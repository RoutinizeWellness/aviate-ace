import { useState, useEffect } from 'react';
import { useAuth } from './useConvexAuth';
import { UserProfile, UserStats, UserAchievement } from '../types/userProfile';

// Mock hook that provides Supabase-style data structure for compatibility
export const useSupabaseProfile = () => {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      // Convert Convex user to Supabase-style profile
      const mockProfile: UserProfile = {
        id: user._id,
        user_id: user._id,
        display_name: user.displayName || user.fullName || user.email?.split('@')[0] || 'Usuario',
        avatar_url: user.avatarUrl,
        experience_level: user.role === 'premium' ? 'advanced' : 'novato',
        current_aircraft: 'A320',
        plan_type: user.accountType === 'premium' ? 'premium' : 'free',
        role: user.role || 'user',
        level: 1,
        points: 0,
        created_at: new Date(user.createdAt).toISOString(),
        updated_at: new Date(user.updatedAt).toISOString(),
      };

      const mockStats: UserStats = {
        id: `stats_${user._id}`,
        user_id: user._id,
        current_level: 1,
        total_points: 0,
        total_exams_taken: 0,
        total_quizzes_taken: 0,
        total_lessons_completed: 0,
        created_at: new Date(user.createdAt).toISOString(),
        updated_at: new Date(user.updatedAt).toISOString(),
      };

      setProfile(mockProfile);
      setUserStats(mockStats);
    } else {
      setProfile(null);
      setUserStats(null);
    }
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ 
        ...profile, 
        ...data, 
        updated_at: new Date().toISOString() 
      });
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (profile) {
      setProfile({ 
        ...profile, 
        avatar_url: avatarUrl, 
        updated_at: new Date().toISOString() 
      });
    }
  };

  return {
    profile,
    userStats,
    isLoading,
    updateProfile,
    updateAvatar,
    isUpdatingProfile: false,
  };
};

export default useSupabaseProfile;