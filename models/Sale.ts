import mongoose, { Schema, Document, Types } from "mongoose";

export enum SaleStatus {
    COMPLETED = "COMPLETED",
    PARTIAL = "PARTIAL",
    REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    MOBILE_BANKING = "MOBILE_BANKING",
}

export interface ISale extends Document {
    invoiceNumber: string;
    cashier: Types.ObjectId;
    customer?: Types.ObjectId;
    items: Types.ObjectId[];
    totalPurchasePriceOfItems: number; // for profit calculation
    subTotal: number;
    discount: number;
    tax: number;
    total: number;
    paid: number;
    due: number;
    paymentMethod: PaymentMethod;
    status: SaleStatus;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const saleSchema = new Schema<ISale>(
    {
        invoiceNumber: { type: String, unique: true, required: true },
        cashier: { type: Schema.Types.ObjectId, ref: "User", required: true },
        customer: { type: Schema.Types.ObjectId, ref: "Customer" },
        items: [{ type: Schema.Types.ObjectId, ref: "SaleItem" }],
        totalPurchasePriceOfItems: { type: Number, required: true, default: 0 },
        subTotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        total: { type: Number, required: true },
        paid: { type: Number, required: true },
        due: { type: Number, default: 0 },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(SaleStatus),
            default: SaleStatus.COMPLETED,
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

saleSchema.index({ invoiceNumber: 1 });
saleSchema.index({ createdAt: -1 });

export default mongoose.models.Sale ||
    mongoose.model<ISale>("Sale", saleSchema);
