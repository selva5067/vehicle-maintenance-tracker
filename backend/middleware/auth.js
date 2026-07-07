const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verifies JWT and attaches user to req
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

// Restrict to admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: admin only' });
};

module.exports = { protect, adminOnly };
