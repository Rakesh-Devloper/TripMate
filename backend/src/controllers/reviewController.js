import mongoose from 'mongoose';
import Review from '../models/Review.js';

// Pre-seeded testimonials from the reference image
const SEED_REVIEWS = [
  {
    userName: 'Sarah Johnson',
    userRole: 'Solo Traveler',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'TripMate made my Bali trip absolutely amazing! The AI itinerary was perfect and saved me so much time.',
    destination: 'Bali, Indonesia',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    userName: 'Michael Chen',
    userRole: 'Digital Nomad',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: "Best travel planner I've ever used. The recommendations were spot on and the UI is beautiful!",
    destination: 'Tokyo, Japan',
    createdAt: '2026-02-28T14:30:00.000Z',
  },
  {
    userName: 'Emily Rodriguez',
    userRole: 'Adventure Seeker',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Incredible experience! Found hidden gems I would have never discovered. Highly recommended!',
    destination: 'Switzerland, Europe',
    createdAt: '2026-02-20T09:15:00.000Z',
  },
];

let memoryReviews = [...SEED_REVIEWS.map((r, i) => ({ ...r, _id: `rev-${i + 1}`, id: `rev-${i + 1}` }))];

/**
 * @desc    Get all reviews / testimonials
 * @route   GET /api/reviews
 * @access  Public
 */
export const getReviews = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        let reviews = await Review.find().sort({ createdAt: -1 });
        if (reviews.length === 0) {
          await Review.insertMany(SEED_REVIEWS).catch(() => {});
          reviews = await Review.find().sort({ createdAt: -1 });
        }
        if (reviews && reviews.length > 0) {
          return res.json({
            success: true,
            count: reviews.length,
            data: reviews,
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB getReviews fallback:', dbErr.message);
      }
    }

    res.json({
      success: true,
      count: memoryReviews.length,
      data: memoryReviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit new testimonial / review
 * @route   POST /api/reviews
 * @access  Public
 */
export const createReview = async (req, res, next) => {
  try {
    const { userName, userRole, rating, comment, destination } = req.body;
    if (!userName || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name and comment' });
    }

    const reviewPayload = {
      user: req.user?._id || null,
      userName: userName.trim(),
      userRole: userRole || (req.user ? req.user.travelStyle : 'Traveler'),
      userAvatar:
        req.user?.profileImage ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: Number(rating) || 5,
      comment: comment.trim(),
      destination: destination || 'Global Explorer',
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const newReview = await Review.create(reviewPayload);
        return res.status(201).json({
          success: true,
          message: 'Thank you for your feedback! Review saved to MongoDB.',
          data: newReview,
        });
      } catch (dbErr) {
        console.warn('MongoDB createReview fallback:', dbErr.message);
      }
    }

    const newRev = {
      _id: `rev-${Date.now()}`,
      id: `rev-${Date.now()}`,
      ...reviewPayload,
      createdAt: new Date().toISOString(),
    };

    memoryReviews.unshift(newRev);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      data: newRev,
    });
  } catch (error) {
    next(error);
  }
};
