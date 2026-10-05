import db from '../services/dbAdapter.js';

export const getReviews = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const reviews = await db.getReviews(userId);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { session_id, reviewed_id, rating, feedback } = req.validatedBody;
    const review = await db.createReview({
      session_id,
      reviewer_id: req.user.id,
      reviewed_id,
      rating,
      feedback
    });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
