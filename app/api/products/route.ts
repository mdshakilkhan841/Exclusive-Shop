import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductVariant from "@/models/ProductVariant";
import { generateSKU, generateBarcode } from "@/utils/sku";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        let query: any = { isDeleted: false };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } },
                { barcode: { $regex: search, $options: "i" } },
            ];
        }

        const products = await Product.find(query)
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .limit(50); // limit for performance in POS

        return NextResponse.json({ success: true, data: products });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const {
            name,
            categoryId,
            purchasePrice,
            sellingPrice,
            profitMargin,
            stock,
            minStockAlert,
            expiryDate,
        } = body;

        // Resolve Category
        let categoryName = "GEN";
        if (categoryId && categoryId !== "new_disabled") {
            const category = await Category.findById(categoryId);
            if (category) categoryName = category.name;
        }

        const sku = body.sku || generateSKU(categoryName, name);
        const barcode = body.barcode || generateBarcode(sku);

        const productData: any = {
            name,
            sku,
            barcode,
            purchasePrice,
            sellingPrice,
            profitMargin: profitMargin || sellingPrice - purchasePrice,
            stock: stock || 0,
            minStockAlert: minStockAlert || 5,
            expiryDate,
        };

        if (categoryId && categoryId !== "new_disabled") {
            productData.category = categoryId;
        }

        const newProduct = await Product.create(productData);

        return NextResponse.json(
            { success: true, data: newProduct },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 },
        );
    }
}
