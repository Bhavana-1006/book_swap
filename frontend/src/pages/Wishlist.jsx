import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, BookOpen, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import BookCard from '../components/BookCard';

const Wishlist = () => {
  const { success, error } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    setLoading(true);
    api.get('/api/wishlist')
      .then((res) => {
        if (res.data.success) {
          setWishlist(res.data.wishlist || []);
        }
      })
      .catch((err) => {
        console.error('Error fetching wishlist:', err);
        error('Could not load your wishlist');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistChange = (bookId, isAdded) => {
    if (!isAdded) {
      setWishlist((prev) => prev.filter((item) => item.book?._id !== bookId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-cream-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>My Saved Wishlist</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track textbooks you plan to purchase or swap this semester
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500">
          Loading your saved books...
        </div>
      ) : wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <BookCard
              key={item._id}
              book={item.book}
              isWishlisted={true}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
          <Heart className="w-12 h-12 text-rose-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click the heart icon on any textbook listing to save it here for quick access later.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 mt-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            <span>Explore Campus Books</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
