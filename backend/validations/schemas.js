import { z } from 'zod';

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100).optional(),
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  avatar_url: z.string().url('Must be a valid URL').or(z.string().length(0)).optional(),
  institution: z.string().max(150).optional(),
  department: z.string().max(100).optional(),
  year_of_study: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  preferred_format: z.enum(['Online', 'In-Person', 'Hybrid', 'Collaborative Project']).optional(),
  languages: z.array(z.string()).optional()
});

export const teachingSkillSchema = z.object({
  skill_name: z.string().min(2, 'Skill name must be at least 2 characters').max(80),
  proficiency_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
});

export const learningSkillSchema = z.object({
  skill_name: z.string().min(2, 'Skill name must be at least 2 characters').max(80),
  target_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
});

export const mentorshipRequestSchema = z.object({
  receiver_id: z.string().uuid('Invalid receiver UUID'),
  skill_requested: z.string().min(2, 'Requested skill name is required').max(80),
  skill_offered: z.string().max(80).optional(),
  objective: z.string().min(10, 'Objective must be at least 10 characters').max(1000)
});

export const requestStatusUpdateSchema = z.object({
  status: z.enum(['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'])
});

export const messageSendSchema = z.object({
  conversation_id: z.string().uuid().optional(),
  receiver_id: z.string().uuid().optional(),
  content: z.string().min(1, 'Message content cannot be empty').max(2000)
}).refine(data => data.conversation_id || data.receiver_id, {
  message: 'Either conversation_id or receiver_id must be provided'
});

export const sessionCreateSchema = z.object({
  mentor_id: z.string().uuid('Invalid mentor UUID'),
  learner_id: z.string().uuid('Invalid learner UUID'),
  skill_name: z.string().min(2, 'Skill name is required').max(80),
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:MM or HH:MM:SS'),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:MM or HH:MM:SS'),
  meeting_link: z.string().url('Invalid meeting URL').or(z.string().length(0)).optional(),
  objective: z.string().max(1000).optional()
});

export const sessionStatusUpdateSchema = z.object({
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled'])
});

export const reviewCreateSchema = z.object({
  session_id: z.string().uuid('Invalid session UUID'),
  reviewed_id: z.string().uuid('Invalid reviewed user UUID'),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  feedback: z.string().max(2000).optional()
});

export const skillGapSchema = z.object({
  skill_name: z.string().min(2, 'Skill name is required'),
  current_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'None']).optional().default('None'),
  target_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional().default('Advanced'),
  objective: z.string().max(500).optional()
});

export const sessionAgendaSchema = z.object({
  skill_name: z.string().min(2, 'Skill name is required'),
  objective: z.string().min(5, 'Objective is required'),
  duration_minutes: z.number().int().min(15).max(180).optional().default(60)
});
