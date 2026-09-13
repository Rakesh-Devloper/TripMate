import React, { createContext, useContext, useState } from 'react';
import tripService from '../services/tripService.js';
const TripContext = createContext(null);
export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadTrips = async () => { setLoading(true); try { const data=await tripService.getMyTrips(); const list=data.trips || data.data || []; setTrips(list); return list; } finally { setLoading(false); } };
  return <TripContext.Provider value={{ trips, setTrips, loading, loadTrips }}>{children}</TripContext.Provider>;
}
export const useTrips = () => useContext(TripContext);
export default TripContext;
