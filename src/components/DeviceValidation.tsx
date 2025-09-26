import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield,
  AlertTriangle,
  Smartphone,
  Monitor,
  RotateCcw,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDeviceFingerprint, DeviceFingerprintService } from '@/services/DeviceFingerprintService';
import { useAuth } from '@/hooks/useConvexAuth';

interface DeviceValidationProps {
  onValidationComplete: (isValid: boolean) => void;
  onDeviceUpdate: () => void;
}

export const DeviceValidation: React.FC<DeviceValidationProps> = ({
  onValidationComplete,
  onDeviceUpdate
}) => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { validateDevice, updateDevice, getRegisteredDevice } = useDeviceFingerprint();
  
  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    reason?: string;
    similarity: number;
  } | null>(null);
  const [registeredDevice, setRegisteredDevice] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      performValidation();
    }
  }, [user]);

  const performValidation = async () => {
    if (!user) return;

    setIsValidating(true);
    setError('');

    try {
      const registered = getRegisteredDevice();
      setRegisteredDevice(registered);

      if (!registered) {
        // No device registered yet, this is first time login
        setValidationResult({
          isValid: true,
          reason: 'First time registration',
          similarity: 1.0,
        });
        onValidationComplete(true);
        return;
      }

      const result = await validateDevice(user._id as string);
      setValidationResult(result);
      onValidationComplete(result.isValid);

    } catch (error) {
      console.error('Device validation error:', error);
      setError(t('errors.deviceValidationFailed') || 'Device validation failed');
      onValidationComplete(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpdateDevice = async () => {
    if (!user) return;

    setIsUpdating(true);
    setError('');

    try {
      await updateDevice(user._id as string);
      setValidationResult({
        isValid: true,
        reason: 'Device updated successfully',
        similarity: 1.0,
      });
      onDeviceUpdate();
      onValidationComplete(true);
    } catch (error) {
      console.error('Device update error:', error);
      setError(t('errors.deviceUpdateFailed') || 'Failed to update device registration');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isValidating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <h3 className="text-lg font-semibold mb-2">
            {t('device.validating') || 'Validating Device...'}
          </h3>
          <p className="text-muted-foreground">
            {t('device.checkingFingerprint') || 'Checking device fingerprint for security'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!validationResult) return null;

  // Device validation failed
  if (!validationResult.isValid) {
    const deviceDesc = registeredDevice 
      ? DeviceFingerprintService.getDeviceDescription(registeredDevice.deviceFingerprint)
      : 'Unknown device';

    return (
      <Card className="w-full max-w-lg mx-auto border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-6 h-6" />
            {t('device.accessBlocked') || 'Access Blocked'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              {t('device.blockedMessage') || 'Tu cuenta ya está vinculada a otro dispositivo. No puedes acceder desde aquí.'}
            </AlertDescription>
          </Alert>

          {/* Device info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">
                {t('device.registeredDevice') || 'Registered Device:'}
              </h4>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{deviceDesc}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">
                {t('device.similarity') || 'Device Similarity:'}
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${validationResult.similarity * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {(validationResult.similarity * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleUpdateDevice}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  {t('device.updating') || 'Updating...'}
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t('device.registerThisDevice') || 'Register This Device'}
                </>
              )}
            </Button>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('device.signOutAndTryAnother') || 'Sign Out & Try Another Device'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Help text */}
          <div className="text-xs text-muted-foreground bg-white p-3 rounded-lg">
            <p>
              {t('device.helpText') || 
                'To use this account on a new device, you need to either sign out from the previous device or register this device as your new primary device.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Device validation successful
  return (
    <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50">
      <CardContent className="p-6 text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
        <h3 className="text-lg font-semibold mb-2 text-green-800">
          {t('device.validationSuccess') || 'Device Validated'}
        </h3>
        <p className="text-green-600 text-sm">
          {t('device.accessGranted') || 'Access granted to your aviation training platform'}
        </p>
      </CardContent>
    </Card>
  );
};

export default DeviceValidation;