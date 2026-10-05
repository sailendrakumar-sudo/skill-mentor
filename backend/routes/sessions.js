import express from 'express';
import { getSessions, createSession, updateSessionStatus } from '../controllers/sessionController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { sessionCreateSchema, sessionStatusUpdateSchema } from '../validations/schemas.js';

const router = express.Router();

router.get('/', requireAuth, getSessions);
router.post('/', requireAuth, validate(sessionCreateSchema), createSession);
router.patch('/:id', requireAuth, validate(sessionStatusUpdateSchema), updateSessionStatus);

export default router;
