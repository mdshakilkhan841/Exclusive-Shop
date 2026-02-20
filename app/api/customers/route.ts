import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

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

        const customers = await Customer.find(query)
            .sort({ createdAt: -1 })
            .limit(50);
        return NextResponse.json({ success: true, data: customers });
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

        const newCustomer = await Customer.create({
            name: body.name,
            phone: body.phone,
            email: body.email,
            address: body.address,
            loyaltyPoints: body.loyaltyPoints || 0,
            dueAmount: body.dueAmount || 0,
        });

        return NextResponse.json(
            { success: true, data: newCustomer },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 },
        );
    }
}
