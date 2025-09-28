import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { DeviceFingerprintService } from '@/services/DeviceFingerprintService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Lock, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: 'A320_FAMILY' | 'B737_FAMILY' | 'ALL';
  fallbackComponent?: React.ReactNode;
}

const ProtectedRoute = ({ 
  children, 
  requiresSubscription,
  fallbackComponent 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const { hasAccessTo, getCurrentSubscription, getSubscriptionDisplayName } = useSubscription();
  const { t } = useLanguage();
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

  // Check subscription-based access if required
  if (requiresSubscription && user) {
    const hasRequiredAccess = hasAccessTo(requiresSubscription);
    
    if (!hasRequiredAccess) {
      // Show subscription required message instead of redirecting
      if (fallbackComponent) {
        return <>{fallbackComponent}</>;
      }
      
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center">
              <Lock className="w-16 h-16 text-warning mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-4 text-warning">
                {t('subscription.accessRestricted') || 'Suscripción Requerida'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('subscription.upgradeRequired') || 'Necesitas una suscripción para acceder a este contenido.'}
              </p>
              <div className="space-y-3 mb-6">
                <div className="text-sm">
                  <p><strong>{t('subscription.currentPlan') || 'Plan Actual'}:</strong></p>
                  <Badge variant="outline" className="mt-1">
                    {getSubscriptionDisplayName()}
                  </Badge>
                </div>
                <div className="text-sm">
                  <p><strong>{t('subscription.requiredFor') || 'Requerido para'}:</strong></p>
                  <Badge className="bg-primary/10 text-primary mt-1">
                    {requiresSubscription === 'A320_FAMILY' ? 'Airbus A320 Family' :
                     requiresSubscription === 'B737_FAMILY' ? 'Boeing 737 Family' :
                     'All Aircraft Types'}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => window.location.href = '/subscription-management'}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t('subscription.upgradeNow') || 'Actualizar Suscripción'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  {t('common.back') || 'Volver'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;