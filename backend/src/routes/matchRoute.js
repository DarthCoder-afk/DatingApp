import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getLikesOverview, getUserMatches, unmatchUser } from '../controllers/matchController.js';

const router = express.Router();

router.get('/match', verifyToken, getUserMatches);
router.get("/overview", verifyToken, getLikesOverview); // Get liked/liked-me lists
router.delete("/:matchId", verifyToken, unmatchUser); // Unmatch user


export default router;