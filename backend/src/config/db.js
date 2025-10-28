import prisma from "../../prisma/client.js";

export const connectDb = async () => {
    try {
        const db = await prisma.$connect();
        console.log("Database connected successfully");
        return db;
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
