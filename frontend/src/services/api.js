const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };

  const storedUser = localStorage.getItem('skill_mentor_user');
  if (storedUser) {
    try {
      const u = JSON.parse(storedUser);
      if (u.id) headers['x-user-id'] = u.id;
      if (u.token) headers['Authorization'] = `Bearer ${u.token}`;
    } catch (e) {}
  }

  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Profiles
  getCurrentProfile: () => request('/profiles/me'),
  getProfile: (id) => request(`/profiles/${id}`),
  getAllProfiles: () => request('/profiles'),
  updateProfile: (data) => request('/profiles', { method: 'PUT', body: JSON.stringify(data) }),

  // Skills
  discoverStudents: (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    return request(`/skills/discover?${queryStr}`);
  },
  addTeachingSkill: (skill_name, proficiency_level) => request('/skills/teach', {
    method: 'POST',
    body: JSON.stringify({ skill_name, proficiency_level })
  }),
  deleteTeachingSkill: (id) => request(`/skills/teach/${id}`, { method: 'DELETE' }),
  addLearningSkill: (skill_name, target_level) => request('/skills/learn', {
    method: 'POST',
    body: JSON.stringify({ skill_name, target_level })
  }),
  deleteLearningSkill: (id) => request(`/skills/learn/${id}`, { method: 'DELETE' }),

  // Requests
  getRequests: () => request('/requests'),
  createRequest: (data) => request('/requests', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateRequestStatus: (id, status) => request(`/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Messages & Chat
  getConversations: () => request('/messages/conversations'),
  getMessages: (conversationId) => request(`/messages/${conversationId}`),
  sendMessage: (data) => request('/messages', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Sessions
  getSessions: () => request('/sessions'),
  createSession: (data) => request('/sessions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateSessionStatus: (id, status) => request(`/sessions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Reviews
  getReviews: (userId) => request(`/reviews${userId ? `?userId=${userId}` : ''}`),
  createReview: (data) => request('/reviews', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // AI Insights
  getAiRecommendations: () => request('/ai/recommendations', { method: 'POST', body: JSON.stringify({}) }),
  getAiSkillGap: (data) => request('/ai/skill-gap', { method: 'POST', body: JSON.stringify(data) }),
  getAiSessionAgenda: (data) => request('/ai/session-agenda', { method: 'POST', body: JSON.stringify(data) })
};

export default api;
