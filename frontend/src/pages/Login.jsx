import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Lock, Mail, ArrowRight, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          <div className="w-10 h-10 rounded-2xl bg-navy-900 flex items-center justify-center text-white shadow-soft">
            <BookOpen className="w-5 h-5 text-brand-500" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-navy-900">
            Book<span className="text-brand-600">Swap</span>
          </span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
          Sign in to your account
        </h2>
        <p className="text-xs text-gray-500">
          Connect with peers on your campus to buy, sell, or swap textbooks
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-cream-200 shadow-soft space-y-6">
          {/* Quick Demo Logins Bar */}
          <div className="p-3.5 rounded-2xl bg-cream-100/70 border border-cream-200 space-y-2 text-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              1-Click Demo Testing
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('alex@student.edu', 'password123')}
                className="px-2.5 py-1 rounded-lg bg-white border border-cream-300 text-xs font-semibold text-navy-800 hover:bg-cream-100 transition-colors"
              >
                Alex (Student)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('priya@student.edu', 'password123')}
                className="px-2.5 py-1 rounded-lg bg-white border border-cream-300 text-xs font-semibold text-navy-800 hover:bg-cream-100 transition-colors"
              >
                Priya (Student)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@bookswap.edu', 'password123')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
              >
                Admin (Sarah)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                College / Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-cream-200 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Join your campus community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
