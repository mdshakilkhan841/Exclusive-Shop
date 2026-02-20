import mongoose, { Schema, Document, Types } from "mongoose";

export enum PurchaseStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface IPurchaseOrder extends Document {
    orderNumber: string;
    supplier: Types.ObjectId;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    status: PurchaseStatus;
    recordedBy: Types.ObjectId;
    date: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
    {
        orderNumber: { type: String, unique: true, required: true },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
        totalAmount: { type: Number, required: true },
        paidAmount: { type: Number, default: 0 },
        dueAmount: { type: Number, default: 0 },
        status: {
            type: String,
            enum: Object.values(PurchaseStatus),
            default: PurchaseStatus.PENDING,
        },
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

export default mongoose.models.PurchaseOrder ||
    mongoose.model<IPurchaseOrder>("PurchaseOrder", purchaseOrderSchema);
