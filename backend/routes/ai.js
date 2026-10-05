import express from 'express';
import { getMentorRecommendations, getSkillGapAdvisoryEndpoint, getSessionAgendaEndpoint } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { skillGapSchema, sessionAgendaSchema } from '../validations/schemas.js';

const router = express.Router();

router.post('/recommendations', requireAuth, getMentorRecommendations);
router.post('/skill-gap', requireAuth, validate(skillGapSchema), getSkillGapAdvisoryEndpoint);
router.post('/session-agenda', requireAuth, validate(sessionAgendaSchema), getSessionAgendaEndpoint);

export default router;
