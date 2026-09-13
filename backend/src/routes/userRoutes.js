import express from 'express';
import { getUserDashboardStats } from '../controllers/userController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard-stats', optionalProtect, getUserDashboardStats);

export default router;
