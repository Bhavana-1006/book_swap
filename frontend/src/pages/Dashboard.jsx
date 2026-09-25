import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  PlusCircle,
  Inbox,
  Heart,
  Repeat,
  MapPin,
  TrendingUp,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';
import { CATEGORIES_DATA } from '../utils/categories';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    myListings: 0,
    myRequests: 0,
    wishlist: 0,
    completed: 0
  });

  // Dynamic book collections
  const [recentBooks, setRecentBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [nearbyBooks, setNearbyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch user's listings
        const myListingsRes = await api.get('/api/books/my/listings');
        const myListingsCount = myListingsRes.data.success ? myListingsRes.data.count : 0;

        // 2. Fetch user's requests (both outgoing and incoming completed)
        const myRequestsRes = await api.get('/api/requests/my');
        const incomingRequestsRes = await api.get('/api/requests/incoming');
        
        const myReqs = myRequestsRes.data.success ? myRequestsRes.data.requests : [];
        const inReqs = incomingRequestsRes.data.success ? incomingRequestsRes.data.requests : [];
        const completedCount = [...myReqs, ...inReqs].filter(r => r.status === 'completed').length;

        // 3. Fetch wishlist
        const wishlistRes = await api.get('/api/wishlist');
        const wishlistCount = wishlistRes.data.success ? wishlistRes.data.count : 0;

        setStats({
          myListings: myListingsCount,
          myRequests: myReqs.length + inReqs.length,
          wishlist: wishlistCount,
          completed: completedCount
        });

        // 4. Fetch books collections
        const recentRes = await api.get('/api/books?sort=newest&limit=4');
        if (recentRes.data.success) {
          setRecentBooks(recentRes.data.books || []);
        }

        const popularRes = await api.get('/api/books?limit=4');
        if (popularRes.data.success) {
          setRecommendedBooks(popularRes.data.books || []);
        }

        const nearbyRes = await api.get(`/api/books/nearby?city=${encodeURIComponent(user?.city || '')}`);
        if (nearbyRes.data.success) {
          setNearbyBooks((nearbyRes.data.books || []).slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER & WELCOME */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>{user?.college || 'Campus Member'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {user?.city || 'Local Area'}
            </span>
          </p>
        </div>

        {/* Search Bar in Dashboard */}
        <div className="max-w-md w-full">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books, authors, subjects..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 2. STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* My Listings */}
        <Link
          to="/my-listings"
          className="p-5 bg-white rounded-2xl border border-cream-200 shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">My Listings</p>
            <h3 className="text-2xl font-extrabold text-navy-900">{stats.myListings}</h3>
          </div>
        </Link>

        {/* Requests */}
        <Link
          to="/requests"
          className="p-5 bg-white rounded-2xl border border-cream-200 shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">My Requests</p>
            <h3 className="text-2xl font-extrabold text-navy-900">{stats.myRequests}</h3>
          </div>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="p-5 bg-white rounded-2xl border border-cream-200 shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Wishlist</p>
            <h3 className="text-2xl font-extrabold text-navy-900">{stats.wishlist}</h3>
          </div>
        </Link>

        {/* Completed Exchanges */}
        <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Completed</p>
            <h3 className="text-2xl font-extrabold text-navy-900">{stats.completed}</h3>
          </div>
        </div>
      </div>

      {/* 3. QUICK SHORTCUT BUTTONS */}
      <div className="p-5 bg-cream-100/80 rounded-2xl border border-cream-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
          Quick Actions:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/create-listing"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Book</span>
          </Link>
          <Link
            to="/swaps"
            className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Repeat className="w-4 h-4" />
            <span>Smart Swaps</span>
          </Link>
          <Link
            to="/browse"
            className="px-4 py-2 rounded-xl bg-white hover:bg-cream-100 text-navy-900 border border-cream-300 text-xs font-bold flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Browse Marketplace</span>
          </Link>
          <Link
            to="/nearby"
            className="px-4 py-2 rounded-xl bg-white hover:bg-cream-100 text-navy-900 border border-cream-300 text-xs font-bold flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Books Near Me</span>
          </Link>
        </div>
      </div>

      {/* 4. MAIN DASHBOARD CONTENT: RECOMMENDED + RECENT */}
      <div className="space-y-10">
        {/* Recommended Books */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-600" />
                <span>Recommended for You</span>
              </h2>
              <p className="text-xs text-gray-500">Popular textbooks across engineering, medical, school & competitive exams</p>
            </div>
            <Link
              to="/browse"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              Array(4).fill(0).map((_, i) => <BookSkeleton key={i} />)
            ) : recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => <BookCard key={book._id} book={book} />)
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-gray-500">
                No recommended books at the moment.
              </div>
            )}
          </div>
        </div>

        {/* Recently Added on Campus */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                <span>Recently Added on Campus</span>
              </h2>
              <p className="text-xs text-gray-500">Fresh listings from fellow students</p>
            </div>
            <Link
              to="/browse?sort=newest"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Browse Newest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              Array(4).fill(0).map((_, i) => <BookSkeleton key={i} />)
            ) : recentBooks.length > 0 ? (
              recentBooks.map((book) => <BookCard key={book._id} book={book} />)
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-gray-500">
                No new books added recently.
              </div>
            )}
          </div>
        </div>

        {/* Books Near You */}
        {nearbyBooks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Books Available Near You ({user?.city || 'Campus Area'})</span>
                </h2>
                <p className="text-xs text-gray-500">Listings within easy campus pickup distance</p>
              </div>
              <Link
                to="/nearby"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View Nearby Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {nearbyBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
