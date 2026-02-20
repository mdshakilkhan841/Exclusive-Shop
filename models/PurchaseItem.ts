import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPurchaseItem extends Document {
    purchaseOrder: Types.ObjectId;
    product: Types.ObjectId;
    variant?: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    createdAt: Date;
    updatedAt: Date;
}

const purchaseItemSchema = new Schema<IPurchaseItem>(
    {
        purchaseOrder: {
            type: Schema.Types.ObjectId,
            ref: "PurchaseOrder",
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        subTotal: { type: Number, required: true },
    },
    { timestamps: true },
);

export default mongoose.models.PurchaseItem ||
    mongoose.model<IPurchaseItem>("PurchaseItem", purchaseItemSchema);
