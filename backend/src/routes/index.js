import { Router } from "express";
import prisma from "../../prisma/client.js";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import likeRoutes from "./likeRoutes.js";
import matchRoutes from "./matchRoute.js";
import passRoutes from "./passRoutes.js";
import messageRoutes from "./messageRoutes.js";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "healthy",
      service: "Datingapp API",
      api: "healthy",
      database: "healthy",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "degraded",
      service: "Datingapp API",
      api: "healthy",
      database: "unhealthy",
    });
  }
});

router.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "healthy", database: "healthy" });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(503).json({ status: "unhealthy", database: "unhealthy" });
  }
});

router.use("/auths", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/likes", likeRoutes);
router.use("/matches", matchRoutes);
router.use("/passes", passRoutes);
router.use("/messages", messageRoutes);

export default router;
