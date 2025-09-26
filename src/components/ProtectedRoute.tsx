import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { DeviceFingerprintService } from '@/services/DeviceFingerprintService';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [deviceValidated, setDeviceValidated] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  // Perform device validation on mount
  React.useEffect(() => {
    const validateDevice = async () => {
      if (!user?._id) {
        setIsValidating(false);
        return;
      }

      try {
        const validationResult = await DeviceFingerprintService.validateDevice(user._id);
        setDeviceValidated(validationResult.isValid);
      } catch (error) {
        console.error('Device validation error:', error);
        setDeviceValidated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateDevice();
  }, [user?._id]);

  if (isLoading || isValidating) {
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

  // Device validation failed
  if (deviceValidated === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4 text-destructive">
              Acceso Restringido
            </h2>
            <p className="text-muted-foreground mb-6">
              Tu cuenta ya está vinculada a otro dispositivo. No puedes acceder desde aquí.
            </p>
            <p className="text-sm text-muted-foreground">
              Si necesitas cambiar de dispositivo, cierra sesión en el dispositivo anterior primero.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Trial expiration enforcement (simple client-side gate)
  const trialExpired = localStorage.getItem('trial_expired') === 'true';
  if (trialExpired && location.pathname !== '/subscription-management') {
    return <Navigate to={'/subscription-management?notice=trialExpired'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;