import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    loyaltyPoints: number;
    dueAmount: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
    {
        name: { type: String, required: true },
        phone: { type: String, unique: true, required: true },
        email: { type: String },
        address: { type: String },
        loyaltyPoints: { type: Number, default: 0 },
        dueAmount: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

customerSchema.index({ phone: 1 });
customerSchema.index({ name: "text" });

export default mongoose.models.Customer ||
    mongoose.model<ICustomer>("Customer", customerSchema);
