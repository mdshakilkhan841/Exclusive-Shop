import mongoose, { Schema, Document, Types } from "mongoose";
import { StockType } from "@/types";

export interface IStockLog extends Document {
    product: Types.ObjectId;
    variant?: Types.ObjectId;
    transactionType: StockType;
    quantity: number;
    previousStock: number;
    newStock: number;
    referenceId?: string; // e.g. Purchase Order ID or Sale ID
    recordedBy: Types.ObjectId;
    note?: string;
    createdAt: Date;
}

const stockLogSchema = new Schema<IStockLog>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
        transactionType: {
            type: String,
            enum: Object.values(StockType),
            required: true,
        },
        quantity: { type: Number, required: true },
        previousStock: { type: Number, required: true },
        newStock: { type: Number, required: true },
        referenceId: { type: String },
        recordedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        note: { type: String },
    },
    { timestamps: true },
);

export default mongoose.models.StockLog ||
    mongoose.model<IStockLog>("StockLog", stockLogSchema);
