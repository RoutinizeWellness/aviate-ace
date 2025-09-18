import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';

export const useUserStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper function to validate Convex IDs
  const isValidConvexId = (id: string): boolean => {
    return /^[a-z]+_[a-z2-7]{16}$/.test(id);
  };

  // Fetch user statistics
  const { data: userStats, isLoading: isLoadingStats } = useQuery({
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

  // Fetch recent progress logs
  const { data: recentProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['recent-progress', user?._id],
    queryFn: async () => {
      if (!user || !isValidConvexId(user._id)) return [];
      
      // Use mock data for now since we're transitioning to Convex
      return [
        {
          id: '1',
          user_id: user._id,
          activity_type: 'lesson_completed',
          lesson_id: 'lesson_1',
          course_id: 'course_1',
          exam_id: null,
          points_earned: 50,
          metadata: null,
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: '2',
          user_id: user._id,
          activity_type: 'exam_taken',
          lesson_id: null,
          course_id: null,
          exam_id: 'exam_1',
          points_earned: 100,
          metadata: null,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        }
      ];
    },
    enabled: !!(user && isValidConvexId(user._id)),
  });

  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['user-achievements', user?._id],
    queryFn: async () => {
      if (!user || !isValidConvexId(user._id)) return [];
      
      // Use mock data for now since we're transitioning to Convex
      return [
        {
          id: '1',
          user_id: user._id,
          achievement_id: 'first_login',
          unlocked_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      ];
    },
    enabled: !!(user && isValidConvexId(user._id)),
  });

  // Fetch available achievements
  const { data: availableAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      // Use mock data for now since we're transitioning to Convex
      return [
        {
          id: 'first_login',
          title: 'Primer Inicio de Sesión',
          description: 'Inicia sesión por primera vez',
          icon: '🎉',
          points: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'first_exam',
          title: 'Primer Examen',
          description: 'Completa tu primer examen',
          icon: '📝',
          points: 50,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
    },
  });

  // Get exam performance statistics
  const { data: examStats } = useQuery({
    queryKey: ['exam-stats', user?._id],
    queryFn: async () => {
      if (!user || !isValidConvexId(user._id)) return null;
      
      // Use mock data for now since we're transitioning to Convex
      return {
        totalExams: 0,
        passedExams: 0,
        averageScore: 0,
        passRate: 0,
        recentSessions: [],
        byAircraftType: {},
      };
    },
    enabled: !!(user && isValidConvexId(user._id)),
  });

  // Update user statistics
  const updateStatsMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!user || !isValidConvexId(user._id)) throw new Error('User not authenticated or invalid ID');
      
      // For now, just return the updates as if they were successful
      return {
        ...userStats,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });

  // Add progress log entry
  const logProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      if (!user || !isValidConvexId(user._id)) throw new Error('User not authenticated or invalid ID');
      
      // For now, just return the data as if it were successful
      return {
        id: `progress_${Date.now()}`,
        user_id: user._id,
        ...progressData,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });

  // Check and award achievements
  const checkAchievementsMutation = useMutation({
    mutationFn: async () => {
      if (!user || !isValidConvexId(user._id)) throw new Error('User not authenticated or invalid ID');
      
      // For now, just simulate success
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      toast({
        title: "¡Logros desbloqueados!",
        description: "Has obtenido nuevos logros. ¡Revisa tu progreso!",
      });
    },
  });

  return {
    userStats,
    isLoadingStats,
    recentProgress,
    isLoadingProgress,
    userAchievements,
    isLoadingAchievements,
    availableAchievements,
    examStats,
    updateStats: updateStatsMutation.mutate,
    isUpdatingStats: updateStatsMutation.isPending,
    logProgress: logProgressMutation.mutate,
    isLoggingProgress: logProgressMutation.isPending,
    checkAchievements: checkAchievementsMutation.mutate,
    isCheckingAchievements: checkAchievementsMutation.isPending,
  };
};