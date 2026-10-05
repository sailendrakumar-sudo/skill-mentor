import db from '../services/dbAdapter.js';

export const discoverSkillsAndStudents = async (req, res) => {
  try {
    const { query, category, proficiency, format } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    const results = await db.discoverStudents({
      query,
      category,
      proficiency,
      format,
      currentUserId
    });

    res.json({
      success: true,
      count: results.length,
      students: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addTeachingSkill = async (req, res) => {
  try {
    const { skill_name, proficiency_level } = req.validatedBody;
    const skill = await db.addTeachingSkill(req.user.id, skill_name, proficiency_level);
    res.status(201).json({ success: true, skill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteTeachingSkill = async (req, res) => {
  try {
    await db.removeTeachingSkill(req.user.id, req.params.id);
    res.json({ success: true, message: 'Teaching skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addLearningSkill = async (req, res) => {
  try {
    const { skill_name, target_level } = req.validatedBody;
    const skill = await db.addLearningSkill(req.user.id, skill_name, target_level);
    res.status(201).json({ success: true, skill });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteLearningSkill = async (req, res) => {
  try {
    await db.removeLearningSkill(req.user.id, req.params.id);
    res.json({ success: true, message: 'Learning skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
