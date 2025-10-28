import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getUserMatches } from '../controllers/matchController.js';

const router = express.Router();

router.get('/matches', verifyToken, getUserMatches);

export default router;