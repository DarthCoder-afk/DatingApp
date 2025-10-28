import express from 'express';
import { getUserProfile , updateUserProfile} from '../controllers/profileController.js';  
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/me', verifyToken, getUserProfile);
router.put('/update', verifyToken, upload.single("photo"), updateUserProfile);

export default router;
