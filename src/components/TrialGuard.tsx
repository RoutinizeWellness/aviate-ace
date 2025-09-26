import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users,
  Globe,
  Info
} from 'lucide-react';
import { useTrialLimitation } from '@/hooks/useTrialLimitation';
import { useLanguage } from '@/contexts/LanguageContext';

interface TrialGuardProps {
  children: React.ReactNode;
  requireTrial?: boolean;
  showTrialInfo?: boolean;
  onTrialRequired?: () => void;
}

export const TrialGuard: React.FC<TrialGuardProps> = ({
  children,
  requireTrial = false,
  showTrialInfo = true,
  onTrialRequired
}) => {
  const { trialStatus, startTrial } = useTrialLimitation();
  const { t } = useLanguage();

  if (trialStatus.isLoading) {
    return (
      <div className=\"flex items-center justify-center p-8\">
        <div className=\"text-center\">
          <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4\"></div>
          <p className=\"text-muted-foreground\">Checking trial eligibility...</p>
        </div>
      </div>
    );
  }

  if (trialStatus.error) {
    return (
      <Alert variant=\"destructive\">
        <AlertTriangle className=\"h-4 w-4\" />
        <AlertDescription>{trialStatus.error}</AlertDescription>
      </Alert>
    );
  }

  // If trial is required but not available, show limitation
  if (requireTrial && !trialStatus.canUseTrial && !trialStatus.hasActiveTrial) {
    return (
      <Card className=\"max-w-2xl mx-auto\">
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <Shield className=\"w-5 h-5 text-warning\" />
            Trial Limitation
          </CardTitle>
          <CardDescription>
            Free trial access is limited to one account per IP address
          </CardDescription>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          <Alert>
            <Info className=\"h-4 w-4\" />
            <AlertDescription>
              {trialStatus.trialInfo?.reason || 'Trial not available from this IP address'}
            </AlertDescription>
          </Alert>
          
          <div className=\"space-y-2\">
            <p className=\"text-sm text-muted-foreground\">
              <strong>Current IP:</strong> {trialStatus.ipAddress}
            </p>
            <p className=\"text-sm text-muted-foreground\">
              To access premium features, please subscribe to one of our plans.
            </p>
          </div>

          <div className=\"flex gap-2\">
            <Button onClick={() => onTrialRequired?.()}>
              View Subscription Plans
            </Button>
            <Button variant=\"outline\" onClick={() => window.location.href = '/contact'}>
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Show trial info if enabled */}
      {showTrialInfo && (
        <TrialStatusInfo 
          trialStatus={trialStatus} 
          onStartTrial={startTrial}
        />
      )}
      
      {/* Render children */}
      {children}
    </div>
  );
};

interface TrialStatusInfoProps {
  trialStatus: any;
  onStartTrial: () => Promise<boolean>;
}

const TrialStatusInfo: React.FC<TrialStatusInfoProps> = ({ trialStatus, onStartTrial }) => {
  const { t } = useLanguage();

  // Don't show if user can't use trial and doesn't have active trial
  if (!trialStatus.canUseTrial && !trialStatus.hasActiveTrial) {
    return null;
  }

  return (
    <Card className=\"mb-6 border-primary/20 bg-primary/5\">
      <CardContent className=\"p-4\">
        <div className=\"flex items-center justify-between\">
          <div className=\"flex items-center gap-3\">
            <div className=\"w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center\">
              {trialStatus.hasActiveTrial ? (
                <CheckCircle2 className=\"w-5 h-5 text-success\" />
              ) : (
                <Clock className=\"w-5 h-5 text-primary\" />
              )}
            </div>
            
            <div>
              <h4 className=\"font-semibold\">
                {trialStatus.hasActiveTrial ? 'Free Trial Active' : 'Free Trial Available'}
              </h4>
              <p className=\"text-sm text-muted-foreground\">
                {trialStatus.hasActiveTrial 
                  ? 'You are currently using your free trial from this IP address'
                  : 'Start your free trial to access premium features'
                }
              </p>
            </div>
          </div>

          <div className=\"flex items-center gap-2\">
            <Badge variant=\"secondary\" className=\"text-xs\">
              <Globe className=\"w-3 h-3 mr-1\" />
              IP: {trialStatus.ipAddress?.substring(0, 10)}...
            </Badge>
            
            {!trialStatus.hasActiveTrial && trialStatus.canUseTrial && (
              <Button size=\"sm\" onClick={onStartTrial}>
                Start Trial
              </Button>
            )}
          </div>
        </div>
        
        {trialStatus.trialInfo?.reason && (
          <div className=\"mt-3 pt-3 border-t border-border/50\">
            <p className=\"text-xs text-muted-foreground\">
              <Info className=\"w-3 h-3 inline mr-1\" />
              {trialStatus.trialInfo.reason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrialGuard;