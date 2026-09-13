/**
 * Generates an easy-to-share alphanumeric code for a trip
 * e.g., "TRIP-BALI-8942"
 */
export const generateTripCode = (destination = 'TRIP') => {
  const cleanDest = destination.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'TRIP';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TM-${cleanDest}-${randomNum}`;
};

export default generateTripCode;
