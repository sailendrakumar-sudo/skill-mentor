import express from 'express';
import { getRequests, createRequest, updateRequestStatus } from '../controllers/requestController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { mentorshipRequestSchema, requestStatusUpdateSchema } from '../validations/schemas.js';

const router = express.Router();

router.get('/', requireAuth, getRequests);
router.post('/', requireAuth, validate(mentorshipRequestSchema), createRequest);
router.patch('/:id', requireAuth, validate(requestStatusUpdateSchema), updateRequestStatus);

export default router;
