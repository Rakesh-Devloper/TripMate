import mongoose from 'mongoose';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

/**
 * Authentication Controller for MERN Stack
 * Ensures all user registrations, logins, profile updates, and password changes
 * are directly and reliably persisted in the MongoDB database.
 */

/**
 * Helper: verify MongoDB is actively connected before running DB queries
 */
const ensureDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database connection is currently unavailable. Please check your MongoDB configuration or network access.',
    });
    return false;
  }
  return true;
};

/**
 * @desc    Register a new user in MongoDB with JWT token
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    if (!ensureDbConnected(res)) return;

    const { name, email, password, travelStyle, bio, preferredCurrency, homeAirport, profileImage } = req.body;

    // Field presence validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.',
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const normalizedEmail = email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Check for existing user in MongoDB
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Create user in MongoDB. Password is automatically hashed by User schema pre-save hook
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      profileImage: profileImage || '',
      travelStyle: travelStyle || 'Adventure',
      bio: bio || 'Passionate globetrotter & adventure seeker.',
      preferredCurrency: preferredCurrency || 'USD',
      homeAirport: homeAirport || '',
      role: 'user',
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully in MongoDB database.',
      tokenType: 'Bearer',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        travelStyle: user.travelStyle,
        bio: user.bio,
        preferredCurrency: user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
      },
      data: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        travelStyle: user.travelStyle,
        bio: user.bio,
        preferredCurrency: user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

/**
 * @desc    Authenticate user with email & password, return signed JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    if (!ensureDbConnected(res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user in MongoDB with password included for comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Signed in successfully.',
      tokenType: 'Bearer',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        travelStyle: user.travelStyle,
        bio: user.bio,
        preferredCurrency: user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
      },
      data: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        travelStyle: user.travelStyle,
        bio: user.bio,
        preferredCurrency: user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile using JWT
 * @route   GET /api/auth/me or GET /api/auth/profile
 * @access  Private (Bearer token required)
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User session not found or token expired.',
      });
    }

    return res.json({
      success: true,
      message: 'Authenticated profile retrieved successfully.',
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        travelStyle: user.travelStyle,
        bio: user.bio,
        preferredCurrency: user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
      },
      data: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role || 'user',
        travelStyle: user.travelStyle || 'Adventure',
        bio: user.bio || '',
        preferredCurrency: user.preferredCurrency || 'USD',
        homeAirport: user.homeAirport || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current authenticated user profile in MongoDB
 * @route   PUT /api/auth/profile
 * @access  Private (Bearer token required)
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    if (!ensureDbConnected(res)) return;

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Session missing.',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found in MongoDB.',
      });
    }

    const { name, bio, travelStyle, preferredCurrency, homeAirport, profileImage } = req.body;

    if (name && typeof name === 'string') user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (travelStyle) user.travelStyle = travelStyle;
    if (preferredCurrency) user.preferredCurrency = preferredCurrency;
    if (homeAirport !== undefined) user.homeAirport = homeAirport;
    if (profileImage !== undefined) user.profileImage = profileImage;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.',
        });
      }
      user.password = req.body.password; // Triggers pre-save hash
    }

    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully in MongoDB.',
      data: {
        _id: updatedUser._id,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
        travelStyle: updatedUser.travelStyle,
        bio: updatedUser.bio,
        preferredCurrency: updatedUser.preferredCurrency,
        homeAirport: updatedUser.homeAirport,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password with current password verification
 * @route   PUT /api/auth/change-password
 * @access  Private (Bearer token required)
 */
export const changePassword = async (req, res, next) => {
  try {
    if (!ensureDbConnected(res)) return;

    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current password and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found in MongoDB.',
      });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword; // Automatically hashed on save
    await user.save();

    return res.json({
      success: true,
      message: 'Password updated successfully in MongoDB.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get MERN stack database & auth diagnostics
 * @route   GET /api/auth/status
 * @access  Public
 */
export const getAuthStatus = async (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  let usersCount = 0;

  if (isMongoConnected) {
    try {
      usersCount = await User.countDocuments();
    } catch {
      usersCount = 0;
    }
  }

  res.json({
    success: true,
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    authType: 'JWT (Bearer token in Authorization header)',
    database: {
      type: 'MongoDB',
      connected: isMongoConnected,
      host: isMongoConnected ? mongoose.connection.host : 'Disconnected',
      name: isMongoConnected ? mongoose.connection.name : 'None',
      usersCount,
    },
    jwt: {
      algorithm: 'HS256',
      expiration: '30 days',
      headerFormat: 'Authorization: Bearer <token>',
    },
  });
};

/**
 * @desc    Logout user & invalidate client session
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  res.json({
    success: true,
    message: 'User logged out successfully. Client session cleared.',
  });
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAuthStatus,
  logoutUser,
};
