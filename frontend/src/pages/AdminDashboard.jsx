import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  Inbox,
  AlertTriangle,
  Search,
  Ban,
  CheckCircle,
  Trash2,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { success, error } = useToast();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'listings'

  // Users state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Listings state
  const [listings, setListings] = useState([]);
  const [listingSearch, setListingSearch] = useState('');
  const [loadingListings, setLoadingListings] = useState(true);

  // Moderation action modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: '', // 'ban' | 'unban' | 'deleteListing'
    targetId: null,
    loading: false
  });

  // Fetch admin stats
  useEffect(() => {
    api.get('/api/admin/stats')
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => console.error('Failed to load stats:', err));
  }, []);

  // Fetch users
  const fetchUsers = () => {
    setLoadingUsers(true);
    const query = userSearch ? `?search=${encodeURIComponent(userSearch)}` : '';
    api.get(`/api/admin/users${query}`)
      .then((res) => {
        if (res.data.success) setUsers(res.data.users || []);
      })
      .catch((err) => error('Failed to load users'))
      .finally(() => setLoadingUsers(false));
  };

  // Fetch listings
  const fetchListings = () => {
    setLoadingListings(true);
    const query = listingSearch ? `?search=${encodeURIComponent(listingSearch)}` : '';
    api.get(`/api/admin/listings${query}`)
      .then((res) => {
        if (res.data.success) setListings(res.data.listings || []);
      })
      .catch((err) => error('Failed to load listings'))
      .finally(() => setLoadingListings(false));
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'listings') fetchListings();
  }, [activeTab]);

  const triggerBanUser = (userDoc) => {
    setConfirmModal({
      isOpen: true,
      title: `Ban ${userDoc.name}?`,
      message: `Are you sure you want to suspend this user account (${userDoc.email})? They will be unable to log in or create listings.`,
      actionType: 'ban',
      targetId: userDoc._id,
      loading: false
    });
  };

  const triggerUnbanUser = (userDoc) => {
    setConfirmModal({
      isOpen: true,
      title: `Reinstate ${userDoc.name}?`,
      message: `Restore account access for ${userDoc.email}?`,
      actionType: 'unban',
      targetId: userDoc._id,
      loading: false
    });
  };

  const triggerRemoveListing = (listingDoc) => {
    setConfirmModal({
      isOpen: true,
      title: `Remove listing "${listingDoc.title}"?`,
      message: 'This book listing will be marked Removed and hidden from all campus searches.',
      actionType: 'deleteListing',
      targetId: listingDoc._id,
      loading: false
    });
  };

  const handleConfirmAction = async () => {
    setConfirmModal((prev) => ({ ...prev, loading: true }));
    const { actionType, targetId } = confirmModal;

    try {
      if (actionType === 'ban') {
        const res = await api.patch(`/api/admin/users/${targetId}/ban`);
        if (res.data.success) {
          success(res.data.message);
          fetchUsers();
        }
      } else if (actionType === 'unban') {
        const res = await api.patch(`/api/admin/users/${targetId}/unban`);
        if (res.data.success) {
          success(res.data.message);
          fetchUsers();
        }
      } else if (actionType === 'deleteListing') {
        const res = await api.delete(`/api/admin/listings/${targetId}`);
        if (res.data.success) {
          success(res.data.message);
          fetchListings();
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Moderation action failed');
    } finally {
      setConfirmModal({
        isOpen: false,
        title: '',
        message: '',
        actionType: '',
        targetId: null,
        loading: false
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
            <Shield className="w-4 h-4" />
            <span>Campus Administrator Console</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">
            Moderation & Platform Health
          </h1>
        </div>
      </div>

      {/* Stats Cards Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft">
            <p className="text-xs font-semibold text-gray-500 uppercase">Total Students</p>
            <p className="text-2xl font-extrabold text-navy-900 mt-1">{stats.totalUsers}</p>
            {stats.bannedUsers > 0 && (
              <span className="text-[11px] font-bold text-rose-600 mt-1 block">
                {stats.bannedUsers} suspended
              </span>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft">
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Listings</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.activeListings}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">{stats.totalListings} total listed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft">
            <p className="text-xs font-semibold text-gray-500 uppercase">Completed Exchanges</p>
            <p className="text-2xl font-extrabold text-brand-700 mt-1">{stats.completedRequests}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">{stats.totalRequests} requests</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft">
            <p className="text-xs font-semibold text-gray-500 uppercase">Reviews & Ratings</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.totalReviews}</p>
            <span className="text-[11px] text-gray-400 mt-1 block">Verified peer feedback</span>
          </div>
        </div>
      )}

      {/* Moderation Tabs */}
      <div className="flex border-b border-cream-200 gap-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-gray-500 hover:text-navy-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Users</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-purple-600 text-purple-800'
              : 'border-transparent text-gray-500 hover:text-navy-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manage Listings</span>
        </button>
      </div>

      {/* TAB 1: USERS TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                placeholder="Search user name, email, or college..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold"
            >
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cream-200 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {loadingUsers ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-navy-900">
                        <div>{u.name}</div>
                        <div className="text-[11px] text-gray-400 font-normal">{u.email}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{u.college}</td>
                      <td className="py-3 px-4 text-gray-600">{u.city}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.isBanned ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Banned
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== 'ADMIN' && (
                          u.isBanned ? (
                            <button
                              onClick={() => triggerUnbanUser(u)}
                              className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => triggerBanUser(u)}
                              className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs"
                            >
                              Ban Account
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No users match criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS TABLE */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                placeholder="Search listing title, author, or subject..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 bg-cream-50 text-xs text-navy-900"
              />
            </div>
            <button
              onClick={fetchListings}
              className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold"
            >
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cream-200 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {loadingListings ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      Loading listings...
                    </td>
                  </tr>
                ) : listings.length > 0 ? (
                  listings.map((l) => (
                    <tr key={l._id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-navy-900 max-w-[200px] truncate">
                        <Link to={`/book/${l._id}`} className="hover:text-brand-600 flex items-center gap-1">
                          <span className="truncate">{l.title}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{l.subject}</td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[120px]">
                        {l.owner?.name} ({l.owner?.college})
                      </td>
                      <td className="py-3 px-4 font-bold text-navy-900">
                        {l.listingType} {l.listingType === 'SELL' && `$${l.price}`}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.status === 'Available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'Reserved'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {l.status !== 'Removed' ? (
                          <button
                            onClick={() => triggerRemoveListing(l)}
                            className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Removed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No listings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Confirm Action"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        loading={confirmModal.loading}
      />
    </div>
  );
};

export default AdminDashboard;
