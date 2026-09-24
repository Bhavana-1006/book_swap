import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const BookCard = ({ book, onWishlistChange, isWishlisted = false }) => {
  const { isAuthenticated } = useAuth();
  const { success, error, warning } = useToast();
  const [inWishlist, setInWishlist] = useState(isWishlisted);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      warning('Please log in to save books to your wishlist');
      return;
    }

    setLoadingWishlist(true);
    try {
      if (inWishlist) {
        await api.delete(`/api/wishlist/${book._id}`);
        setInWishlist(false);
        success('Removed from your wishlist');
        if (onWishlistChange) onWishlistChange(book._id, false);
      } else {
        await api.post(`/api/wishlist/${book._id}`);
        setInWishlist(true);
        success('Saved to your wishlist');
        if (onWishlistChange) onWishlistChange(book._id, true);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Could not update wishlist');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const coverImg = book.images && book.images.length > 0 ? book.images[0] : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] w-full bg-cream-100 overflow-hidden">
        {coverImg ? (
          <img
            src={coverImg}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-cream-100">
            <BookOpen className="w-12 h-12 text-cream-300 mb-1" />
            <span className="text-xs font-medium text-gray-500">Textbook Cover</span>
          </div>
        )}

        {/* Listing Type & Price Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          {book.listingType === 'SELL' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-navy-900 text-white shadow-sm flex items-center gap-1">
              <span>Sell</span>
              <span className="text-emerald-400 font-extrabold">${book.price}</span>
            </span>
          )}
          {book.listingType === 'DONATE' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Free Donate</span>
            </span>
          )}
          {book.listingType === 'SWAP' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent-600 text-white shadow-sm">
              Swap Exchange
            </span>
          )}

          {book.status === 'Reserved' && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              Reserved
            </span>
          )}
          {book.status === 'Exchanged' && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-600 text-white shadow-sm">
              Exchanged
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={loadingWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-sm ${
            inWishlist
              ? 'bg-rose-500 text-white hover:bg-rose-600'
              : 'bg-white/80 text-gray-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Condition Ribbon */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 text-navy-800 backdrop-blur-sm border border-cream-200">
            {book.condition}
          </span>
        </div>
      </div>

      {/* Book Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subject & Semester */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-brand-700 uppercase tracking-wider mb-1.5">
            <span className="truncate max-w-[150px]">{book.subject}</span>
            <span>•</span>
            <span className="text-gray-500">{book.semester}</span>
          </div>

          {/* Book Title */}
          <Link to={`/book/${book._id}`}>
            <h3 className="font-serif text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            by {book.author}
          </p>

          {/* Swap Preference Snippet if SWAP */}
          {book.listingType === 'SWAP' && book.swapPreferences && (
            <div className="mt-2.5 p-2 rounded-lg bg-accent-50/70 border border-accent-100 text-[11px] text-accent-800 line-clamp-1">
              <span className="font-semibold">Seeking:</span> {book.swapPreferences}
            </div>
          )}
        </div>

        {/* Location & Owner Footer */}
        <div className="pt-3 mt-3 border-t border-cream-200/80 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1 truncate max-w-[140px]" title={book.location?.city || book.owner?.city}>
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{book.location?.city || book.owner?.city || 'Campus'}</span>
          </div>

          {book.owner?.college && (
            <span className="text-[11px] text-gray-400 truncate max-w-[120px]" title={book.owner?.college}>
              {book.owner.college}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
