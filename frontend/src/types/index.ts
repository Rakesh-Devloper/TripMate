/**
 * TripMate Frontend TypeScript Definitions
 */

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  profileImage?: string;
  role: 'user' | 'admin';
  travelStyle?: string;
  bio?: string;
  preferredCurrency?: string;
  homeAirport?: string;
  createdAt?: string;
  token?: string;
}

export interface Activity {
  time?: string;
  activity: string;
  location?: string;
  cost?: number;
  notes?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description?: string;
  activities: Activity[];
}

export interface Expense {
  category: string;
  amount: number;
  description?: string;
}

export interface Trip {
  _id: string;
  id?: string;
  tripCode?: string;
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Active' | 'Completed';
  travelStyle?: string;
  budget?: number;
  coverImage?: string;
  itinerary?: ItineraryDay[];
  expenses?: Expense[];
  notes?: string;
  saved?: boolean;
  user?: string | User;
  createdAt?: string;
}

export interface Destination {
  _id: string;
  id?: string;
  name: string;
  country: string;
  region?: string;
  category: string;
  rating: number;
  reviewsCount?: number;
  description: string;
  coverImage: string;
  galleryImages?: string[];
  bestTimeToVisit?: string;
  currency?: string;
  language?: string;
  estimatedDailyCost?: number;
  popularSpots?: string[];
  tags?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialChecking: boolean;
}
