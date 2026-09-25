import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PasswordStrengthIndicator, { checkPasswordCriteria } from '../components/PasswordStrengthIndicator';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const { success, error } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, criteria, isMatch } = checkPasswordCriteria(password, confirmPassword);

    if (!criteria.length) {
      error('Password must be at least 8 characters long');
      return;
    }
    if (!criteria.uppercase) {
      error('Password must contain at least one uppercase letter (A-Z)');
      return;
    }
    if (!criteria.lowercase) {
      error('Password must contain at least one lowercase letter (a-z)');
      return;
    }
    if (!criteria.number) {
      error('Password must contain at least one number (0-9)');
      return;
    }
    if (!criteria.special) {
      error('Password must contain at least one special character (!@#$%^&*)');
      return;
    }
    if (!isMatch) {
      error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });

      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('bookswap_token', res.data.token);
          if (setToken) setToken(res.data.token);
          if (setUser) setUser(res.data.user);
        }
        success('Password updated successfully! Welcome back.');
        navigate('/');
      }
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Password reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
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
          Create New Password
        </h2>
        <p className="text-xs text-gray-500">
          Choose a strong, secure password for your student account
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-cream-200 shadow-soft space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Real-time criteria checklist */}
            <PasswordStrengthIndicator password={password} confirmPassword={confirmPassword} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                'Updating Password...'
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-cream-200 text-center text-xs text-gray-500">
            Remember your credentials?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
