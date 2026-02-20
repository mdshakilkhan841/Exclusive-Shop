import mongoose, { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
    name: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    address?: string;
    balanceDue: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>(
    {
        name: { type: String, required: true },
        contactPerson: { type: String },
        phone: { type: String, required: true },
        email: { type: String },
        address: { type: String },
        balanceDue: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.Supplier ||
    mongoose.model<ISupplier>("Supplier", supplierSchema);
