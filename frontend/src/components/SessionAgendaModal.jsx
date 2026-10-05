import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, CheckCircle2, Copy, Check, HelpCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export const SessionAgendaModal = ({ skillName, objective, durationMinutes = 60, isOpen, onClose }) => {
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && skillName) {
      loadAgenda();
    }
  }, [isOpen, skillName]);

  const loadAgenda = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getAiSessionAgenda({
        skill_name: skillName,
        objective: objective || `Deepen practical understanding and complete hands-on exercises in ${skillName}`,
        duration_minutes: durationMinutes
      });
      if (res.success && res.agenda) {
        setAgenda(res.agenda);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate session agenda');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!agenda) return;
    const text = `=== ${agenda.sessionTitle} ===\nTarget Outcome: ${agenda.targetOutcome}\n\nAGENDA (${durationMinutes} mins):\n${(agenda.agendaSegments || []).map(s => `• [${s.minutes}m] ${s.title}: ${s.description}\n  Mentor: ${s.mentorRole}\n  Learner: ${s.learnerRole}`).join('\n\n')}\n\nPREP CHECKLIST:\n${(agenda.prepChecklist || []).map(c => `[ ] ${c}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">AI Session Prep & Agenda Summary</h3>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Structured {durationMinutes}-minute agenda for <span className="text-indigo-400 font-semibold">{skillName}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-white">Synthesizing Interactive Session Plan...</p>
            <p className="text-xs text-slate-400">Allocating collaborative checkpoints and dual-role responsibilities</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-rose-400">{error}</p>
            <button
              onClick={loadAgenda}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500"
            >
              Retry
            </button>
          </div>
        ) : agenda ? (
          <div className="mt-4 space-y-5">
            
            {/* Title & Target Outcome */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
              <h4 className="text-sm font-extrabold text-white">{agenda.sessionTitle}</h4>
              <p className="text-xs text-indigo-300 mt-1">
                <strong>Target Outcome:</strong> {agenda.targetOutcome}
              </p>
            </div>

            {/* Time-Boxed Segments */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Time-Boxed Agenda Breakdown</span>
              </h4>
              <div className="space-y-3">
                {(agenda.agendaSegments || []).map((seg, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{seg.title}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{seg.minutes} mins</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{seg.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="font-bold text-indigo-300 block mb-0.5">Mentor Action:</span>
                        <span className="text-slate-300">{seg.mentorRole}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="font-bold text-emerald-300 block mb-0.5">Learner Action:</span>
                        <span className="text-slate-300">{seg.learnerRole}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prep Checklist */}
            {agenda.prepChecklist && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pre-Session Checklist</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {agenda.prepChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Debrief Questions */}
            {agenda.suggestedDebriefQuestions && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Reflection & Debrief Questions</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-400 italic">
                  {agenda.suggestedDebriefQuestions.map((q, idx) => (
                    <li key={idx}>"{q}"</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Agenda'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all"
              >
                Done
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};

export default SessionAgendaModal;
