import db from '../services/dbAdapter.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await db.getConversations(req.user.id);
    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMessagesByConversationId = async (req, res) => {
  try {
    const messages = await db.getMessages(req.params.conversationId);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversation_id, receiver_id, content } = req.validatedBody;
    const message = await db.sendMessage({
      conversation_id,
      receiver_id,
      sender_id: req.user.id,
      content
    });
    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
