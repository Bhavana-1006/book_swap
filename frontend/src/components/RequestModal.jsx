import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const RequestModal = ({ book, isOpen, onClose, onSuccess }) => {
  const { success, error } = useToast();
  const [requestType, setRequestType] = useState('PURCHASE');
  const [offeredBookId, setOfferedBookId] = useState('');
  const [message, setMessage] = useState('');
  const [myBooks, setMyBooks] = useState([]);
  const [loadingMyBooks, setLoadingMyBooks] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Set default requestType based on book's listingType
  useEffect(() => {
    if (book) {
      if (book.listingType === 'DONATE') {
        setRequestType('DONATION');
      } else if (book.listingType === 'SWAP') {
        setRequestType('SWAP');
      } else {
        setRequestType('PURCHASE');
      }
    }
  }, [book]);

  // If SWAP selected, fetch user's available listings
  useEffect(() => {
    if (isOpen && requestType === 'SWAP') {
      setLoadingMyBooks(true);
      api.get('/api/books/my/listings?status=Available')
        .then((res) => {
          if (res.data.success) {
            setMyBooks(res.data.books || []);
            if (res.data.books && res.data.books.length > 0) {
              setOfferedBookId(res.data.books[0]._id);
            }
          }
        })
        .catch(() => {})
        .finally(() => setLoadingMyBooks(false));
    }
  }, [isOpen, requestType]);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        bookId: book._id,
        requestType,
        message: message.trim(),
        offeredBookId: requestType === 'SWAP' && offeredBookId ? offeredBookId : undefined
      };

      const res = await api.post('/api/requests', payload);

      if (res.data.success) {
        success('Request sent to book owner!');
        if (onSuccess) onSuccess(res.data.request);
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-modal border border-cream-200 overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="p-6 bg-cream-100/70 border-b border-cream-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-navy-900">Request Book</h3>
            <p className="text-xs text-gray-500 mt-0.5">Connect with the owner to arrange the exchange</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-navy-900 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Book Summary */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
            {book.images && book.images[0] ? (
              <img
                src={book.images[0]}
                alt={book.title}
                className="w-14 h-14 object-cover rounded-xl border border-cream-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-cream-200 flex items-center justify-center text-gray-400">
                <BookOpen className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-navy-900 truncate">{book.title}</h4>
              <p className="text-xs text-gray-500 truncate">by {book.author}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-semibold text-brand-700">{book.listingType}</span>
                {book.listingType === 'SELL' && (
                  <span className="text-xs font-bold text-navy-900">₹{Number(book.price).toLocaleString('en-IN')}</span>
                )}
                <span className="text-[11px] text-gray-400">• Owner: {book.owner?.name}</span>
              </div>
            </div>
          </div>

          {/* Request Type Selector */}
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Request Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRequestType('PURCHASE')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  requestType === 'PURCHASE'
                    ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                    : 'bg-white text-gray-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                Purchase
              </button>
              <button
                type="button"
                onClick={() => setRequestType('DONATION')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  requestType === 'DONATION'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-gray-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                Donation Claim
              </button>
              <button
                type="button"
                onClick={() => setRequestType('SWAP')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  requestType === 'SWAP'
                    ? 'bg-accent-600 text-white border-accent-600 shadow-sm'
                    : 'bg-white text-gray-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                Swap Offer
              </button>
            </div>
          </div>

          {/* If SWAP: Select Offered Book */}
          {requestType === 'SWAP' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Select Your Book to Offer in Exchange
              </label>
              {loadingMyBooks ? (
                <p className="text-xs text-gray-500">Loading your listings...</p>
              ) : myBooks.length > 0 ? (
                <select
                  value={offeredBookId}
                  onChange={(e) => setOfferedBookId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {myBooks.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.title} ({b.subject} - {b.condition})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    You don't have any available books listed yet. You can still send a message or list a book first!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Message Note */}
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Message to Owner (Optional)
            </label>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hi! I'm in the Computer Science department and can meet at the campus library this afternoon..."
              maxLength={500}
              className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            ></textarea>
            <div className="text-right text-[11px] text-gray-400 mt-1">
              {message.length}/500 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-cream-300 text-sm font-semibold text-gray-700 hover:bg-cream-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
