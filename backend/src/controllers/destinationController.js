import mongoose from 'mongoose';
import Destination from '../models/Destination.js';

// Pre-seeded destinations exactly matching the reference design
export const SEED_DESTINATIONS = [
  {
    _id: 'dest-bali',
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    category: 'Beach & Island',
    tags: ['Beaches', 'Temples', 'Surfing', 'Nature'],
    rating: 4.8,
    price: 1200,
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'An Indonesian paradise renowned for its volcanic forested mountains, iconic rice paddies, pristine surfing beaches and religious coral reefs.',
    bestTimeToVisit: 'April – June & September',
    weather: '28°C Tropical & Sunny',
    popularAttractions: ['Ubud Monkey Forest', 'Tegalalang Rice Terraces', 'Tanah Lot Temple', 'Nusa Penida', 'Uluwatu Clifftop'],
    averageBudget: 1200,
    travelTips: ['Rent a scooter for flexibility', 'Always carry cash for local warungs', 'Wear a sarong when visiting sacred temples'],
    mapCoordinates: { lat: -8.5069, lng: 115.2625 },
    featured: true,
  },
  {
    _id: 'dest-santorini',
    id: 'dest-santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    category: 'Beach & Island',
    tags: ['Caldera', 'Sunset', 'Luxury', 'Romance'],
    rating: 4.9,
    price: 1800,
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    description: 'A dazzling Aegean island world famed for its whitewashed cube houses carved into dramatic cliff faces perched above an underwater caldera crater.',
    bestTimeToVisit: 'May – October',
    weather: '26°C Mediterranean Breeze',
    popularAttractions: ['Oia Blue Domes', 'Fira Cliffside Walk', 'Red Volcanic Beach', 'Akrotiri Ruins', 'Caldera Catamaran Sailing'],
    averageBudget: 1800,
    travelTips: ['Reserve sunset dinner spots 2 weeks ahead', 'Wear comfortable walking shoes with grip', 'Take a boat to the volcanic hot springs'],
    mapCoordinates: { lat: 36.3932, lng: 25.4615 },
    featured: true,
  },
  {
    _id: 'dest-switzerland',
    id: 'dest-switzerland',
    name: 'Switzerland',
    country: 'Europe',
    region: 'Western Europe',
    category: 'Alpine & Mountain',
    tags: ['Alps', 'Hiking', 'Skiing', 'Scenic Trains'],
    rating: 4.9,
    price: 2200,
    duration: '8 days',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    description: 'The pinnacle of breathtaking alpine grandeur, mirror-smooth glacial lakes, scenic cogwheel trains, and charming medieval chalets.',
    bestTimeToVisit: 'June – September (Hiking) or Dec – March (Skiing)',
    weather: '22°C Fresh Mountain Air',
    popularAttractions: ['Matterhorn Zermatt', 'Jungfraujoch Top of Europe', 'Lake Lucerne', 'Lauterbrunnen Valley', 'Glacier Express'],
    averageBudget: 2200,
    travelTips: ['Purchase the Swiss Travel Pass for unlimited trains & ferries', 'Carry layers as mountain summits are crisp', 'Try authentic Gruyère fondue'],
    mapCoordinates: { lat: 46.8182, lng: 8.2275 },
    featured: true,
  },
  {
    _id: 'dest-tokyo',
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    category: 'Mega City',
    tags: ['Food', 'Anime', 'Temples', 'Modern Architecture'],
    rating: 4.8,
    price: 1700,
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'A dazzling metropolis balancing ultra-futuristic neon skyscrapers, Michelin-starred culinary craft, with serene historic shrines and tranquil gardens.',
    bestTimeToVisit: 'March – May (Cherry Blossoms) or Oct – Nov',
    weather: '20°C Mild & Pleasant',
    popularAttractions: ['Shibuya Crossing', 'Senso-ji Asakusa', 'Shinjuku Gyoen', 'Akihabara Tech District', 'Meiji Jingu Shrine'],
    averageBudget: 1700,
    travelTips: ['Get a Suica or Pasmo card for seamless transit', 'Always carry cash as some ramen spots use ticket machines', 'Walk on the left side of escalators'],
    mapCoordinates: { lat: 35.6762, lng: 139.6503 },
    featured: true,
  },
  {
    _id: 'dest-maldives',
    id: 'dest-maldives',
    name: 'Maldives',
    country: 'Island',
    region: 'Indian Ocean',
    category: 'Luxury & Wellness',
    tags: ['Overwater Villas', 'Snorkeling', 'Romantic', 'Beaches'],
    rating: 4.9,
    price: 2500,
    duration: '5 days',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    description: 'An idyllic chain of secluded coral atolls featuring overwater bungalow villas, translucent turquoise lagoons, and world-class marine sanctuaries.',
    bestTimeToVisit: 'November – April',
    weather: '30°C Warm Ocean Sun',
    popularAttractions: ['Overwater Villa Living', 'Manta Ray Reef Snorkel', 'Bioluminescent Beach Vaadhoo', 'Sunset Dolphin Safari'],
    averageBudget: 2500,
    travelTips: ['Book all-inclusive packages for best value', 'Bring reef-safe mineral sunscreen', 'Experience an underwater spa treatment'],
    mapCoordinates: { lat: 3.2028, lng: 73.2207 },
    featured: true,
  },
  {
    _id: 'dest-new-york',
    id: 'dest-new-york',
    name: 'New York',
    country: 'USA',
    region: 'North America',
    category: 'Mega City',
    tags: ['Broadway', 'Museums', 'Skyline', 'Shopping'],
    rating: 4.7,
    price: 1500,
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    description: 'The iconic city that never sleeps, offering world-famous theater, soaring skyline observatories, Central Park walks, and endless cultural diversity.',
    bestTimeToVisit: 'September – November or April – June',
    weather: '21°C Crisply Energetic',
    popularAttractions: ['Central Park', 'Times Square & Broadway', 'Empire State Building', 'High Line & Hudson Yards', 'Brooklyn Bridge'],
    averageBudget: 1500,
    travelTips: ['Use the NYC Subway via contactless tap to pay', 'Walk across the Brooklyn Bridge at sunset', 'Grab fresh bagels in the East Village'],
    mapCoordinates: { lat: 40.7128, lng: -74.0060 },
    featured: true,
  },
  {
    _id: 'dest-kyoto',
    id: 'dest-kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    category: 'Cultural & Historic',
    tags: ['Ancient Temples', 'Bamboo Forest', 'Geisha Culture', 'Zen Gardens'],
    rating: 4.9,
    price: 1650,
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'The cultural heart of Japan, boasting over a thousand preserved Buddhist temples, tranquil Zen stone gardens, and whispering bamboo groves in Arashiyama.',
    bestTimeToVisit: 'March – May & October – November',
    weather: '19°C Serene & Crisp',
    popularAttractions: ['Fushimi Inari Torii Gates', 'Arashiyama Bamboo Forest', 'Kinkaku-ji Golden Pavilion', 'Gion Historic District', 'Kiyomizu-dera'],
    averageBudget: 1650,
    travelTips: ['Visit Fushimi Inari at dawn to avoid crowds', 'Rent a bicycle to explore peaceful temple lanes', 'Savor traditional matcha in Uji'],
    mapCoordinates: { lat: 35.0116, lng: 135.7681 },
    featured: true,
  },
  {
    _id: 'dest-amalfi',
    id: 'dest-amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    category: 'Beach & Island',
    tags: ['Cliffside Villages', 'Italian Cuisine', 'Coastal Drives', 'Limoncello'],
    rating: 4.8,
    price: 2100,
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    description: 'A 50-kilometer stretch of pastel cliffside villas, lemon orchards, vertical fishing villages, and azure Mediterranean coves on Italy’s Sorrentine peninsula.',
    bestTimeToVisit: 'May – June & September',
    weather: '25°C Sunlit Italian Breeze',
    popularAttractions: ['Positano Cliffside Beach', 'Ravello Villa Rufolo', 'Capri Island Boat Tour', 'Path of the Gods Hike', 'Amalfi Duomo'],
    averageBudget: 2100,
    travelTips: ['Use public ferries between villages to bypass cliffside road traffic', 'Sample fresh limoncello and handmade pasta', 'Book beach loungers early'],
    mapCoordinates: { lat: 40.6340, lng: 14.6027 },
    featured: true,
  },
  {
    _id: 'dest-paris',
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    category: 'Cultural & Historic',
    tags: ['Eiffel Tower', 'Art & Louvre', 'Bistros', 'Romance'],
    rating: 4.8,
    price: 1950,
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Light captivates travelers with monumental neoclassical architecture, intimate sidewalk boulangeries, the world’s greatest art galleries, and Seine riverbanks.',
    bestTimeToVisit: 'April – June & September – November',
    weather: '18°C Romantic & Pleasant',
    popularAttractions: ['Eiffel Tower Summit', 'The Louvre Museum', 'Montmartre & Sacré-Cœur', 'Seine River Sunset Cruise', 'Musée d’Orsay'],
    averageBudget: 1950,
    travelTips: ['Book Louvre time slots in advance', 'Walk through the Marais district for artisan cafés', 'A simple picnic along the Seine is unforgettable'],
    mapCoordinates: { lat: 48.8566, lng: 2.3522 },
    featured: true,
  },
  {
    _id: 'dest-banff',
    id: 'dest-banff',
    name: 'Banff & Canadian Rockies',
    country: 'Canada',
    region: 'North America',
    category: 'Alpine & Mountain',
    tags: ['Glacial Lakes', 'Wildlife', 'Canoeing', 'National Parks'],
    rating: 4.9,
    price: 1850,
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
    description: 'Emerald glacial lakes, towering limestone peaks, pine valleys, and wildlife encounters inside Canada’s oldest national park.',
    bestTimeToVisit: 'June – September (Canoeing) or Dec – March (Skiing)',
    weather: '20°C Crisp Mountain Sun',
    popularAttractions: ['Lake Louise Canoe', 'Moraine Lake Valley of the Ten Peaks', 'Icefields Parkway Drive', 'Banff Upper Hot Springs', 'Johnston Canyon'],
    averageBudget: 1850,
    travelTips: ['Reserve Lake Louise shuttle buses months in advance', 'Always carry bear spray when hiking trails', 'Wake up for sunrise at Moraine Lake'],
    mapCoordinates: { lat: 51.1784, lng: -115.5708 },
    featured: true,
  },
  {
    _id: 'dest-capetown',
    id: 'dest-capetown',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    category: 'Adventure',
    tags: ['Table Mountain', 'Penguins', 'Wine Lands', 'Coastline'],
    rating: 4.8,
    price: 1600,
    duration: '8 days',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    description: 'A striking coastal city nestled between the dramatic flat top of Table Mountain, two roaring oceans, lush Cape Winelands, and wild penguin colonies.',
    bestTimeToVisit: 'November – April',
    weather: '26°C Sunny Ocean Breeze',
    popularAttractions: ['Table Mountain Cableway', 'Boulders Beach African Penguins', 'Cape Point Nature Reserve', 'Kirstenbosch Botanical Gardens', 'Victoria & Alfred Waterfront'],
    averageBudget: 1600,
    travelTips: ['Check Table Mountain wind conditions before booking the cable car', 'Visit Stellenbosch for premier wine tastings', 'Watch sunsets at Camps Bay'],
    mapCoordinates: { lat: -33.9249, lng: 18.4241 },
    featured: true,
  },
  {
    _id: 'dest-reykjavik',
    id: 'dest-reykjavik',
    name: 'Reykjavik & Golden Circle',
    country: 'Iceland',
    region: 'Europe',
    category: 'Adventure',
    tags: ['Northern Lights', 'Geothermal Spas', 'Waterfalls', 'Volcanoes'],
    rating: 4.9,
    price: 2400,
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80',
    description: 'The land of fire and ice where roaring geothermal geysers, massive glacial lagoons, volcanic black sand beaches, and the ethereal Aurora Borealis collide.',
    bestTimeToVisit: 'September – April (Auroras) or June – August (Midnight Sun)',
    weather: '12°C Pure Subpolar Air',
    popularAttractions: ['Blue Lagoon Geothermal Spa', 'Gullfoss Waterfall', 'Thingvellir Tectonic Rift', 'Reynisfjara Black Sand Beach', 'Jökulsárlón Glacier Lagoon'],
    averageBudget: 2400,
    travelTips: ['Rent a 4WD vehicle if driving Iceland’s Ring Road', 'Pack windproof & waterproof thermal layers', 'Track the aurora forecast daily'],
    mapCoordinates: { lat: 64.1466, lng: -21.9426 },
    featured: true,
  },
  {
    _id: 'dest-petra',
    id: 'dest-petra',
    name: 'Petra & Wadi Rum',
    country: 'Jordan',
    region: 'Middle East',
    category: 'Cultural & Historic',
    tags: ['Wonder of the World', 'Desert Camping', 'Bedouin Culture', 'Stargazing'],
    rating: 4.9,
    price: 1750,
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1579606032822-6b94091a92e1?auto=format&fit=crop&w=800&q=80',
    description: 'The rose-red city carved directly into sandstone canyon cliffs over 2,000 years ago, paired with the cinematic Martian dunes of Wadi Rum under brilliant desert stars.',
    bestTimeToVisit: 'March – May & September – November',
    weather: '24°C Sunny & Dry Desert',
    popularAttractions: ['The Treasury (Al-Khazneh)', 'The Monastery (Ad-Deir)', 'Siq Gorge Walk', 'Wadi Rum 4x4 Jeep Safari', 'Dead Sea Floating'],
    averageBudget: 1750,
    travelTips: ['Buy the Jordan Pass for visa exemption & Petra entry', 'Wear sturdy hiking boots for the 800-step Monastery climb', 'Experience Petra by Night by candlelight'],
    mapCoordinates: { lat: 30.3285, lng: 35.4444 },
    featured: true,
  },
  {
    _id: 'dest-rio',
    id: 'dest-rio',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    region: 'South America',
    category: 'Beach & Island',
    tags: ['Copacabana', 'Christ the Redeemer', 'Carnival', 'Sugarloaf'],
    rating: 4.8,
    price: 1550,
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
    description: 'The Marvelous City of golden tropical beaches, forested granite monoliths, infectious samba rhythms, and the iconic Christ the Redeemer overlooking Guanabara Bay.',
    bestTimeToVisit: 'December – March (Carnival) or May – October',
    weather: '29°C Tropical Warmth',
    popularAttractions: ['Christ the Redeemer Corcovado', 'Sugarloaf Mountain Cable Car', 'Copacabana & Ipanema Beaches', 'Selarón Ceramic Steps', 'Tijuca Rainforest'],
    averageBudget: 1550,
    travelTips: ['Watch the sunset from Arpoador rock in Ipanema', 'Drink fresh chilled coconut water on the beach', 'Take ride-shares at night for ease'],
    mapCoordinates: { lat: -22.9068, lng: -43.1729 },
    featured: true,
  },
  {
    _id: 'dest-queenstown',
    id: 'dest-queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    region: 'Oceania',
    category: 'Adventure',
    tags: ['Bungy Jumping', 'Milford Sound', 'Fjords', 'Skydiving'],
    rating: 4.9,
    price: 2300,
    duration: '8 days',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
    description: 'The adventure capital of the Southern Hemisphere, set against the crystalline waters of Lake Wakatipu and the dramatic serrated peaks of the Remarkables.',
    bestTimeToVisit: 'December – February (Summer) or June – August (Skiing)',
    weather: '21°C Invigorating Alpine Sun',
    popularAttractions: ['Milford Sound Fjord Cruise', 'Shotover River Jet Boat', 'Skyline Gondola & Luge', 'Kawarau Bungy Bridge', 'Fergburger Feast'],
    averageBudget: 2300,
    travelTips: ['Book a day trip to Milford Sound including scenic flyback', 'Try the famous Queenstown Fergburger in off-peak hours', 'Taste local Central Otago Pinot Noir'],
    mapCoordinates: { lat: -45.0312, lng: 168.6626 },
    featured: true,
  },
  {
    _id: 'dest-barcelona',
    id: 'dest-barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    category: 'Cultural & Historic',
    tags: ['Gaudi Architecture', 'Tapas', 'Mediterranean Beaches', 'Gothic Quarter'],
    rating: 4.8,
    price: 1700,
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    description: 'A vibrant Mediterranean metropolis defined by Antoni Gaudí’s surrealist modernist masterpieces, lively tapas bars, golden city beaches, and medieval alleys.',
    bestTimeToVisit: 'May – June & September – October',
    weather: '24°C Balmy Mediterranean Sun',
    popularAttractions: ['La Sagrada Família Basilica', 'Park Güell Mosaic Terraces', 'Gothic Quarter (Barri Gòtic)', 'Barceloneta Beach', 'Casa Batlló'],
    averageBudget: 1700,
    travelTips: ['Purchase Sagrada Família tower tickets weeks ahead', 'Eat tapas in the trendy El Born neighborhood', 'Be mindful of pickpockets on Las Ramblas'],
    mapCoordinates: { lat: 41.3879, lng: 2.1699 },
    featured: true,
  },
  {
    _id: 'dest-serengeti',
    id: 'dest-serengeti',
    name: 'Serengeti National Park',
    country: 'Tanzania',
    region: 'Africa',
    category: 'Wildlife & Safari',
    tags: ['Great Migration', 'Big Five', 'Savannah Sunsets', 'Hot Air Balloon'],
    rating: 5.0,
    price: 3200,
    duration: '6 days',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    description: 'An endless savannah wilderness that hosts the greatest wildlife spectacle on Earth: the annual Great Migration of millions of wildebeests, zebras, and apex predators.',
    bestTimeToVisit: 'June – October (River Crossings) or Jan – March (Calving)',
    weather: '27°C Golden Savannah Warmth',
    popularAttractions: ['Great Migration Tracking', 'Dawn Hot Air Balloon Safari', 'Ngorongoro Crater Descent', 'Maasai Cultural Village', 'Kopjes Lion Spotting'],
    averageBudget: 3200,
    travelTips: ['Bring high-magnification binoculars and camera telephoto lens', 'Pack neutral khaki and olive clothing', 'Book luxury tented camp lodges for an immersive wild night'],
    mapCoordinates: { lat: -2.3333, lng: 34.8333 },
    featured: true,
  },
  {
    _id: 'dest-machupicchu',
    id: 'dest-machupicchu',
    name: 'Machu Picchu & Cusco',
    country: 'Peru',
    region: 'South America',
    category: 'Cultural & Historic',
    tags: ['Inca Citadel', 'Andes Mountains', 'Inca Trail', 'Ancient Ruins'],
    rating: 4.9,
    price: 1900,
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    description: 'The mystical 15th-century Inca citadel perched dramatically on a high mountain ridge above cloud forests in the Peruvian Andes.',
    bestTimeToVisit: 'May – October (Dry Season)',
    weather: '20°C Crisp Highland Mountain Air',
    popularAttractions: ['Machu Picchu Sun Gate', 'Huayna Picchu Peak Climb', 'Cusco Plaza de Armas', 'Sacred Valley of the Incas', 'Ollantaytambo Fortress'],
    averageBudget: 1900,
    travelTips: ['Acclimatize in Cusco for 2 days before strenuous hikes', 'Book Inca Trail permits 6 months in advance', 'Drink coca tea to ease altitude symptoms'],
    mapCoordinates: { lat: -13.1631, lng: -72.5450 },
    featured: true,
  },
];

