import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Layers, 
  Compass, 
  Sparkles, 
  UserCheck, 
  MessageSquare, 
  Calendar, 
  Star, 
  User, 
  Settings,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, profile } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Overview', icon: Layers },
    { to: '/discover', label: 'Discover Students', icon: Compass },
    { to: '/recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'Gemini' },
    { to: '/requests', label: 'Exchange Requests', icon: ArrowRightLeft },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/sessions', label: 'Learning Sessions', icon: Calendar },
    { to: '/reviews', label: 'Reviews & Reputation', icon: Star },
    { to: '/profile', label: 'My Public Profile', icon: User },
    { to: '/profile/edit', label: 'Skill Inventory & Edit', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block pr-6">
      <div className="sticky top-24 glass-panel rounded-2xl p-4 border border-white/10 space-y-6">
        
        {/* User Mini Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <img
            src={profile?.avatar_url || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={user?.full_name}
            className="w-10 h-10 rounded-full object-cover border border-indigo-500/40"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{user?.full_name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{profile?.institution || 'Student'}</p>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-0.5">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{profile?.rating || '4.90'}</span>
              <span className="text-slate-400 font-normal">({profile?.completed_sessions_count || 12} sessions)</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Control Center
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
