import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    sku: string;
    barcode?: string;
    category: Types.ObjectId;
    purchasePrice: number;
    sellingPrice: number;
    profitMargin: number;
    stock: number;
    minStockAlert: number;
    expiryDate?: Date;
    variants: Types.ObjectId[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        sku: { type: String, unique: true, required: true },
        barcode: { type: String },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        purchasePrice: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        profitMargin: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        minStockAlert: { type: Number, default: 10 },
        expiryDate: { type: Date },
        variants: [{ type: Schema.Types.ObjectId, ref: "ProductVariant" }],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

productSchema.index({ sku: 1, barcode: 1 });
productSchema.index({ name: "text" });

export default mongoose.models.Product ||
    mongoose.model<IProduct>("Product", productSchema);
