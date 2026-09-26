import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, CheckCircle, AlertCircle, Sparkles, User, GraduationCap, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

// Realistic sample reviews: mostly positive with constructive feedback
const SAMPLE_REVIEWS = [
  {
    id: 'sample-1',
    author: 'Kavya S.',
    college: 'Osmania University, Hyderabad',
    branch: 'Computer Science (3rd Year)',
    rating: 5,
    date: '2 days ago',
    badge: 'Sample Review',
    comment:
      'Found the exact CLRS Algorithms textbook for 4th sem at less than half the market price from a senior in my own hostel. The exchange was super smooth and saved me almost ₹800!',
    aspect: 'Affordability & Exchange',
    helpfulCount: 14
  },
  {
    id: 'sample-2',
    author: 'Rahul Verma',
    college: 'JNTU College of Engineering',
    branch: 'Mechanical (2nd Year)',
    rating: 4,
    date: '1 week ago',
    badge: 'Sample Review',
    comment:
      'Very useful platform for engineering semester books. The search and branch filtering work really well. It would be even better if more juniors list first-year basic physics notes earlier in the semester.',
    aspect: 'Platform Usability',
    helpfulCount: 9
  },
  {
    id: 'sample-3',
    author: 'Dr. Sneha Reddy',
    college: 'Gandhi Medical College',
    branch: 'MBBS (Intern)',
    rating: 5,
    date: '2 weeks ago',
    badge: 'Sample Review',
    comment:
      'Medical textbooks like Robbins Pathology and BD Chaurasia Anatomy are notoriously costly. Exchanging standard editions with batchmates through BookSwap has been a lifesaver.',
    aspect: 'Medical Book Availability',
    helpfulCount: 22
  },
  {
    id: 'sample-4',
    author: 'Arjun Das',
    college: 'Delhi University',
    branch: 'B.Com Honours',
    rating: 3,
    date: '3 weeks ago',
    badge: 'Sample Review',
    comment:
      'Good platform overall. Most sellers respond fast, but I had one listing where the book cover had minor wear not fully visible in the single photo. Always inspect book condition in person before confirming exchange.',
    aspect: 'Constructive Feedback',
    helpfulCount: 18
  },
  {
    id: 'sample-5',
    author: 'Ananya Sharma',
    college: 'IIT Madras',
    branch: 'Electrical Engineering',
    rating: 5,
    date: '1 month ago',
    badge: 'Sample Review',
    comment:
      'The dark mode theme looks sleek and easy on the eyes during late-night exam prep. Listed my competitive JEE prep guides and handed them over to a fresh batch student within 24 hours.',
    aspect: 'UI & Campus Community',
    helpfulCount: 31
  }
];

