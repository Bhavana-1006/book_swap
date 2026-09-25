import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Inbox,
  Heart,
  User,
  LogOut,
  Search,
  PlusCircle,
  GraduationCap,
  Stethoscope,
  Cpu,
  Bookmark,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Filter,
  CheckCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active Category selection from Sidebar: 'All', '10th Class', 'Intermediate', 'Medical', 'Engineering'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [stats, setStats] = useState({
    myListings: 0,
    myRequests: 0,
    wishlist: 0,
    completed: 0
  });

  const categories = [
    { id: 'All', label: 'All Categories', icon: BookOpen, count: null },
    { id: '10th Class', label: '10th Class', icon: GraduationCap, query: 'School' },
    { id: 'Intermediate', label: 'Intermediate', icon: Layers, query: 'Intermediate' },
    { id: 'Medical', label: 'Medical', icon: Stethoscope, query: 'Medical' },
    { id: 'Engineering', label: 'Engineering', icon: Cpu, query: 'Engineering' }
  ];

  // Fetch Dashboard Stats & User-specific info
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [myListingsRes, myRequestsRes, incomingRes, wishlistRes] = await Promise.allSettled([
          api.get('/api/books/my/listings'),
          api.get('/api/requests/my'),
          api.get('/api/requests/incoming'),
          api.get('/api/wishlist')
        ]);

        const myListingsCount = myListingsRes.status === 'fulfilled' && myListingsRes.value.data.success ? myListingsRes.value.data.count : 0;
        const myReqs = myRequestsRes.status === 'fulfilled' && myRequestsRes.value.data.success ? myRequestsRes.value.data.requests : [];
        const inReqs = incomingRes.status === 'fulfilled' && incomingRes.value.data.success ? incomingRes.value.data.requests : [];
        const completedCount = [...myReqs, ...inReqs].filter(r => r.status === 'completed').length;
        const wishlistCount = wishlistRes.status === 'fulfilled' && wishlistRes.value.data.success ? wishlistRes.value.data.count : 0;

        setStats({
          myListings: myListingsCount,
          myRequests: myReqs.length + inReqs.length,
          wishlist: wishlistCount,
          completed: completedCount
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, [user]);

  // Fetch Books filtered by Selected Category & Search Term
  const fetchCategoryBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      if (selectedCategory !== 'All') {
        const catObj = categories.find(c => c.id === selectedCategory);
        if (catObj?.query) {
          params.append('category', catObj.query);
        } else {
          params.append('category', selectedCategory);
        }
      }

      params.append('limit', 16);
      const res = await api.get(`/api/books?${params.toString()}`);
      if (res.data.success) {
        setBooks(res.data.books || []);
      }
    } catch (err) {
      console.error('Error fetching category books:', err);
    } finally {
      setLoadingBooks(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCategoryBooks();
    }, 250);
    return () => clearTimeout(handler);
  }, [selectedCategory, searchTerm, fetchCategoryBooks]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-cream-200 shadow-soft p-5 space-y-6 sticky top-24">
            {/* User Profile Mini Badge */}
            <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-cream-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-base">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-navy-900 truncate">{user?.name}</h3>
                <p className="text-xs text-gray-500 truncate">{user?.college || 'Campus Member'}</p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{user?.city || 'Local Area'}</span>
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Main Menu
              </span>

              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedCategory === 'All' && !searchTerm
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-navy-800 hover:bg-cream-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <Link
                to="/browse"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-navy-800 hover:bg-cream-100 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span>All Books (Marketplace)</span>
              </Link>

              <Link
                to="/create-listing"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-brand-600" />
                <span>Post a Book</span>
              </Link>

              <Link
                to="/my-listings"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-navy-800 hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span>My Listings</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-200 text-navy-800">
                  {stats.myListings}
                </span>
              </Link>

              <Link
                to="/requests"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-navy-800 hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-gray-500" />
                  <span>My Requests</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-200 text-navy-800">
                  {stats.myRequests}
                </span>
              </Link>

              <Link
                to="/wishlist"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-navy-800 hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Wishlist</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {stats.wishlist}
                </span>
              </Link>

              <Link
                to="/profile"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-navy-800 hover:bg-cream-100 transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>My Profile</span>
              </Link>
            </div>

            {/* Vertical Book Categories in Sidebar */}
            <div className="space-y-1 pt-3 border-t border-cream-200">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Book Categories
              </span>

              {categories.filter(c => c.id !== 'All').map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-navy-800 hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-brand-600'}`} />
                      <span>{cat.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="pt-3 border-t border-cream-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ================= MAIN DASHBOARD CONTENT ================= */}
        <main className="lg:col-span-9 space-y-8">
          {/* 1. WELCOME BANNER & SEARCH */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Student Exchange Hub</span>
                </div>
                <h1 className="font-serif text-3xl font-extrabold text-navy-900 tracking-tight">
                  Welcome back, {user?.name || 'Student'}!
                </h1>
                <p className="text-xs text-gray-500">
                  Manage your textbooks, discover books for your semester, and connect with peers.
                </p>
              </div>

              <Link
                to="/create-listing"
                className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Book</span>
              </Link>
            </div>

            {/* Search Books Field */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search books by title, author, subject, or ISBN..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-cream-300 bg-cream-50/70 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-navy-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 2. CATEGORY CARDS SECTION: 10TH, INTERMEDIATE, MEDICAL, ENGINEERING */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                Select Academic Category
              </span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  View All Categories
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* 10th Class */}
              <div
                onClick={() => setSelectedCategory('10th Class')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  selectedCategory === '10th Class'
                    ? 'border-brand-600 bg-brand-50 shadow-sm ring-2 ring-brand-500'
                    : 'border-cream-300 hover:border-brand-400 bg-white shadow-soft'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-2">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-navy-900">10th Class</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">NCERT, CBSE & State</p>
              </div>

              {/* Intermediate */}
              <div
                onClick={() => setSelectedCategory('Intermediate')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  selectedCategory === 'Intermediate'
                    ? 'border-brand-600 bg-brand-50 shadow-sm ring-2 ring-brand-500'
                    : 'border-cream-300 hover:border-brand-400 bg-white shadow-soft'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-navy-900">Intermediate</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">MPC, BiPC, CEC, MEC</p>
              </div>

              {/* Medical */}
              <div
                onClick={() => setSelectedCategory('Medical')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  selectedCategory === 'Medical'
                    ? 'border-brand-600 bg-brand-50 shadow-sm ring-2 ring-brand-500'
                    : 'border-cream-300 hover:border-brand-400 bg-white shadow-soft'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-2">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-navy-900">Medical</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">MBBS, BDS, Nursing</p>
              </div>

              {/* Engineering */}
              <div
                onClick={() => setSelectedCategory('Engineering')}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  selectedCategory === 'Engineering'
                    ? 'border-brand-600 bg-brand-50 shadow-sm ring-2 ring-brand-500'
                    : 'border-cream-300 hover:border-brand-400 bg-white shadow-soft'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-navy-900">Engineering</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">CSE, ECE, Mech, Civil</p>
              </div>
            </div>
          </div>

          {/* 3. BOOK COLLECTION / CARDS GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <h3 className="font-serif text-xl font-bold text-navy-900">
                {selectedCategory === 'All' ? 'All Textbook Listings' : `${selectedCategory} Textbooks`}
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {books.length} {books.length === 1 ? 'book available' : 'books available'}
              </span>
            </div>

            {loadingBooks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <BookSkeleton key={i} />
                ))}
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-navy-900">
                  No books found in {selectedCategory}
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Be the first student to post a textbook in this category or check all categories!
                </p>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors inline-block"
                >
                  View All Categories
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
