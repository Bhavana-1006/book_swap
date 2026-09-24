const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');
const Request = require('../models/Request');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'bookswap_jwt_secure_secret_campus_platform_2026_xyz',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, college, city } = req.body;

    // Validation
    if (!name || !email || !password || !college || !city) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    let profileImage = '';
    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    // First registered user can optionally be an ADMIN if no other admin exists
    const existingUsersCount = await User.countDocuments();
    const role = existingUsersCount === 0 ? 'ADMIN' : 'USER';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      college: college.trim(),
      city: city.trim(),
      profileImage,
      role
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        city: user.city,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'This account has been suspended by administration' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        city: user.city,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user profile with stats
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compute user activity stats
    const listingsCount = await Book.countDocuments({ owner: user._id, status: { $ne: 'Removed' } });
    const completedExchangesCount = await Request.countDocuments({
      $or: [{ requester: user._id }, { owner: user._id }],
      status: 'completed'
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        city: user.city,
        profileImage: user.profileImage,
        role: user.role,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
        listingsCount,
        completedExchangesCount
      }
    });
  } catch (error) {
    console.error('[Auth Me Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, college, city } = req.body;
    if (name) user.name = name.trim();
    if (college) user.college = college.trim();
    if (city) user.city = city.trim();

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        city: user.city,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

module.exports = { register, login, getMe, updateProfile };
