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
  GraduationCap
} from 'lucide-react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/books?limit=6')
      .then((res) => {
        if (res.data.success) {
          setFeaturedBooks(res.data.books || []);
        }
      })
      .catch((err) => console.error('Error fetching featured books:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const popularSubjects = [
    'Computer Science',
    'Mathematics',
    'Mechanical Engineering',
    'Electronics',
    'Physics',
    'Business & Economics'
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-cream-100/70 via-cream-50 to-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>The Dedicated Campus Textbook Marketplace</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
              Give Books a <span className="text-brand-600 underline decoration-brand-200 decoration-wavy decoration-2">Second Life</span>.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-normal">
              Why pay hundreds of dollars for textbook bookstore markups? Sell, donate, or swap second-hand textbooks directly with fellow college students on your campus.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/browse"
                className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Browse Books</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/create-listing"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-navy-900 border border-cream-300 font-bold text-sm shadow-soft transition-all"
              >
                List a Book Free
              </Link>
            </div>

            {/* Search Bar */}
            <div className="pt-6 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="relative flex items-center bg-white p-2 rounded-2xl shadow-hover border border-cream-200"
              >
                <Search className="w-5 h-5 text-gray-400 ml-3 mr-2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, author, subject, or ISBN..."
                  className="w-full py-2 bg-transparent text-sm sm:text-base text-navy-900 focus:outline-none placeholder-gray-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Popular Search Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-gray-500">
                <span className="font-semibold text-gray-600">Quick explore:</span>
                {popularSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => navigate(`/browse?subject=${encodeURIComponent(subject)}`)}
                    className="px-2.5 py-0.5 rounded-lg bg-cream-200/80 hover:bg-cream-300 text-navy-800 transition-colors"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE LISTING TYPE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
            Three Ways to Share Academic Knowledge
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Tailored specifically for student budgets and semester course rotations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SELL */}
          <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft hover:shadow-hover transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-navy-900 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Sell for Cash</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Recoup your semester textbook expenses by selling directly to juniors at fair campus prices. No middleman cuts or vendor fees.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-cream-200">
              <Link
                to="/browse?type=SELL"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Browse Affordable Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* DONATE */}
          <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft hover:shadow-hover transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Donate to Peers</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Finished a core requirement? Pass forward your textbooks to students in need. Build campus camaraderie and support academic equality.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-cream-200">
              <Link
                to="/browse?type=DONATE"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Find Free Donated Textbooks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* SWAP */}
          <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft hover:shadow-hover transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Smart Swap</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Exchange your previous semester books for the ones you need now. Our smart matching algorithm pairs reciprocal book desires automatically!
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-cream-200">
              <Link
                to="/swaps"
                className="text-xs font-bold text-accent-700 hover:text-accent-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Explore Smart Match Swaps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS (Dynamically loaded from MongoDB Atlas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Campus Listings</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              Recently Listed Textbooks
            </h2>
          </div>
          <Link
            to="/browse"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Textbooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <BookSkeleton key={i} />)
          ) : featuredBooks.length > 0 ? (
            featuredBooks.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-cream-200 p-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base font-bold text-navy-900">No books listed yet</p>
              <p className="text-xs text-gray-500 mt-1">Be the first student to list a textbook on your campus!</p>
              <Link
                to="/create-listing"
                className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                List a Book Now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-cream-100/70 border-y border-cream-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900">
              How BookSwap Works
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Three simple steps to exchange textbooks with your campus peers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-900">List Your Book</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Scan or enter the ISBN. Google Books automatically fills in title, author, and edition details in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-accent-100 text-accent-700 font-extrabold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-900">Connect with Readers</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Receive requests for purchases, free donations, or smart 2-way swaps from fellow students attending your college.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-900">Handover on Campus</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Meet safely at the campus library or student center to complete the exchange. Leave reviews to build campus trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLEGE COMMUNITY TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-modal relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-brand-400 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Campus Verified</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Ready to recycle your textbooks and help peers?
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Join thousands of college students exchanging course books, notes, and academic material each semester.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all text-center"
            >
              Join Your Campus
            </Link>
            <Link
              to="/nearby"
              className="px-6 py-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-cream-100 border border-navy-700 font-bold text-sm transition-all text-center flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Check Nearby</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
