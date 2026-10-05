import express from 'express';
import { getProfileById, getCurrentUserProfile, updateCurrentUserProfile, listAllProfiles } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema } from '../validations/schemas.js';

const router = express.Router();

router.get('/me', requireAuth, getCurrentUserProfile);
router.get('/', listAllProfiles);
router.get('/:id', getProfileById);
router.put('/', requireAuth, validate(profileUpdateSchema), updateCurrentUserProfile);

export default router;
