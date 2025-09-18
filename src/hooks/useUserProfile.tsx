import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper function to validate Convex IDs
  const isValidConvexId = (id: string): boolean => {
    return /^[a-z]+_[a-z2-7]{16}$/.test(id);
  };

  // Use Convex queries for profile and stats
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?._id],
    queryFn: async () => {
      if (!user || !isValidConvexId(user._id)) return null;
      
      // Use mock data for now since we're transitioning to Convex
      return {
        user_id: user._id,
        display_name: user.displayName || user.email?.split('@')[0] || 'Usuario',
        experience_level: 'beginner',
        plan_type: 'free',
        role: 'user',
        avatar_url: user.avatarUrl || null,
        created_at: new Date(user.createdAt).toISOString(),
        updated_at: new Date(user.updatedAt).toISOString(),
      };
    },
    enabled: !!(user && isValidConvexId(user._id)),
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-stats', user?._id],
    queryFn: async () => {
      if (!user || !isValidConvexId(user._id)) return null;
      
      // Use mock data for now since we're transitioning to Convex
      return {
        user_id: user._id,
        total_points: 0,
        current_level: 1,
        total_exams_taken: 0,
        total_lessons_completed: 0,
        total_quizzes_taken: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
    enabled: !!(user && isValidConvexId(user._id)),
  });

  // Since we're using mock data, these mutations will just update the local state
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!user || !isValidConvexId(user._id)) throw new Error('User not authenticated or invalid ID');
      
      // For now, just return the updates as if they were successful
      return {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente.",
      });
      queryClient.setQueryData(['profile', user?._id], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      if (!user || !isValidConvexId(user._id)) throw new Error('User not authenticated or invalid ID');
      
      // For now, just return the updates as if they were successful
      return {
        ...profile,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Avatar actualizado",
        description: "Tu avatar ha sido actualizado exitosamente.",
      });
      queryClient.setQueryData(['profile', user?._id], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error al actualizar avatar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    userStats,
    isLoadingProfile,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateAvatar: updateAvatarMutation.mutate,
    isUpdatingAvatar: updateAvatarMutation.isPending,
  };
};