let memoryDestinations = [...SEED_DESTINATIONS];

/**
 * @desc    Get all destinations with optional search and filters
 * @route   GET /api/destinations
 * @access  Public
 */
export const getDestinations = async (req, res, next) => {
  try {
    const { search, country, region, category, minPrice, maxPrice, sort } = req.query;

    let results = [...memoryDestinations];

    // Check if MongoDB is connected
    try {
      if (Destination && Destination.db && Destination.db.readyState === 1) {
        const count = await Destination.countDocuments();
        if (count === 0) {
          await Destination.insertMany(
            SEED_DESTINATIONS.map(({ _id, ...rest }) => rest)
          ).catch(() => {});
        }
        const dbItems = await Destination.find({}).lean();
        if (dbItems && dbItems.length > 0) {
          results = dbItems.map((item) => ({ ...item, id: item._id.toString() }));
        }
      }
    } catch (dbErr) {
      // Fallback to memoryDestinations smoothly
    }

    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          (d.region && d.region.toLowerCase().includes(q)) ||
          (d.category && d.category.toLowerCase().includes(q)) ||
          (Array.isArray(d.tags) && d.tags.some((t) => t.toLowerCase().includes(q))) ||
          (d.description && d.description.toLowerCase().includes(q)) ||
          (Array.isArray(d.popularAttractions) &&
            d.popularAttractions.some((a) => a.toLowerCase().includes(q)))
      );
    }

    if (region && region !== 'All') {
      results = results.filter(
        (d) =>
          (d.region && d.region.toLowerCase() === region.toLowerCase()) ||
          d.country.toLowerCase() === region.toLowerCase()
      );
    }

    if (country && country !== 'all') {
      results = results.filter((d) => d.country.toLowerCase() === country.toLowerCase());
    }

    if (category && category !== 'All') {
      results = results.filter((d) => d.category && d.category.toLowerCase() === category.toLowerCase());
    }

    if (minPrice) {
      results = results.filter((d) => d.price >= Number(minPrice));
    }
    if (maxPrice) {
      results = results.filter((d) => d.price <= Number(maxPrice));
    }

    if (sort === 'lowest-price') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'highest-price') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'highest-rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'name-asc') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single destination by ID
 * @route   GET /api/destinations/:id
 * @access  Public
 */
