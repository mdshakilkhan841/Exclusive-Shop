import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductVariant extends Document {
    product: Types.ObjectId;
    name: string; // e.g., "Size", "Color"
    value: string; // e.g., "XL", "Red"
    sku: string;
    additionalPrice: number;
    stock: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: { type: String, required: true },
        value: { type: String, required: true },
        sku: { type: String, unique: true, required: true },
        additionalPrice: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const ProductVariant =
    mongoose.models.ProductVariant ||
    mongoose.model<IProductVariant>("ProductVariant", variantSchema);

export default ProductVariant;
