import React from 'react';
import { Award, BookOpen, Star } from 'lucide-react';

export const SkillBadge = ({ skill, type = 'teach', size = 'md' }) => {
  const isTeach = type === 'teach';
  const name = skill.skill_name || skill;
  const level = skill.proficiency_level || skill.target_level || 'Intermediate';

  const levelColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Advanced: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Expert: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
  };

  const badgeStyle = isTeach 
    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200' 
    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium'
  };

  return (
    <span className={`inline-flex items-center rounded-full border transition-all hover:scale-105 ${badgeStyle} ${sizeClasses[size]}`}>
      {isTeach ? (
        <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      ) : (
        <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      )}
      <span className="font-semibold">{name}</span>
      {level && (
        <span className={`ml-1 text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-md ${levelColors[level] || 'bg-slate-700/50 text-slate-300'}`}>
          {level}
        </span>
      )}
    </span>
  );
};

export default SkillBadge;
