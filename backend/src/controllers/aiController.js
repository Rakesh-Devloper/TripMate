import aiService from '../services/aiService.js';
import Trip from '../models/Trip.js';
import generateTripCode from '../utils/generateTripCode.js';

/**
 * @desc    Generate a custom AI travel itinerary
 * @route   POST /api/ai/generate-trip
 * @access  Public
 */
export const generateTrip = async (req, res, next) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      travelers = 2,
      travelStyle = 'Adventure',
      budget = '$1,200',
      interests = ['Culture', 'Nature', 'Food'],
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a destination to plan your trip.',
      });
    }

    console.log(`🤖 Generating AI Trip for: ${destination} (${travelStyle}, ${travelers} travelers)`);

    // Call the modular AI Service
    const aiGeneratedTrip = await aiService.generateTripItinerary({
      destination,
      startDate,
      endDate,
      travelers: Number(travelers) || 2,
      travelStyle,
      budget,
      interests,
    });

    const tripCode = generateTripCode(destination);
    const tripId = `trip-${Date.now()}`;
    const totalDays = aiGeneratedTrip.numberOfDays || 7;

    const daysFormatted = (aiGeneratedTrip.itinerary || []).map((item, idx) => ({
      day: item.dayNumber || (idx + 1),
      title: item.title,
      summary: item.summary,
      activities: (item.activities || []).map((act) => ({
        time: act.time || '10:00 AM',
        title: act.name || act.title,
        location: act.location,
        cost: typeof act.cost === 'number' ? `$${act.cost}` : (act.cost || '$0'),
        notes: act.description || act.notes || '',
        image: act.image || '',
      })),
      stay: item.stay || 'Boutique Resort ($95/night)',
    }));

    const budgetTotal = aiGeneratedTrip.estimatedCost || 1200;
    const breakdownFormatted = {
      flights: aiGeneratedTrip.budgetBreakdown?.flights || 400,
      accommodation: aiGeneratedTrip.budgetBreakdown?.hotel || 350,
      food: aiGeneratedTrip.budgetBreakdown?.food || 200,
      activities: aiGeneratedTrip.budgetBreakdown?.activities || 150,
      transportation: aiGeneratedTrip.budgetBreakdown?.transport || 100,
    };

    // Construct full trip model object for database persistence
    const tripDocData = {
      user: req.user?._id || null,
      tripCode,
      title: `${totalDays} Days Adventure in ${aiGeneratedTrip.destination || destination}`,
      destination: aiGeneratedTrip.destination || destination,
      destinationImage:
        aiGeneratedTrip.mapLocations?.[0]?.image ||
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '',
      duration: `${totalDays} Days / ${Math.max(1, totalDays - 1)} Nights`,
      numberOfDays: totalDays,
      travelers: Number(travelers) || 2,
      travelStyle,
      budget: {
        total: budgetTotal,
        currency: 'USD',
        breakdown: breakdownFormatted,
      },
      interests: Array.isArray(interests) ? interests : [interests],
      estimatedCost: budgetTotal,
      budgetBreakdown: aiGeneratedTrip.budgetBreakdown || breakdownFormatted,
      mapLocations: aiGeneratedTrip.mapLocations || [],
      tips: aiGeneratedTrip.travelTips || [
        'Pack light comfortable clothing and temple-appropriate attire.',
        'Keep emergency numbers and travel insurance details stored offline.',
        'Taste authentic local street dishes at bustling evening night markets.',
      ],
      days: daysFormatted,
      itinerary: aiGeneratedTrip.itinerary || [],
      status: 'Upcoming',
      saved: true,
    };

    let completeTrip;

    if (req.user?._id) {
      const createdTrip = await Trip.create(tripDocData);
      completeTrip = createdTrip.toObject();
      completeTrip.id = completeTrip._id.toString();
    } else {
      completeTrip = {
        ...tripDocData,
        id: tripId,
        _id: tripId,
        user: null,
        createdAt: new Date().toISOString(),
      };
    }

    res.status(200).json({
      success: true,
      message: 'AI Trip Itinerary generated successfully',
      trip: completeTrip,
    });
  } catch (error) {
    console.error('Error generating AI trip:', error);
    next(error);
  }
};

export default {
  generateTrip,
};
