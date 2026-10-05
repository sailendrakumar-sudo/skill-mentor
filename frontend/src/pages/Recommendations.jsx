import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRightLeft, RefreshCw, Loader2, Target, HelpCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MentorMatchCard from '../components/MentorMatchCard';
import RequestModal from '../components/RequestModal';
import SkillGapModal from '../components/SkillGapModal';

export const Recommendations = () => {
  const { user, profile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedMentorForRequest, setSelectedMentorForRequest] = useState(null);

  // Skill Gap Modal
  const [skillGapOpen, setSkillGapOpen] = useState(false);
  const [selectedSkillForGap, setSelectedSkillForGap] = useState('');

  const fetchRecommendations = async () => {
    try {
      const res = await api.getAiRecommendations();
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.warn('Failed to load recommendations:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRecommendations();
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecommendations();
  };

  const handleOpenRequest = (mentor) => {
    setSelectedMentorForRequest(mentor);
    setRequestModalOpen(true);
  };

  const handleOpenSkillGap = (skillName) => {
    setSelectedSkillForGap(skillName);
    setSkillGapOpen(true);
  };

  const myLearningSkills = profile?.learning_skills || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Google Gemini 3.8 Flash • Neural Matching Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI-Powered Mentor Recommendations</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Personalized peer matches analyzing your active learning goals, teaching proficiencies, and reciprocal exchange potential.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      {/* Quick Skill Gap Helper Pill Bar */}
      {myLearningSkills.length > 0 && (
        <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Target className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Generate an AI study roadmap for your target learning goals:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {myLearningSkills.map((s, idx) => {
              const name = s.skill_name || s;
              return (
                <button
                  key={idx}
                  onClick={() => handleOpenSkillGap(name)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>{name} Roadmap</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-white">Synthesizing Gemini Peer Synergies...</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Comparing your learning goals against active peer inventories and generating compatibility breakdowns.
          </p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-base font-bold text-white">No recommendations available yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add more learning goals or teaching skills to your profile to unlock customized AI recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <MentorMatchCard
              key={rec.mentorId || index}
              recommendation={rec}
              onRequestExchange={handleOpenRequest}
            />
          ))}
        </div>
      )}

      {/* Request Modal */}
      {requestModalOpen && selectedMentorForRequest && (
        <RequestModal
          targetStudent={selectedMentorForRequest}
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
        />
      )}

      {/* Skill Gap Advisory Modal */}
      {skillGapOpen && selectedSkillForGap && (
        <SkillGapModal
          skillName={selectedSkillForGap}
          isOpen={skillGapOpen}
          onClose={() => setSkillGapOpen(false)}
        />
      )}

    </div>
  );
};

export default Recommendations;