const StudentReviewsSection = ({ bookId = null }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [realReviews, setRealReviews] = useState([]);
  const [loadingReal, setLoadingReal] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'genuine' | 'samples'
  
  // Review form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRealReviews();
  }, [bookId]);

  const fetchRealReviews = async () => {
    try {
      setLoadingReal(true);
      const res = await api.get('/api/reviews');
      if (res.data.success) {
        setRealReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.warn('Could not fetch live reviews:', err.message);
    } finally {
      setLoadingReal(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      error('Please log in to submit a student review');
      return;
    }
    if (!comment.trim()) {
      error('Please write a brief comment describing your experience');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rating,
        comment: comment.trim(),
        bookId: bookId || undefined
      };

      const res = await api.post('/api/reviews', payload);
      if (res.data.success) {
        success('Thank you! Your student review has been published.');
        setComment('');
        setRating(5);
        setShowForm(false);
        fetchRealReviews();
      }
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-cream-50/50 dark:bg-[#101D24] border-t border-cream-200 dark:border-[#36505A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-[#203640] border border-brand-200 dark:border-[#36505A] text-brand-700 dark:text-[#D8B66C] text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Student Experiences & Feedback
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-900 dark:text-[#F7F2E8]">
              Student Reviews & Community Ratings
            </h2>
            <p className="text-sm text-gray-600 dark:text-[#BBCBD0] mt-1 max-w-2xl">
              Authentic feedback from students exchanging academic books, semester guides, and competitive exam materials across campuses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-[#D8B66C] dark:hover:bg-[#c4a259] text-white dark:text-[#101D24] font-bold text-xs shadow-soft transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{showForm ? 'Close Form' : 'Write a Student Review'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#203640] border border-cream-300 dark:border-[#36505A] text-navy-900 dark:text-[#F7F2E8] hover:bg-cream-100 dark:hover:bg-[#29434D] text-xs font-bold transition-all"
              >
                <User className="w-3.5 h-3.5 text-brand-600 dark:text-[#D8B66C]" />
                <span>Log In to Leave a Review</span>
              </Link>
            )}
          </div>
        </div>

        {/* Review Submission Form Modal/Card */}
        {showForm && (
          <div className="mb-8 p-6 rounded-3xl bg-white dark:bg-[#203640] border border-brand-200 dark:border-[#36505A] shadow-soft animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-navy-900 dark:text-[#F7F2E8] mb-1">
              Share Your Campus Experience
            </h3>
            <p className="text-xs text-gray-500 dark:text-[#BBCBD0] mb-4">
              Posting as <strong className="text-navy-900 dark:text-[#D8B66C]">{user?.name}</strong> ({user?.college || 'Student'})
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-navy-800 dark:text-[#BBCBD0]">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 dark:text-[#F7F2E8] uppercase tracking-wider mb-1">
                  Review & Feedback Comments <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about book condition, exchange timeliness, savings, or helpful suggestions for peers..."
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-[#36505A] bg-white dark:bg-[#172A33] text-sm text-navy-900 dark:text-[#F7F2E8] focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-[#D8B66C] placeholder-gray-400 dark:placeholder-[#8C9FA6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl bg-cream-100 dark:bg-[#172A33] text-xs font-bold text-gray-600 dark:text-[#BBCBD0] hover:bg-cream-200 dark:hover:bg-[#29434D] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-[#D8B66C] dark:hover:bg-[#c4a259] text-white dark:text-[#101D24] text-xs font-bold shadow-soft transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Student Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs for Transparency */}
        <div className="flex items-center gap-2 mb-6 border-b border-cream-200 dark:border-[#36505A] pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-navy-900 text-white dark:bg-[#D8B66C] dark:text-[#101D24]'
                : 'text-gray-500 dark:text-[#BBCBD0] hover:bg-cream-100 dark:hover:bg-[#203640]'
            }`}
          >
            All Reviews ({SAMPLE_REVIEWS.length + realReviews.length})
          </button>
          {realReviews.length > 0 && (
            <button
              onClick={() => setActiveTab('genuine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'genuine'
                  ? 'bg-navy-900 text-white dark:bg-[#D8B66C] dark:text-[#101D24]'
                  : 'text-gray-500 dark:text-[#BBCBD0] hover:bg-cream-100 dark:hover:bg-[#203640]'
              }`}
            >
              Live Student Reviews ({realReviews.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'samples'
                ? 'bg-navy-900 text-white dark:bg-[#D8B66C] dark:text-[#101D24]'
                : 'text-gray-500 dark:text-[#BBCBD0] hover:bg-cream-100 dark:hover:bg-[#203640]'
            }`}
          >
            Sample Demonstrations ({SAMPLE_REVIEWS.length})
          </button>
        </div>

        {/* Live Student Reviews Section (if any submitted) */}
        {activeTab !== 'samples' && realReviews.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-[#78C49C]">
                Verified Campus Student Submissions
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {realReviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white dark:bg-[#203640] p-5 rounded-2xl border border-emerald-200 dark:border-[#36505A] shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-[#172A33] border border-emerald-300 dark:border-[#78C49C]/40 flex items-center justify-center text-emerald-700 dark:text-[#78C49C] font-bold text-xs">
                          {rev.reviewer?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-navy-900 dark:text-[#F7F2E8] flex items-center gap-1.5">
                            {rev.reviewer?.name || 'Student'}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-[#172A33] text-emerald-800 dark:text-[#78C49C]">
                              Live
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-[#BBCBD0]">
                            {rev.reviewer?.college || 'Campus Member'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-[#BBCBD0] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-cream-100 dark:border-[#36505A] text-[11px] text-gray-400 dark:text-[#8C9FA6] flex items-center justify-between">
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    <span className="text-emerald-600 dark:text-[#78C49C] font-medium">Verified Student</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Demonstration Reviews */}
        {activeTab !== 'genuine' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-[#172A33] text-amber-800 dark:text-[#D8B66C] border border-amber-300 dark:border-[#36505A]">
                  Sample Reviews
                </span>
                <span className="text-xs text-gray-500 dark:text-[#BBCBD0]">
                  Illustrative campus feedback scenarios
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SAMPLE_REVIEWS.map((sample) => (
                <div
                  key={sample.id}
                  className="bg-white dark:bg-[#203640] p-5 rounded-2xl border border-cream-200 dark:border-[#36505A] shadow-soft flex flex-col justify-between hover:border-brand-300 dark:hover:border-[#73B5A4] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="text-xs font-bold text-navy-900 dark:text-[#F7F2E8]">
                          {sample.author}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-[#BBCBD0] flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          <span>{sample.branch}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 dark:text-[#8C9FA6]">
                          {sample.college}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-0.5 justify-end">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < sample.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-200 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-[#8C9FA6] block mt-0.5">
                          {sample.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-navy-800 dark:text-[#BBCBD0] leading-relaxed italic">
                      "{sample.comment}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-cream-100 dark:border-[#36505A] flex items-center justify-between text-[11px]">
                    <span className="text-xs text-brand-600 dark:text-[#73B5A4] font-medium">
                      {sample.aspect}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-400 dark:text-[#8C9FA6]">
                      <ThumbsUp className="w-3 h-3" /> {sample.helpfulCount} helpful
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default StudentReviewsSection;
