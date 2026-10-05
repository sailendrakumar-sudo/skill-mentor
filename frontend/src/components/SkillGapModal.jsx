import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Target, Calendar, CheckSquare, Compass, Loader2 } from 'lucide-react';
import api from '../services/api';

export const SkillGapModal = ({ skillName, currentLevel = 'Beginner', targetLevel = 'Advanced', isOpen, onClose }) => {
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && skillName) {
      loadAdvisory();
    }
  }, [isOpen, skillName]);

  const loadAdvisory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getAiSkillGap({
        skill_name: skillName,
        current_level: currentLevel || 'Beginner',
        target_level: targetLevel || 'Advanced',
        objective: `Accelerate learning through structured peer mentorship and collaborative practice.`
      });
      if (res.success && res.advisory) {
        setAdvisory(res.advisory);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate advisory');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">AI Skill Gap & Learning Path Advisory</h3>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalized roadmap for <span className="text-indigo-400 font-semibold">{skillName}</span> ({currentLevel} → {targetLevel})
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-white">Consulting Gemini Academic Advisor...</p>
            <p className="text-xs text-slate-400">Synthesizing curriculum milestones and peer discussion prompts</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-rose-400">{error}</p>
            <button
              onClick={loadAdvisory}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              Retry
            </button>
          </div>
        ) : advisory ? (
          <div className="mt-4 space-y-5">
            
            {/* Summary & Stats Banner */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {advisory.summary}
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-indigo-500/20 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span><strong>{advisory.estimatedWeeks || 6}</strong> Weeks Estimated</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span><strong>{advisory.recommendedHoursPerWeek || 5}</strong> hrs/week with peer practice</span>
                </div>
              </div>
            </div>

            {/* Milestone Roadmap */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Peer Learning Milestones</span>
              </h4>
              <div className="space-y-3">
                {(advisory.milestoneRoadmap || []).map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{m.title}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                        {m.weekRange}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(m.coreConcepts || []).map((c, cIdx) => (
                        <span key={cIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                    {m.practicalProject && (
                      <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckSquare className="w-3 h-3" />
                        <span>Deliverable: {m.practicalProject}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Peer Practice Topics */}
            {advisory.peerPracticeTopics && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Recommended Topics for Peer Sessions</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {advisory.peerPracticeTopics.map((topic, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
              >
                Close Advisory
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};

export default SkillGapModal;
