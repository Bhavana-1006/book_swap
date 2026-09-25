import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Repeat,
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  TrendingUp,
  GraduationCap,
  Clock,
  Compass,
  CheckCircle,
  Layers,
  Cpu,
  Stethoscope,
  Trophy,
  Award,
  Users,
  Zap
} from 'lucide-react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';
import { CATEGORIES_DATA } from '../utils/categories';
import { useAuth } from '../context/AuthContext';
import { BookshelfScene } from '../shaders/bookshelf/BookshelfScene';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentBooks, setRecentBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [nearbyBooks, setNearbyBooks] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // 1. Fetch Recently Added Books
    api.get('/api/books?sort=newest&limit=6')
      .then((res) => {
        if (res.data.success) {
          setRecentBooks(res.data.books || []);
        }
      })
      .catch((err) => console.error('Error fetching recent books:', err))
      .finally(() => setLoadingRecent(false));

    // 2. Fetch Popular / Varied Books
    api.get('/api/books?limit=6')
      .then((res) => {
        if (res.data.success) {
          setPopularBooks(res.data.books || []);
        }
      })
      .catch((err) => console.error('Error fetching popular books:', err))
      .finally(() => setLoadingPopular(false));

    // 3. Fetch Nearby Books
    const cityParam = user?.city ? `?city=${encodeURIComponent(user.city)}` : '';
    api.get(`/api/books/nearby${cityParam}`)
      .then((res) => {
        if (res.data.success) {
          setNearbyBooks((res.data.books || []).slice(0, 4));
        }
      })
      .catch((err) => console.error('Error fetching nearby books:', err))
      .finally(() => setLoadingNearby(false));
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5" />;
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION WITH SUBTLE 3D EDUCATIONAL BOOKSHELF ANIMATION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-cream-100/80 via-cream-50 to-white border-b border-cream-200">
        {/* BookshelfScene 3D background inside Hero section only - crisp visibility behind text */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-85 md:opacity-90" aria-hidden="true">
          <BookshelfScene className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-100/30 via-transparent to-white/70 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Campus Book Exchange & Second-Hand Marketplace</span>
            </div>

            {/* Main Heading & Tagline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
              Give Books a <span className="text-brand-600">Second Life</span>.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-normal">
              Buy, sell, donate, or swap college textbooks directly with fellow students. Save up to 80% on semester coursework and keep academic resources in circulation.
            </p>

            {/* Action Buttons - Distinct from Navbar (no duplicate Login/Register buttons) */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/browse"
                    className="px-7 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-navy-900 border border-cream-300 font-bold text-sm shadow-soft transition-all"
                  >
                    Explore Books
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/browse"
                    className="px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Explore Books</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/nearby"
                    className="px-7 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-navy-900 border border-cream-300 font-bold text-sm shadow-soft transition-all flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Books Near Me</span>
                  </Link>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="pt-6 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white p-2 rounded-2xl shadow-hover border border-cream-300 focus-within:ring-2 focus-within:ring-brand-500"
              >
                <Search className="w-5 h-5 text-gray-400 ml-3 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search books, authors, ISBN, course names..."
                  className="w-full py-2 bg-transparent text-sm sm:text-base text-navy-900 focus:outline-none placeholder-gray-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SHORTCUTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-900">Explore by Category</h2>
            <p className="text-xs text-gray-500 mt-0.5">Find books tailored to your academic curriculum</p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/browse?category=${encodeURIComponent(cat.id)}`)}
              className="group p-4 bg-white rounded-2xl border border-cream-200 shadow-soft hover:shadow-hover hover:border-brand-500 transition-all text-left flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-cream-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{cat.tagline}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. POPULAR & RECOMMENDED BOOKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Trending on Campus</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              Popular Textbooks
            </h2>
          </div>
          <Link
            to="/browse"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingPopular ? (
            Array(6).fill(0).map((_, i) => <BookSkeleton key={i} />)
          ) : popularBooks.length > 0 ? (
            popularBooks.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-cream-200 p-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base font-bold text-navy-900">No popular books found</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. THREE LISTING TYPE PILLARS: SELL / DONATE / SWAP */}
      <section className="bg-cream-100/70 border-y border-cream-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              Sell, Donate, or Swap
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Flexible options designed for students looking to save money and share knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SELL */}
            <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-navy-900 text-emerald-400 flex items-center justify-center mb-5">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Sell for Fair Cash</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Sell directly to other students without middleman markups or bookstore commission cuts. Earn back what you spent.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-cream-200">
                <Link
                  to="/browse?type=SELL"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Browse Books for Sale</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* DONATE */}
            <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center mb-5">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Donate for Free</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Help juniors who cannot afford expensive engineering or medical textbooks. Give your books a meaningful second purpose.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-cream-200">
                <Link
                  to="/browse?type=DONATE"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Find Donated Books</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* SWAP */}
            <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent-600 text-white flex items-center justify-center mb-5">
                  <Repeat className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Two-Way Book Swap</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Exchange books you completed for the ones you need this semester. Our Smart Swap system matches reciprocal book desires automatically.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-cream-200">
                <Link
                  to="/swaps"
                  className="text-xs font-bold text-accent-700 hover:text-accent-800 flex items-center gap-1"
                >
                  <span>Explore Smart Swaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RECENTLY ADDED BOOKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
              <Clock className="w-4 h-4" />
              <span>Fresh Listings</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              Recently Added Books
            </h2>
          </div>
          <Link
            to="/browse?sort=newest"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
          >
            <span>Browse Newest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingRecent ? (
            Array(6).fill(0).map((_, i) => <BookSkeleton key={i} />)
          ) : recentBooks.length > 0 ? (
            recentBooks.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-cream-200 p-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base font-bold text-navy-900">No books found</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. BOOKS AVAILABLE NEAR YOU */}
      {nearbyBooks.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                <MapPin className="w-4 h-4" />
                <span>Geospatial Discovery</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
                Books Available Near You
              </h2>
            </div>
            <Link
              to="/nearby"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <span>Explore Near Me Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* 7. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
            How BookSwap Works
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            A simple, safe, student-first workflow to exchange textbooks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-serif text-lg font-bold text-navy-900">List with ISBN</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter the ISBN and our system pulls the official book title, author, and cover image automatically.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-100 text-accent-700 font-extrabold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-serif text-lg font-bold text-navy-900">Connect with Students</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Receive direct requests for purchase, donation, or swap offers from verified campus peers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-serif text-lg font-bold text-navy-900">Exchange on Campus</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Meet safely at the campus library or student center to complete the exchange and leave reviews.
            </p>
          </div>
        </div>
      </section>

      {/* 8. WHY BOOKSWAP */}
      <section className="bg-white border-y border-cream-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              Why Students Choose BookSwap
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Built specifically for college communities, not generic e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-2.5">
              <ShieldCheck className="w-8 h-8 text-brand-600" />
              <h4 className="font-bold text-sm text-navy-900">Campus Verified</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect exclusively with verified students from your college and neighboring universities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-2.5">
              <DollarSign className="w-8 h-8 text-emerald-600" />
              <h4 className="font-bold text-sm text-navy-900">Zero Middleman Fees</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Keep 100% of your book earnings. No listing fees, marketplace commissions, or shipping costs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-2.5">
              <Repeat className="w-8 h-8 text-accent-600" />
              <h4 className="font-bold text-sm text-navy-900">Smart Swap Algorithm</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our reciprocal matching engine pairs what you have with what other students want automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-2.5">
              <Zap className="w-8 h-8 text-amber-500" />
              <h4 className="font-bold text-sm text-navy-900">Instant ISBN Auto-Fill</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                List books in under 30 seconds with automatic metadata fetching from Google Books and Open Library.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-modal relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-400 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Join Your Campus Community</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Ready to recycle your textbooks and save money?
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Join thousands of college students exchanging course books, notes, and academic material every semester.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to={isAuthenticated ? "/create-listing" : "/register"}
              className="px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              {isAuthenticated ? "Post a Book Now" : "Register Free"}
            </Link>
            <Link
              to="/browse"
              className="px-7 py-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-cream-100 border border-navy-700 font-bold text-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-brand-400" />
              <span>Explore All Books</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
