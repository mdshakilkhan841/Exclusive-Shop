import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Sale from "@/models/Sale";
import Product from "@/models/Product";
import { SaleStatus } from "@/types";

export async function GET() {
    try {
        await dbConnect();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
        );

        // 1. Total Sales Today
        const todaySales = await Sale.aggregate([
            {
                $match: {
                    createdAt: { $gte: today },
                    status: SaleStatus.COMPLETED,
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                    totalProfit: {
                        $sum: {
                            $subtract: ["$total", "$totalPurchasePriceOfItems"],
                        },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        // 2. Monthly Revenue
        const monthlySales = await Sale.aggregate([
            {
                $match: {
                    createdAt: { $gte: firstDayOfMonth },
                    status: SaleStatus.COMPLETED,
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    dailyRevenue: { $sum: "$total" },
                    dailyProfit: {
                        $sum: {
                            $subtract: ["$total", "$totalPurchasePriceOfItems"],
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // 3. Top Selling Products
        const topSelling = await Sale.aggregate([
            { $match: { status: SaleStatus.COMPLETED, isDeleted: false } },
            {
                $lookup: {
                    from: "saleitems",
                    localField: "items",
                    foreignField: "_id",
                    as: "saleItems",
                },
            },
            { $unwind: "$saleItems" },
            {
                $group: {
                    _id: "$saleItems.product",
                    totalQuantity: { $sum: "$saleItems.quantity" },
                    totalRevenue: { $sum: "$saleItems.subTotal" },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    name: "$productDetails.name",
                    totalQuantity: 1,
                    totalRevenue: 1,
                },
            },
        ]);

        // 4. Low Stock Alerts
        const lowStock = await Product.aggregate([
            {
                $match: {
                    isDeleted: false,
                    $expr: { $lte: ["$stock", "$minStockAlert"] },
                },
            },
            { $limit: 5 },
            {
                $project: {
                    name: 1,
                    stock: 1,
                    minStockAlert: 1,
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                todayStats: todaySales[0] || {
                    totalRevenue: 0,
                    totalProfit: 0,
                    count: 0,
                },
                monthlySales,
                topSelling,
                lowStock,
            },
        });
    } catch (error: any) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 },
        );
    }
}
