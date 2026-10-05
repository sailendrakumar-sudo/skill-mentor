import express from 'express';
import { discoverSkillsAndStudents, addTeachingSkill, deleteTeachingSkill, addLearningSkill, deleteLearningSkill } from '../controllers/skillController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { teachingSkillSchema, learningSkillSchema } from '../validations/schemas.js';

const router = express.Router();

router.get('/discover', discoverSkillsAndStudents);
router.post('/teach', requireAuth, validate(teachingSkillSchema), addTeachingSkill);
router.delete('/teach/:id', requireAuth, deleteTeachingSkill);
router.post('/learn', requireAuth, validate(learningSkillSchema), addLearningSkill);
router.delete('/learn/:id', requireAuth, deleteLearningSkill);

export default router;
