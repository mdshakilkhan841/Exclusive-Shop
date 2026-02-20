import mongoose, { Schema, Document, Types } from "mongoose";
import { ExpenseCategory } from "@/types";

export interface IExpense extends Document {
    amount: number;
    category: ExpenseCategory;
    description: string;
    recordedBy: Types.ObjectId;
    date: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
    {
        amount: { type: Number, required: true },
        category: {
            type: String,
            enum: Object.values(ExpenseCategory),
            required: true,
        },
        description: { type: String, required: true },
        recordedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.Expense ||
    mongoose.model<IExpense>("Expense", expenseSchema);
