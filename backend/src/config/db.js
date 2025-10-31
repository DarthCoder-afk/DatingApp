import prisma from "../../prisma/client.js";

export const connectDb = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("⚠️ Database connection failed:", error.message);
        console.error("Database connection failed:", error);
        setTimeout(connectDb, 5000);
    }
};
