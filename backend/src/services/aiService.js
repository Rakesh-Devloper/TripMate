import { GoogleGenAI } from '@google/genai';

/**
 * AI Service for TripMate
 * Uses Google Gemini (gemini-3.8-flash) via @google/genai
 * with intelligent fallback handling and robust JSON schema parsing.
 */

// Fallback high-quality curated data for instant reliable responses
const DESTINATION_PRESETS = {
  bali: {
    destination: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    mapLocations: [
      { name: 'Lovina Beach', latitude: -8.1500, longitude: 115.0270, description: 'Famous dolphin watching & black sand beaches', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=300&q=80' },
      { name: 'Munduk Waterfalls', latitude: -8.2700, longitude: 115.0600, description: 'Scenic mountain village with misty jungle waterfalls', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=300&q=80' },
      { name: 'Ubud Cultural Heart', latitude: -8.5069, longitude: 115.2625, description: 'Traditional arts, crafts, and famous sacred monkey forest', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=300&q=80' },
      { name: 'Tanah Lot Temple', latitude: -8.6212, longitude: 115.0868, description: 'Ancient ocean rock temple bathed in legendary sunsets', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=300&q=80' },
      { name: 'Seminyak Coastal Hub', latitude: -8.6913, longitude: 115.1682, description: 'Vibrant beach clubs, boutique shopping, and gourmet dining', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Nusa Penida Island', latitude: -8.7278, longitude: 115.5444, description: 'Dramatic coastal cliffs, Kelingking beach, and manta ray snorkeling', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=300&q=80' },
      { name: 'Uluwatu Clifftop', latitude: -8.8290, longitude: 115.0849, description: 'Perched high atop limestone cliffs with fiery Kecak dance', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  santorini: {
    destination: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    mapLocations: [
      { name: 'Oia Village', latitude: 36.4618, longitude: 25.3753, description: 'Iconic whitewashed houses, blue domes, and world-famous caldera sunset', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80' },
      { name: 'Fira Capital', latitude: 36.4166, longitude: 25.4324, description: 'Cliffside restaurants, cultural museums, and cable car to old port', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80' },
      { name: 'Red Beach Akrotiri', latitude: 36.3488, longitude: 25.3855, description: 'Striking volcanic red cliffs and deep blue Aegean sea', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  tokyo: {
    destination: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    mapLocations: [
      { name: 'Shibuya Crossing', latitude: 35.6595, longitude: 139.7004, description: 'Electric neon lights and the world’s busiest pedestrian intersection', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80' },
      { name: 'Senso-ji Asakusa', latitude: 35.7148, longitude: 139.7967, description: 'Tokyo’s oldest Buddhist temple surrounded by historic market stalls', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80' },
      { name: 'Shinjuku Gyoen', latitude: 35.6852, longitude: 139.7100, description: 'Serene Japanese gardens juxtaposed against soaring skyscrapers', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  switzerland: {
    destination: 'Switzerland, Europe',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    mapLocations: [
      { name: 'Zermatt & Matterhorn', latitude: 45.9763, longitude: 7.7491, description: 'Alpine wonderland with majestic views of the jagged Matterhorn', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=300&q=80' },
      { name: 'Interlaken & Jungfrau', latitude: 46.6863, longitude: 7.8632, description: 'Adventure capital flanked by Lake Thun and Lake Brienz', image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=300&q=80' },
      { name: 'Lucerne Chapel Bridge', latitude: 47.0502, longitude: 8.3093, description: 'Medieval covered wooden bridge and peaceful glacial lake', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=300&q=80' },
    ]
  }
};

/**
 * Builds fallback itinerary when AI is offline or key is not provided
 */
function buildFallbackItinerary(params) {
  const {
    destination = 'Bali',
    travelers = 2,
    travelStyle = 'Adventure',
    numberOfDays = 7,
    interests = ['Culture', 'Nature', 'Food']
  } = params;

  const destLower = destination.toLowerCase();
  let matchedPreset = DESTINATION_PRESETS.bali;

  if (destLower.includes('santorini') || destLower.includes('greece')) {
    matchedPreset = DESTINATION_PRESETS.santorini;
  } else if (destLower.includes('tokyo') || destLower.includes('japan')) {
    matchedPreset = DESTINATION_PRESETS.tokyo;
  } else if (destLower.includes('swiss') || destLower.includes('switzerland') || destLower.includes('alps')) {
    matchedPreset = DESTINATION_PRESETS.switzerland;
  }

  const days = Math.min(Math.max(parseInt(numberOfDays, 10) || 7, 3), 14);
  const activitiesByDay = [
    {
      title: `Arrival & Settling in ${destination}`,
      summary: 'Check-in, relax after travel, and enjoy an evening sunset walk.',
      activities: [
        { name: 'Airport Welcome & Private Transfer', time: '10:00 AM', location: `${destination} Airport`, description: 'Comfortable transfer to your boutique resort with refreshments.', cost: 45, image: matchedPreset.image },
        { name: 'Boutique Hotel Check-in & Unwind', time: '02:00 PM', location: 'City Center', description: 'Freshen up and enjoy complimentary welcome drinks poolside.', cost: 0, image: matchedPreset.image },
        { name: 'Sunset Welcome Dinner', time: '06:30 PM', location: 'Oceanview Promenade', description: 'Authentic local cuisine accompanied by acoustic melodies.', cost: 60, image: matchedPreset.image }
      ]
    },
    {
      title: 'Iconic Landmarks & Cultural Highlights',
      summary: 'Explore historic shrines, lively artisan markets, and local architecture.',
      activities: [
        { name: 'Heritage Cultural Exploration', time: '09:00 AM', location: 'Old Town Heritage Quarter', description: 'Guided walking tour through ancient streets and architectural gems.', cost: 35, image: matchedPreset.image },
        { name: 'Artisans Market & Crafts', time: '01:30 PM', location: 'Traditional Crafts Bazaar', description: 'Discover handcrafted jewelry, handwoven textiles, and local spices.', cost: 25, image: matchedPreset.image },
        { name: 'Scenic Lookout & Photography', time: '05:00 PM', location: 'Panoramic Valley Viewpoint', description: 'Capture panoramic golden hour photos across the horizon.', cost: 15, image: matchedPreset.image }
      ]
    },
    {
      title: `${travelStyle} Nature & Outdoor Expedition`,
      summary: 'Immerse yourself in breathtaking landscapes, waterways, and scenic hiking trails.',
      activities: [
        { name: 'Morning Nature Trail & Waterfalls', time: '08:30 AM', location: 'Emerald Nature Reserve', description: 'Misty jungle walk leading to secluded plunge pools.', cost: 40, image: matchedPreset.image },
        { name: 'Organic Farm-to-Table Lunch', time: '12:30 PM', location: 'Valley Eco-Cafe', description: 'Freshly harvested herbs, tropical fruits, and traditional recipes.', cost: 30, image: matchedPreset.image },
        { name: 'Sunset Relaxation & Spa', time: '05:30 PM', location: 'Balinese Herbal Spa', description: 'Soothing massage and traditional herbal reflexology session.', cost: 50, image: matchedPreset.image }
      ]
    },
    {
      title: 'Island Tour & Coastal Adventure',
      summary: 'Discover hidden beaches, limestone coves, and crystal turquoise waters.',
      activities: [
        { name: 'High-Speed Ferry / Coastal Boat Tour', time: '08:00 AM', location: 'Harbor Pier', description: 'Cruise across sparkling waters with opportunities for marine sightings.', cost: 75, image: matchedPreset.image },
        { name: 'Snorkeling at Coral Reefs', time: '11:00 AM', location: 'Crystal Bay', description: 'Swim alongside vibrant marine life, sea turtles, and coral gardens.', cost: 55, image: matchedPreset.image },
        { name: 'Clifftop Lookout Walk', time: '04:00 PM', location: 'Dramatic Ocean Cliffs', description: 'Spectacular cliff viewpoints overlooking crashing ocean waves.', cost: 20, image: matchedPreset.image }
      ]
    },
    {
      title: 'Culinary Masterclass & Local Living',
      summary: 'Connect with local chefs and experience authentic gastronomic traditions.',
      activities: [
        { name: 'Morning Produce Market Tour', time: '08:30 AM', location: 'Central Farmers Market', description: 'Hand-pick exotic herbs, fresh spices, and seasonal ingredients.', cost: 20, image: matchedPreset.image },
        { name: 'Traditional Culinary Masterclass', time: '10:30 AM', location: 'Open-Air Cooking Pavilion', description: 'Learn the secret spice pastes and multi-course national dishes.', cost: 65, image: matchedPreset.image },
        { name: 'Evening Acoustic Lounge & Tasting', time: '07:00 PM', location: 'Rooftop Lounge', description: 'Sample craft cocktails and signature desserts with skyline views.', cost: 45, image: matchedPreset.image }
      ]
    },
    {
      title: 'Hidden Gems & Golden Beach Sunset',
      summary: 'Leisurely exploration of tranquil villages and beachside celebration.',
      activities: [
        { name: 'Hidden Coastal Lagoon Kayak', time: '09:30 AM', location: 'Secret Lagoon Cove', description: 'Paddle through serene mangroves and private sandy shores.', cost: 45, image: matchedPreset.image },
        { name: 'Boutique Shopping & Cafe Hopping', time: '02:00 PM', location: 'Boutique Avenue', description: 'Explore bespoke lifestyle stores and specialty pour-over coffee.', cost: 25, image: matchedPreset.image },
        { name: 'Celebration Sunset Beach Club', time: '06:00 PM', location: 'Ocean Sunset Club', description: 'Toast an incredible week of adventure while the sun sinks into the sea.', cost: 80, image: matchedPreset.image }
      ]
    },
    {
      title: 'Farewell & Departure',
      summary: 'Final souvenir shopping, relaxation, and airport departure transfer.',
      activities: [
        { name: 'Leisurely Sunrise Walk & Coffee', time: '08:00 AM', location: 'Resort Beach Boardwalk', description: 'One last tranquil morning strolling along the gentle shoreline.', cost: 10, image: matchedPreset.image },
        { name: 'Last-Minute Souvenirs & Treats', time: '11:00 AM', location: 'Artisan Village', description: 'Pick up handmade crafts, local coffee beans, and gifts for loved ones.', cost: 30, image: matchedPreset.image },
        { name: 'Airport Transfer & Departure', time: '02:30 PM', location: `${destination} International Terminal`, description: 'Smooth private transfer back to the airport for your flight home.', cost: 40, image: matchedPreset.image }
      ]
    }
  ];

  const itinerary = [];
  for (let i = 0; i < days; i++) {
    const template = activitiesByDay[i % activitiesByDay.length];
    itinerary.push({
      dayNumber: i + 1,
      title: `Day ${i + 1}: ${template.title}`,
      summary: template.summary,
      activities: template.activities
    });
  }

  const baseCost = 350 + (days * 125);
  const estimatedCost = Math.round(baseCost * (travelers > 1 ? 1 + (travelers - 1) * 0.75 : 1));

  return {
    destination: destination.charAt(0).toUpperCase() + destination.slice(1),
    numberOfDays: days,
    estimatedCost,
    budgetBreakdown: {
      flights: Math.round(estimatedCost * 0.35),
      hotel: Math.round(estimatedCost * 0.30),
      food: Math.round(estimatedCost * 0.15),
      activities: Math.round(estimatedCost * 0.12),
      transport: Math.round(estimatedCost * 0.08),
    },
    travelTips: [
      'Pack breathable lightweight clothing and comfortable walking shoes.',
      'Always carry a reusable water bottle and reef-safe sunscreen.',
      'Download offline Google Maps and a local currency converter app.',
      'Keep small cash denominations handy for local markets and tips.',
      'Respect local cultural customs when visiting sacred shrines or temples.'
    ],
    mapLocations: matchedPreset.mapLocations,
    itinerary
  };
}

/**
 * Generate Trip Itinerary with Gemini API or Fallback
 */
export async function generateTripItinerary(params) {
  const {
    destination,
    startDate,
    endDate,
    travelers = 2,
    travelStyle = 'Adventure',
    budget = '$1,200',
    interests = ['Culture', 'Nature', 'Food']
  } = params;

  let days = 7;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0 && diffDays <= 14) {
      days = diffDays;
    }
  }

  // Check if GEMINI_API_KEY is available in the environment
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are TripMate's elite AI Travel Planner. Generate an extraordinary, production-ready, day-by-day travel itinerary in pure JSON.
Destination: ${destination}
Number of days: ${days}
Travelers: ${travelers}
Travel Style: ${travelStyle}
Target Budget: ${budget}
Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}

STRICT JSON FORMAT SCHEMA REQUIRED:
{
  "destination": "${destination}",
  "numberOfDays": ${days},
  "estimatedCost": 1200,
  "budgetBreakdown": {
    "flights": 400,
    "hotel": 350,
    "food": 200,
    "activities": 150,
    "transport": 100
  },
  "travelTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3",
    "Tip 4"
  ],
  "mapLocations": [
    {
      "name": "Location Name",
      "latitude": -8.5069,
      "longitude": 115.2625,
      "description": "Short 1-sentence highlight",
      "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80"
    }
  ],
  "itinerary": [
    {
      "dayNumber": 1,
      "title": "Day 1: Arrival & Exploration",
      "summary": "Short 1-sentence summary of the day",
      "activities": [
        {
          "name": "Activity Name",
          "time": "09:00 AM",
          "location": "Specific Spot Name",
          "description": "Engaging activity details",
          "cost": 30,
          "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
        }
      ]
    }
  ]
}
Ensure exactly ${days} days in the itinerary. Do not include markdown formatting or backticks outside the JSON. Return only the JSON object.`;

      // Resilient candidate list of supported Gemini models with instant fallback
      const candidateModels = [
        'gemini-3.8-flash',
        'gemini-flash-latest',
        'gemini-3.1-flash-lite',
        'gemini-3.1-pro-preview',
      ];

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });

          const responseText = response.text ? response.text.trim() : '';
          if (responseText) {
            const cleanedJson = responseText.replace(/^```json/i, '').replace(/```$/i, '').trim();
            const parsed = JSON.parse(cleanedJson);
            if (parsed.itinerary && Array.isArray(parsed.itinerary)) {
              return parsed;
            }
          }
        } catch (err) {
          // If model hits 429 resource_exhausted or 503, try next candidate
          console.warn(`[AI Service] Model ${model} generation notice:`, err.message || err);
          continue;
        }
      }
    } catch {
      // Graceful fallback to curated data
    }
  }

  // Fallback to high-quality curated data
  return buildFallbackItinerary({
    destination,
    travelers,
    travelStyle,
    numberOfDays: days,
    interests
  });
}

export default {
  generateTripItinerary,
};
