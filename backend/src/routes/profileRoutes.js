import express from 'express';
import { getUserProfile } from '../controllers/profileController';  
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/me', verifyToken, getUserProfile);

export default router;
