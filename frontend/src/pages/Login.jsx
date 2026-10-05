import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export const Login = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleDemoLogin = (demo) => {
    switchDemoUser(demo);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-xl shadow-indigo-500/30 mx-auto">
          <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
        <p className="text-xs text-slate-400">Log in to your Skill Mentor student account</p>
      </div>

      {/* Main Login Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-5">
        
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              University Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.chen@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Instant Demo Switcher inside Login */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Or Click to Test a Demo Persona Instantly:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleDemoLogin(demo)}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-left transition-all flex items-center gap-2"
              >
                <img src={demo.avatar} alt={demo.full_name} className="w-7 h-7 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{demo.full_name.split(' ')[0]}</p>
                  <p className="text-[9px] text-slate-400 truncate">{demo.roleName.split('&')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;
