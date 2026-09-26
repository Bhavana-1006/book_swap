import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, Sparkles, UserCheck, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please provide email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back to BookSwap campus!');
      navigate(from, { replace: true });
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click Demo credentials
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-navy-900 dark:bg-brand-600 flex items-center justify-center text-white shadow-soft">
            <BookOpen className="w-5 h-5 text-brand-500 dark:text-white" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-navy-900 dark:text-white">
            Book<span className="text-brand-600 dark:text-amber-400">Swap</span>
          </span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="text-xs text-gray-500 dark:text-slate-300">
          Connect with peers on your campus to buy, sell, or swap textbooks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#132B32] py-8 px-6 sm:px-10 rounded-3xl border border-cream-200 dark:border-[#26525E] shadow-soft space-y-6">
          {/* Quick Demo Logins Bar */}
          <div className="p-3.5 rounded-2xl bg-cream-100/70 dark:bg-[#0E2328] border border-cream-200 dark:border-[#26525E] space-y-2 text-center">
            <span className="text-[11px] font-bold text-gray-500 dark:text-slate-300 uppercase tracking-wider block">
              1-Click Demo Testing
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('rahul.eng@campus.edu', 'password123')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#183B45] border border-cream-300 dark:border-[#2E5C6A] text-xs font-semibold text-navy-800 dark:text-white hover:bg-cream-100 dark:hover:bg-[#204956] transition-colors"
              >
                Rahul (Engineering)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('ananya.med@campus.edu', 'password123')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#183B45] border border-cream-300 dark:border-[#2E5C6A] text-xs font-semibold text-navy-800 dark:text-white hover:bg-cream-100 dark:hover:bg-[#204956] transition-colors"
              >
                Ananya (Medical)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@bookswap.edu', 'password123')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-700/50 text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
              >
                Admin (Sarah)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-1">
                College / Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 dark:text-amber-400 hover:text-brand-700 dark:hover:text-amber-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-navy-900 dark:hover:text-amber-300 p-1 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-navy-950 font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-cream-200 dark:border-[#26525E] text-center text-xs text-gray-500 dark:text-slate-300">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 dark:text-amber-400 hover:text-brand-700 dark:hover:text-amber-300">
              Join your campus community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
