import express from 'express';
import { getAllProfiles, getUserProfile , updateUserProfile} from '../controllers/profileController.js';  
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/me', verifyToken, getUserProfile);
router.get('/all', verifyToken, getAllProfiles);
router.put('/update', verifyToken, upload.single("photo"), updateUserProfile);

export default router;
