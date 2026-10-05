import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import api from '../services/api';

const AuthContext = createContext();

// Pre-configured student personas for instant frictionless testing & evaluation
export const DEMO_USERS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    full_name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    roleName: 'Tech Lead & ML Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    topSkill: 'Teaches: Python & React',
    learnGoal: 'Wants: UI/UX & Figma'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    full_name: 'Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    roleName: 'UI/UX Designer & Artist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    topSkill: 'Teaches: Figma & UI/UX',
    learnGoal: 'Wants: Python Automation'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    full_name: 'Marcus Vance',
    email: 'marcus.vance@university.edu',
    roleName: 'Data Scientist & Math Whiz',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    topSkill: 'Teaches: Data Science & Math',
    learnGoal: 'Wants: Public Speaking'
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    full_name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    roleName: 'Communications & Debate Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    topSkill: 'Teaches: Public Speaking',
    learnGoal: 'Wants: React & Web'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skill_mentor_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch full student profile whenever active user changes
  const fetchCurrentProfile = async (userId = user?.id) => {
    if (!userId) return;
    try {
      const res = await api.getCurrentProfile();
      if (res.success && res.profile) {
        setProfile(res.profile);
      }
    } catch (err) {
      console.warn('Could not fetch user profile from API:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentProfile();
  }, [user?.id]);

  // Switch persona (instant demo role testing)
  const switchDemoUser = (demoUser) => {
    setUser(demoUser);
    localStorage.setItem('skill_mentor_user', JSON.stringify(demoUser));
    fetchCurrentProfile(demoUser.id);
  };

  // Supabase & Custom Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Check if matches demo user
      const demo = DEMO_USERS.find(d => d.email.toLowerCase() === email.toLowerCase());
      if (demo) {
        switchDemoUser(demo);
        return { success: true, user: demo };
      }

      // Try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const newUser = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
        token: data.session.access_token
      };
      setUser(newUser);
      localStorage.setItem('skill_mentor_user', JSON.stringify(newUser));
      await fetchCurrentProfile(newUser.id);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Supabase & Custom Register
  const register = async (email, password, fullName) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;

      const newUser = {
        id: data.user?.id || 'new-' + Date.now(),
        email: email,
        full_name: fullName,
        token: data.session?.access_token || null
      };
      setUser(newUser);
      localStorage.setItem('skill_mentor_user', JSON.stringify(newUser));
      await fetchCurrentProfile(newUser.id);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Switch back to default demo user or clear
    const defaultUser = DEMO_USERS[0];
    setUser(defaultUser);
    localStorage.setItem('skill_mentor_user', JSON.stringify(defaultUser));
    fetchCurrentProfile(defaultUser.id);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      register,
      logout,
      switchDemoUser,
      refreshProfile: () => fetchCurrentProfile(user?.id)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
