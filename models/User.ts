import mongoose, { Schema, Document } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    CASHIER = "CASHIER",
}

export interface IUser extends Document {
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, default: false },
        image: { type: String },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.CASHIER,
        },
    },
    { timestamps: true, collection: "user" }, // BetterAuth creates 'user' collection
);

export default mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);
