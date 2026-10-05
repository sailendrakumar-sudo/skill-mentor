import React, { useState } from 'react';
import { X, Calendar, Clock, Video, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const SessionScheduler = ({ peer, isOpen, onClose, onSuccess, onOpenAiAgenda }) => {
  const { user } = useAuth();
  const [mentorId, setMentorId] = useState(peer?.id || '');
  const [skillName, setSkillName] = useState('');
  const [sessionDate, setSessionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:00');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [objective, setObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !peer) return null;

  const isPeerMentor = mentorId === peer.id;

  const generateMeetLink = () => {
    const randomId = Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
    setMeetingLink(`https://meet.google.com/${randomId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) {
      setError('Please specify the skill focus for this session.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.createSession({
        mentor_id: isPeerMentor ? peer.id : user.id,
        learner_id: isPeerMentor ? user.id : peer.id,
        skill_name: skillName.trim(),
        session_date: sessionDate,
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        meeting_link: meetingLink,
        objective: objective.trim() || undefined
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess && onSuccess(res.session);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to schedule session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
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
            <h3 className="text-xl font-bold text-white">Session Scheduled!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your learning session with {peer.full_name} is set. A reminder has been placed in your Sessions tracker.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Schedule Learning Session</h3>
                <p className="text-xs text-slate-400">With {peer.full_name}</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Who will be teaching this session?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMentorId(peer.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    isPeerMentor
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {peer.full_name.split(' ')[0]} (Mentor)
                </button>
                <button
                  type="button"
                  onClick={() => setMentorId(user?.id || '')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    !isPeerMentor
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  I will teach (Mentor)
                </button>
              </div>
            </div>

            {/* Skill Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Skill Focus
                </label>
                {skillName && onOpenAiAgenda && (
                  <button
                    type="button"
                    onClick={() => onOpenAiAgenda(skillName, objective)}
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Generate Agenda</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Python, UI/UX Design, React, Figma..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Video Call Link (Google Meet / Zoom)</span>
                </label>
                <button
                  type="button"
                  onClick={generateMeetLink}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  Generate New Link
                </button>
              </div>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Objective */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Session Objective & Notes
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={2}
                placeholder="What will you accomplish in this 60 minutes?"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Actions */}
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
                <span>{loading ? 'Scheduling...' : 'Schedule Session'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default SessionScheduler;
