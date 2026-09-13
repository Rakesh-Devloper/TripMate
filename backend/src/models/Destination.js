import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    region: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    price: {
      type: Number,
      required: true,
      default: 1200,
    },
    duration: {
      type: String,
      default: '7 days',
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    bestTimeToVisit: {
      type: String,
      default: 'April - October',
    },
    weather: {
      type: String,
      default: '27°C Sunny & Tropical',
    },
    popularAttractions: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'Cultural',
    },
    tags: {
      type: [String],
      default: [],
    },
    averageBudget: {
      type: Number,
      default: 1200,
    },
    travelTips: {
      type: [String],
      default: [],
    },
    mapCoordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

export default Destination;
