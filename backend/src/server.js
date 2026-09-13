import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';

const PORT = Number(process.env.PORT || 5000);

try {
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ [TripMate Backend] Server startup aborted because MongoDB is unavailable.');
    process.exit(1);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [TripMate Backend] API Server listening on port ${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received: shutting down gracefully...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
} catch (error) {
  console.error('❌ [TripMate Backend] Fatal startup error:', error.message);
  process.exit(1);
}
