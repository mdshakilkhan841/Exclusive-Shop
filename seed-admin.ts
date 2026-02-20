import { auth } from "./lib/auth";

async function seedAdmin() {
    try {
        console.log("Seeding admin account...");
        const res = await auth.api.signUpEmail({
            body: {
                email: "admin@gmail.com",
                password: "admin123",
                name: "Super Admin",
                role: "ADMIN",
            },
        });
        console.log("Admin seeded successfully:", res);
        process.exit(0);
    } catch (err) {
        console.error("Failed to seed admin:", err);
        process.exit(1);
    }
}

seedAdmin();
