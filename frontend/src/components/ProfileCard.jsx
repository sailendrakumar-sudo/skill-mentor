import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Building2, Send, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import SkillBadge from './SkillBadge';

export const ProfileCard = ({ student, currentStudent, onRequestExchange }) => {
  // Check reciprocal exchange potential
  const currentLearning = (currentStudent?.learning_skills || []).map(s => (s.skill_name || s).toLowerCase());
  const currentTeaching = (currentStudent?.teaching_skills || []).map(s => (s.skill_name || s).toLowerCase());

  const studentTeaching = (student?.teaching_skills || []).map(s => (s.skill_name || s).toLowerCase());
  const studentLearning = (student?.learning_skills || []).map(s => (s.skill_name || s).toLowerCase());

  const canTeachMe = studentTeaching.filter(s => currentLearning.some(cl => cl.includes(s) || s.includes(cl)));
  const canLearnFromMe = studentLearning.filter(s => currentTeaching.some(ct => ct.includes(s) || s.includes(ct)));

  const isReciprocal = canTeachMe.length > 0 && canLearnFromMe.length > 0;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Reciprocal Banner if applicable */}
      {isReciprocal && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500/20 to-transparent border-b border-l border-emerald-500/30 px-3 py-1 rounded-bl-xl flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Reciprocal Match</span>
        </div>
      )}

      <div>
        {/* Header: Avatar, Name, School */}
        <div className="flex items-start gap-4">
          <Link to={`/student/${student.id}`} className="relative shrink-0">
            <img
              src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={student.full_name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" title="Active Peer" />
          </Link>

          <div className="min-w-0 flex-1">
            <Link to={`/student/${student.id}`} className="hover:underline">
              <h3 className="text-base font-bold text-white truncate">{student.full_name}</h3>
            </Link>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{student.institution || 'University'}</span>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{Number(student.rating || 5.0).toFixed(2)}</span>
              </div>
              <span className="text-slate-400">
                {student.completed_sessions_count || 10} sessions completed
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <p className="text-xs text-slate-300 mt-3.5 line-clamp-2 leading-relaxed">
            {student.bio}
          </p>
        )}

        {/* Location & Format */}
        <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
          {student.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{student.location}</span>
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-medium border border-slate-700">
            {student.preferred_format || 'Online'}
          </span>
        </div>

        {/* Skills Being Taught */}
        <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
            <span>Can Teach</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(student.teaching_skills || []).map((skill, idx) => (
              <SkillBadge key={idx} skill={skill} type="teach" size="sm" />
            ))}
          </div>
        </div>

        {/* Skills Wanting to Learn */}
        <div className="mt-3 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
            <span>Wants to Learn</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(student.learning_skills || []).map((skill, idx) => (
              <SkillBadge key={idx} skill={skill} type="learn" size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
        <Link
          to={`/student/${student.id}`}
          className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
        >
          View Profile
        </Link>
        <button
          onClick={() => onRequestExchange(student)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Connect</span>
        </button>
      </div>

    </div>
  );
};

export default ProfileCard;