export const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        let dest = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          dest = await Destination.findById(id);
        } else {
          dest = await Destination.findOne({
            $or: [{ name: new RegExp(`^${id}$`, 'i') }, { _id: id }],
          });
        }
        if (dest) {
          return res.json({ success: true, data: dest });
        }
      } catch (dbErr) {
        console.warn('MongoDB getDestinationById fallback:', dbErr.message);
      }
    }

    const found = memoryDestinations.find(
      (d) => d._id === id || d.id === id || d.name.toLowerCase() === id.toLowerCase()
    );

    if (found) {
      return res.json({ success: true, data: found });
    }

    // Default to Bali if not found
    res.json({ success: true, data: memoryDestinations[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new destination (Admin only)
 * @route   POST /api/destinations
 * @access  Private/Admin
 */
export const createDestination = async (req, res, next) => {
  try {
    const { _id, id, ...bodyWithoutIds } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Destination.create(bodyWithoutIds);
        return res.status(201).json({
          success: true,
          message: 'Destination added successfully to MongoDB',
          data: created,
        });
      } catch (dbErr) {
        console.warn('MongoDB createDestination fallback:', dbErr.message);
      }
    }

    const newDest = {
      _id: `dest-${Date.now()}`,
      id: `dest-${Date.now()}`,
      ...bodyWithoutIds,
    };
    memoryDestinations.push(newDest);

    res.status(201).json({
      success: true,
      message: 'Destination added successfully',
      data: newDest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update destination (Admin only)
 * @route   PUT /api/destinations/:id
 * @access  Private/Admin
 */
export const updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id, id: bodyId, ...updates } = req.body;

    if (mongoose.connection.readyState === 1) {
      try {
        let updated = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          updated = await Destination.findByIdAndUpdate(id, updates, { new: true });
        } else {
          updated = await Destination.findOneAndUpdate({ name: id }, updates, { new: true });
        }
        if (updated) {
          return res.json({
            success: true,
            message: 'Destination updated successfully in MongoDB',
            data: updated,
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB updateDestination fallback:', dbErr.message);
      }
    }

    const index = memoryDestinations.findIndex((d) => d._id === id || d.id === id);
    if (index !== -1) {
      memoryDestinations[index] = { ...memoryDestinations[index], ...updates };
      return res.json({
        success: true,
        message: 'Destination updated successfully',
        data: memoryDestinations[index],
      });
    }

    res.status(404).json({ success: false, message: 'Destination not found' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete destination (Admin only)
 * @route   DELETE /api/destinations/:id
 * @access  Private/Admin
 */
export const deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await Destination.findByIdAndDelete(id);
        } else {
          await Destination.findOneAndDelete({ name: id });
        }
      } catch (dbErr) {
        console.warn('MongoDB deleteDestination fallback:', dbErr.message);
      }
    }

    memoryDestinations = memoryDestinations.filter((d) => d._id !== id && d.id !== id);

    res.json({
      success: true,
      message: 'Destination deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
