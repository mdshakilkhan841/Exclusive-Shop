import mongoose, { Schema, Document, Types } from "mongoose";
import { PaymentMethod } from "@/types";

export interface IPayment extends Document {
    referenceType: "SALE" | "PURCHASE";
    referenceId: Types.ObjectId; // Sale ID or Purchase Order ID
    amount: number;
    method: PaymentMethod;
    transactionId?: string; // e.g., for Card or Mobile Banking
    processedBy: Types.ObjectId;
    date: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        referenceType: {
            type: String,
            enum: ["SALE", "PURCHASE"],
            required: true,
        },
        referenceId: { type: Schema.Types.ObjectId, required: true },
        amount: { type: Number, required: true },
        method: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        transactionId: { type: String },
        processedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.Payment ||
    mongoose.model<IPayment>("Payment", paymentSchema);
