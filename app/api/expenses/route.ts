import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Expense from "@/models/Expense";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const dateQuery = searchParams.get("date"); // e.g. YYYY-MM

        let query: any = { isDeleted: false };

        if (dateQuery) {
            const parts = dateQuery.split("-");
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

            query.date = {
                $gte: startOfMonth,
                $lte: endOfMonth,
            };
        }

        const expenses = await Expense.find(query)
            .populate("recordedBy", "name")
            .sort({ date: -1 });

        return NextResponse.json({ success: true, data: expenses });
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

        const newExpense = await Expense.create({
            amount: body.amount,
            category: body.category,
            description: body.description,
            recordedBy: body.userId, // from auth session in real app
            date: body.date || new Date(),
        });

        return NextResponse.json(
            { success: true, data: newExpense },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 },
        );
    }
}
