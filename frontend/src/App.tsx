import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { TripProvider } from './context/TripContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppProvider, useAppContext } from './context/AppContext.jsx';

import MainLayout from './layouts/MainLayout.jsx';

import HomePage from './pages/Home/HomePage.jsx';
import AIPlannerPage from './pages/AIPlanner/AIPlannerPage.jsx';
import TripDetailsPage from './pages/Trips/TripDetailsPage.jsx';
import TripsPage from './pages/Trips/TripsPage.jsx';
import DestinationsPage from './pages/Destinations/DestinationsPage.jsx';
import DestinationDetailsPage from './pages/Destinations/DestinationDetailsPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import CommunityPage from './pages/Community/CommunityPage.jsx';
import PricingPage from './pages/Pricing/PricingPage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

function AppContent() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-planner" element={<AIPlannerPage />} />
        <Route path="/trip/:tripId" element={<TripDetailsPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetailsPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <TripProvider>
              <AppContent />
            </TripProvider>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </Router>
  );
}
