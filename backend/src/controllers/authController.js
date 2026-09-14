import mongoose from "mongoose";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * =========================================================
 * DATABASE CONNECTION CHECK
 * =========================================================
 */
const ensureDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message:
        "Database connection is currently unavailable.",
    });

    return false;
  }

  return true;
};

/**
 * =========================================================
 * REGISTER USER
 * =========================================================
 *
 * POST /api/auth/register
 */
export const registerUser = async (req, res, next) => {
  try {
    if (!ensureDbConnected(res)) return;

    const {
      name,
      email,
      password,
      travelStyle,
      bio,
      preferredCurrency,
      homeAirport,
      profileImage,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, and password.",
      });
    }

    // Validate name
    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name must be at least 2 characters long.",
      });
    }

    // Validate password
    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    // Validate email
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const normalizedEmail =
      email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email address already exists. Please log in instead.",
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,

      profileImage: profileImage || "",

      travelStyle:
        travelStyle || "Adventure",

      bio:
        bio ||
        "Passionate globetrotter & adventure seeker.",

      preferredCurrency:
        preferredCurrency || "USD",

      homeAirport:
        homeAirport || "",

      role: "user",
    });

    // Generate JWT using user ID
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully.",

      tokenType: "Bearer",

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
        preferredCurrency:
          user.preferredCurrency,
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
        preferredCurrency:
          user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email address already exists. Please log in instead.",
      });
    }

    if (error.name === "ValidationError") {
      const messages =
        Object.values(error.errors).map(
          (e) => e.message
        );

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    next(error);
  }
};

/**
 * =========================================================
 * LOGIN USER
 * =========================================================
 *
 * POST /api/auth/login
 */
export const loginUser = async (
  req,
  res,
  next
) => {
  try {
    if (!ensureDbConnected(res)) return;

    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide both email and password.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Check password
    const passwordMatches =
      await user.matchPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,

      message:
        "Signed in successfully.",

      tokenType: "Bearer",

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
        preferredCurrency:
          user.preferredCurrency,
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
        preferredCurrency:
          user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    next(error);
  }
};

/**
 * =========================================================
 * GET CURRENT USER
 * =========================================================
 *
 * GET /api/auth/me
 */
export const getUserProfile = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized: User session not found or token expired.",
      });
    }

    const user = req.user;

    return res.status(200).json({
      success: true,

      message:
        "Authenticated profile retrieved successfully.",

      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        travelStyle: user.travelStyle,
        bio: user.bio,
        preferredCurrency:
          user.preferredCurrency,
        homeAirport: user.homeAirport,
        createdAt: user.createdAt,
      },

      data: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role || "user",
        travelStyle:
          user.travelStyle || "Adventure",
        bio: user.bio || "",
        preferredCurrency:
          user.preferredCurrency || "USD",
        homeAirport:
          user.homeAirport || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "GET USER ERROR:",
      error
    );

    next(error);
  }
};

/**
 * =========================================================
 * UPDATE PROFILE
 * =========================================================
 *
 * PUT /api/auth/profile
 */
export const updateUserProfile = async (
  req,
  res,
  next
) => {
  try {
    if (!ensureDbConnected(res)) return;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized: Session missing.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account not found in MongoDB.",
      });
    }

    const {
      name,
      bio,
      travelStyle,
      preferredCurrency,
      homeAirport,
      profileImage,
    } = req.body;

    if (
      name !== undefined &&
      typeof name === "string"
    ) {
      user.name = name.trim();
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (travelStyle) {
      user.travelStyle = travelStyle;
    }

    if (preferredCurrency) {
      user.preferredCurrency =
        preferredCurrency;
    }

    if (homeAirport !== undefined) {
      user.homeAirport = homeAirport;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters long.",
        });
      }

      user.password = req.body.password;
    }

    const updatedUser =
      await user.save();

    return res.status(200).json({
      success: true,

      message:
        "Profile updated successfully.",

      data: {
        _id: updatedUser._id,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage:
          updatedUser.profileImage,
        role: updatedUser.role,
        travelStyle:
          updatedUser.travelStyle,
        bio: updatedUser.bio,
        preferredCurrency:
          updatedUser.preferredCurrency,
        homeAirport:
          updatedUser.homeAirport,
        createdAt:
          updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    next(error);
  }
};

/**
 * =========================================================
 * CHANGE PASSWORD
 * =========================================================
 *
 * PUT /api/auth/change-password
 */
export const changePassword = async (
  req,
  res,
  next
) => {
  try {
    if (!ensureDbConnected(res)) return;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Not authorized: Session missing.",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide both current password and new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters long.",
      });
    }

    const user =
      await User.findById(userId).select(
        "+password"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account not found in MongoDB.",
      });
    }

    const isMatch =
      await user.matchPassword(
        currentPassword
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password does not match.",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password updated successfully.",
    });
  } catch (error) {
    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    next(error);
  }
};

/**
 * =========================================================
 * AUTH STATUS
 * =========================================================
 *
 * GET /api/auth/status
 */
export const getAuthStatus = async (
  req,
  res
) => {
  const isMongoConnected =
    mongoose.connection.readyState === 1;

  let usersCount = 0;

  if (isMongoConnected) {
    try {
      usersCount =
        await User.countDocuments();
    } catch {
      usersCount = 0;
    }
  }

  return res.status(200).json({
    success: true,

    stack:
      "MERN (MongoDB, Express, React, Node.js)",

    authType:
      "JWT (Bearer token in Authorization header)",

    database: {
      type: "MongoDB",

      connected:
        isMongoConnected,

      host: isMongoConnected
        ? mongoose.connection.host
        : "Disconnected",

      name: isMongoConnected
        ? mongoose.connection.name
        : "None",

      usersCount,
    },

    jwt: {
      algorithm: "HS256",

      expiration:
        process.env.JWT_EXPIRE || "7 days",

      headerFormat:
        "Authorization: Bearer <token>",
    },
  });
};

/**
 * =========================================================
 * LOGOUT
 * =========================================================
 *
 * POST /api/auth/logout
 */
export const logoutUser = async (
  req,
  res
) => {
  return res.status(200).json({
    success: true,
    message:
      "User logged out successfully. Client session cleared.",
  });
};

/**
 * =========================================================
 * DEFAULT EXPORT
 * =========================================================
 */
export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAuthStatus,
  logoutUser,
};