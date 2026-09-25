import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  DollarSign,
  Repeat,
  HeartHandshake
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';

const MyListings = () => {
  const { success, error } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  // Deletion modal state
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = () => {
    setLoading(true);
    const query = activeTab !== 'All' ? `?status=${activeTab}` : '';
    api.get(`/api/books/my/listings${query}`)
      .then((res) => {
        if (res.data.success) {
          setListings(res.data.books || []);
        }
      })
      .catch((err) => {
        console.error('Error fetching my listings:', err);
        error('Failed to load your listings');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [activeTab]);

  const confirmDelete = (bookId) => {
    setSelectedBookId(bookId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBookId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/api/books/${selectedBookId}`);
      if (res.data.success) {
        success('Listing removed successfully');
        setListings((prev) => prev.filter((b) => b._id !== selectedBookId));
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to remove listing');
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setSelectedBookId(null);
    }
  };

  const tabs = ['All', 'Available', 'Reserved', 'Exchanged'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">
            My Book Listings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your textbook offers, pricing, and exchange statuses
          </p>
        </div>

        <Link
          to="/create-listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cream-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-cream-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Listings Table / Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500">
          Loading your listings...
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-soft p-4 flex flex-col justify-between"
            >
              <div className="flex gap-3">
                {b.images && b.images[0] ? (
                  <img
                    src={b.images[0]}
                    alt={b.title}
                    className="w-20 h-24 object-cover rounded-xl border border-cream-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-xl bg-cream-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        b.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Reserved'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">• {b.listingType}</span>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-navy-900 truncate" title={b.title}>
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">by {b.author}</p>

                  <div className="mt-2 text-xs font-bold text-navy-900">
                    {b.listingType === 'SELL' ? `₹${Number(b.price).toLocaleString('en-IN')}` : b.listingType === 'DONATE' ? 'Free Donation' : 'Swap'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-cream-200 flex items-center justify-between text-xs font-semibold">
                <Link
                  to={`/book/${b._id}`}
                  className="text-gray-600 hover:text-navy-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </Link>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/edit-listing/${b._id}`}
                    className="text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => confirmDelete(b._id)}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-cream-200 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-navy-900">No {activeTab.toLowerCase()} listings</h3>
          <p className="text-xs text-gray-500">
            {activeTab === 'All'
              ? "You haven't listed any textbooks yet."
              : `You don't have any books with status '${activeTab}'.`}
          </p>
          <Link
            to="/create-listing"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Create Your First Listing
          </Link>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete this listing?"
        message="This book will be removed from marketplace search and campus listings."
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  );
};

export default MyListings;
