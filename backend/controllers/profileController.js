import db from '../services/dbAdapter.js';

export const getProfileById = async (req, res) => {
  try {
    const profile = await db.getProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCurrentUserProfile = async (req, res) => {
  try {
    const profile = await db.getProfile(req.user.id);
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCurrentUserProfile = async (req, res) => {
  try {
    const updated = await db.updateProfile(req.user.id, req.validatedBody);
    res.json({ success: true, profile: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const listAllProfiles = async (req, res) => {
  try {
    const profiles = await db.getAllProfiles();
    res.json({ success: true, profiles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
