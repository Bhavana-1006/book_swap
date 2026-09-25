import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [listingType, setListingType] = useState('SELL');
  const [price, setPrice] = useState('');
  const [swapPreferences, setSwapPreferences] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Available');
  const [city, setCity] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/api/books/${id}`)
      .then((res) => {
        if (res.data.success && res.data.book) {
          const b = res.data.book;
          setTitle(b.title || '');
          setAuthor(b.author || '');
          setIsbn(b.isbn || '');
          setSubject(b.subject || '');
          setSemester(b.semester || '');
          setBranch(b.branch || '');
          setCondition(b.condition || 'Good');
          setListingType(b.listingType || 'SELL');
          setPrice(b.price ? b.price.toString() : '');
          setSwapPreferences(b.swapPreferences || '');
          setDescription(b.description || '');
          setStatus(b.status || 'Available');
          setCity(b.location?.city || '');
        }
      })
      .catch((err) => {
        error(err.response?.data?.message || 'Could not load listing for editing');
        navigate('/my-listings');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        subject,
        semester,
        branch: branch.trim(),
        condition,
        listingType,
        price: listingType === 'SELL' ? parseFloat(price) : 0,
        swapPreferences: swapPreferences.trim(),
        description: description.trim(),
        status,
        city: city.trim()
      };

      const res = await api.put(`/api/books/${id}`, payload);
      if (res.data.success) {
        success('Listing updated successfully!');
        navigate(`/book/${id}`);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await api.delete(`/api/books/${id}`);
      if (res.data.success) {
        success('Listing removed successfully');
        navigate('/my-listings');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-cream-200 border-t-brand-600 rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-500 font-medium">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-navy-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => setDeleteConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Listing</span>
        </button>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
        <h2 className="font-serif text-2xl font-bold text-navy-900">Edit Book Listing</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Status selector */}
          <div className="p-4 rounded-2xl bg-cream-100/70 border border-cream-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-navy-900 uppercase">Availability Status</span>
              <p className="text-[11px] text-gray-500 mt-0.5">Control whether students can request this listing</p>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-cream-300 bg-white text-xs font-bold text-navy-900"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Exchanged">Exchanged</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-900 uppercase mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase mb-1">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Acceptable">Acceptable</option>
              </select>
            </div>

            {listingType === 'SELL' && (
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase mb-1">Price (₹ INR)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm font-bold"
                />
              </div>
            )}

            {listingType === 'SWAP' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy-900 uppercase mb-1">Swap Preferences</label>
                <input
                  type="text"
                  value={swapPreferences}
                  onChange={(e) => setSwapPreferences(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm"
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-900 uppercase mb-1">Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-sm resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete this listing?"
        message="Are you sure you want to delete this listing? It will no longer be visible on the campus marketplace."
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  );
};

export default EditListing;
