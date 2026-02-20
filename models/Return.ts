import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReturn extends Document {
    sale: Types.ObjectId;
    saleItem: Types.ObjectId;
    product: Types.ObjectId;
    variant?: Types.ObjectId;
    quantity: number;
    refundAmount: number;
    reason: string;
    processedBy: Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const returnSchema = new Schema<IReturn>(
    {
        sale: { type: Schema.Types.ObjectId, ref: "Sale", required: true },
        saleItem: {
            type: Schema.Types.ObjectId,
            ref: "SaleItem",
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
        quantity: { type: Number, required: true },
        refundAmount: { type: Number, required: true },
        reason: { type: String, required: true },
        processedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.Return ||
    mongoose.model<IReturn>("Return", returnSchema);
