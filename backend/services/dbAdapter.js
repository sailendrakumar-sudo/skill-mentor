import { supabaseAdmin } from '../config/supabase.js';
import { randomUUID } from 'crypto';

// In-Memory Fallback State (initialized with comprehensive seed data)
const memoryStore = {
  profiles: [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      full_name: 'Alex Chen',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      bio: 'Computer Science Junior with a deep passion for Full-Stack development and Machine Learning. Eager to master UI/UX Design and Figma to build gorgeous interfaces.',
      institution: 'Stanford University',
      department: 'Computer Science',
      year_of_study: '3rd Year',
      location: 'San Francisco, CA',
      preferred_format: 'Online',
      languages: ['English', 'Mandarin'],
      rating: 4.90,
      completed_sessions_count: 18,
      mentored_count: 12,
      created_at: new Date().toISOString()
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      full_name: 'Sarah Jenkins',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      bio: 'Product Designer & Visual Communicator. Love creating wireframes, design systems, and micro-interactions. Want to learn Python and web scraping for data-driven design.',
      institution: 'Rhode Island School of Design',
      department: 'Digital Arts & Design',
      year_of_study: '4th Year',
      location: 'Providence, RI',
      preferred_format: 'Online',
      languages: ['English'],
      rating: 4.85,
      completed_sessions_count: 24,
      mentored_count: 16,
      created_at: new Date().toISOString()
    },
    {
      id: 'c3333333-3333-3333-3333-333333333333',
      full_name: 'Marcus Vance',
      avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
      bio: 'Data Science & Algorithm Specialist. Built predictive models for campus hackathons. Seeking a partner to polish my public speaking and pitch deck communication skills.',
      institution: 'MIT',
      department: 'Electrical Engineering & CS',
      year_of_study: '2nd Year',
      location: 'Cambridge, MA',
      preferred_format: 'Hybrid',
      languages: ['English', 'Spanish'],
      rating: 4.75,
      completed_sessions_count: 14,
      mentored_count: 9,
      created_at: new Date().toISOString()
    },
    {
      id: 'd4444444-4444-4444-4444-444444444444',
      full_name: 'Priya Patel',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      bio: 'Debate team captain and business communications mentor. Helping engineers present technical ideas with conviction and clarity. Keen to learn React and modern JavaScript.',
      institution: 'UC Berkeley',
      department: 'Haas School of Business',
      year_of_study: 'Senior',
      location: 'Berkeley, CA',
      preferred_format: 'Online',
      languages: ['English', 'Hindi'],
      rating: 4.95,
      completed_sessions_count: 31,
      mentored_count: 22,
      created_at: new Date().toISOString()
    },
    {
      id: 'e5555555-5555-5555-5555-555555555555',
      full_name: 'David Kim',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      bio: 'Video editor and digital motion graphics creator. Proficient in Premiere Pro and After Effects. Looking to collaborate on video projects and learn basic Python automation.',
      institution: 'NYU Tisch',
      department: 'Film & Television',
      year_of_study: '2nd Year',
      location: 'New York, NY',
      preferred_format: 'In-Person',
      languages: ['English', 'Korean'],
      rating: 4.65,
      completed_sessions_count: 10,
      mentored_count: 6,
      created_at: new Date().toISOString()
    }
  ],
  teaching_skills: [
    { id: 'ts-1', user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'Python', proficiency_level: 'Expert' },
    { id: 'ts-2', user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'React', proficiency_level: 'Advanced' },
    { id: 'ts-3', user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'Machine Learning', proficiency_level: 'Intermediate' },
    { id: 'ts-4', user_id: 'b2222222-2222-2222-2222-222222222222', skill_name: 'UI/UX Design', proficiency_level: 'Expert' },
    { id: 'ts-5', user_id: 'b2222222-2222-2222-2222-222222222222', skill_name: 'Figma', proficiency_level: 'Expert' },
    { id: 'ts-6', user_id: 'b2222222-2222-2222-2222-222222222222', skill_name: 'Graphic Design', proficiency_level: 'Advanced' },
    { id: 'ts-7', user_id: 'c3333333-3333-3333-3333-333333333333', skill_name: 'Python', proficiency_level: 'Advanced' },
    { id: 'ts-8', user_id: 'c3333333-3333-3333-3333-333333333333', skill_name: 'Mathematics', proficiency_level: 'Expert' },
    { id: 'ts-9', user_id: 'c3333333-3333-3333-3333-333333333333', skill_name: 'Data Science', proficiency_level: 'Advanced' },
    { id: 'ts-10', user_id: 'd4444444-4444-4444-4444-444444444444', skill_name: 'Public Speaking', proficiency_level: 'Expert' },
    { id: 'ts-11', user_id: 'd4444444-4444-4444-4444-444444444444', skill_name: 'Communication', proficiency_level: 'Expert' },
    { id: 'ts-12', user_id: 'd4444444-4444-4444-4444-444444444444', skill_name: 'Leadership', proficiency_level: 'Advanced' },
    { id: 'ts-13', user_id: 'e5555555-5555-5555-5555-555555555555', skill_name: 'Video Editing', proficiency_level: 'Expert' },
    { id: 'ts-14', user_id: 'e5555555-5555-5555-5555-555555555555', skill_name: 'Digital Marketing', proficiency_level: 'Intermediate' }
  ],
  learning_skills: [
    { id: 'ls-1', user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'UI/UX Design', target_level: 'Advanced' },
    { id: 'ls-2', user_id: 'a1111111-1111-1111-1111-111111111111', skill_name: 'Figma', target_level: 'Intermediate' },
    { id: 'ls-3', user_id: 'b2222222-2222-2222-2222-222222222222', skill_name: 'Python', target_level: 'Intermediate' },
    { id: 'ls-4', user_id: 'b2222222-2222-2222-2222-222222222222', skill_name: 'JavaScript', target_level: 'Beginner' },
    { id: 'ls-5', user_id: 'c3333333-3333-3333-3333-333333333333', skill_name: 'Public Speaking', target_level: 'Advanced' },
    { id: 'ls-6', user_id: 'c3333333-3333-3333-3333-333333333333', skill_name: 'Communication', target_level: 'Intermediate' },
    { id: 'ls-7', user_id: 'd4444444-4444-4444-4444-444444444444', skill_name: 'React', target_level: 'Intermediate' },
    { id: 'ls-8', user_id: 'd4444444-4444-4444-4444-444444444444', skill_name: 'JavaScript', target_level: 'Intermediate' },
    { id: 'ls-9', user_id: 'e5555555-5555-5555-5555-555555555555', skill_name: 'Python', target_level: 'Intermediate' },
    { id: 'ls-10', user_id: 'e5555555-5555-5555-5555-555555555555', skill_name: 'UI/UX Design', target_level: 'Beginner' }
  ],
  requests: [
    {
      id: 'r-1',
      sender_id: 'a1111111-1111-1111-1111-111111111111',
      receiver_id: 'b2222222-2222-2222-2222-222222222222',
      skill_requested: 'UI/UX Design',
      skill_offered: 'Python',
      objective: 'I want to redesign my web application project and learn wireframing best practices in Figma. In return, I can teach you Python programming and pandas for data analysis!',
      status: 'Accepted',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'r-2',
      sender_id: 'c3333333-3333-3333-3333-333333333333',
      receiver_id: 'd4444444-4444-4444-4444-444444444444',
      skill_requested: 'Public Speaking',
      skill_offered: 'Mathematics',
      objective: 'Need guidance on articulating complex algorithmic research concisely for an upcoming research conference presentation.',
      status: 'Accepted',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'r-3',
      sender_id: 'e5555555-5555-5555-5555-555555555555',
      receiver_id: 'a1111111-1111-1111-1111-111111111111',
      skill_requested: 'Python',
      skill_offered: 'Video Editing',
      objective: 'Looking for beginner Python scripts to automate bulk media renaming and folder organization for video editing pipelines.',
      status: 'Pending',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ],
  conversations: [
    {
      id: 'c0000001-0001-0001-0001-000000000001',
      participant_one: 'a1111111-1111-1111-1111-111111111111',
      participant_two: 'b2222222-2222-2222-2222-222222222222',
      updated_at: new Date().toISOString()
    }
  ],
  messages: [
    {
      id: 'm-1',
      conversation_id: 'c0000001-0001-0001-0001-000000000001',
      sender_id: 'a1111111-1111-1111-1111-111111111111',
      content: 'Hi Sarah! Thanks for accepting my request. Looking forward to our UI/UX and Python skill exchange!',
      is_read: true,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'm-2',
      conversation_id: 'c0000001-0001-0001-0001-000000000001',
      sender_id: 'b2222222-2222-2222-2222-222222222222',
      content: 'Hey Alex! So excited. I have always wanted to automate my design assets with Python. When works best for our first session?',
      is_read: true,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'm-3',
      conversation_id: 'c0000001-0001-0001-0001-000000000001',
      sender_id: 'a1111111-1111-1111-1111-111111111111',
      content: 'How does Wednesday at 4:00 PM EST sound? I can prepare an interactive Colab notebook for you!',
      is_read: false,
      created_at: new Date(Date.now() - 4 * 3600000).toISOString()
    }
  ],
  sessions: [
    {
      id: 's0000001-0001-0001-0001-000000000001',
      mentor_id: 'b2222222-2222-2222-2222-222222222222',
      learner_id: 'a1111111-1111-1111-1111-111111111111',
      skill_name: 'UI/UX Design',
      session_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      start_time: '16:00:00',
      end_time: '17:00:00',
      meeting_link: 'https://meet.google.com/xyz-mentor-skill',
      objective: 'Figma layout grids, typography hierarchies, and mobile responsiveness review.',
      status: 'Scheduled',
      created_at: new Date().toISOString()
    },
    {
      id: 's0000002-0002-0002-0002-000000000002',
      mentor_id: 'a1111111-1111-1111-1111-111111111111',
      learner_id: 'b2222222-2222-2222-2222-222222222222',
      skill_name: 'Python',
      session_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      start_time: '14:00:00',
      end_time: '15:00:00',
      meeting_link: 'https://meet.google.com/abc-python-exchange',
      objective: 'Python fundamentals: variables, lists, dictionaries, and CSV file reading.',
      status: 'Completed',
      created_at: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      session_id: 's0000002-0002-0002-0002-000000000002',
      reviewer_id: 'b2222222-2222-2222-2222-222222222222',
      reviewed_id: 'a1111111-1111-1111-1111-111111111111',
      rating: 5,
      feedback: 'Alex is a phenomenal peer teacher! He broke down Python programming concepts into bite-sized analogies that made total sense. We wrote 3 scripts together in one hour. Highly recommended!',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ]
};

let remoteTablesAvailable = false;

// Check once on startup whether Supabase tables are available
(async function checkRemoteTables() {
  try {
    const { error } = await supabaseAdmin.from('profiles').select('id').limit(1);
    if (!error) {
      remoteTablesAvailable = true;
      console.log('✅ Connected to Supabase Cloud PostgreSQL: remote tables are LIVE!');
    } else {
      console.log('ℹ️ Supabase Cloud tables pending migration. In-Memory Adaptive Store is ACTIVE.');
    }
  } catch (e) {
    console.log('ℹ️ Adaptive in-memory persistence active.');
  }
})();

export const db = {
  // PROFILES
  async getProfile(userId) {
    if (remoteTablesAvailable) {
      try {
        const { data: profile, error } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
        if (!error && profile) {
          const { data: teaching } = await supabaseAdmin.from('user_teaching_skills').select('*').eq('user_id', userId);
          const { data: learning } = await supabaseAdmin.from('user_learning_skills').select('*').eq('user_id', userId);
          return { ...profile, teaching_skills: teaching || [], learning_skills: learning || [] };
        }
      } catch (e) {}
    }

    let profile = memoryStore.profiles.find(p => p.id === userId);
    if (!profile) {
      // Auto-create on first access for any new user id
      profile = {
        id: userId,
        full_name: 'Student Learner',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        bio: 'Passionate student eager to learn and mentor fellow peers.',
        institution: 'Campus University',
        department: 'General Studies',
        year_of_study: '2nd Year',
        location: 'United States',
        preferred_format: 'Online',
        languages: ['English'],
        rating: 5.0,
        completed_sessions_count: 0,
        mentored_count: 0,
        created_at: new Date().toISOString()
      };
      memoryStore.profiles.push(profile);
    }

    const teaching = memoryStore.teaching_skills.filter(s => s.user_id === userId);
    const learning = memoryStore.learning_skills.filter(s => s.user_id === userId);
    return { ...profile, teaching_skills: teaching, learning_skills: learning };
  },

  async updateProfile(userId, updates) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('profiles').update(updates).eq('id', userId).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const index = memoryStore.profiles.findIndex(p => p.id === userId);
    if (index !== -1) {
      memoryStore.profiles[index] = { ...memoryStore.profiles[index], ...updates };
      return memoryStore.profiles[index];
    }
    const newProfile = { id: userId, ...updates, created_at: new Date().toISOString() };
    memoryStore.profiles.push(newProfile);
    return newProfile;
  },

  async getAllProfiles() {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('profiles').select('*, user_teaching_skills(*), user_learning_skills(*)');
        if (!error && data) {
          return data.map(p => ({
            ...p,
            teaching_skills: p.user_teaching_skills || [],
            learning_skills: p.user_learning_skills || []
          }));
        }
      } catch (e) {}
    }

    return memoryStore.profiles.map(p => ({
      ...p,
      teaching_skills: memoryStore.teaching_skills.filter(s => s.user_id === p.id),
      learning_skills: memoryStore.learning_skills.filter(s => s.user_id === p.id)
    }));
  },

  // SKILLS
  async addTeachingSkill(userId, skill_name, proficiency_level) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('user_teaching_skills').insert({ user_id: userId, skill_name, proficiency_level }).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const existingIndex = memoryStore.teaching_skills.findIndex(s => s.user_id === userId && s.skill_name.toLowerCase() === skill_name.toLowerCase());
    if (existingIndex !== -1) {
      memoryStore.teaching_skills[existingIndex].proficiency_level = proficiency_level;
      return memoryStore.teaching_skills[existingIndex];
    }
    const skill = { id: randomUUID(), user_id: userId, skill_name, proficiency_level, created_at: new Date().toISOString() };
    memoryStore.teaching_skills.push(skill);
    return skill;
  },

  async removeTeachingSkill(userId, skillId) {
    if (remoteTablesAvailable) {
      try {
        await supabaseAdmin.from('user_teaching_skills').delete().match({ id: skillId, user_id: userId });
        return true;
      } catch (e) {}
    }
    memoryStore.teaching_skills = memoryStore.teaching_skills.filter(s => !(s.id === skillId && s.user_id === userId));
    return true;
  },

  async addLearningSkill(userId, skill_name, target_level) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('user_learning_skills').insert({ user_id: userId, skill_name, target_level }).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const existingIndex = memoryStore.learning_skills.findIndex(s => s.user_id === userId && s.skill_name.toLowerCase() === skill_name.toLowerCase());
    if (existingIndex !== -1) {
      memoryStore.learning_skills[existingIndex].target_level = target_level;
      return memoryStore.learning_skills[existingIndex];
    }
    const skill = { id: randomUUID(), user_id: userId, skill_name, target_level, created_at: new Date().toISOString() };
    memoryStore.learning_skills.push(skill);
    return skill;
  },

  async removeLearningSkill(userId, skillId) {
    if (remoteTablesAvailable) {
      try {
        await supabaseAdmin.from('user_learning_skills').delete().match({ id: skillId, user_id: userId });
        return true;
      } catch (e) {}
    }
    memoryStore.learning_skills = memoryStore.learning_skills.filter(s => !(s.id === skillId && s.user_id === userId));
    return true;
  },

  // DISCOVERY & FILTERING
  async discoverStudents({ query, category, proficiency, format, currentUserId }) {
    const allProfiles = await this.getAllProfiles();
    return allProfiles.filter(p => {
      if (currentUserId && p.id === currentUserId) return false;

      // Filter by text search
      if (query) {
        const q = query.toLowerCase();
        const nameMatch = p.full_name.toLowerCase().includes(q);
        const instMatch = (p.institution || '').toLowerCase().includes(q);
        const bioMatch = (p.bio || '').toLowerCase().includes(q);
        const teachMatch = p.teaching_skills.some(s => s.skill_name.toLowerCase().includes(q));
        const learnMatch = p.learning_skills.some(s => s.skill_name.toLowerCase().includes(q));
        if (!nameMatch && !instMatch && !bioMatch && !teachMatch && !learnMatch) return false;
      }

      // Filter by format
      if (format && format !== 'All' && p.preferred_format !== format) {
        return false;
      }

      // Filter by proficiency level in teaching skills
      if (proficiency && proficiency !== 'All') {
        const hasProficiency = p.teaching_skills.some(s => s.proficiency_level === proficiency);
        if (!hasProficiency) return false;
      }

      return true;
    });
  },

  // MENTORSHIP REQUESTS
  async getRequests(userId) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('mentorship_requests').select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`).order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {}
    }

    const requests = memoryStore.requests.filter(r => r.sender_id === userId || r.receiver_id === userId);
    return requests.map(r => ({
      ...r,
      sender: memoryStore.profiles.find(p => p.id === r.sender_id) || { id: r.sender_id, full_name: 'Peer Student' },
      receiver: memoryStore.profiles.find(p => p.id === r.receiver_id) || { id: r.receiver_id, full_name: 'Peer Mentor' }
    }));
  },

  async createRequest({ sender_id, receiver_id, skill_requested, skill_offered, objective }) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('mentorship_requests').insert({ sender_id, receiver_id, skill_requested, skill_offered, objective, status: 'Pending' }).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const newRequest = {
      id: randomUUID(),
      sender_id,
      receiver_id,
      skill_requested,
      skill_offered: skill_offered || null,
      objective,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    memoryStore.requests.unshift(newRequest);
    return newRequest;
  },

  async updateRequestStatus(requestId, status, userId) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('mentorship_requests').update({ status }).eq('id', requestId).select().single();
        if (!error && data) {
          // If accepted, auto-create conversation if doesn't exist
          if (status === 'Accepted') {
            await this.getOrCreateConversation(data.sender_id, data.receiver_id);
          }
          return data;
        }
      } catch (e) {}
    }

    const req = memoryStore.requests.find(r => r.id === requestId);
    if (req) {
      req.status = status;
      if (status === 'Accepted') {
        this.getOrCreateConversation(req.sender_id, req.receiver_id);
      }
      return req;
    }
    return null;
  },

  // CONVERSATIONS & CHAT MESSAGES
  async getOrCreateConversation(p1, p2) {
    if (remoteTablesAvailable) {
      try {
        const { data: existing } = await supabaseAdmin.from('conversations').select('*').or(`and(participant_one.eq.${p1},participant_two.eq.${p2}),and(participant_one.eq.${p2},participant_two.eq.${p1})`).maybeSingle();
        if (existing) return existing;

        const { data: created } = await supabaseAdmin.from('conversations').insert({ participant_one: p1, participant_two: p2, updated_at: new Date().toISOString() }).select().single();
        if (created) return created;
      } catch (e) {}
    }

    let conv = memoryStore.conversations.find(c => 
      (c.participant_one === p1 && c.participant_two === p2) ||
      (c.participant_one === p2 && c.participant_two === p1)
    );
    if (!conv) {
      conv = {
        id: randomUUID(),
        participant_one: p1,
        participant_two: p2,
        updated_at: new Date().toISOString()
      };
      memoryStore.conversations.push(conv);
    }
    return conv;
  },

  async getConversations(userId) {
    const convs = memoryStore.conversations.filter(c => c.participant_one === userId || c.participant_two === userId);
    return convs.map(c => {
      const otherId = c.participant_one === userId ? c.participant_two : c.participant_one;
      const otherProfile = memoryStore.profiles.find(p => p.id === otherId) || { id: otherId, full_name: 'Peer Student' };
      const lastMsg = memoryStore.messages.filter(m => m.conversation_id === c.id).slice(-1)[0] || null;
      const unreadCount = memoryStore.messages.filter(m => m.conversation_id === c.id && m.sender_id !== userId && !m.is_read).length;
      return {
        ...c,
        recipient: otherProfile,
        lastMessage: lastMsg,
        unreadCount
      };
    });
  },

  async getMessages(conversationId) {
    if (remoteTablesAvailable) {
      try {
        const { data } = await supabaseAdmin.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
        if (data) return data;
      } catch (e) {}
    }

    return memoryStore.messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  async sendMessage({ conversation_id, receiver_id, sender_id, content }) {
    let convId = conversation_id;
    if (!convId && receiver_id) {
      const conv = await this.getOrCreateConversation(sender_id, receiver_id);
      convId = conv.id;
    }

    if (remoteTablesAvailable) {
      try {
        const { data } = await supabaseAdmin.from('messages').insert({ conversation_id: convId, sender_id, content, is_read: false }).select().single();
        if (data) return data;
      } catch (e) {}
    }

    const message = {
      id: randomUUID(),
      conversation_id: convId,
      sender_id,
      content,
      is_read: false,
      created_at: new Date().toISOString()
    };
    memoryStore.messages.push(message);

    // Update conversation timestamp
    const conv = memoryStore.conversations.find(c => c.id === convId);
    if (conv) conv.updated_at = new Date().toISOString();

    return message;
  },

  // SESSIONS
  async getSessions(userId) {
    if (remoteTablesAvailable) {
      try {
        const { data } = await supabaseAdmin.from('learning_sessions').select('*, mentor:profiles!mentor_id(*), learner:profiles!learner_id(*)').or(`mentor_id.eq.${userId},learner_id.eq.${userId}`).order('session_date', { ascending: true });
        if (data) return data;
      } catch (e) {}
    }

    const sessions = memoryStore.sessions.filter(s => s.mentor_id === userId || s.learner_id === userId);
    return sessions.map(s => ({
      ...s,
      mentor: memoryStore.profiles.find(p => p.id === s.mentor_id) || { id: s.mentor_id, full_name: 'Peer Mentor' },
      learner: memoryStore.profiles.find(p => p.id === s.learner_id) || { id: s.learner_id, full_name: 'Peer Learner' }
    }));
  },

  async createSession(sessionData) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('learning_sessions').insert({ ...sessionData, status: 'Scheduled' }).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const newSession = {
      id: randomUUID(),
      ...sessionData,
      status: 'Scheduled',
      created_at: new Date().toISOString()
    };
    memoryStore.sessions.push(newSession);
    return newSession;
  },

  async updateSessionStatus(sessionId, status) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('learning_sessions').update({ status }).eq('id', sessionId).select().single();
        if (!error && data) return data;
      } catch (e) {}
    }

    const s = memoryStore.sessions.find(x => x.id === sessionId);
    if (s) {
      s.status = status;
      return s;
    }
    return null;
  },

  // REVIEWS & REPUTATION
  async getReviews(userId) {
    if (remoteTablesAvailable) {
      try {
        const { data } = await supabaseAdmin.from('reviews').select('*, reviewer:profiles!reviewer_id(*), session:learning_sessions(*)').eq('reviewed_id', userId).order('created_at', { ascending: false });
        if (data) return data;
      } catch (e) {}
    }

    const revs = memoryStore.reviews.filter(r => r.reviewed_id === userId || r.reviewer_id === userId);
    return revs.map(r => ({
      ...r,
      reviewer: memoryStore.profiles.find(p => p.id === r.reviewer_id) || { id: r.reviewer_id, full_name: 'Peer Reviewer' },
      session: memoryStore.sessions.find(s => s.id === r.session_id) || null
    }));
  },

  async createReview({ session_id, reviewer_id, reviewed_id, rating, feedback }) {
    if (remoteTablesAvailable) {
      try {
        const { data, error } = await supabaseAdmin.from('reviews').insert({ session_id, reviewer_id, reviewed_id, rating, feedback }).select().single();
        if (!error && data) {
          // Update completed count on session
          await supabaseAdmin.from('learning_sessions').update({ status: 'Completed' }).eq('id', session_id);
          return data;
        }
      } catch (e) {}
    }

    const newReview = {
      id: randomUUID(),
      session_id,
      reviewer_id,
      reviewed_id,
      rating,
      feedback: feedback || '',
      created_at: new Date().toISOString()
    };
    memoryStore.reviews.unshift(newReview);

    // Update session status to Completed
    const session = memoryStore.sessions.find(s => s.id === session_id);
    if (session) session.status = 'Completed';

    // Recalculate reviewed profile rating & counts
    const userReviews = memoryStore.reviews.filter(r => r.reviewed_id === reviewed_id);
    const avgRating = Number((userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(2));
    const profile = memoryStore.profiles.find(p => p.id === reviewed_id);
    if (profile) {
      profile.rating = avgRating;
      profile.completed_sessions_count = (profile.completed_sessions_count || 0) + 1;
      if (session && session.mentor_id === reviewed_id) {
        profile.mentored_count = (profile.mentored_count || 0) + 1;
      }
    }

    return newReview;
  }
};

export default db;
