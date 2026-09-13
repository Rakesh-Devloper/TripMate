import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

/**
 * Middleware to protect routes that require authentication.
 * Verifies JWT token and resolves user document directly from MongoDB.
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided.',
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token || token === 'undefined' || token === 'null' || token.split('.').length !== 3) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid token format.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ [TripMate Auth] CRITICAL: JWT_SECRET environment variable is not defined.');
      return res.status(500).json({
        success: false,
        message: 'Authentication configuration error on server.',
      });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid token payload.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is temporarily unavailable. Please try again.',
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User account no longer exists in MongoDB.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Authentication token verification failed.',
    });
  }
};

/**
 * Optional authentication: decodes JWT if token is provided,
 * but allows the request to continue as guest if not.
 */
export const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token && token !== 'undefined' && token !== 'null' && token.split('.').length === 3) {
      try {
        const secret = process.env.JWT_SECRET;
        if (secret) {
          const decoded = jwt.verify(token, secret);
          if (decoded?.id && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(decoded.id)) {
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
              req.user = user;
            }
          }
        }
      } catch {
        // Optional auth: continue as unauthenticated guest
        req.user = null;
      }
    }
  }
  next();
};

/**
 * Middleware to restrict access to admin users
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required.',
    });
  }
};

export default { protect, optionalProtect, admin };

