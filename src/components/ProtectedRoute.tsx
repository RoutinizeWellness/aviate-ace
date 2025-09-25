import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Save the current location they were trying to go to
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  // Trial expiration enforcement (simple client-side gate)
  const trialExpired = localStorage.getItem('trial_expired') === 'true';
  if (trialExpired && location.pathname !== '/subscription-management') {
    return <Navigate to={'/subscription-management?notice=trialExpired'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;