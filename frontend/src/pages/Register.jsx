import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Lock,
  Mail,
  User,
  GraduationCap,
  MapPin,
  Upload,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PasswordStrengthIndicator, { checkPasswordCriteria } from '../components/PasswordStrengthIndicator';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('college', college.trim());
      formData.append('city', city.trim());
      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }

      await register(formData);
      success('Welcome to BookSwap! Your account was registered successfully.');
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          Create Student Account
        </h2>
        <p className="text-xs text-gray-500 dark:text-slate-300">
          Join your college network to exchange, buy, or donate textbooks
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-[#132B32] py-8 px-6 sm:px-10 rounded-3xl border border-cream-200 dark:border-[#26525E] shadow-soft space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex items-center gap-4 py-2 border-b border-cream-200 dark:border-[#26525E]">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-14 h-14 rounded-2xl object-cover border border-cream-300 dark:border-[#2E5C6A]"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-cream-100 dark:bg-[#0E2328] flex items-center justify-center text-gray-400 dark:text-slate-400">
                  <User className="w-7 h-7" />
                </div>
              )}
              <div>
                <label className="cursor-pointer text-xs font-bold text-brand-600 dark:text-amber-400 hover:text-brand-700 dark:hover:text-amber-300">
                  <span>Upload profile photo</span>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
                <p className="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5">Optional, JPG or PNG</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@student.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                />
              </div>
            </div>

            {/* College & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-1">
                  College / University <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. State University"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Boston"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-navy-900 dark:hover:text-amber-300 p-1 focus:outline-none transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-300 dark:border-[#26525E] bg-white dark:bg-[#0E2328] text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-amber-400 placeholder-gray-400 dark:placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-navy-900 dark:hover:text-amber-300 p-1 focus:outline-none transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Password Strength Criteria */}
            <PasswordStrengthIndicator password={password} confirmPassword={confirmPassword} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-navy-950 font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="pt-4 border-t border-cream-200 dark:border-[#26525E] text-center text-xs text-gray-500 dark:text-slate-300">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-600 dark:text-amber-400 hover:text-brand-700 dark:hover:text-amber-300">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

