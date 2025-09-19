import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';

export const useCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Helper function to validate Convex IDs
  const isValidConvexId = (id: string): boolean => {
    // Convex IDs are 32-character strings with lowercase letters and digits
    return /^[a-z0-9]{32}$/.test(id);
  };

  // Fetch all available courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      // Use real course data for A320 and B737 type ratings
      return [
        {
          id: 'course_1',
          title: 'A320 Type Rating - Real Exam Preparation',
          description: 'Complete A320 type rating course with real examination content based on EASA/FAA standards',
          aircraft_type: 'A320_FAMILY',
          difficulty: 'advanced',
          duration_hours: 40,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'course_2',
          title: 'B737 Type Rating - Real Exam Preparation',
          description: 'Complete B737 type rating course with real examination content based on EASA/FAA standards',
          aircraft_type: 'BOEING_737',
          difficulty: 'advanced',
          duration_hours: 40,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
    },
  });

  // Fetch user's enrolled courses
  const { data: userCourses, isLoading: isLoadingUserCourses } = useQuery({
    queryKey: ['user-courses', user?._id],
    queryFn: async () => {
      if (!user || !isValidConvexId(user._id)) return [];
      
      // Use mock data for now since we're transitioning to Convex
      // Auto-enroll user in A320 course for demonstration
      return [
        {
          id: 'user_course_1',
          user_id: user._id,
          course_id: 'course_1',
          enrolled_at: new Date().toISOString(),
          completed_at: null,
          progress_percentage: 25,
          last_accessed_at: new Date().toISOString(),
          course: {
            _id: 'course_1',
            title: 'A320 Type Rating - Real Exam Preparation',
            description: 'Complete A320 type rating course with real examination content based on EASA/FAA standards',
            aircraftType: 'A320_FAMILY',
            difficulty: 'advanced',
            duration_hours: 40,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        },
        {
          id: 'user_course_2',
          user_id: user._id,
          course_id: 'course_2',
          enrolled_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          completed_at: null,
          progress_percentage: 0,
          last_accessed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          course: {
            _id: 'course_2',
            title: 'B737 Type Rating - Real Exam Preparation',
            description: 'Complete B737 type rating course with real examination content based on EASA/FAA standards',
            aircraftType: 'BOEING_737',
            difficulty: 'advanced',
            duration_hours: 40,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }
      ];
    },
    enabled: !!(user && isValidConvexId(user._id)),
  });

  // Fetch course modules with lessons
  const getCourseWithModules = (courseId: string) => {
    return useQuery({
      queryKey: ['course-modules', courseId],
      queryFn: async () => {
        // Use mock data for now since we're transitioning to Convex
        return [
          {
            id: 'module_1',
            course_id: courseId,
            title: 'Introducción',
            description: 'Introducción al curso',
            order_index: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            lessons: [
              {
                id: 'lesson_1',
                module_id: 'module_1',
                title: 'Bienvenida',
                description: 'Bienvenida al curso',
                content: 'Contenido de la lección',
                order_index: 1,
                estimated_duration_minutes: 10,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            ]
          }
        ];
      },
      enabled: !!courseId,
    });
  };

  // Fetch user progress for a course
  const getUserCourseProgress = (courseId: string) => {
    return useQuery({
      queryKey: ['user-course-progress', user?._id, courseId],
      queryFn: async () => {
        if (!user || !isValidConvexId(user._id)) return [];
        
        // Use mock data for now since we're transitioning to Convex
        return [
          {
            id: 'progress_1',
            user_id: user._id,
            lesson_id: 'lesson_1',
            course_id: courseId,
            score: 100,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            lessons: {
              id: 'lesson_1',
              title: 'Bienvenida',
            }
          }
        ];
      },
      enabled: !!(user && isValidConvexId(user._id) && courseId),
    });
  };

  // Enroll in a course
  const enrollInCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user || !isValidConvexId(user._id)) throw new Error('User not authenticated');
      
      // For now, just return the data as if it were successful
      return {
        id: `user_course_${Date.now()}`,
        user_id: user._id,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        completed_at: null,
        progress_percentage: 0,
        last_accessed_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      toast({
        title: "¡Inscripción exitosa!",
        description: "Te has inscrito al curso correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-courses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error en la inscripción",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mark lesson as completed
  const markLessonCompletedMutation = useMutation({
    mutationFn: async ({ lessonId, courseId, score }: { lessonId: string; courseId: string; score?: number }) => {
      if (!user || !isValidConvexId(user._id)) throw new Error('User not authenticated');
      
      // For now, just return the data as if it were successful
      return {
        id: `progress_${Date.now()}`,
        user_id: user._id,
        lesson_id: lessonId,
        course_id: courseId,
        score: score || null,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      toast({
        title: "¡Lección completada!",
        description: "Has completado la lección exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-course-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error al completar lección",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    courses,
    userCourses,
    isLoadingCourses,
    isLoadingUserCourses,
    getCourseWithModules,
    getUserCourseProgress,
    enrollInCourse: enrollInCourseMutation.mutate,
    isEnrolling: enrollInCourseMutation.isPending,
    markLessonCompleted: markLessonCompletedMutation.mutate,
    isMarkingCompleted: markLessonCompletedMutation.isPending,
  };
};