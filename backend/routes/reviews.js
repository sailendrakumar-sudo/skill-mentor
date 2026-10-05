import express from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reviewCreateSchema } from '../validations/schemas.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', requireAuth, validate(reviewCreateSchema), createReview);

export default router;
