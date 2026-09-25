import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Search,
  PlusCircle,
  Heart,
  Repeat,
  MapPin,
  Inbox,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Layers
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Fetch counts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/requests/incoming?status=pending')
        .then((res) => {
          if (res.data.success) {
            setPendingRequestsCount(res.data.count || 0);
          }
        })
        .catch(() => {});

      api.get('/api/wishlist')
        .then((res) => {
          if (res.data.success) {
            setWishlistCount(res.data.count || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav border-b border-cream-200/80 dark:border-navy-700/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-navy-800 dark:bg-brand-600 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-brand-500 dark:text-white" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-navy-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-amber-400 transition-colors">
                Book<span className="text-brand-600 dark:text-amber-400">Swap</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider uppercase text-gray-500 dark:text-slate-400 -mt-1">
                Campus Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-cream-200 dark:bg-[#1e3a43] text-navy-900 dark:text-amber-300 font-semibold'
                    : 'text-gray-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-[#162e36]'
                }`}
              >
                Dashboard
              </Link>
            )}

            <Link
              to="/browse"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/browse')
                  ? 'bg-cream-200 dark:bg-[#1e3a43] text-navy-900 dark:text-amber-300 font-semibold'
                  : 'text-gray-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-[#162e36]'
              }`}
            >
              Explore Books
            </Link>

            <Link
              to="/nearby"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/nearby')
                  ? 'bg-cream-200 dark:bg-[#1e3a43] text-navy-900 dark:text-amber-300 font-semibold'
                  : 'text-gray-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-[#162e36]'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Near Me</span>
            </Link>

            <Link
              to="/swaps"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/swaps')
                  ? 'bg-cream-200 dark:bg-[#1e3a43] text-navy-900 dark:text-amber-300 font-semibold'
                  : 'text-gray-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-[#162e36]'
              }`}
            >
              <Repeat className="w-4 h-4 text-accent-600 dark:text-amber-400" />
              <span>Smart Swaps</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/my-listings"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-listings')
                      ? 'bg-cream-200 dark:bg-[#1e3a43] text-navy-900 dark:text-amber-300 font-semibold'
                      : 'text-gray-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-[#162e36]'
                  }`}
                >
                  <Layers className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span>My Listings</span>
                </Link>

                <Link
                  to="/requests"
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/requests')
                      ? 'bg-cream-200 dark:bg-[#1e3a43] text-navy-900 dark:text-amber-300 font-semibold'
                      : 'text-gray-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-[#162e36]'
                  }`}
                >
                  <Inbox className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span>Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-500 text-white animate-pulse">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/wishlist"
                  className={`relative p-2 rounded-lg text-gray-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-cream-100 dark:hover:bg-[#162e36] transition-colors ${
                    isActive('/wishlist') ? 'bg-cream-200 dark:bg-[#1e3a43] text-rose-600' : ''
                  }`}
                  title="My Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isActive('/wishlist') ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Right Action Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              to="/create-listing"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-navy-950 text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List a Book</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-brand-500 dark:hover:ring-amber-400 transition-all focus:outline-none"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-cream-300 dark:border-navy-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-navy-700 dark:bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-navy-800 dark:text-slate-100 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#12242a] rounded-2xl shadow-modal border border-cream-200 dark:border-[#21434c] py-2 z-50 animate-slide-in">
                    <div className="px-4 py-2 border-b border-cream-200 dark:border-[#21434c]">
                      <p className="text-xs text-gray-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-navy-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-brand-600 dark:text-amber-400 font-medium truncate">{user?.college}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#1a353e] hover:text-navy-900 dark:hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-medium transition-colors"
                      >
                        <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-cream-200 dark:border-[#21434c] my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-navy-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-amber-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-navy-950 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu and toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/create-listing"
              className="p-2 rounded-lg bg-brand-600 dark:bg-amber-500 text-white dark:text-navy-950"
              title="List a Book"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-slate-200 hover:bg-cream-200 dark:hover:bg-[#1a353e] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 dark:border-[#21434c] bg-white dark:bg-[#102228] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-slide-in">
          <Link
            to="/browse"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
          >
            <Search className="w-4 h-4 text-gray-500 dark:text-slate-400" />
            <span>Browse Books</span>
          </Link>
          <Link
            to="/nearby"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
          >
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Books Near Me</span>
          </Link>
          <Link
            to="/swaps"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
          >
            <Repeat className="w-4 h-4 text-accent-600 dark:text-amber-400" />
            <span>Smart Swaps</span>
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t border-cream-200 dark:border-[#21434c] pt-2 my-2"></div>
              <Link
                to="/my-listings"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
              >
                <Layers className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                <span>My Listings</span>
              </Link>
              <Link
                to="/requests"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                  <span>My Requests</span>
                </div>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-500 text-white">
                    {pendingRequestsCount} new
                  </span>
                )}
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
              >
                <User className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                <span>Profile ({user?.name})</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40"
                >
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-cream-300 dark:border-[#21434c] text-navy-900 dark:text-slate-200 hover:bg-cream-100 dark:hover:bg-[#183139]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-navy-950 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
