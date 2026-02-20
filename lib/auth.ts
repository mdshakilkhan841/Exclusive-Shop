import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// We use the mongodb driver directly for the betterAuth adapter since BetterAuth's mongodb adapter
// requires a mongodb driver MongoClient instance instead of mongoose connection.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// Global cached client for BetterAuth adapter
let cachedClient = (global as any).mongoClientForAuth;

if (!cachedClient) {
    cachedClient = (global as any).mongoClientForAuth = new MongoClient(
        MONGODB_URI,
    );
}

const client: MongoClient = cachedClient;
const db = client.db();

// The Better Auth Instance
export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    // Optionally, you can define your custom user schema here through BetterAuth plugins or user object overrides if you need them synchronized.
    // For BetterAuth, the roles will be managed by adding a 'role' field to the user in mongo.
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "CASHIER",
            },
        },
    },
});
