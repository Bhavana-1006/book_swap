import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Repeat,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  BookOpen,
  Send,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import RequestModal from '../components/RequestModal';

const SwapMatches = () => {
  const { error } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoMsg, setInfoMsg] = useState('');

  // Swap modal state
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/api/swaps/matches')
      .then((res) => {
        if (res.data.success) {
          setMatches(res.data.matches || []);
          if (res.data.message) setInfoMsg(res.data.message);
        }
      })
      .catch((err) => {
        console.error('Error fetching swap matches:', err);
        error('Failed to calculate swap matches');
      })
      .finally(() => setLoading(false));
  }, [error]);

  const handleProposeSwap = (match) => {
    setSelectedMatch(match);
    setRequestModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-50 text-accent-800 border border-accent-200 text-xs font-bold shadow-sm">
          <Repeat className="w-3.5 h-3.5 text-accent-600 animate-spin-slow" />
          <span>Intelligent Two-Way Academic Matching</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Smart Swap Matches
        </h1>
        <p className="text-sm text-gray-500">
          Our algorithm compares your swap textbooks and wishlist with other students to find reciprocal textbook trades!
        </p>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-gray-500">
          <div className="w-8 h-8 border-4 border-cream-200 border-t-accent-600 rounded-full animate-spin mx-auto mb-3"></div>
          Calculating reciprocal book pairings...
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-6">
          {matches.map((m, idx) => {
            const isPerfect = m.matchType === 'PERFECT_TWO_WAY';

            return (
              <div
                key={idx}
                className={`bg-white rounded-3xl border ${
                  isPerfect ? 'border-accent-300 ring-2 ring-accent-100' : 'border-cream-200'
                } p-6 shadow-soft hover:shadow-hover transition-all space-y-5`}
              >
                {/* Match Score & Badge Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-200">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                        isPerfect
                          ? 'bg-accent-600 text-white shadow-sm'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{m.badge} ({m.confidence}% Match)</span>
                    </span>
                    <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                      {isPerfect ? 'Both students have exactly what each other wants!' : 'Compatible course swap'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleProposeSwap(m)}
                    className="px-5 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Propose Swap</span>
                  </button>
                </div>

                {/* Paired Books View: Your Book <---> Their Book */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                  {/* Left: Your Book */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-cream-50/70 border border-cream-200 flex gap-3 items-center">
                    {m.myBook?.images && m.myBook.images[0] ? (
                      <img
                        src={m.myBook.images[0]}
                        alt={m.myBook.title}
                        className="w-16 h-20 object-cover rounded-xl border border-cream-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 rounded-xl bg-cream-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Your Book (Offered)
                      </span>
                      <h4 className="font-serif text-sm font-bold text-navy-900 truncate" title={m.myBook.title}>
                        {m.myBook.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">by {m.myBook.author}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-brand-700">
                        {m.myBook.subject}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Exchange Arrows Icon */}
                  <div className="md:col-span-1 flex items-center justify-center py-2 md:py-0">
                    <div className="w-10 h-10 rounded-full bg-cream-200 text-accent-700 flex items-center justify-center shadow-inner">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Right: Matched Student's Book */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-white border border-cream-200 flex gap-3 items-center">
                    {m.matchedBook?.images && m.matchedBook.images[0] ? (
                      <img
                        src={m.matchedBook.images[0]}
                        alt={m.matchedBook.title}
                        className="w-16 h-20 object-cover rounded-xl border border-cream-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 rounded-xl bg-cream-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-accent-600 uppercase tracking-wider block">
                        Their Book (You Receive)
                      </span>
                      <Link to={`/book/${m.matchedBook._id}`} className="hover:text-brand-600">
                        <h4 className="font-serif text-sm font-bold text-navy-900 truncate" title={m.matchedBook.title}>
                          {m.matchedBook.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500 truncate">by {m.matchedBook.author}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{m.matchedBook.owner?.name} ({m.matchedBook.owner?.college})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Reasons List */}
                {m.reasons && m.reasons.length > 0 && (
                  <div className="p-3 rounded-xl bg-cream-100/60 border border-cream-200 text-xs text-gray-700 space-y-1">
                    <span className="font-bold text-navy-900 block">Why this matched:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                      {m.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-cream-200 p-8 space-y-4 max-w-xl mx-auto">
          <Repeat className="w-12 h-12 text-accent-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-navy-900">
            No reciprocal swap matches yet
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {infoMsg ||
              'To find matches, list a book with listing type SWAP and specify your desired textbooks, or add textbooks to your Wishlist!'}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/create-listing"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              List a SWAP Book
            </Link>
            <Link
              to="/browse"
              className="px-5 py-2.5 rounded-xl border border-cream-300 bg-white text-navy-900 text-xs font-bold hover:bg-cream-100 transition-colors"
            >
              Browse & Save to Wishlist
            </Link>
          </div>
        </div>
      )}

      {/* Propose Swap Modal */}
      {selectedMatch && (
        <RequestModal
          book={selectedMatch.matchedBook}
          isOpen={requestModalOpen}
          onClose={() => {
            setRequestModalOpen(false);
            setSelectedMatch(null);
          }}
          onSuccess={() => {
            // Success toast
          }}
        />
      )}
    </div>
  );
};

export default SwapMatches;
