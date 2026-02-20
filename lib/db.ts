import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI as string, opts)
            .then((mongoose) => {
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    // Explicitly load models to prevent "Schema hasn't been registered" errors in Next.js edge cases
    await import("@/models/User");
    await import("@/models/Category");
    await import("@/models/ProductVariant");
    await import("@/models/Product");
    await import("@/models/Customer");
    await import("@/models/Supplier");
    await import("@/models/Sale");

    return cached.conn;
}

export default dbConnect;
