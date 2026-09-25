import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Star,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ChatModal from '../components/ChatModal';
import ReviewModal from '../components/ReviewModal';

const MyRequests = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'sent'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active modals
  const [chatRequest, setChatRequest] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [reviewRequest, setReviewRequest] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    const endpoint = activeTab === 'incoming' ? '/api/requests/incoming' : '/api/requests/my';
    api.get(endpoint)
      .then((res) => {
        if (res.data.success) {
          setRequests(res.data.requests || []);
        }
      })
      .catch((err) => {
        console.error('Error fetching requests:', err);
        error('Could not load exchange requests');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleUpdateStatus = async (requestId, targetStatus) => {
    setActionLoadingId(requestId);
    try {
      const res = await api.patch(`/api/requests/${requestId}/status`, { status: targetStatus });
      if (res.data.success) {
        success(`Request ${targetStatus} successfully!`);
        fetchRequests();
      }
    } catch (err) {
      error(err.response?.data?.message || `Failed to update request to ${targetStatus}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3" />
            <span>Accepted (Reserved)</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="pb-6 border-b border-cream-200">
        <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">
          Exchange Requests Hub
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review incoming requests from campus peers and track requests you've sent
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cream-200 gap-2">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'incoming'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-500 hover:text-navy-900'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests (For My Books)</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 pb-3 px-4 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'sent'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-500 hover:text-navy-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests (Books I Want)</span>
        </button>
      </div>

      {/* Request Cards List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500">
          Loading requests...
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => {
            const isOwner = activeTab === 'incoming';
            const counterParty = isOwner ? req.requester : req.owner;
            const isActionLoading = actionLoadingId === req._id;

            return (
              <div
                key={req._id}
                className="bg-white rounded-3xl border border-cream-200 p-5 sm:p-6 shadow-soft hover:shadow-hover transition-all space-y-4"
              >
                {/* Top Row: Counterparty info + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cream-200">
                  <div className="flex items-center gap-3">
                    {counterParty?.profileImage ? (
                      <img
                        src={counterParty.profileImage}
                        alt={counterParty.name}
                        className="w-10 h-10 rounded-full object-cover border border-cream-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-sm">
                        {counterParty?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400 font-medium">
                          {isOwner ? 'Requested by' : 'Book Owner'}:
                        </span>
                        <span className="text-sm font-bold text-navy-900">{counterParty?.name}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {counterParty?.college} • {counterParty?.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="text-[11px] font-bold text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                {/* Middle Row: Book Info & Custom Message */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex gap-3 items-center">
                    {req.book?.images && req.book.images[0] ? (
                      <img
                        src={req.book.images[0]}
                        alt={req.book.title}
                        className="w-14 h-16 object-cover rounded-xl border border-cream-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-16 rounded-xl bg-cream-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                        {req.requestType} REQUEST
                      </span>
                      <h4 className="font-serif text-sm font-bold text-navy-900 truncate">
                        {req.book?.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">by {req.book?.author}</p>
                      {req.book?.price > 0 && req.requestType === 'PURCHASE' && (
                        <p className="text-xs font-bold text-navy-900 mt-0.5">₹{Number(req.book.price).toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>

                  {/* Offered Swap Book (if SWAP) */}
                  {req.requestType === 'SWAP' && req.offeredBook && (
                    <div className="md:col-span-6 p-2.5 rounded-xl bg-accent-50 border border-accent-100 text-xs">
                      <span className="font-bold text-accent-900 block mb-0.5">Offered in Exchange:</span>
                      <span className="font-semibold text-navy-900">{req.offeredBook.title}</span>
                      <span className="text-gray-500"> by {req.offeredBook.author}</span>
                    </div>
                  )}

                  {/* Note / Message */}
                  {req.message && (
                    <div className="col-span-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs text-gray-700">
                      <span className="font-bold text-navy-900">Note: </span>
                      "{req.message}"
                    </div>
                  )}
                </div>

                {/* Bottom Row: State Machine Action Buttons */}
                <div className="pt-3 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Chat button (available if accepted or pending) */}
                    {(req.status === 'pending' || req.status === 'accepted' || req.status === 'completed') && (
                      <button
                        onClick={() => {
                          setChatRequest(req);
                          setChatModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-200/80 hover:bg-cream-300 text-xs font-bold text-navy-900 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-brand-600" />
                        <span>Chat & Coordinate Meetup</span>
                      </button>
                    )}

                    {/* Rate & Review button (available if completed) */}
                    {req.status === 'completed' && (
                      <button
                        onClick={() => {
                          setReviewRequest(req);
                          setReviewModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Rate Exchange</span>
                      </button>
                    )}
                  </div>

                  {/* Status Transition Triggers */}
                  <div className="flex items-center gap-2">
                    {/* Owner controls for pending requests */}
                    {isOwner && req.status === 'pending' && (
                      <>
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(req._id, 'rejected')}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(req._id, 'accepted')}
                          className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                        >
                          {isActionLoading ? 'Reserving...' : 'Accept & Reserve Book'}
                        </button>
                      </>
                    )}

                    {/* Requester cancel option for pending requests */}
                    {!isOwner && req.status === 'pending' && (
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleUpdateStatus(req._id, 'cancelled')}
                        className="px-3 py-1.5 rounded-xl border border-cream-300 text-gray-600 text-xs font-semibold hover:bg-cream-100 transition-colors"
                      >
                        Cancel Request
                      </button>
                    )}

                    {/* Mark Completed (for either party once accepted) */}
                    {req.status === 'accepted' && (
                      <>
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(req._id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 transition-colors"
                        >
                          Cancel Handover
                        </button>
                        <button
                          disabled={isActionLoading}
                          onClick={() => handleUpdateStatus(req._id, 'completed')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Mark Exchange Completed</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">
            No {activeTab === 'incoming' ? 'incoming' : 'sent'} requests
          </h3>
          <p className="text-xs text-gray-500">
            {activeTab === 'incoming'
              ? 'When students request your textbooks, they will appear here for you to accept or reject.'
              : "You haven't requested any textbooks yet."}
          </p>
          <Link
            to="/browse"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Browse Available Books
          </Link>
        </div>
      )}

      {/* Live Chat Modal */}
      <ChatModal
        request={chatRequest}
        isOpen={chatModalOpen}
        onClose={() => {
          setChatModalOpen(false);
          setChatRequest(null);
        }}
      />

      {/* Review Modal */}
      <ReviewModal
        request={reviewRequest}
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setReviewRequest(null);
        }}
        onSuccess={() => {
          fetchRequests();
        }}
      />
    </div>
  );
};

export default MyRequests;
