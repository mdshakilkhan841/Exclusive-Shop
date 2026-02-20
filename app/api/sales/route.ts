import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Sale from "@/models/Sale";
import SaleItem from "@/models/SaleItem";
import { PaymentMethod, SaleStatus } from "@/types";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const {
            cartItems, // array of { productId, quantity, unitPrice, unitPurchasePrice, subTotal }
            cashierId,
            customerId,
            subTotal,
            discount,
            tax,
            total,
            paid,
            paymentMethod,
        } = body;

        // 1. Calculate due
        const due = total - paid;
        const status = due > 0 ? SaleStatus.PARTIAL : SaleStatus.COMPLETED;

        // 2. Calculate Total Purchase Price for profit margins
        const totalPurchasePriceOfItems = cartItems.reduce(
            (sum: number, item: any) =>
                sum + item.unitPurchasePrice * item.quantity,
            0,
        );

        // 3. Create Sale Record
        const newSale = await Sale.create({
            invoiceNumber: `INV-${Date.now()}`,
            cashier: cashierId,
            customer: customerId || undefined,
            totalPurchasePriceOfItems,
            subTotal,
            discount,
            tax,
            total,
            paid,
            due,
            paymentMethod,
            status,
        });

        // 4. Create Sale Items
        const itemsToInsert = cartItems.map((item: any) => ({
            sale: newSale._id,
            product: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unitPurchasePrice: item.unitPurchasePrice,
            subTotal: item.subTotal,
        }));

        const insertedItems = await SaleItem.insertMany(itemsToInsert);

        // 5. Link items to sale
        newSale.items = insertedItems.map((item) => item._id);
        await newSale.save();

        // Note: Stock deduction should happen here ideally using bulkWrite for performance

        return NextResponse.json(
            { success: true, data: newSale },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 },
        );
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const dateQuery = searchParams.get("date"); // e.g. YYYY-MM-DD

        let query: any = { isDeleted: false };

        if (dateQuery) {
            const startOfDay = new Date(dateQuery);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        }

        const sales = await Sale.find(query)
            .populate("cashier", "name email")
            .populate("customer", "name phone")
            .sort({ createdAt: -1 })
            .limit(100);

        return NextResponse.json({ success: true, data: sales });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 },
        );
    }
}
