import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        await dbConnect();
        const body = await request.json();

        // Calculate new profit margin if prices change
        if (body.sellingPrice && body.purchasePrice && !body.profitMargin) {
            body.profitMargin = body.sellingPrice - body.purchasePrice;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            params.id,
            body,
            {
                new: true,
                runValidators: true,
            },
        ).populate("category", "name");

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, data: updatedProduct });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        await dbConnect();

        // Soft delete
        const deletedProduct = await Product.findByIdAndUpdate(
            params.id,
            { isDeleted: true },
            { new: true },
        );

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 },
        );
    }
}
