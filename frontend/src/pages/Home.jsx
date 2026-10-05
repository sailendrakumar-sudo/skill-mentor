import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRightLeft, 
  Users, 
  Compass, 
  Calendar, 
  Award, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  CheckCircle2,
  Code2,
  Palette,
  MessageSquare
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export const Home = () => {
  const { switchDemoUser } = useAuth();

  return (
    <div className="space-y-24 py-8">
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/25 via-indigo-600/20 to-purple-600/25 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold shadow-sm mb-6 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Intelligent Student Skill Exchange • Powered by Google Gemini</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Learn what you love.<br />
          <span className="gradient-text">Teach what you know.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The premier peer-to-peer knowledge network for university students. Discover complementary skill matches, exchange mentorship, and collaborate on real-world projects.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/recommendations"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find AI Mentor Matches</span>
          </Link>
          <Link
            to="/discover"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 shadow-md transition-all"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Explore Skills & Peers</span>
          </Link>
        </div>

        {/* Quick Demo Persona Switcher Banner */}
        <div className="mt-12 p-4 max-w-2xl mx-auto rounded-2xl glass-panel border border-white/10 shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Instant Peer Role Test — Click Any Student to Test Platform Perspectives:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => switchDemoUser(demo)}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <img src={demo.avatar} alt={demo.full_name} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">{demo.full_name.split(' ')[0]}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">{demo.topSkill}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Key Platform Metrics */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">100%</span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Free Peer Exchange</span>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold gradient-text block">Gemini 3.8</span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">AI Matching Engine</span>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">4.92 ★</span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Average Peer Rating</span>
          </div>
          <div className="glass-card rounded-2xl p-4 border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">3,400+</span>
            <span className="text-xs text-slate-400 font-medium mt-1 block">Sessions Completed</span>
          </div>
        </div>

      </section>

      {/* How It Works 4-Step Interactive Grid */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white">How Skill Mentor Works</h2>
          <p className="text-sm text-slate-400 mt-2">
            A seamless 4-step workflow that transforms passive study into active peer mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="glass-card rounded-2xl p-6 border border-white/10 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
              1
            </div>
            <h3 className="text-base font-bold text-white">Build Skill Inventory</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              List the skills you can mentor (with proficiency) and specify the subjects you are striving to master.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg border border-purple-500/30">
              2
            </div>
            <h3 className="text-base font-bold text-white">AI-Powered Pairing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gemini AI evaluates complementary overlaps (e.g. Python for UI/UX) and calculates match scores with detailed rationale.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
              3
            </div>
            <h3 className="text-base font-bold text-white">Connect & Schedule</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Send reciprocal exchange requests, chat in real-time, and schedule sessions with built-in Google Meet links.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
              4
            </div>
            <h3 className="text-base font-bold text-white">Review & Earn Standing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              After completing the session, rate each other to build verified university reputation scores and badges.
            </p>
          </div>

        </div>
      </section>

      {/* Target Domains Feature Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">
              Cross-Disciplinary Learning
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Exchange Technical, Creative & Professional Skills
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Skill Mentor breaks campus silos. Engineers teach designers Python automation; business majors mentor developers in pitch presentations and public speaking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <Code2 className="w-6 h-6 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">Technical & Engineering</h4>
              <p className="text-xs text-slate-400">Python, React, JavaScript, Machine Learning, Java, Data Science, C++.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <Palette className="w-6 h-6 text-purple-400" />
              <h4 className="text-sm font-bold text-white">Creative & Design</h4>
              <p className="text-xs text-slate-400">Figma, UI/UX Design, Video Editing, After Effects, Graphic Design, Brand Identity.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <Users className="w-6 h-6 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Professional & Soft Skills</h4>
              <p className="text-xs text-slate-400">Public Speaking, Leadership, Business Communication, Interview Prep, Mathematics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-indigo-900/40 via-purple-900/20 to-transparent border border-indigo-500/20 shadow-2xl space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to find your skill match?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Join university peers today. Manage your skills, discover mentors, and launch reciprocal study sessions in minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/discover"
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Start Discovering Peers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
