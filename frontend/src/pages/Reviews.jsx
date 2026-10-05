import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Award, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Reviews = () => {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        const res = await api.getReviews(user?.id);
        if (res.success && res.reviews) {
          setReviews(res.reviews);
        }
      } catch (err) {
        console.warn('Failed to load reviews:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadReviews();
  }, [user?.id]);

  const rating = Number(profile?.rating || 4.90).toFixed(2);
  const completedCount = profile?.completed_sessions_count || 18;
  const mentoredCount = profile?.mentored_count || 12;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>Reputation & Standing</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Peer Feedback & Ratings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified ratings and qualitative testimonials from completed student study sessions.
          </p>
        </div>

        <Link
          to="/sessions"
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
        >
          View Completed Sessions
        </Link>
      </div>

      {/* Aggregate Reputation Score Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          
          {/* Big Score Block */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Peer Standing
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-5xl font-black text-amber-400">{rating}</span>
              <div className="space-y-0.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 block font-semibold">out of 5.00 stars</span>
              </div>
            </div>
          </div>

          {/* Badges / Metrics */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xl font-black text-white block">{completedCount}</span>
            <span className="text-[11px] text-slate-400">Sessions Completed</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Award className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className="text-xl font-black text-indigo-300 block">{mentoredCount}</span>
            <span className="text-[11px] text-slate-400">Times Mentored</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <ShieldCheck className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <span className="text-xl font-black text-purple-300 block">100%</span>
            <span className="text-[11px] text-slate-400">Verified University Peer</span>
          </div>

        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Detailed Student Testimonials ({reviews.length})</span>
        </h3>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl border border-white/10 p-8 space-y-3">
            <Star className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No reviews received yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Finish a learning session with a peer to earn post-session reviews and build your reputation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="glass-card rounded-2xl p-5 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.reviewer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={rev.reviewer?.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{rev.reviewer?.full_name || 'Verified Peer'}</h4>
                      <p className="text-[11px] text-slate-400">{rev.reviewer?.institution || 'Campus Student'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-extrabold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating} / 5</span>
                  </div>
                </div>

                {rev.feedback && (
                  <p className="text-xs text-slate-200 leading-relaxed italic pl-2 border-l-2 border-indigo-500/40">
                    "{rev.feedback}"
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  <span>Exchange Study Session</span>
                  <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Reviews;
