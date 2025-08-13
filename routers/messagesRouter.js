import express from 'express'
import { getMessages, createMessage, markMessageAsRead } from '../controllers/messagesController.js';

const router = express.Router();


router.post('/create-message', createMessage)
router.get('/get-messages', getMessages)
router.put('/read-status-update', markMessageAsRead)




export default router;
