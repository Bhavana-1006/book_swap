import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Sparkles,
  MapPin,
  DollarSign,
  Layers
} from 'lucide-react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import BookSkeleton from '../components/BookSkeleton';
import { CATEGORIES_DATA, ALL_CATEGORIES } from '../utils/categories';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter States initialized from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'All');
  const [semester, setSemester] = useState(searchParams.get('semester') || 'All');
  const [listingType, setListingType] = useState(searchParams.get('type') || searchParams.get('listingType') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Result state
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const conditionsList = ['All', 'New', 'Like New', 'Good', 'Acceptable'];
  const typesList = ['All', 'SELL', 'DONATE', 'SWAP'];

  // Dynamic subjects based on selected category
  const getSubcategories = () => {
    if (category === 'All') {
      return ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Anatomy', 'Physiology', 'Economics & Business', 'Fiction & Literature'];
    }
    const catObj = CATEGORIES_DATA.find(c => c.id.toLowerCase() === category.toLowerCase());
    return catObj ? ['All', ...catObj.subcategories] : ['All'];
  };

  const currentSubcategories = getSubcategories();

  // Fetch Books from backend with active query parameters
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (category !== 'All') params.append('category', category);
      if (subject !== 'All') params.append('subject', subject);
      if (semester !== 'All') params.append('semester', semester);
      if (listingType !== 'All') params.append('listingType', listingType);
      if (condition !== 'All') params.append('condition', condition);
      if (city.trim()) params.append('city', city.trim());
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 12);

      // Update URL query parameters for shareable links
      setSearchParams(params, { replace: true });

      const res = await api.get(`/api/books?${params.toString()}`);

      if (res.data.success) {
        setBooks(res.data.books || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load books:', err);
      setErrorMsg('Unable to retrieve book listings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, subject, semester, listingType, condition, city, minPrice, maxPrice, sort, page, setSearchParams]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBooks();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, category, subject, semester, listingType, condition, city, minPrice, maxPrice, sort, page, fetchBooks]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setSubject('All');
    setSemester('All');
    setListingType('All');
    setCondition('All');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">
            Explore Campus Textbooks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Found {totalCount} {totalCount === 1 ? 'book' : 'books'} listed across academic categories
          </p>
        </div>

        {/* Search Input & Mobile Filter Toggle */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, author, subject, ISBN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden p-2.5 rounded-xl border border-cream-300 bg-white text-navy-900 hover:bg-cream-100 flex items-center justify-center"
            title="Filter listings"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 2. CATEGORY PILL STRIP */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setSubject('All');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              category.toLowerCase() === cat.toLowerCase()
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-cream-300 hover:bg-cream-100'
            }`}
          >
            {cat === 'All' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* 3. MAIN LAYOUT: FILTERS SIDEBAR + BOOKS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden md:block col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <span className="font-serif text-base font-bold text-navy-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>Filters</span>
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Listing Type Filter */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Listing Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {typesList.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setListingType(t);
                      setPage(1);
                    }}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      listingType.toUpperCase() === t
                        ? 'bg-navy-900 text-white'
                        : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
                    }`}
                  >
                    {t === 'All' ? 'All Types' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Academic Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubject('All');
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                {ALL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory / Stream Filter */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Stream / Subject
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {currentSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {conditionsList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                City / Campus Area
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                placeholder="e.g. Hyderabad, Chennai"
                className="w-full px-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Price Range Filter (Only for Sell listings) */}
            {listingType !== 'DONATE' && (
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                  Price Range ($ USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-1/2 px-2.5 py-1.5 rounded-lg border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-1/2 px-2.5 py-1.5 rounded-lg border border-cream-300 bg-cream-50 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* BOOK LISTINGS CONTENT */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Sort Control Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-cream-200 shadow-soft flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Showing page {page} of {totalPages} ({totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1 rounded-lg border border-cream-300 bg-cream-50 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest Listed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(9)
                .fill(0)
                .map((_, i) => <BookSkeleton key={i} />)
            ) : books.length > 0 ? (
              books.map((book) => <BookCard key={book._id} book={book} />)
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-navy-900">
                  No matching textbooks found
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your search terms or clearing specific category/price filters to see more results.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors inline-block"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-xl border border-cream-300 bg-white text-navy-900 disabled:opacity-40 disabled:pointer-events-none hover:bg-cream-100 transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === num
                        ? 'bg-navy-900 text-white shadow-sm'
                        : 'bg-white text-navy-800 border border-cream-200 hover:bg-cream-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-xl border border-cream-300 bg-white text-navy-900 disabled:opacity-40 disabled:pointer-events-none hover:bg-cream-100 transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex justify-end md:hidden">
          <div className="bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto space-y-6 animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <span className="font-serif text-lg font-bold text-navy-900">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-cream-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Body */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Listing Type</label>
                <div className="grid grid-cols-2 gap-1">
                  {typesList.map((t) => (
                    <button
                      key={t}
                      onClick={() => setListingType(t)}
                      className={`p-2 rounded-lg text-xs font-bold ${
                        listingType === t ? 'bg-navy-900 text-white' : 'bg-cream-100 text-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubject('All');
                  }}
                  className="w-full p-2 text-xs border rounded-xl"
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Subject / Stream</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 text-xs border rounded-xl"
                >
                  {currentSubcategories.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2 text-xs font-bold rounded-xl border border-cream-300 text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-brand-600 text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
