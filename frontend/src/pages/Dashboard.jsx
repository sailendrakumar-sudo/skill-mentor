import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Star, 
  Sparkles, 
  ArrowRightLeft, 
  Video, 
  Plus, 
  UserCheck, 
  Clock, 
  ChevronRight, 
  Building2,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';
import SessionScheduler from '../components/SessionScheduler';

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [selectedPeerForSession, setSelectedPeerForSession] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sessRes, reqRes] = await Promise.all([
        api.getSessions().catch(() => ({ success: false, upcoming: [] })),
        api.getRequests().catch(() => ({ success: false, received: [], sent: [] }))
      ]);

      if (sessRes.success) setSessions(sessRes.upcoming || sessRes.all || []);
      if (reqRes.success) setRequests(reqRes.all || []);
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.updateRequestStatus(requestId, 'Accepted');
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const teachingSkills = profile?.teaching_skills || [];
  const learningSkills = profile?.learning_skills || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Welcome Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={profile?.avatar_url || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={user?.full_name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, {user?.full_name?.split(' ')[0]}! 👋
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{profile?.institution || 'Stanford University'}</span>
                <span>•</span>
                <span>{profile?.department || 'Computer Science'}</span>
                <span>•</span>
                <span className="text-indigo-400 font-semibold">{profile?.year_of_study || '3rd Year'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/recommendations"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Recommendations</span>
            </Link>
            <Link
              to="/profile/edit"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-center transition-colors"
            >
              Edit Profile
            </Link>
          </div>

        </div>

        {/* Dynamic Dual-Role Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
          
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Reputation Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">
              {Number(profile?.rating || 4.90).toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ 5.0</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Completed Sessions</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">
              {profile?.completed_sessions_count || 18}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Peer Mentored</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-indigo-300">
              {profile?.mentored_count || 12}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Active Exchanges</span>
              <ArrowRightLeft className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-purple-300">
              {requests.filter(r => r.status === 'Accepted').length || 2}
            </p>
          </div>

        </div>
      </div>

      {/* Main Content Grid: Skills on Left, Sessions & Requests on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Skills Inventory (Teaching vs Learning) */}
        <div className="space-y-6">
          
          {/* Skills I Can Teach */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Skills I Teach (Mentor)</h3>
              </div>
              <Link to="/profile/edit" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {teachingSkills.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No teaching skills added yet.</p>
              ) : (
                teachingSkills.map((s, idx) => (
                  <SkillBadge key={idx} skill={s} type="teach" size="md" />
                ))
              )}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Learning Goals (Learner)</h3>
              </div>
              <Link to="/profile/edit" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {learningSkills.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No learning goals added yet.</p>
              ) : (
                learningSkills.map((s, idx) => (
                  <SkillBadge key={idx} skill={s} type="learn" size="md" />
                ))
              )}
            </div>
          </div>

          {/* Quick AI Match Banner */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Gemini Recommendation Engine</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We identified 4 student mentors whose teaching skills match your exact learning goals with reciprocal exchange opportunities!
            </p>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl shadow-md transition-all"
            >
              <span>View Matches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Right Columns (2-wide): Upcoming Sessions & Exchange Requests */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Sessions Widget */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Upcoming Learning Sessions</h3>
              </div>
              <Link to="/sessions" className="text-xs font-semibold text-indigo-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <p>No upcoming sessions scheduled.</p>
                  <p className="text-slate-500 mt-1">Accept an exchange request or connect with a peer to schedule one.</p>
                </div>
              ) : (
                sessions.slice(0, 3).map((sess) => {
                  const isMentor = sess.mentor_id === user?.id;
                  const otherParty = isMentor ? sess.learner : sess.mentor;
                  return (
                    <div
                      key={sess.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={otherParty?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={otherParty?.full_name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{sess.skill_name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                              {isMentor ? 'Teaching' : 'Learning'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            with <strong className="text-slate-200">{otherParty?.full_name || 'Peer'}</strong>
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{sess.session_date}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{sess.start_time?.substring(0, 5)} - {sess.end_time?.substring(0, 5)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {sess.meeting_link && (
                        <a
                          href={sess.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video</span>
                        </a>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Exchange Requests Widget */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Mentorship Requests</h3>
              </div>
              <Link to="/requests" className="text-xs font-semibold text-purple-400 hover:underline">
                Manage Requests
              </Link>
            </div>

            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <p>No active exchange requests at the moment.</p>
                </div>
              ) : (
                requests.slice(0, 3).map((req) => {
                  const isSender = req.sender_id === user?.id;
                  const otherParty = isSender ? req.receiver : req.sender;
                  const isPending = req.status === 'Pending';

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={otherParty?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={otherParty?.full_name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{otherParty?.full_name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              req.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                              req.status === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-slate-700 text-slate-300'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Wants to learn: <span className="text-indigo-400 font-semibold">{req.skill_requested}</span>
                            {req.skill_offered && (
                              <span> • Offers: <span className="text-emerald-400 font-semibold">{req.skill_offered}</span></span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">"{req.objective}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {!isSender && isPending ? (
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
                          >
                            Accept
                          </button>
                        ) : req.status === 'Accepted' ? (
                          <Link
                            to="/messages"
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Chat</span>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {schedulerOpen && selectedPeerForSession && (
        <SessionScheduler
          peer={selectedPeerForSession}
          isOpen={schedulerOpen}
          onClose={() => setSchedulerOpen(false)}
          onSuccess={() => loadDashboardData()}
        />
      )}

    </div>
  );
};

export default Dashboard;
