import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISaleItem extends Document {
    sale: Types.ObjectId;
    product: Types.ObjectId;
    variant?: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    unitPurchasePrice: number;
    subTotal: number;
    createdAt: Date;
    updatedAt: Date;
}

const saleItemSchema = new Schema<ISaleItem>(
    {
        sale: { type: Schema.Types.ObjectId, ref: "Sale", required: true },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        variant: { type: Schema.Types.ObjectId, ref: "ProductVariant" },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        unitPurchasePrice: { type: Number, required: true },
        subTotal: { type: Number, required: true },
    },
    { timestamps: true },
);

export default mongoose.models.SaleItem ||
    mongoose.model<ISaleItem>("SaleItem", saleItemSchema);
