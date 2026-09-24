const User = require('../models/User');
const Book = require('../models/Book');
const Request = require('../models/Request');
const Review = require('../models/Review');

// @desc    Get system-wide stats for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalListings = await Book.countDocuments();
    const activeListings = await Book.countDocuments({ status: 'Available' });
    const exchangedListings = await Book.countDocuments({ status: 'Exchanged' });
    const totalRequests = await Request.countDocuments();
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    const totalReviews = await Review.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        bannedUsers,
        totalListings,
        activeListings,
        exchangedListings,
        totalRequests,
        completedRequests,
        totalReviews
      }
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving admin stats' });
  }
};

// @desc    Get all users (with search and pagination)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ name: reg }, { email: reg }, { college: reg }, { city: reg }];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      users
    });
  } catch (error) {
    console.error('[Admin Get Users Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving users' });
  }
};

// @desc    Get all listings across all users
// @route   GET /api/admin/listings
// @access  Private/Admin
const getAllListings = async (req, res) => {
  try {
    const { search, status, listingType, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const reg = new RegExp(search.trim(), 'i');
      query.$or = [{ title: reg }, { author: reg }, { subject: reg }, { isbn: reg }];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (listingType && listingType !== 'All') {
      query.listingType = listingType;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Book.countDocuments(query);
    const listings = await Book.find(query)
      .populate('owner', 'name email college city profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: listings.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      listings
    });
  } catch (error) {
    console.error('[Admin Get Listings Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error retrieving listings' });
  }
};

// @desc    Ban user
// @route   PATCH /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ success: false, message: 'Cannot ban an Administrator account' });
    }

    user.isBanned = true;
    await user.save();

    console.log(`[Admin Moderation] User ${user.email} (${user._id}) banned by admin ${req.user.email}`);

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been banned`,
      user
    });
  } catch (error) {
    console.error('[Admin Ban User Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error banning user' });
  }
};

// @desc    Unban user
// @route   PATCH /api/admin/users/:id/unban
// @access  Private/Admin
const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBanned = false;
    await user.save();

    console.log(`[Admin Moderation] User ${user.email} (${user._id}) unbanned by admin ${req.user.email}`);

    return res.status(200).json({
      success: true,
      message: `User ${user.name} has been reinstated`,
      user
    });
  } catch (error) {
    console.error('[Admin Unban User Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error unbanning user' });
  }
};

// @desc    Remove/delete inappropriate listing (Admin moderation)
// @route   DELETE /api/admin/listings/:id
// @access  Private/Admin
const removeListing = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book listing not found' });
    }

    book.status = 'Removed';
    await book.save();

    console.log(`[Admin Moderation] Listing "${book.title}" (${book._id}) removed by admin ${req.user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Listing removed successfully by administrator'
    });
  } catch (error) {
    console.error('[Admin Remove Listing Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error removing listing' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllListings,
  banUser,
  unbanUser,
  removeListing
};
