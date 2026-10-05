import express from 'express';
import { getConversations, getMessagesByConversationId, sendMessage } from '../controllers/messageController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { messageSendSchema } from '../validations/schemas.js';

const router = express.Router();

router.get('/conversations', requireAuth, getConversations);
router.get('/:conversationId', requireAuth, getMessagesByConversationId);
router.post('/', requireAuth, validate(messageSendSchema), sendMessage);

export default router;
