import db from '../services/dbAdapter.js';

export const getRequests = async (req, res) => {
  try {
    const requests = await db.getRequests(req.user.id);
    const sent = requests.filter(r => r.sender_id === req.user.id);
    const received = requests.filter(r => r.receiver_id === req.user.id);

    res.json({
      success: true,
      all: requests,
      sent,
      received
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const { receiver_id, skill_requested, skill_offered, objective } = req.validatedBody;

    if (receiver_id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot send mentorship request to yourself' });
    }

    const newRequest = await db.createRequest({
      sender_id: req.user.id,
      receiver_id,
      skill_requested,
      skill_offered,
      objective
    });

    res.status(201).json({ success: true, request: newRequest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.validatedBody;
    const updated = await db.updateRequestStatus(req.params.id, status, req.user.id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }
    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
