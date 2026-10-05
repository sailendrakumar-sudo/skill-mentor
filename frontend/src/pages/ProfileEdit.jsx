import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  Plus, 
  Trash2, 
  Award, 
  BookOpen, 
  Building2, 
  MapPin, 
  User, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProfileEdit = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Basic Profile Form State
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [location, setLocation] = useState('');
  const [preferredFormat, setPreferredFormat] = useState('Online');
  const [languagesStr, setLanguagesStr] = useState('English');

  // Teaching Skills State
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newTeachLevel, setNewTeachLevel] = useState('Advanced');

  // Learning Skills State
  const [learningSkills, setLearningSkills] = useState([]);
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [newLearnLevel, setNewLearnLevel] = useState('Intermediate');

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
      setInstitution(profile.institution || '');
      setDepartment(profile.department || '');
      setYearOfStudy(profile.year_of_study || '');
      setLocation(profile.location || '');
      setPreferredFormat(profile.preferred_format || 'Online');
      setLanguagesStr((profile.languages || ['English']).join(', '));
      setTeachingSkills(profile.teaching_skills || []);
      setLearningSkills(profile.learning_skills || []);
    }
  }, [profile, user]);

  // Handle saving general profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const languages = languagesStr.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.updateProfile({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || undefined,
        bio: bio.trim(),
        institution: institution.trim(),
        department: department.trim(),
        year_of_study: yearOfStudy.trim(),
        location: location.trim(),
        preferred_format: preferredFormat,
        languages
      });

      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Profile details saved successfully!' });
        await refreshProfile();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  // Add Teaching Skill
  const handleAddTeachSkill = async (e) => {
    e.preventDefault();
    if (!newTeachSkill.trim()) return;

    try {
      const res = await api.addTeachingSkill(newTeachSkill.trim(), newTeachLevel);
      if (res.success) {
        setNewTeachSkill('');
        await refreshProfile();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add teaching skill' });
    }
  };

  // Delete Teaching Skill
  const handleDeleteTeachSkill = async (id) => {
    try {
      await api.deleteTeachingSkill(id);
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Learning Skill
  const handleAddLearnSkill = async (e) => {
    e.preventDefault();
    if (!newLearnSkill.trim()) return;

    try {
      const res = await api.addLearningSkill(newLearnSkill.trim(), newLearnLevel);
      if (res.success) {
        setNewLearnSkill('');
        await refreshProfile();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add learning goal' });
    }
  };

  // Delete Learning Skill
  const handleDeleteLearnSkill = async (id) => {
    try {
      await api.deleteLearningSkill(id);
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/profile" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:underline mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Manage Student Profile & Skills</h1>
          <p className="text-xs text-slate-400">Keep your teaching inventory and learning goals updated for precision matching</p>
        </div>
      </div>

      {statusMsg.text && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
            : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 1. Personal Information Form */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <User className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Personal & Academic Details</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio & Learning Philosophy</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell fellow students about your academic interests, current projects, and collaboration style..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institution / University</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department / Major</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Year of Study</label>
              <input
                type="text"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                placeholder="e.g. 3rd Year, Junior, Senior"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Format</label>
              <select
                value={preferredFormat}
                onChange={(e) => setPreferredFormat(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Online">Online Video Call</option>
                <option value="In-Person">In-Person Study</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Collaborative Project">Collaborative Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Languages (comma-separated)</label>
              <input
                type="text"
                value={languagesStr}
                onChange={(e) => setLanguagesStr(e.target.value)}
                placeholder="English, Spanish, Mandarin"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all ml-auto disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Skills You Can Teach (Mentor Portfolio) */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Award className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Skills You Can Teach (Mentor Role)</h2>
        </div>

        {/* Existing Teaching Skills */}
        <div className="space-y-2">
          {teachingSkills.length === 0 ? (
            <p className="text-xs text-slate-400">No teaching skills registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teachingSkills.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white">{s.skill_name}</span>
                    <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {s.proficiency_level}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTeachSkill(s.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Teaching Skill Form */}
        <form onSubmit={handleAddTeachSkill} className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/5">
          <input
            type="text"
            value={newTeachSkill}
            onChange={(e) => setNewTeachSkill(e.target.value)}
            placeholder="Skill to teach (e.g. Python, UI/UX, React)..."
            className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={newTeachLevel}
            onChange={(e) => setNewTeachLevel(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </form>
      </div>

      {/* 3. Skills You Want to Learn (Learner Role) */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Skills You Want to Learn (Learner Role)</h2>
        </div>

        {/* Existing Learning Skills */}
        <div className="space-y-2">
          {learningSkills.length === 0 ? (
            <p className="text-xs text-slate-400">No learning goals registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {learningSkills.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white">{s.skill_name}</span>
                    <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Target: {s.target_level}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteLearnSkill(s.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Learning Skill Form */}
        <form onSubmit={handleAddLearnSkill} className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/5">
          <input
            type="text"
            value={newLearnSkill}
            onChange={(e) => setNewLearnSkill(e.target.value)}
            placeholder="Skill you want to learn (e.g. Figma, Machine Learning)..."
            className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={newLearnLevel}
            onChange={(e) => setNewLearnLevel(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default ProfileEdit;
