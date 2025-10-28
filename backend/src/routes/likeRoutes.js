import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getLikesGiven, getLikesReceived, sendLike } from "../controllers/likeController.js";

const router = express.Router();

// Send like to another user
router.post("/:toUserId", verifyToken, sendLike);

// View likes sent by the user
router.get("/sent", verifyToken, getLikesGiven);

// View likes received by the user
router.get("/received", verifyToken, getLikesReceived);

export default router;