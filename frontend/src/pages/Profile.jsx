import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Calendar,
  Layers,
  CheckCircle,
  Star,
  Edit3,
  Save,
  X,
  Upload,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);

  // Reviews state
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 0, count: 0 });
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCollege(user.college || '');
      setCity(user.city || '');
      setAvatarPreview(user.profileImage || '');

      // Fetch user reviews
      api.get(`/api/reviews/user/${user.id}`)
        .then((res) => {
          if (res.data.success) {
            setReviewsData({
              reviews: res.data.reviews || [],
              averageRating: res.data.averageRating || 0,
              count: res.data.count || 0
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingReviews(false));
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('college', college.trim());
      formData.append('city', city.trim());
      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }

      await updateProfile(formData);
      await refreshUser();
      success('Profile updated successfully!');
      setEditModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-soft flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-cream-100 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-navy-800 text-white flex items-center justify-center font-bold text-3xl shadow-md uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${
                user.role === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-brand-600 text-white'
              }`}
            >
              {user.role}
            </span>
          </div>

          {/* User Details */}
          <div className="space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-900">
              {user.name}
            </h1>
            <p className="text-xs text-gray-500 font-medium">{user.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1 font-semibold text-navy-900">
                <GraduationCap className="w-4 h-4 text-brand-600" />
                {user.college}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {user.city}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setEditModalOpen(true)}
          className="px-4 py-2 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-100 text-xs font-bold text-navy-900 flex items-center gap-1.5 transition-colors self-center sm:self-start"
        >
          <Edit3 className="w-3.5 h-3.5 text-brand-600" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Activity Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Total Listings</p>
            <p className="text-2xl font-extrabold text-navy-900">{user.listingsCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Completed Exchanges</p>
            <p className="text-2xl font-extrabold text-navy-900">{user.completedExchangesCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Peer Reputation</p>
            <p className="text-2xl font-extrabold text-navy-900">
              {reviewsData.averageRating > 0 ? `${reviewsData.averageRating} / 5` : 'New Peer'}
            </p>
            <span className="text-[11px] text-gray-400">({reviewsData.count} reviews)</span>
          </div>
        </div>
      </div>

      {/* Received Reviews Section */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
        <h3 className="font-serif text-xl font-bold text-navy-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>Campus Reviews & Ratings Received</span>
        </h3>

        {loadingReviews ? (
          <p className="text-xs text-gray-400">Loading reviews...</p>
        ) : reviewsData.reviews.length > 0 ? (
          <div className="space-y-4">
            {reviewsData.reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy-900">{rev.reviewer?.name}</span>
                    <span className="text-[11px] text-gray-400">({rev.reviewer?.college})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-cream-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {rev.comment && <p className="text-xs text-gray-600">"{rev.comment}"</p>}
                <div className="text-[10px] text-gray-400">
                  Book: <span className="font-semibold text-navy-800">{rev.book?.title}</span> •{' '}
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            No reviews yet. Complete your first textbook exchange to receive student ratings!
          </p>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-modal border border-cream-200 p-6 space-y-5 animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h3 className="font-serif text-lg font-bold text-navy-900">Edit Profile</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-navy-900 hover:bg-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-cream-300"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-100 text-xs font-bold text-navy-900 inline-block transition-colors">
                    Upload New Avatar
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-cream-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
