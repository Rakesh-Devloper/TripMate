import express from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(optionalProtect, createReview);

export default router;
