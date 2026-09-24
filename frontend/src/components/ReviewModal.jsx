import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ReviewModal = ({ request, isOpen, onClose, onSuccess }) => {
  const { success, error } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const quickTags = [
    'Book was in great condition',
    'Punctual and friendly meetup',
    'Smooth academic swap',
    'Highly recommended peer'
  ];

  const handleTagClick = (tag) => {
    if (comment.includes(tag)) return;
    setComment((prev) => (prev ? `${prev}. ${tag}` : tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/api/reviews', {
        requestId: request._id,
        rating,
        comment: comment.trim()
      });

      if (res.data.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
        success('Review submitted successfully! Thank you for supporting the campus community.');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-modal border border-cream-200 overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="p-6 bg-cream-100/70 border-b border-cream-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-navy-900">Rate Exchange</h3>
            <p className="text-xs text-gray-500 mt-0.5">How was your exchange experience for "{request.book?.title}"?</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-navy-900 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Selector */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-cream-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-gray-500 mt-2">
              {rating === 5 && '🌟 Excellent experience!'}
              {rating === 4 && '👍 Very good meetup'}
              {rating === 3 && '👌 Good exchange'}
              {rating === 2 && 'Fair'}
              {rating === 1 && 'Needs improvement'}
            </span>
          </div>

          {/* Quick Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Quick Highlights
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-cream-200 bg-cream-50 hover:bg-cream-100 text-navy-800 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Review Note (Optional)
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share how the handover went or how the book was..."
              maxLength={1000}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-cream-300 text-sm font-semibold text-gray-700 hover:bg-cream-100 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
