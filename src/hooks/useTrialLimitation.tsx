import { useState, useEffect } from 'react';
import { TrialLimitationService, TrialCheckResult } from '@/services/TrialLimitationService';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';

export interface TrialStatus {
  isLoading: boolean;
  canUseTrial: boolean;
  hasActiveTrial: boolean;
  trialInfo: TrialCheckResult | null;
  ipAddress: string | null;
  error: string | null;
}

export const useTrialLimitation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isLoading: true,
    canUseTrial: false,
    hasActiveTrial: false,
    trialInfo: null,
    ipAddress: null,
    error: null
  });

  // Check trial eligibility when user changes
  useEffect(() => {
    if (!user?._id) {
      setTrialStatus({
        isLoading: false,
        canUseTrial: false,
        hasActiveTrial: false,
        trialInfo: null,
        ipAddress: null,
        error: 'User not authenticated'
      });
      return;
    }

    checkTrialEligibility();
  }, [user?._id]);

  const checkTrialEligibility = async () => {
    if (!user?._id) return;

    setTrialStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await TrialLimitationService.getCurrentUserTrialInfo(user._id);
      
      setTrialStatus({
        isLoading: false,
        canUseTrial: result.eligibility.canUseTrial,
        hasActiveTrial: !!result.eligibility.existingRecord,
        trialInfo: result.eligibility,
        ipAddress: result.ipAddress,
        error: null
      });
    } catch (error: any) {
      console.error('Error checking trial eligibility:', error);
      setTrialStatus({
        isLoading: false,
        canUseTrial: false,
        hasActiveTrial: false,
        trialInfo: null,
        ipAddress: null,
        error: error.message || 'Failed to check trial eligibility'
      });
    }
  };

  const startTrial = async (): Promise<boolean> => {
    if (!user?._id) {
      toast({
        title: \"Error\",
        description: \"User not authenticated\",
        variant: \"destructive\"
      });
      return false;
    }

    if (!trialStatus.canUseTrial) {
      toast({
        title: \"Trial Not Available\",
        description: trialStatus.trialInfo?.reason || \"Cannot start trial from this IP\",
        variant: \"destructive\"
      });
      return false;
    }

    try {
      setTrialStatus(prev => ({ ...prev, isLoading: true }));
      
      const trialRecord = await TrialLimitationService.registerTrial(user._id);
      
      // Refresh trial status
      await checkTrialEligibility();
      
      toast({
        title: \"Trial Started\",
        description: \"Your free trial has been activated!\",
        variant: \"default\"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error starting trial:', error);
      toast({
        title: \"Error\",
        description: error.message || \"Failed to start trial\",
        variant: \"destructive\"
      });
      return false;
    }
  };

  const refreshTrialStatus = () => {
    checkTrialEligibility();
  };

  return {
    trialStatus,
    startTrial,
    refreshTrialStatus,
    checkTrialEligibility
  };
};