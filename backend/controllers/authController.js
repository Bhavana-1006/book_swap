const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Book = require('../models/Book');
const Request = require('../models/Request');
const sendEmail = require('../utils/sendEmail');
const { validatePasswordCriteria } = require('../utils/validatePassword');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign(
    { id: id.toString() },
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

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // Validate strict password criteria
    const passwordValidation = validatePasswordCriteria(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ success: false, message: passwordValidation.message });
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
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
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

// @desc    Forgot Password - Request reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond with generic confirmation to prevent user enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Get reset token and save hashed version in DB
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Determine client base URL
    const clientUrl = (process.env.CLIENT_URL || 'https://book-swap-angirekulabhavana-4085.vercel.app').replace(/\/+$/, '');
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `
Hello ${user.name},

You requested to reset your password on BookSwap.
Please click the link below to set a new password. This link is valid for 15 minutes:

${resetUrl}

If you did not request this, please ignore this email and your password will remain unchanged.

Best regards,
The BookSwap Campus Team
    `;

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #0f172a; margin: 0;">Book<span style="color: #d97706;">Swap</span></h2>
    <p style="color: #64748b; font-size: 14px;">Campus Book Exchange & Marketplace</p>
  </div>
  <p style="color: #334155; font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
  <p style="color: #475569; font-size: 15px; line-height: 1.5;">You requested to reset your password. Click the button below to choose a new password. This link expires in <strong>15 minutes</strong>.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="${resetUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 15px; display: inline-block;">Reset Password</a>
  </div>
  <p style="color: #64748b; font-size: 13px;">Or copy and paste this URL into your browser:</p>
  <p style="color: #2563eb; font-size: 12px; word-break: break-all;">${resetUrl}</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't request a password reset, you can safely ignore this email.</p>
</div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'BookSwap - Password Reset Request',
        message,
        html
      });
    } catch (emailErr) {
      console.warn('[Email Warning]: Could not send email. Reset token is safely stored in DB.');
    }

    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Server error while processing reset request' });
  }
};

// @desc    Reset Password using token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { resetToken } = req.params;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Validate strict password criteria
    const passwordValidation = validatePasswordCriteria(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ success: false, message: passwordValidation.message });
    }

    // Hash the token from URL to match database hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You are now logged in.',
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
    console.error('[Reset Password Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error during password reset' });
  }
};

// @desc    Change password while logged in
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    const passwordValidation = validatePasswordCriteria(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ success: false, message: passwordValidation.message });
    }

    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('[Change Password Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
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

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile
};
