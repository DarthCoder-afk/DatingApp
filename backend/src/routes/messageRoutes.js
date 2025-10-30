import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js'; 
import { getMessages, getUserConversations, sendMessage } from '../controllers/messageController.js';


const router = express.Router();

router.get('/conversations', verifyToken, getUserConversations);

router.get('/:matchId', verifyToken, getMessages);

router.post('/:matchId', verifyToken, sendMessage);


export default router;