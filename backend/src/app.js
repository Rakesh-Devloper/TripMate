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

/*
|--------------------------------------------------------------------------
| CORS CONFIGURATION
|--------------------------------------------------------------------------
*/

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

/*
 * These are the frontends that are always allowed.
 *
 * Your current Vercel frontend:
 * https://trip-mate-oes7hf996-rakesh-frontends-projects.vercel.app
 */
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',

  'https://trip-mate-oes7hf996-rakesh-frontends-projects.vercel.app',

  ...configuredOrigins,
]);

console.log('==========================================');
console.log('TripMate CORS configuration');
console.log('Allowed origins:');
console.log([...allowedOrigins]);
console.log('==========================================');

/*
|--------------------------------------------------------------------------
| CORS MIDDLEWARE
|--------------------------------------------------------------------------
*/

const corsOptions = {
  origin(origin, callback) {
    /*
     * Requests such as Postman/server-to-server requests may not
     * contain an Origin header.
     */
    if (!origin) {
      return callback(null, true);
    }

    /*
     * Allow exact origins.
     */
    if (allowedOrigins.has(origin)) {
      console.log('CORS allowed:', origin);
      return callback(null, true);
    }

    /*
     * Allow Vercel preview deployments for TripMate.
     *
     * This makes future Vercel deployment URLs work as well,
     * provided they use the TripMate Vercel naming pattern.
     */
    if (
      origin.startsWith('https://trip-mate-') &&
      origin.endsWith('.vercel.app')
    ) {
      console.log('CORS allowed Vercel preview:', origin);
      return callback(null, true);
    }

    console.log('CORS BLOCKED:', origin);

    /*
     * Do not throw an error here.
     * Returning false prevents the CORS headers from being added,
     * while avoiding an unnecessary Express error response for
     * the browser preflight request.
     */
    return callback(null, false);
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],

  exposedHeaders: [
    'Content-Length',
  ],

  optionsSuccessStatus: 204,
};

/*
 * Apply CORS before all API routes.
 */
app.use(cors(corsOptions));

/*
|--------------------------------------------------------------------------
| BODY PARSERS
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: '2mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '2mb',
  })
);

/*
|--------------------------------------------------------------------------
| SECURITY
|--------------------------------------------------------------------------
*/

app.disable('x-powered-by');

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get('/api/health', (req, res) => {
  const databaseConnected = getDbStatus();

  return res.status(200).json({
    success: true,
    status: databaseConnected ? 'ok' : 'degraded',
    service: 'TripMate API',
    database: databaseConnected
      ? 'MongoDB Connected'
      : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/trips', tripRoutes);

app.use('/api/destinations', destinationRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/reviews', reviewRoutes);

/*
|--------------------------------------------------------------------------
| API 404 HANDLER
|--------------------------------------------------------------------------
*/

app.use('/api', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default app;