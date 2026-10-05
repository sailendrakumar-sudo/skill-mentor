import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRightLeft, Star, Send, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import SkillBadge from './SkillBadge';

export const MentorMatchCard = ({ recommendation, onRequestExchange }) => {
  const { mentor, matchScore, reasoning, reciprocalExchangePotential, matchedSkills } = recommendation;

  if (!mentor) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Mentor Details & Match Score Badge */}
        <div className="flex items-start gap-4 flex-1">
          <Link to={`/student/${mentor.id}`} className="relative shrink-0">
            <img
              src={mentor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={mentor.full_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{matchScore}%</span>
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/student/${mentor.id}`} className="hover:underline">
                <h3 className="text-lg font-bold text-white truncate">{mentor.full_name}</h3>
              </Link>
              {reciprocalExchangePotential && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Reciprocal Synergy</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-0.5">{mentor.institution} • {mentor.department}</p>

            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{Number(mentor.rating || 5.0).toFixed(2)}</span>
              </div>
              <span className="text-slate-400">{mentor.completed_sessions_count || 15} sessions completed</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 text-[11px] font-medium border border-slate-700">
                {mentor.preferred_format || 'Online'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Button */}
        <div className="w-full lg:w-auto flex items-center gap-2">
          <Link
            to={`/student/${mentor.id}`}
            className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 text-center transition-colors"
          >
            View Profile
          </Link>
          <button
            onClick={() => onRequestExchange(mentor)}
            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request Exchange</span>
          </button>
        </div>

      </div>

      {/* AI Gemini Reasoning Breakdown */}
      <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 relative">
        <div className="flex items-start gap-2.5">
          <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
              Gemini Compatibility Rationale
            </p>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {reasoning}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Comparison Row */}
      <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Teaches:</span>
          <div className="flex flex-wrap gap-1.5">
            {(mentor.teaching_skills || []).map((s, idx) => (
              <SkillBadge key={idx} skill={s} type="teach" size="sm" />
            ))}
          </div>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Wants to Learn:</span>
          <div className="flex flex-wrap gap-1.5">
            {(mentor.learning_skills || []).map((s, idx) => (
              <SkillBadge key={idx} skill={s} type="learn" size="sm" />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MentorMatchCard;
