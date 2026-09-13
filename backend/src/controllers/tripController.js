import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import generateTripCode from '../utils/generateTripCode.js';

// Pre-seeded trips matching the reference image
export const SEED_TRIPS = [
  {
    _id: 'trip-bali-7d',
    id: 'trip-bali-7d',
    tripCode: 'TM-BALI-7701',
    destination: 'Bali, Indonesia',
    destinationImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-04-12',
    endDate: '2026-04-19',
    numberOfDays: 7,
    travelers: 2,
    travelStyle: 'Adventure',
    budget: '$1,200',
    interests: ['Culture', 'Nature', 'Beaches', 'Adventure'],
    estimatedCost: 1200,
    budgetBreakdown: {
      flights: 400,
      hotel: 350,
      food: 180,
      activities: 170,
      transport: 100,
    },
    status: 'Upcoming',
    saved: true,
    tips: [
      'Best time to visit: April – June for sunny skies and fewer crowds.',
      'Rent a scooter or book Grab/Gojek with pre-negotiated daily drivers.',
      'Respect Balinese temple dress codes by wearing a sarong and sash.',
      'Keep small Rupiah currency handy for street warungs and tips.'
    ],
    mapLocations: [
      { name: 'Lovina Beach', latitude: -8.1500, longitude: 115.0270, description: 'Famous dolphin watching & black sand sunrise beaches', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=300&q=80' },
      { name: 'Munduk Waterfalls', latitude: -8.2700, longitude: 115.0600, description: 'Scenic mountain village with misty jungle waterfalls', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ubud Cultural Heart', latitude: -8.5069, longitude: 115.2625, description: 'Traditional arts, crafts, and sacred monkey forest sanctuary', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tanah Lot Temple', latitude: -8.6212, longitude: 115.0868, description: 'Ancient ocean rock temple bathed in legendary sunsets', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=300&q=80' },
      { name: 'Seminyak Coastal Hub', latitude: -8.6913, longitude: 115.1682, description: 'Vibrant beach clubs, boutique shopping, and gourmet dining', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nusa Penida Island', latitude: -8.7278, longitude: 115.5444, description: 'Dramatic coastal cliffs, Kelingking beach, and manta ray snorkeling', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=300&q=80' },
      { name: 'Uluwatu Clifftop', latitude: -8.8290, longitude: 115.0849, description: 'Perched high atop limestone cliffs with fiery Kecak dance', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80' },
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Bali',
        summary: 'Check-in • Relax • Beach Walk',
        activities: [
          { name: 'Airport Pickup & Transfer', time: '11:00 AM', location: 'Ngurah Rai Airport', cost: 25, description: 'Private luxury air-conditioned transfer directly to Seminyak hotel.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
          { name: 'Boutique Villa Check-in', time: '02:00 PM', location: 'Seminyak Villa', cost: 0, description: 'Freshen up, enjoy welcome fresh coconut drinks.', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80' },
          { name: 'Double Six Sunset Walk', time: '05:30 PM', location: 'Seminyak Beach', cost: 15, description: 'Relaxed sunset stroll along the golden sands with acoustic cafe sounds.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        dayNumber: 2,
        title: 'Ubud Exploration',
        summary: 'Monkey Forest • Rice Terraces • Artisan Markets',
        activities: [
          { name: 'Sacred Monkey Forest Sanctuary', time: '09:00 AM', location: 'Padangtegal Ubud', cost: 8, description: 'Walk through ancient mossy temples shaded by giant banyan trees.', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=400&q=80' },
          { name: 'Tegalalang Rice Terraces', time: '01:00 PM', location: 'Tegalalang', cost: 10, description: 'UNESCO heritage stepped green paddies with jungle swing photo ops.', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80' },
          { name: 'Traditional Balinese Feast', time: '06:30 PM', location: 'Bebek Bengil Ubud', cost: 25, description: 'Crispy duck dinner overlooking serene lotus ponds.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        dayNumber: 3,
        title: 'Nature & Adventure',
        summary: 'Waterfalls • Swing • Jungle Trek',
        activities: [
          { name: 'Tegenungan & Kanto Lampo Waterfalls', time: '08:30 AM', location: 'Gianyar', cost: 12, description: 'Refreshing dip in cascading natural jungle pools.', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80' },
          { name: 'Bali Jungle Swing', time: '01:30 PM', location: 'Abiansemal', cost: 35, description: 'Fly high above the forest canopy on the iconic high swing.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
          { name: 'Luak Coffee Plantation Tasting', time: '04:30 PM', location: 'Payangan', cost: 15, description: 'Sample organic roasted beans and indigenous herbal teas.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        dayNumber: 4,
        title: 'Nusa Penida',
        summary: 'Island Tour • Snorkeling • Kelingking Cliff',
        activities: [
          { name: 'Fast Speedboat Crossing', time: '07:30 AM', location: 'Sanur Port to Nusa Penida', cost: 30, description: 'Scenic 40-minute boat ride to the wild island of Nusa Penida.', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=400&q=80' },
          { name: 'Kelingking T-Rex Lookout', time: '10:30 AM', location: 'Kelingking Point', cost: 5, description: 'World-famous dinosaur-shaped ridge and turquoise waves.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
          { name: 'Manta Bay Snorkeling', time: '02:00 PM', location: 'Crystal Bay', cost: 40, description: 'Swim with majestic manta rays and vibrant tropical schools of fish.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        dayNumber: 5,
        title: 'Cultural Experience',
        summary: 'Temples • Local Markets • Cooking Class',
        activities: [
          { name: 'Ulun Danu Beratan Temple', time: '09:00 AM', location: 'Bedugul Lake', cost: 15, description: 'Serene temple seemingly floating on the misty mountain lake.', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80' },
          { name: 'Traditional Balinese Cooking School', time: '01:00 PM', location: 'Canggu Organic Farm', cost: 50, description: 'Prepare handmade sambal matah, satay lilit, and dadar gulung.', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80' },
          { name: 'Tanah Lot Sunset Ritual', time: '05:30 PM', location: 'Tanah Lot Temple', cost: 10, description: 'Breathtaking ocean sunset against ancient wave-lashed shrine.', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        dayNumber: 6,
        title: 'Beach & Sunset',
        summary: 'Seminyak • Beach Clubs • Uluwatu Fire Dance',
        activities: [
          { name: 'Padang Padang Surfing & Swim', time: '10:00 AM', location: 'Uluwatu', cost: 15, description: 'Relax at the sheltered cove made famous by Eat Pray Love.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
          { name: 'Uluwatu Clifftop Temple & Kecak', time: '05:30 PM', location: 'Uluwatu Cliff Amphitheatre', cost: 25, description: 'Mesmerizing sunset chorus chanted as the sun dips into the ocean.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
          { name: 'Jimbaran Bay Seafood Candlelit BBQ', time: '07:30 PM', location: 'Jimbaran Beach', cost: 45, description: 'Fresh grilled prawns, snapper, and calamari with toes in the sand.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        dayNumber: 7,
        title: 'Departure',
        summary: 'Last-minute Shopping • Farewell Lunch',
        activities: [
          { name: 'Seminyak Square Artisan Boutiques', time: '10:00 AM', location: 'Seminyak', cost: 30, description: 'Collect hand-carved souvenirs, organic skincare, and spices.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
          { name: 'Farewell Organic Cafe Brunch', time: '12:30 PM', location: 'Kynd Community', cost: 20, description: 'Tropical smoothie bowls, cold-pressed elixirs, and artisan toasts.', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80' },
          { name: 'VIP Airport Departure Lounge', time: '03:30 PM', location: 'Ngurah Rai Terminal', cost: 35, description: 'Comfortable check-in and boarding for the homeward journey.', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80' }
        ]
      }
    ]
  },
  {
    _id: 'trip-santorini-6d',
    id: 'trip-santorini-6d',
    tripCode: 'TM-SANT-5520',
    destination: 'Santorini, Greece',
    destinationImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-05-10',
    endDate: '2026-05-16',
    numberOfDays: 6,
    travelers: 2,
    travelStyle: 'Romantic',
    budget: '$1,800',
    interests: ['Culture', 'Photography', 'Food', 'Romance'],
    estimatedCost: 1800,
    budgetBreakdown: {
      flights: 650,
      hotel: 600,
      food: 280,
      activities: 180,
      transport: 90,
    },
    status: 'Upcoming',
    saved: true,
    tips: [
      'Book caldera-facing cliff restaurants well in advance for prime sunset tables.',
      'Wear flat, gripped sandals or walking shoes due to cobblestones and stairs.',
      'Take a catamaran cruise for the premier view of the volcanic caldera.'
    ],
    mapLocations: [
      { name: 'Oia Blue Domes', latitude: 36.4618, longitude: 25.3753, description: 'Iconic whitewashed houses, blue domes, and world-famous caldera sunset', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80' },
      { name: 'Fira Capital', latitude: 36.4166, longitude: 25.4324, description: 'Cliffside restaurants, cultural museums, and cable car to old port', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80' },
      { name: 'Red Beach', latitude: 36.3488, longitude: 25.3855, description: 'Striking volcanic red cliffs and deep blue Aegean sea', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=300&q=80' },
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Santorini & Oia Sunset',
        summary: 'Check-in • Caldera Views • Sunset Dinner',
        activities: [
          { name: 'Thira Airport Transfer to Oia', time: '12:00 PM', location: 'Oia', cost: 40, description: 'Scenic drive winding along the Aegean coastline.', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80' },
          { name: 'Oia Sunset Castle Gathering', time: '06:00 PM', location: 'Byzantine Castle Ruins', cost: 0, description: 'Witness the golden sun sinking behind the Aegean blue sea.', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80' }
        ]
      }
    ]
  }
];

let memoryTrips = [...SEED_TRIPS];

/**
 * @desc    Create a new trip (from AI or manual builder)
 * @route   POST /api/trips
 * @access  Public / Private
 */
export const createTrip = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is currently unavailable. Please verify MongoDB server status.',
      });
    }

    const { _id, id, ...rest } = req.body;
    const tripData = {
      ...rest,
      tripCode: req.body.tripCode || generateTripCode(req.body.destination || 'TRIP'),
      user: req.user?._id || null,
      saved: true,
      status: req.body.status || 'Upcoming',
    };

    const trip = await Trip.create(tripData);
    return res.status(201).json({
      success: true,
      message: 'Trip created and saved successfully in MongoDB.',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's trips
 * @route   GET /api/trips/my-trips
 * @access  Public / Private
 */
export const getMyTrips = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (mongoose.connection.readyState === 1) {
      if (!userId) return res.status(401).json({ success: false, message: 'Please sign in to view your saved trips.' });
      const trips = await Trip.find({ user: userId }).sort({ createdAt: -1 });
      return res.json({ success: true, data: trips });
    }

    return res.status(503).json({
      success: false,
      message: 'Database is currently unavailable.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single trip by ID or tripCode
 * @route   GET /api/trips/:id
 * @access  Public
 */
export const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      let trip = null;
      if (mongoose.Types.ObjectId.isValid(id)) trip = await Trip.findById(id);
      else trip = await Trip.findOne({ tripCode: id });
      if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
      if (trip.user && (!req.user || trip.user.toString() !== req.user._id.toString())) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this trip.' });
      }
      return res.json({ success: true, data: trip });
    }

    return res.status(503).json({
      success: false,
      message: 'Database is currently unavailable.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update trip
 * @route   PUT /api/trips/:id
 * @access  Public / Private
 */
export const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id, id: bodyId, ...updates } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable.',
      });
    }

    let trip = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      trip = await Trip.findById(id);
    } else {
      trip = await Trip.findOne({ tripCode: id });
    }

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    // Check ownership if trip is owned by a specific user
    if (trip.user && (!req.user || (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin'))) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You do not have permission to modify this trip.',
      });
    }

    Object.assign(trip, updates);
    const updatedTrip = await trip.save();

    return res.json({
      success: true,
      message: 'Trip updated successfully in MongoDB.',
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete trip
 * @route   DELETE /api/trips/:id
 * @access  Public / Private
 */
export const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable.',
      });
    }

    let trip = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      trip = await Trip.findById(id);
    } else {
      trip = await Trip.findOne({ tripCode: id });
    }

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    // Check ownership if trip is owned by a specific user
    if (trip.user && (!req.user || (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin'))) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You do not have permission to delete this trip.',
      });
    }

    await trip.deleteOne();

    return res.json({
      success: true,
      message: 'Trip deleted successfully from MongoDB.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle save status on trip
 * @route   PUT /api/trips/:id/save
 * @access  Public / Private
 */
export const toggleSaveTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable.',
      });
    }

    let trip = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      trip = await Trip.findById(id);
    } else {
      trip = await Trip.findOne({ tripCode: id });
    }

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    trip.saved = !trip.saved;
    await trip.save();

    return res.json({
      success: true,
      message: trip.saved ? 'Trip saved to your profile in MongoDB.' : 'Trip removed from saved trips in MongoDB.',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};
