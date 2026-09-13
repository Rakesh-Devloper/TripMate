import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { getDbStatus } from './config/db.js';

const app = express();
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',').map(v => v.trim()).filter(Boolean);
const allowedOrigins = new Set(['http://localhost:5173', 'http://localhost:5174', ...configuredOrigins]);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by TripMate CORS policy.'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.get('/api/health', (req, res) => res.json({
  status: getDbStatus() ? 'ok' : 'degraded',
  service: 'TripMate API',
  database: getDbStatus() ? 'MongoDB Connected' : 'Disconnected',
  timestamp: new Date().toISOString(),
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api', (req, res) => res.status(404).json({ success:false, message:`API endpoint not found: ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

export default app;
