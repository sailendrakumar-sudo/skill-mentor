import db from '../services/dbAdapter.js';

export const getSessions = async (req, res) => {
  try {
    const sessions = await db.getSessions(req.user.id);
    const upcoming = sessions.filter(s => s.status === 'Scheduled' || s.status === 'In Progress');
    const completed = sessions.filter(s => s.status === 'Completed');
    res.json({
      success: true,
      all: sessions,
      upcoming,
      completed
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const newSession = await db.createSession(req.validatedBody);
    res.status(201).json({ success: true, session: newSession });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.validatedBody;
    const updated = await db.updateSessionStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, session: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
