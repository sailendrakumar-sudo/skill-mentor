import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Sparkles, Shield, Cpu, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#070A12] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md shadow-indigo-500/30">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white">
                Skill<span className="gradient-text">Mentor</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The intelligent peer-to-peer student skill exchange platform. Transform passive classrooms into dynamic hubs where every student teaches what they know and learns what they love.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Powered by Gemini AI
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Supabase RLS
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/discover" className="hover:text-white transition-colors">Discover Mentors</Link></li>
              <li><Link to="/recommendations" className="hover:text-white transition-colors">AI Match Engine</Link></li>
              <li><Link to="/sessions" className="hover:text-white transition-colors">Study Sessions</Link></li>
              <li><Link to="/requests" className="hover:text-white transition-colors">Exchange Requests</Link></li>
              <li><Link to="/reviews" className="hover:text-white transition-colors">Student Reviews</Link></li>
            </ul>
          </div>

          {/* About & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About & How It Works</Link></li>
              <li><Link to="/profile/edit" className="hover:text-white transition-colors">Skill Inventory</Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Exchange Guidelines</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Skill Mentor. Engineered for collaborative student mastery.</p>
          <div className="flex items-center gap-2">
            <span>Built with modern React, Express & Google Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
