import express from 'express';
import { getUserProfile , updateUserProfile} from '../controllers/profileController.js';  
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', verifyToken, getUserProfile);
router.put('/update', verifyToken, updateUserProfile);

export default router;
