import express from 'express'
import { getMessages, createMessage, markMessageAsRead, deleteMessage } from '../controllers/messagesController.js';

const router = express.Router();


router.post('/create-message', createMessage)
router.get('/get-messages', getMessages)
router.put('/read-status-update', markMessageAsRead)
router.delete('/delete-message/:messageId', deleteMessage)




export default router;
