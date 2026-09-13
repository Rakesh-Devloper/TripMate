/**
 * Itinerary utility service
 * Provides helper calculations for budget estimations, day count formatting,
 * and currency conversions.
 */

export const calculateBudget = (days = 7, travelers = 2, travelStyle = 'Adventure') => {
  let dailyRate = 120;
  switch (travelStyle) {
    case 'Luxury':
      dailyRate = 320;
      break;
    case 'Budget':
      dailyRate = 60;
      break;
    case 'Romantic':
      dailyRate = 220;
      break;
    case 'Family':
      dailyRate = 180;
      break;
    default:
      dailyRate = 120;
  }

  const baseCost = 350 + days * dailyRate;
  const total = Math.round(baseCost * (travelers > 1 ? 1 + (travelers - 1) * 0.7 : 1));

  return {
    total,
    breakdown: {
      flights: Math.round(total * 0.35),
      hotel: Math.round(total * 0.30),
      food: Math.round(total * 0.15),
      activities: Math.round(total * 0.12),
      transport: Math.round(total * 0.08),
    },
  };
};

export default {
  calculateBudget,
};
