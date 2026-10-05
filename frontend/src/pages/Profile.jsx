import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Star, 
  Award, 
  BookOpen, 
  Edit3, 
  Languages, 
  CheckCircle2, 
  ArrowRightLeft,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillBadge from '../components/SkillBadge';

export const Profile = () => {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await api.getReviews(user?.id);
        if (res.success && res.reviews) {
          setReviews(res.reviews);
        }
      } catch (err) {}
    };
    if (user?.id) loadReviews();
  }, [user?.id]);

  const teachingSkills = profile?.teaching_skills || [];
  const learningSkills = profile?.learning_skills || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
          
          <div className="flex items-center gap-5">
            <img
              src={profile?.avatar_url || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              alt={user?.full_name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.full_name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active Peer
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{profile?.institution || 'Stanford University'}</span>
                </span>
                <span>•</span>
                <span>{profile?.department || 'Computer Science'}</span>
                <span>•</span>
                <span className="text-indigo-400 font-semibold">{profile?.year_of_study || '3rd Year'}</span>
              </p>
              
              <div className="flex items-center gap-3 mt-2 text-xs flex-wrap">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{Number(profile?.rating || 4.90).toFixed(2)} Rating</span>
                </div>
                <span className="text-slate-400">
                  {profile?.completed_sessions_count || 18} Sessions Completed
                </span>
                {profile?.location && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{profile.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/profile/edit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile & Skills</span>
          </Link>

        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
            {profile.bio}
          </p>
        )}

        {/* Additional Metadata Details */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">Format Preference:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-medium">
              {profile?.preferred_format || 'Online'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-300">Languages:</span>
            <span>{(profile?.languages || ['English']).join(', ')}</span>
          </div>
        </div>

      </div>

      {/* Skills Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Teaching Skills */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Can Teach (Mentor Portfolio)</h3>
            </div>
            <Link to="/profile/edit" className="text-xs text-indigo-400 hover:underline">
              Manage
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {teachingSkills.length === 0 ? (
              <p className="text-xs text-slate-400">No skills currently listed. Add what you can teach to start matching!</p>
            ) : (
              teachingSkills.map((s, idx) => (
                <SkillBadge key={idx} skill={s} type="teach" size="md" />
              ))
            )}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Wants to Learn (Active Goals)</h3>
            </div>
            <Link to="/profile/edit" className="text-xs text-emerald-400 hover:underline">
              Manage
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {learningSkills.length === 0 ? (
              <p className="text-xs text-slate-400">No learning goals listed. Add your target subjects to get recommendations!</p>
            ) : (
              learningSkills.map((s, idx) => (
                <SkillBadge key={idx} skill={s} type="learn" size="md" />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Reviews Received */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h3 className="text-base font-bold text-white">Peer Feedback & Reviews Received</h3>
        </div>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              No reviews received yet. Complete sessions to build up verified peer reviews!
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rev.reviewer?.full_name || 'Verified Peer'}</span>
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
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Profile;
