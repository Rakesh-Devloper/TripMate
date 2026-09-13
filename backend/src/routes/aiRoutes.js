import express from 'express';
import { generateTrip } from '../controllers/aiController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/ai/generate-trip
router.post('/generate-trip', optionalProtect, generateTrip);

export default router;
