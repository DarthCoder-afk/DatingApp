import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { sendPass } from '../controllers/passController.js';

const router = express.Router();

router.post('/:toUserId', verifyToken, sendPass);


export default router;