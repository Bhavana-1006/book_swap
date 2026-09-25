const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    try {
      const parts = authHeader.split(' ');
      if (parts.length >= 2) {
        token = parts.slice(1).join(' ').trim();
      }

      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication failed: Empty token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookswap_jwt_secure_secret_campus_platform_2026_xyz');
      const userId = decoded.id || decoded._id;

      const user = await User.findById(userId).select('-password');
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
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    try {
      const parts = authHeader.split(' ');
      if (parts.length >= 2) {
        const token = parts.slice(1).join(' ').trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookswap_jwt_secure_secret_campus_platform_2026_xyz');
        const userId = decoded.id || decoded._id;
        const user = await User.findById(userId).select('-password');
        if (user && !user.isBanned) {
          req.user = user;
        }
      }
    } catch (err) {
      // Ignore token error in optional auth
    }
  }
  next();
};

module.exports = { protect, admin, optionalAuth };
