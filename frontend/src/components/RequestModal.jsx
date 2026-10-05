import React, { useState } from 'react';
import { X, Send, Sparkles, ArrowRightLeft, BookOpen, Award, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const RequestModal = ({ targetStudent, isOpen, onClose, onSuccess }) => {
  const { user, profile } = useAuth();
  const [skillRequested, setSkillRequested] = useState('');
  const [skillOffered, setSkillOffered] = useState('');
  const [objective, setObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !targetStudent) return null;

  const targetTeachingSkills = targetStudent.teaching_skills || [];
  const myTeachingSkills = profile?.teaching_skills || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillRequested) {
      setError('Please select or specify a skill you want to learn.');
      return;
    }
    if (!objective || objective.trim().length < 10) {
      setError('Please describe your learning objective (minimum 10 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.createRequest({
        receiver_id: targetStudent.id,
        skill_requested: skillRequested,
        skill_offered: skillOffered || undefined,
        objective: objective.trim()
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess && onSuccess(res.request);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit exchange request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Mentorship Request Sent!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your request has been delivered to {targetStudent.full_name}. Once accepted, you'll be able to chat and schedule study sessions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <img
                src={targetStudent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={targetStudent.full_name}
                className="w-12 h-12 rounded-xl object-cover border border-indigo-500/30"
              />
              <div>
                <h3 className="text-lg font-bold text-white">Request Skill Exchange</h3>
                <p className="text-xs text-slate-400">Collaborate with {targetStudent.full_name}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Skill You Want to Learn */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Skill You Want to Learn (from {targetStudent.full_name.split(' ')[0]})</span>
              </label>
              
              {/* Quick Select Buttons from Mentor's Skills */}
              {targetTeachingSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {targetTeachingSkills.map((s, idx) => {
                    const sName = s.skill_name || s;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSkillRequested(sName)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          skillRequested.toLowerCase() === sName.toLowerCase()
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {sName} ({s.proficiency_level || 'Expert'})
                      </button>
                    );
                  })}
                </div>
              )}

              <input
                type="text"
                value={skillRequested}
                onChange={(e) => setSkillRequested(e.target.value)}
                placeholder="e.g. Python, UI/UX Design, Public Speaking..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Skill You Can Offer in Return */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skill You Offer in Return (Reciprocal Exchange)</span>
              </label>
              
              {myTeachingSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {myTeachingSkills.map((s, idx) => {
                    const sName = s.skill_name || s;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSkillOffered(sName)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          skillOffered.toLowerCase() === sName.toLowerCase()
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {sName}
                      </button>
                    );
                  })}
                </div>
              )}

              <input
                type="text"
                value={skillOffered}
                onChange={(e) => setSkillOffered(e.target.value)}
                placeholder="e.g. React, Video Editing, Mathematics (Optional)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Objective & Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Learning Objective & Project Goals
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                placeholder="Describe what specific topics you want to cover, any projects you are building, and how you hope to collaborate..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default RequestModal;
