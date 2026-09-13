import mongoose from 'mongoose';

/**
 * MongoDB Connection Handler for MERN Stack.
 * Reads connection string securely from MONGO_URI or MONGODB_URI environment variables.
 * Sensitive credentials are never hardcoded or exposed in logs.
 */

let isConnected = false;

// Connection lifecycle event listeners
mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ [TripMate DB] MongoDB connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('🔄 [TripMate DB] MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error(`❌ [TripMate DB] MongoDB connection error: ${err.message}`);
});

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    const errorMsg = 'CRITICAL CONFIGURATION ERROR: Neither MONGO_URI nor MONGODB_URI environment variable is defined in .env.';
    console.error(`❌ [TripMate DB] ${errorMsg}`);
    isConnected = false;
    return false;
  }

  // Mask credentials for secure development/production logging
  const sanitizedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');

  try {
    const dbName = process.env.DB_NAME || 'tripmate';
    const conn = await mongoose.connect(mongoUri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log(`✅ [TripMate DB] MongoDB Connected Successfully!`);
    console.log(`   Host:     ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Target:   ${sanitizedUri}`);

    // Import models to ensure registration in Mongoose
    await import('../models/User.js');
    const { default: Destination } = await import('../models/Destination.js');
    const { default: Trip } = await import('../models/Trip.js');
    await import('../models/Review.js');

    // Auto-seed initial destinations if collection is empty
    try {
      if (Destination) {
        const count = await Destination.countDocuments();
        if (count === 0) {
          const { SEED_DESTINATIONS } = await import('../controllers/destinationController.js');
          await Destination.insertMany(
            SEED_DESTINATIONS.map(({ _id, ...rest }) => rest)
          );
          console.log(`🌱 [TripMate DB] Auto-seeded ${SEED_DESTINATIONS.length} global destinations to MongoDB.`);
        }
      }
    } catch (seedErr) {
      console.warn('Initial destination seeding note:', seedErr.message);
    }

    // Auto-seed initial sample trips if collection is empty
    try {
      if (Trip) {
        const tripCount = await Trip.countDocuments();
        if (tripCount === 0) {
          const { SEED_TRIPS } = await import('../controllers/tripController.js');
          await Trip.insertMany(
            SEED_TRIPS.map(({ _id, id, ...rest }) => rest)
          );
          console.log(`🌱 [TripMate DB] Auto-seeded ${SEED_TRIPS.length} sample trips to MongoDB.`);
        }
      }
    } catch (seedTripErr) {
      console.warn('Initial trip seeding note:', seedTripErr.message);
    }

    return true;
  } catch (error) {
    isConnected = false;
    console.error(`❌ [TripMate DB] MongoDB Connection Failed: ${error.message}`);
    console.error('   Please check that your MongoDB cluster is online, network access (0.0.0.0/0 or IP) is allowed, and credentials are valid.');
    return false;
  }
};

export const getDbStatus = () => isConnected && mongoose.connection.readyState === 1;

export default connectDB;

