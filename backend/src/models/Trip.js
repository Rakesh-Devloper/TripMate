import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  time: { type: String, default: 'Morning' },
  location: { type: String, default: '' },
  cost: { type: Number, default: 0 },
  image: { type: String, default: '' },
});

const dayItinerarySchema = new mongoose.Schema({
  dayNumber: { type: Number, default: 1 },
  title: { type: String, default: '' },
  summary: { type: String, default: '' },
  activities: [mongoose.Schema.Types.Mixed],
});

const mapLocationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allows guest/unauthenticated preview trips
    },
    tripCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination'],
      trim: true,
    },
    destinationImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    },
    duration: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    numberOfDays: {
      type: Number,
      default: 7,
    },
    travelers: {
      type: Number,
      default: 2,
    },
    travelStyle: {
      type: String,
      default: 'Adventure',
    },
    budget: {
      type: mongoose.Schema.Types.Mixed,
      default: '$1,200',
    },
    interests: {
      type: [String],
      default: ['Culture', 'Nature', 'Food'],
    },
    days: [mongoose.Schema.Types.Mixed],
    itinerary: [mongoose.Schema.Types.Mixed],
    estimatedCost: {
      type: Number,
      default: 1200,
    },
    budgetBreakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        flights: 400,
        hotel: 350,
        food: 200,
        activities: 150,
        transport: 100,
      },
    },
    mapLocations: [mongoose.Schema.Types.Mixed],
    tips: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: 'Upcoming',
    },
    saved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

export default Trip;
