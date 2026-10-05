import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Star, 
  Award, 
  BookOpen, 
  Send, 
  Calendar, 
  Languages, 
  CheckCircle2, 
  MessageSquare,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillBadge from '../components/SkillBadge';
import RequestModal from '../components/RequestModal';
import SessionScheduler from '../components/SessionScheduler';

export const StudentProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          api.getProfile(id),
          api.getReviews(id)
        ]);

        if (profileRes.success && profileRes.profile) {
          setStudent(profileRes.profile);
        }
        if (reviewsRes.success && reviewsRes.reviews) {
          setReviews(reviewsRes.reviews);
        }
      } catch (err) {
        console.warn('Failed to load student profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-md mx-auto py-20 text-center glass-panel rounded-2xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-white">Student Profile Not Found</h3>
        <p className="text-xs text-slate-400">The profile you requested does not exist or has been removed.</p>
        <Link to="/discover" className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500">
          Discover Other Students
        </Link>
      </div>
    );
  }

  const isMe = user?.id === student.id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Profile Card Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-600/15 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
          
          <div className="flex items-center gap-5">
            <img
              src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={student.full_name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{student.full_name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{student.institution || 'University'}</span>
                </span>
                <span>•</span>
                <span>{student.department || 'Academic Department'}</span>
                <span>•</span>
                <span className="text-indigo-400 font-semibold">{student.year_of_study || 'Student'}</span>
              </p>
              
              <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{Number(student.rating || 5.0).toFixed(2)} Rating</span>
                </div>
                <span className="text-slate-400">
                  {student.completed_sessions_count || 10} Sessions Completed
                </span>
                {student.location && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{student.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isMe && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setSchedulerOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Schedule Session</span>
              </button>
              <button
                onClick={() => setRequestModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Request Exchange</span>
              </button>
            </div>
          )}

        </div>

        {/* Bio */}
        {student.bio && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
            {student.bio}
          </p>
        )}

        {/* Additional Metadata Details */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">Format Preference:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-medium">
              {student.preferred_format || 'Online'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-300">Languages:</span>
            <span>{(student.languages || ['English']).join(', ')}</span>
          </div>
        </div>

      </div>

      {/* Skills Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Teaching Skills */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Can Teach (Mentor Portfolio)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(student.teaching_skills || []).length === 0 ? (
              <p className="text-xs text-slate-400">No skills currently listed.</p>
            ) : (
              (student.teaching_skills || []).map((s, idx) => (
                <SkillBadge key={idx} skill={s} type="teach" size="md" />
              ))
            )}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Wants to Learn (Active Goals)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(student.learning_skills || []).length === 0 ? (
              <p className="text-xs text-slate-400">No learning goals listed.</p>
            ) : (
              (student.learning_skills || []).map((s, idx) => (
                <SkillBadge key={idx} skill={s} type="learn" size="md" />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Reviews Section */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-base font-bold text-white">Peer Reviews & Reputation</h3>
          </div>
          <span className="text-xs text-slate-400">{reviews.length} reviews</span>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No reviews submitted yet for this student. Complete a study session to leave feedback!
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.reviewer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={rev.reviewer?.full_name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-white">{rev.reviewer?.full_name || 'Verified Peer'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating} / 5</span>
                  </div>
                </div>
                {rev.feedback && (
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.feedback}"
                  </p>
                )}
                <span className="text-[10px] text-slate-400 block">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {requestModalOpen && (
        <RequestModal
          targetStudent={student}
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
        />
      )}

      {schedulerOpen && (
        <SessionScheduler
          peer={student}
          isOpen={schedulerOpen}
          onClose={() => setSchedulerOpen(false)}
        />
      )}

    </div>
  );
};

export default StudentProfile;
