import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRightLeft, 
  Users, 
  SlidersHorizontal,
  GraduationCap,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import RequestModal from '../components/RequestModal';

export const Discover = () => {
  const { user, profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedProficiency, setSelectedProficiency] = useState('All');
  const [reciprocalOnly, setReciprocalOnly] = useState(false);
  
  // Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedStudentForRequest, setSelectedStudentForRequest] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.query = searchQuery;
      if (selectedFormat !== 'All') params.format = selectedFormat;
      if (selectedProficiency !== 'All') params.proficiency = selectedProficiency;

      const res = await api.discoverStudents(params);
      if (res.success && res.students) {
        setStudents(res.students);
      }
    } catch (err) {
      console.warn('Failed to discover students:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedFormat, selectedProficiency]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleOpenRequest = (student) => {
    setSelectedStudentForRequest(student);
    setRequestModalOpen(true);
  };

  // Filter reciprocal matches if toggle is on
  const myLearning = (profile?.learning_skills || []).map(s => (s.skill_name || s).toLowerCase());
  const myTeaching = (profile?.teaching_skills || []).map(s => (s.skill_name || s).toLowerCase());

  const filteredStudents = students.filter(student => {
    if (student.id === user?.id) return false;

    if (reciprocalOnly) {
      const studentTeaching = (student.teaching_skills || []).map(s => (s.skill_name || s).toLowerCase());
      const studentLearning = (student.learning_skills || []).map(s => (s.skill_name || s).toLowerCase());
      const canTeachMe = studentTeaching.some(s => myLearning.some(ml => ml.includes(s) || s.includes(ml)));
      const canLearnFromMe = studentLearning.some(s => myTeaching.some(mt => mt.includes(s) || s.includes(mt)));
      return canTeachMe && canLearnFromMe;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Global Student & Skill Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Find Your Peer Mentor</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect with university peers across tech, design, marketing, and communication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 cursor-pointer hover:border-indigo-500/50 transition-colors">
            <input
              type="checkbox"
              checked={reciprocalOnly}
              onChange={(e) => setReciprocalOnly(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reciprocal Matches Only</span>
          </label>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-xl space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (e.g. Python, Figma), student name, or university..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all shrink-0"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/5 text-xs">
          
          {/* Format Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Format:</span>
            {['All', 'Online', 'In-Person', 'Hybrid'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFormat === fmt
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Proficiency Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Proficiency:</span>
            {['All', 'Expert', 'Advanced', 'Intermediate'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedProficiency(lvl)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedProficiency === lvl
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Discovering peer students across campus networks...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No students matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, removing format restrictions, or disabling the reciprocal match filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFormat('All');
              setSelectedProficiency('All');
              setReciprocalOnly(false);
              fetchStudents();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <ProfileCard
              key={student.id}
              student={student}
              currentStudent={profile}
              onRequestExchange={handleOpenRequest}
            />
          ))}
        </div>
      )}

      {/* Request Modal */}
      {requestModalOpen && selectedStudentForRequest && (
        <RequestModal
          targetStudent={selectedStudentForRequest}
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
        />
      )}

    </div>
  );
};

export default Discover;
