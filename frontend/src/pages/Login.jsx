import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Repeat,
  TrendingUp,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
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
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT SIDE: Animated Project Showcase & Highlights */}
        <div className="lg:col-span-6 space-y-6 lg:pr-4">
          {/* Brand header */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-navy-900 dark:bg-[#172A33] border border-transparent dark:border-[#36505A] flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6 text-brand-500 dark:text-[#D8B66C]" />
              </div>
              <span className="font-serif text-3xl font-black tracking-tight text-navy-900 dark:text-[#F7F2E8]">
                Book<span className="text-brand-600 dark:text-[#D8B66C]">Swap</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-[#203640] border border-brand-200 dark:border-[#36505A] text-brand-800 dark:text-[#D8B66C] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-[#D8B66C]" />
              <span>Campus Book Exchange & Second-Hand Marketplace</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 dark:text-[#F7F2E8] leading-tight">
              Exchange Books with <span className="text-brand-600 dark:text-[#D8B66C]">Fellow Students</span>.
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-[#BBCBD0] font-medium leading-relaxed">
              Buy, sell, donate, and swap college textbooks directly with peers. Save up to 80% on semester coursework and keep academic resources in circulation.
            </p>
          </div>

          {/* Animated Interactive Cards Showcase */}
          <div className="space-y-3.5 pt-2">
            {/* Card 1: Floating Recent Swap */}
            <div className="animate-float-slow p-4 rounded-2xl bg-white dark:bg-[#203640] border border-cream-200 dark:border-[#36505A] shadow-soft flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-[#172A33] text-brand-600 dark:text-[#D8B66C] flex items-center justify-center flex-shrink-0">
                <Repeat className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-navy-900 dark:text-[#F7F2E8] truncate">
                    Data Structures & Algorithms in Java
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-[#78C49C] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    Swapped
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-[#8C9FA6] truncate mt-0.5">
                  Computer Science Department • 12 mins ago
                </p>
              </div>
            </div>

            {/* Card 2: Floating Live Stats */}
            <div className="animate-float-reverse p-4 rounded-2xl bg-white dark:bg-[#203640] border border-cream-200 dark:border-[#36505A] shadow-soft flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#172A33] text-emerald-600 dark:text-[#78C49C] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-navy-900 dark:text-[#F7F2E8]">
                  ₹4,500+ Saved Per Student / Semester
                </p>
                <p className="text-[11px] text-gray-500 dark:text-[#8C9FA6] truncate mt-0.5">
                  Over 5,000+ textbooks exchanged across 40+ universities
                </p>
              </div>
            </div>
          </div>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-[#172A33] border border-cream-200 dark:border-[#36505A] text-xs font-semibold text-navy-800 dark:text-[#BBCBD0]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#78C49C]" />
              Direct Campus Handover
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-[#172A33] border border-cream-200 dark:border-[#36505A] text-xs font-semibold text-navy-800 dark:text-[#BBCBD0]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#78C49C]" />
              Zero Middleman Fees
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-[#172A33] border border-cream-200 dark:border-[#36505A] text-xs font-semibold text-navy-800 dark:text-[#BBCBD0]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#78C49C]" />
              Instant ISBN Metadata
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Login Form */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-[#203640] py-8 px-6 sm:px-10 rounded-3xl border border-cream-200 dark:border-[#36505A] shadow-soft space-y-6 animate-slide-in">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 dark:text-[#F7F2E8]">
                Sign in to your account
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#BBCBD0]">
                Enter your college email and password to access your dashboard
              </p>
            </div>

            {/* Quick Demo Logins Bar */}
            <div className="p-3.5 rounded-2xl bg-cream-100/70 dark:bg-[#172A33] border border-cream-200 dark:border-[#36505A] space-y-2 text-center">
              <span className="text-[11px] font-bold text-gray-500 dark:text-[#BBCBD0] uppercase tracking-wider block">
                1-Click Demo Testing
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fillDemo('rahul.eng@campus.edu', 'password123')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#203640] border border-cream-300 dark:border-[#36505A] text-xs font-semibold text-navy-800 dark:text-[#F7F2E8] hover:bg-cream-100 dark:hover:bg-[#29434D] transition-colors"
                >
                  Rahul (Engineering)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('ananya.med@campus.edu', 'password123')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#203640] border border-cream-300 dark:border-[#36505A] text-xs font-semibold text-navy-800 dark:text-[#F7F2E8] hover:bg-cream-100 dark:hover:bg-[#29434D] transition-colors"
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
                <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                  College / Student Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-brand-600 dark:text-[#D8B66C] hover:text-brand-700 dark:hover:text-[#c4a259]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8C9FA6] hover:text-navy-900 dark:hover:text-[#D8B66C] p-1 focus:outline-none transition-colors"
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
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-[#D8B66C] dark:hover:bg-[#c4a259] text-white dark:text-[#101D24] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-[#101D24] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-cream-200 dark:border-[#36505A] pt-4 text-center">
              <p className="text-xs text-gray-600 dark:text-[#BBCBD0]">
                New to BookSwap?{' '}
                <Link
                  to="/register"
                  className="font-bold text-brand-600 dark:text-[#D8B66C] hover:text-brand-700 dark:hover:text-[#c4a259]"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
