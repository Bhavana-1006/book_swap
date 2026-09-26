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
  EyeOff,
  Sparkles,
  Repeat,
  CheckCircle2,
  Users
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
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT SIDE: Project Animation & Benefits Showcase */}
        <div className="lg:col-span-5 space-y-6 lg:pr-4">
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
              <span>Student Registration Network</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 dark:text-[#F7F2E8] leading-tight">
              Join Your Campus <span className="text-brand-600 dark:text-[#D8B66C]">Book Community</span>.
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-[#BBCBD0] font-medium leading-relaxed">
              Find required textbooks from seniors, swap completed coursework, and give your old books a new home across your university.
            </p>
          </div>

          {/* Animated Interactive Showcase Cards */}
          <div className="space-y-3.5 pt-2">
            {/* Card 1: Verified Campus Network */}
            <div className="animate-float-slow p-4 rounded-2xl bg-white dark:bg-[#203640] border border-cream-200 dark:border-[#36505A] shadow-soft flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-[#172A33] text-brand-600 dark:text-[#D8B66C] flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-navy-900 dark:text-[#F7F2E8]">
                  Verified Student Marketplace
                </p>
                <p className="text-[11px] text-gray-500 dark:text-[#8C9FA6] truncate mt-0.5">
                  Exclusive college domain verification & safe meetup locations
                </p>
              </div>
            </div>

            {/* Card 2: 3-Step Simple Flow */}
            <div className="animate-float-reverse p-4 rounded-2xl bg-white dark:bg-[#203640] border border-cream-200 dark:border-[#36505A] shadow-soft space-y-2">
              <p className="text-xs font-bold text-navy-900 dark:text-[#F7F2E8]">
                How it works in 3 easy steps:
              </p>
              <div className="space-y-1.5 text-[11px] text-gray-600 dark:text-[#BBCBD0]">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-brand-100 dark:bg-[#172A33] text-brand-700 dark:text-[#D8B66C] font-bold text-[10px] flex items-center justify-center">1</span>
                  <span>Create your verified student profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-accent-100 dark:bg-[#172A33] text-accent-700 dark:text-[#D8B66C] font-bold text-[10px] flex items-center justify-center">2</span>
                  <span>Search by subject or list with instant ISBN lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-[#172A33] text-emerald-800 dark:text-[#78C49C] font-bold text-[10px] flex items-center justify-center">3</span>
                  <span>Handover directly on campus & save money</span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-[#172A33] border border-cream-200 dark:border-[#36505A] text-xs font-semibold text-navy-800 dark:text-[#BBCBD0]">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-[#D8B66C]" />
              100% Free to Join
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-[#172A33] border border-cream-200 dark:border-[#36505A] text-xs font-semibold text-navy-800 dark:text-[#BBCBD0]">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-[#D8B66C]" />
              Zero Listing Fees
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Registration Form */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#203640] py-8 px-6 sm:px-10 rounded-3xl border border-cream-200 dark:border-[#36505A] shadow-soft space-y-6 animate-slide-in">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 dark:text-[#F7F2E8]">
                Create Student Account
              </h2>
              <p className="text-xs text-gray-500 dark:text-[#BBCBD0]">
                Join your college network to exchange, buy, or donate textbooks
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar upload */}
              <div className="flex items-center gap-4 py-2 border-b border-cream-200 dark:border-[#36505A]">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-14 h-14 rounded-2xl object-cover border border-cream-300 dark:border-[#36505A]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-cream-100 dark:bg-[#172A33] flex items-center justify-center text-gray-400 dark:text-[#8C9FA6]">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <label className="cursor-pointer text-xs font-bold text-brand-600 dark:text-[#D8B66C] hover:text-brand-700 dark:hover:text-[#c4a259]">
                    <span>Upload profile photo</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                  <p className="text-[11px] text-gray-400 dark:text-[#8C9FA6] mt-0.5">Optional, JPG or PNG</p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@student.edu"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                  />
                </div>
              </div>

              {/* College & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                    College / University <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. State University"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Boston"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                    />
                  </div>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8C9FA6] hover:text-navy-900 dark:hover:text-[#D8B66C] p-1 focus:outline-none transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 dark:text-[#8C9FA6] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8C9FA6] hover:text-navy-900 dark:hover:text-[#D8B66C] p-1 focus:outline-none transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator password={password} confirmPassword={confirmPassword} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-[#D8B66C] dark:hover:bg-[#c4a259] text-white dark:text-[#101D24] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white dark:border-[#101D24] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-cream-200 dark:border-[#36505A] pt-4 text-center">
              <p className="text-xs text-gray-600 dark:text-[#BBCBD0]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-brand-600 dark:text-[#D8B66C] hover:text-brand-700 dark:hover:text-[#c4a259]"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
