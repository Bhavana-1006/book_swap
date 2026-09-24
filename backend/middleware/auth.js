const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookswap_jwt_secure_secret_campus_platform_2026_xyz');

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User account no longer exists' });
      }

      if (user.isBanned) {
        return res.status(403).json({ success: false, message: 'Your account has been suspended by administration' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Authentication failed: Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookswap_jwt_secure_secret_campus_platform_2026_xyz');
      const user = await User.findById(decoded.id).select('-password');
      if (user && !user.isBanned) {
        req.user = user;
      }
    } catch (err) {
      // Ignore token error in optional auth
    }
  }
  next();
};

module.exports = { protect, admin, optionalAuth };
