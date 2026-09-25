import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Sparkles,
  BookOpen,
  User,
  GraduationCap,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  Send,
  Edit,
  Repeat
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RequestModal from '../components/RequestModal';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error, warning } = useToast();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [copiedIsbn, setCopiedIsbn] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Fetch book details
  useEffect(() => {
    setLoading(true);
    api.get(`/api/books/${id}`)
      .then((res) => {
        if (res.data.success) {
          setBook(res.data.book);
        }
      })
      .catch((err) => {
        console.error('Error fetching book details:', err);
        setErrorMsg('Book listing not found or has been removed.');
      })
      .finally(() => setLoading(false));

    // Check wishlist status if user is authenticated
    if (isAuthenticated) {
      api.get('/api/wishlist')
        .then((res) => {
          if (res.data.success) {
            const hasIt = (res.data.wishlist || []).some((item) => item.book?._id === id);
            setInWishlist(hasIt);
          }
        })
        .catch(() => {});
    }
  }, [id, isAuthenticated]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      warning('Please log in to save books to your wishlist');
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/api/wishlist/${book._id}`);
        setInWishlist(false);
        success('Removed from your wishlist');
      } else {
        await api.post(`/api/wishlist/${book._id}`);
        setInWishlist(true);
        success('Saved to your wishlist');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const copyIsbnToClipboard = () => {
    if (book?.isbn) {
      navigator.clipboard.writeText(book.isbn);
      setCopiedIsbn(true);
      setTimeout(() => setCopiedIsbn(false), 2000);
      success('ISBN copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-cream-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium text-gray-500">Retrieving textbook details...</p>
      </div>
    );
  }

  if (errorMsg || !book) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-navy-900">Book Not Found</h2>
        <p className="text-sm text-gray-500">{errorMsg || 'This listing does not exist.'}</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === book.owner?._id;
  const isAvailable = book.status === 'Available';
  const images = book.images && book.images.length > 0 ? book.images : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </button>

        <div className="flex items-center gap-2">
          {isOwner ? (
            <Link
              to={`/edit-listing/${book._id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-xs font-bold text-navy-900 transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-brand-600" />
              <span>Edit Listing</span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Main Grid: Gallery on Left + Info & Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl bg-cream-100 border border-cream-200 overflow-hidden shadow-soft">
            {images.length > 0 ? (
              <img
                src={images[activeImageIndex] || images[0]}
                alt={book.title}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <BookOpen className="w-16 h-16 text-cream-300 mb-2" />
                <span className="text-xs">No Cover Image</span>
              </div>
            )}

            {/* Type Badge */}
            <div className="absolute top-4 left-4">
              {book.listingType === 'SELL' && (
                <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-navy-900 text-white shadow-md">
                  Sell for ${book.price}
                </span>
              )}
              {book.listingType === 'DONATE' && (
                <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-700 text-white shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Free Donation</span>
                </span>
              )}
              {book.listingType === 'SWAP' && (
                <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-accent-600 text-white shadow-md flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Swap Exchange</span>
                </span>
              )}
            </div>

            {/* Availability Ribbon */}
            {!isAvailable && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                {book.status}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-brand-600 shadow-sm' : 'border-cream-300 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Book Details & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tags & Metadata */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-xs font-bold uppercase tracking-wider">
                {book.subject}
              </span>
              <span className="px-3 py-1 rounded-full bg-cream-200 text-navy-800 text-xs font-semibold">
                {book.semester}
              </span>
              <span className="px-3 py-1 rounded-full bg-cream-200 text-gray-700 text-xs font-semibold">
                Condition: {book.condition}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-900 leading-tight">
              {book.title}
            </h1>

            <p className="text-base text-gray-600 font-medium">
              Written by <span className="text-navy-900 font-semibold">{book.author}</span>
            </p>
          </div>

          {/* Pricing / Listing Type Callout */}
          <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Exchange Type</p>
              <div className="flex items-center gap-3 mt-1">
                {book.listingType === 'SELL' ? (
                  <span className="text-3xl font-extrabold text-navy-900">
                    ${book.price} <span className="text-xs font-normal text-gray-500">USD</span>
                  </span>
                ) : book.listingType === 'DONATE' ? (
                  <span className="text-2xl font-extrabold text-emerald-700 flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>$0 (Free Student Donation)</span>
                  </span>
                ) : (
                  <span className="text-2xl font-extrabold text-accent-700 flex items-center gap-1.5">
                    <Repeat className="w-5 h-5" />
                    <span>Two-Way Course Swap</span>
                  </span>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Current Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                  book.status === 'Available'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {book.status}
              </span>
            </div>
          </div>

          {/* ISBN & Academic Details Table */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-cream-100/60 border border-cream-200 text-xs">
            {book.category && (
              <div className="space-y-1">
                <span className="text-gray-500 font-semibold">Category</span>
                <p className="text-navy-900 font-bold">{book.category}</p>
              </div>
            )}
            {book.isbn && (
              <div className="space-y-1">
                <span className="text-gray-500 font-semibold">ISBN</span>
                <div className="flex items-center gap-2 text-navy-900 font-mono font-bold">
                  <span>{book.isbn}</span>
                  <button
                    onClick={copyIsbnToClipboard}
                    className="p-1 hover:text-brand-600 transition-colors"
                    title="Copy ISBN"
                  >
                    {copiedIsbn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
            {book.publisher && (
              <div className="space-y-1">
                <span className="text-gray-500 font-semibold">Publisher</span>
                <p className="text-navy-900 font-bold">{book.publisher}</p>
              </div>
            )}
            {book.edition && (
              <div className="space-y-1">
                <span className="text-gray-500 font-semibold">Edition</span>
                <p className="text-navy-900 font-bold">{book.edition}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-gray-500 font-semibold">Department / Stream</span>
              <p className="text-navy-900 font-bold">{book.branch || 'General'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 font-semibold">Campus Location</span>
              <p className="text-navy-900 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>{book.location?.city || book.owner?.city || 'Campus'}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 font-semibold">Listed Date</span>
              <p className="text-navy-900 font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>{new Date(book.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* Swap Preference Box (if SWAP) */}
          {book.listingType === 'SWAP' && book.swapPreferences && (
            <div className="p-4 rounded-2xl bg-accent-50 border border-accent-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-900 uppercase tracking-wider">
                <Repeat className="w-3.5 h-3.5 text-accent-600" />
                <span>Owner's Swap Wishlist / Preferences</span>
              </div>
              <p className="text-xs text-accent-800 leading-relaxed font-medium">
                "{book.swapPreferences}"
              </p>
            </div>
          )}

          {/* Book Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-navy-900">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Book Owner Profile Card */}
          <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-3">
              {book.owner?.profileImage ? (
                <img
                  src={book.owner.profileImage}
                  alt={book.owner.name}
                  className="w-12 h-12 rounded-full object-cover border border-cream-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-base">
                  {book.owner?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                  <span>{book.owner?.name}</span>
                  <ShieldCheck className="w-4 h-4 text-brand-600" title="Verified Campus Student" />
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{book.owner?.college}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isOwner ? (
              <div className="p-3.5 rounded-2xl bg-cream-200/80 border border-cream-300 text-xs font-semibold text-navy-800 flex-1 text-center">
                This is your active listing. You can manage incoming requests in your Requests tab.
              </div>
            ) : !isAvailable ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex-1 text-center">
                This book is currently {book.status.toLowerCase()} and cannot accept new requests.
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    warning('Please log in to request this book');
                    navigate('/login');
                    return;
                  }
                  setRequestModalOpen(true);
                }}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {book.listingType === 'SELL'
                    ? `Request to Buy ($${book.price})`
                    : book.listingType === 'DONATE'
                    ? 'Request Donation'
                    : 'Propose Swap Offer'}
                </span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                inWishlist
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-cream-300 bg-white hover:bg-cream-100 text-gray-700'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{inWishlist ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestModal
        book={book}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSuccess={() => {
          // Success handled in modal
        }}
      />
    </div>
  );
};

export default BookDetails;
