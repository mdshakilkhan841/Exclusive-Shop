import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILoyaltyPoint extends Document {
    customer: Types.ObjectId;
    points: number;
    transactionType: "EARN" | "REDEEM";
    referenceId?: Types.ObjectId; // e.g. Sale ID
    description?: string;
    createdAt: Date;
}

const loyaltyPointSchema = new Schema<ILoyaltyPoint>(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        points: { type: Number, required: true },
        transactionType: {
            type: String,
            enum: ["EARN", "REDEEM"],
            required: true,
        },
        referenceId: { type: Schema.Types.ObjectId },
        description: { type: String },
    },
    { timestamps: true },
);

export default mongoose.models.LoyaltyPoint ||
    mongoose.model<ILoyaltyPoint>("LoyaltyPoint", loyaltyPointSchema);
