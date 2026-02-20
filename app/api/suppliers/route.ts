import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Supplier from "@/models/Supplier";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        let query: any = { isDeleted: false };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: suppliers });
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

        const newSupplier = await Supplier.create({
            name: body.name,
            contactPerson: body.contactPerson,
            phone: body.phone,
            email: body.email,
            address: body.address,
            balanceDue: body.balanceDue || 0,
        });

        return NextResponse.json(
            { success: true, data: newSupplier },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 },
        );
    }
}
