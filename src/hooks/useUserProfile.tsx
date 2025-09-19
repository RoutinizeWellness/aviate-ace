import { useState, useEffect } from 'react';
import { useAuth } from './useConvexAuth';

interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'premium';
  accountType?: 'free' | 'premium' | 'enterprise';
  subscription?: string;
  isActive?: boolean;
  createdAt: number;
  updatedAt: number;
}

export const useUserProfile = () => {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
    updateProfile: async (data: Partial<UserProfile>) => {
      // In a real implementation, this would call an API to update the profile
      if (profile) {
        setProfile({ ...profile, ...data, updatedAt: Date.now() });
      }
    },
  };
};

export default useUserProfile;