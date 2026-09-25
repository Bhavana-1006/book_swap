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
import { FlowingHeroBooks } from '../components/FlowingHeroBooks';
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
    const cityParam = user?.city ? `?city=${encodeURIComponent(user.city)}` : '';

    Promise.all([
      api.get('/api/books?sort=newest&limit=6').catch(() => ({ data: { success: false } })),
      api.get('/api/books?limit=6').catch(() => ({ data: { success: false } })),
      api.get(`/api/books/nearby${cityParam}`).catch(() => ({ data: { success: false } }))
    ])
      .then(([recentRes, popularRes, nearbyRes]) => {
        if (recentRes.data?.success) setRecentBooks(recentRes.data.books || []);
        if (popularRes.data?.success) setPopularBooks(popularRes.data.books || []);
        if (nearbyRes.data?.success) setNearbyBooks((nearbyRes.data.books || []).slice(0, 4));
      })
      .finally(() => {
        setLoadingRecent(false);
        setLoadingPopular(false);
        setLoadingNearby(false);
      });
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
    <div className="space-y-16 pb-16 overflow-x-hidden">
      {/* 1. HERO SECTION WITH FLOWING 3D EDUCATIONAL BOOKS STREAM */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-cream-50 to-[#F5EFE1] border-b border-cream-200/80">
        {/* Flowing animated educational books from shelves background */}
        <FlowingHeroBooks />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Main Heading & Tagline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-[#12343B] tracking-tight leading-[1.12]">
              Give Books a <span className="text-[#0F4C5C]">Second Life</span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-[#243B42] font-medium leading-relaxed max-w-2xl mx-auto">
              Buy, Sell, Donate or Swap books and make learning more accessible for everyone.
            </p>

            {/* 4 Floating Educational Category Cards (Inspired by Mockup) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-4 max-w-4xl mx-auto">
              <Link
                to="/browse?category=10th%20Class"
                className="group p-4 rounded-2xl bg-white/95 hover:bg-white border border-cream-200/90 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all flex flex-col items-center text-center backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F4C5C]/10 text-[#0F4C5C] group-hover:bg-[#0F4C5C] group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#12343B] group-hover:text-[#0F4C5C] transition-colors">
                  10th Class
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">Mathematics • Science • SST • English</p>
                <ArrowRight className="w-4 h-4 text-[#0F4C5C] mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/browse?category=Intermediate"
                className="group p-4 rounded-2xl bg-white/95 hover:bg-white border border-cream-200/90 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all flex flex-col items-center text-center backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#12343B] group-hover:text-amber-700 transition-colors">
                  Intermediate
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">MPC • BiPC • Maths • Physics • Chem</p>
                <ArrowRight className="w-4 h-4 text-amber-600 mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/browse?category=Medical"
                className="group p-4 rounded-2xl bg-white/95 hover:bg-white border border-cream-200/90 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all flex flex-col items-center text-center backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#12343B] group-hover:text-emerald-700 transition-colors">
                  Medical
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">Anatomy • Physiology • Medical Science</p>
                <ArrowRight className="w-4 h-4 text-emerald-600 mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/browse?category=Engineering"
                className="group p-4 rounded-2xl bg-white/95 hover:bg-white border border-cream-200/90 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all flex flex-col items-center text-center backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-700 group-hover:bg-blue-700 group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#12343B] group-hover:text-blue-700 transition-colors">
                  Engineering
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">CS • AI/ML • Data Structures • DBMS</p>
                <ArrowRight className="w-4 h-4 text-blue-600 mt-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="pt-3 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white p-2 rounded-2xl shadow-hover border border-cream-300 focus-within:ring-2 focus-within:ring-[#0F4C5C]"
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
                  className="px-6 py-2.5 rounded-xl bg-[#12343B] hover:bg-[#0F4C5C] text-white text-xs sm:text-sm font-bold transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Trust Feature Highlights Ribbon */}
        <div className="mt-14 pt-8 border-t border-cream-300/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                <Repeat className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#12343B]">Sustainable Learning</h4>
                <p className="text-[11px] text-gray-500">Reduce waste, give books a new home</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-200">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#12343B]">Build a Community</h4>
                <p className="text-[11px] text-gray-500">Connect with students and learners</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 border border-teal-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#12343B]">Safe & Trusted</h4>
                <p className="text-[11px] text-gray-500">Verified users and secure transactions</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#12343B]">Affordable Education</h4>
                <p className="text-[11px] text-gray-500">Quality books at better prices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Accent Ribbon */}
        <div className="mt-8 pt-4 flex items-center justify-center gap-2 text-center text-xs font-semibold text-[#0F4C5C]/80">
          <BookOpen className="w-4 h-4 text-[#D6A756]" />
          <span>Better Books • Brighter Futures</span>
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
