import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Guards routes that require authentication.
 * - Displays a sleek loading state while initial session rehydration occurs.
 * - Redirects unauthenticated visitors to /login preserving the requested path.
 * - Renders children when the user has a verified authentication session.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initialChecking } = useAuth();
  const location = useLocation();

  if (initialChecking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xl">
          <Loader2 className="w-5 h-5 animate-spin text-[#6C3DF5]" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Verifying your session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
