import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.Category ||
    mongoose.model<ICategory>("Category", categorySchema);
