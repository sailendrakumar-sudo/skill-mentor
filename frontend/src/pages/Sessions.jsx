import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  Star, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  Loader2,
  BookOpen,
  Award
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SessionScheduler from '../components/SessionScheduler';
import ReviewForm from '../components/ReviewForm';
import SessionAgendaModal from '../components/SessionAgendaModal';

export const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All' | 'Scheduled' | 'Completed'

  // Modals state
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  
  // AI Agenda Modal state
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [agendaSkill, setAgendaSkill] = useState('');
  const [agendaObjective, setAgendaObjective] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.getSessions();
      if (res.success) {
        setSessions(res.all || []);
      }
    } catch (err) {
      console.warn('Failed to load sessions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user?.id]);

  const handleUpdateStatus = async (sessionId, status) => {
    try {
      await api.updateSessionStatus(sessionId, status);
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReview = (session) => {
    setSelectedSessionForReview(session);
    setReviewOpen(true);
  };

  const handleOpenAiAgenda = (skill, objective) => {
    setAgendaSkill(skill);
    setAgendaObjective(objective);
    setAgendaOpen(true);
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Session Tracker & Scheduler</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Learning Sessions</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track upcoming meetings, join video calls, and review completed mentorship exchanges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {['All', 'Scheduled', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filter === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSchedulerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading learning sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No sessions found in this view</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Schedule a study session with one of your matched peers to begin exchanging skills.
          </p>
          <button
            onClick={() => setSchedulerOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
          >
            Schedule a Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((sess) => {
            const isMentor = sess.mentor_id === user?.id;
            const peer = isMentor ? sess.learner : sess.mentor;
            const isScheduled = sess.status === 'Scheduled';
            const isCompleted = sess.status === 'Completed';

            return (
              <div
                key={sess.id}
                className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                
                {/* Session Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={peer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={peer?.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border border-indigo-500/40 shrink-0"
                  />

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-white">{sess.skill_name}</h3>
                      
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isMentor
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isMentor ? <Award className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                        <span>{isMentor ? 'You are Mentoring' : 'You are Learning'}</span>
                      </span>

                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCompleted ? 'bg-purple-500/20 text-purple-300' :
                        isScheduled ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {sess.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      With <strong className="text-white">{peer?.full_name || 'Peer Student'}</strong> ({peer?.institution || 'University'})
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{sess.session_date}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{sess.start_time?.substring(0, 5)} - {sess.end_time?.substring(0, 5)}</span>
                      </span>
                    </div>

                    {sess.objective && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic">
                        "{sess.objective}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center shrink-0 flex-wrap">
                  
                  {/* AI Agenda Button */}
                  <button
                    onClick={() => handleOpenAiAgenda(sess.skill_name, sess.objective)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors"
                    title="Generate 60-min interactive agenda with Gemini AI"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Agenda</span>
                  </button>

                  {/* Join Video Link */}
                  {sess.meeting_link && isScheduled && (
                    <a
                      href={sess.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                  )}

                  {/* Complete Session Action */}
                  {isScheduled && (
                    <button
                      onClick={() => handleUpdateStatus(sess.id, 'Completed')}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 transition-colors"
                      title="Mark session as completed"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  {/* Rate / Review Action */}
                  {isCompleted && (
                    <button
                      onClick={() => handleOpenReview(sess)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-md transition-all"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>Review Peer</span>
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Scheduler Modal */}
      {schedulerOpen && (
        <SessionScheduler
          peer={user}
          isOpen={schedulerOpen}
          onClose={() => setSchedulerOpen(false)}
          onSuccess={() => fetchSessions()}
        />
      )}

      {/* Review Modal */}
      {reviewOpen && selectedSessionForReview && (
        <ReviewForm
          session={selectedSessionForReview}
          isOpen={reviewOpen}
          onClose={() => setReviewOpen(false)}
          onSuccess={() => fetchSessions()}
        />
      )}

      {/* AI Agenda Modal */}
      {agendaOpen && agendaSkill && (
        <SessionAgendaModal
          skillName={agendaSkill}
          objective={agendaObjective}
          isOpen={agendaOpen}
          onClose={() => setAgendaOpen(false)}
        />
      )}

    </div>
  );
};

export default Sessions;
