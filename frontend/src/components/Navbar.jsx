import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { 
  Sparkles, 
  Users, 
  Compass, 
  MessageSquare, 
  Calendar, 
  Star, 
  Layers, 
  UserCheck, 
  Menu, 
  X,
  ChevronDown,
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';

export const Navbar = () => {
  const { user, profile, logout, switchDemoUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Layers },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'AI Matches', path: '/recommendations', icon: Sparkles, badge: 'AI' },
    { name: 'Requests', path: '/requests', icon: UserCheck },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Sessions', path: '/sessions', icon: Calendar },
    { name: 'Reviews', path: '/reviews', icon: Star },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Skill<span className="gradient-text">Mentor</span>
              </span>
              <span className="text-[10px] text-indigo-300 font-medium tracking-wide uppercase block -mt-1">
                Peer Student Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-500/15 text-indigo-300 shadow-sm border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar: Persona Switcher & Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Persona Switcher (For seamless multi-role testing) */}
            <div className="relative">
              <button
                onClick={() => {
                  setPersonaDropdownOpen(!personaDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-all"
                title="Switch test personas to evaluate dual roles"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-bold text-white max-w-[80px] truncate">{user?.full_name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Peer Persona
                    </p>
                    <p className="text-[11px] text-slate-500">Test different learner & mentor perspectives</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {DEMO_USERS.map((demo) => (
                      <button
                        key={demo.id}
                        onClick={() => {
                          switchDemoUser(demo);
                          setPersonaDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-slate-800/80 transition-colors ${
                          user?.id === demo.id ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : ''
                        }`}
                      >
                        <img src={demo.avatar} alt={demo.full_name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">{demo.full_name}</p>
                          <p className="text-[11px] text-indigo-400 truncate">{demo.topSkill}</p>
                          <p className="text-[10px] text-slate-400 truncate">{demo.learnGoal}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setPersonaDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all"
              >
                <img
                  src={profile?.avatar_url || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user?.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{profile?.rating || '4.90'} Rating</span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/profile/edit"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Manage Skills</span>
                  </Link>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Reset / Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 text-indigo-400" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
