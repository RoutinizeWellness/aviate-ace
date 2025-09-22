import { useState, useEffect } from 'react';
import { useAuth } from './useConvexAuth';
import { UserProfile, ConvexUserProfile, UserStats } from '../types/userProfile';

export const useUserProfile = () => {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<ConvexUserProfile | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        accountType: user.accountType,
        subscription: user.subscription,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      setProfile(null);
    }
  }, [user]);

  return {
    profile,
    isLoading,
    updateProfile: async (data: Partial<ConvexUserProfile>) => {
      // In a real implementation, this would call an API to update the profile
      if (profile) {
        setProfile({ ...profile, ...data, updatedAt: Date.now() });
      }
    },
  };
};

export default useUserProfile;