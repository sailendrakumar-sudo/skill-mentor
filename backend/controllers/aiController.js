import db from '../services/dbAdapter.js';
import { getGeminiRecommendations, getSkillGapAdvisory, getSessionAgenda } from '../services/geminiService.js';

export const getMentorRecommendations = async (req, res) => {
  try {
    const studentProfile = await db.getProfile(req.user.id);
    const allProfiles = await db.getAllProfiles();
    const candidateMentors = allProfiles.filter(p => p.id !== req.user.id);

    const aiResult = await getGeminiRecommendations(studentProfile, candidateMentors);

    // Merge full mentor profile details with AI recommendation data
    const enrichedRecommendations = (aiResult.recommendations || []).map(rec => {
      const mentorProfile = candidateMentors.find(m => m.id === rec.mentorId);
      return {
        ...rec,
        mentor: mentorProfile || null
      };
    }).filter(rec => rec.mentor !== null);

    res.json({
      success: true,
      recommendations: enrichedRecommendations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSkillGapAdvisoryEndpoint = async (req, res) => {
  try {
    const { skill_name, current_level, target_level, objective } = req.validatedBody;
    const advisory = await getSkillGapAdvisory(skill_name, current_level, target_level, objective);
    res.json({ success: true, advisory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getSessionAgendaEndpoint = async (req, res) => {
  try {
    const { skill_name, objective, duration_minutes } = req.validatedBody;
    const agenda = await getSessionAgenda(skill_name, objective, duration_minutes);
    res.json({ success: true, agenda });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
