import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from './useConvexAuth';
import { useToast } from './use-toast';

// Helper function to validate Convex IDs
const isValidConvexId = (id: string): boolean => {
  return /^[a-z0-9]{32}$/.test(id);
};

export interface AircraftProgress {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeSpent: number;
  lastStudied: Date | null;
  completedCategories: string[];
  weakCategories: string[];
  strongCategories: string[];
}

export interface CategoryProgress {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  lastStudied: Date | null;
  isCompleted: boolean;
}

// Hook for A320 progress tracking
export const useA320Progress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<AircraftProgress | null>(null);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);

  // Get user's exam sessions for A320
  const examSessions = useQuery(
    api.exams.getUserExamSessions,
    user && isValidConvexId(user._id) ? { userId: user._id } : "skip"
  );

  // Get user's incorrect questions for A320
  const incorrectQuestions = useQuery(
    api.auth.getUserIncorrectQuestions,
    user && isValidConvexId(user._id) ? { userId: user._id } : "skip"
  );

  useEffect(() => {
    if (examSessions && incorrectQuestions) {
      // Filter A320 sessions
      const a320Sessions = examSessions.filter(session => 
        session.answers?.some(answer => 
          // Check if any answer relates to A320 questions
          true // For now, we'll include all sessions
        )
      );

      // Calculate overall progress
      const totalQuestions = a320Sessions.reduce((sum, session) => sum + session.questionsCount, 0);
      const correctAnswers = a320Sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
      const incorrectAnswers = totalQuestions - correctAnswers;
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const timeSpent = a320Sessions.reduce((sum, session) => sum + session.timeSpent, 0);
      const lastStudied = a320Sessions.length > 0 ? new Date(Math.max(...a320Sessions.map(s => s.completedAt))) : null;

      // Filter A320 incorrect questions
      const a320IncorrectQuestions = incorrectQuestions.filter(iq => 
        iq.aircraftType === 'A320_FAMILY'
      );

      // Calculate category progress
      const categoryStats = new Map<string, {
        total: number;
        correct: number;
        incorrect: number;
        lastStudied: number;
      }>();

      // Process exam sessions for category stats
      a320Sessions.forEach(session => {
        session.answers?.forEach(answer => {
          // For now, we'll use a default category since we don't have question details
          const category = 'General';
          const stats = categoryStats.get(category) || { total: 0, correct: 0, incorrect: 0, lastStudied: 0 };
          stats.total++;
          if (answer.isCorrect) {
            stats.correct++;
          } else {
            stats.incorrect++;
          }
          stats.lastStudied = Math.max(stats.lastStudied, session.completedAt);
          categoryStats.set(category, stats);
        });
      });

      // Convert to CategoryProgress array
      const categoryProgressArray: CategoryProgress[] = Array.from(categoryStats.entries()).map(([category, stats]) => ({
        category,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        incorrectAnswers: stats.incorrect,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        lastStudied: stats.lastStudied > 0 ? new Date(stats.lastStudied) : null,
        isCompleted: stats.total > 0 && (stats.correct / stats.total) >= 0.8 // 80% accuracy threshold
      }));

      // Determine category strengths
      const completedCategories = categoryProgressArray.filter(cp => cp.isCompleted).map(cp => cp.category);
      const weakCategories = categoryProgressArray.filter(cp => cp.accuracy < 60).map(cp => cp.category);
      const strongCategories = categoryProgressArray.filter(cp => cp.accuracy >= 80).map(cp => cp.category);

      setProgress({
        totalQuestions,
        answeredQuestions: totalQuestions,
        correctAnswers,
        incorrectAnswers,
        accuracy,
        timeSpent,
        lastStudied,
        completedCategories,
        weakCategories,
        strongCategories
      });

      setCategoryProgress(categoryProgressArray);
    }
  }, [examSessions, incorrectQuestions]);

  return {
    progress,
    categoryProgress,
    isLoading: user && isValidConvexId(user._id) ? (!examSessions || !incorrectQuestions) : false,
    refresh: () => {
      // Trigger a refresh by clearing local state
      setProgress(null);
      setCategoryProgress([]);
    }
  };
};

// Hook for B737 progress tracking
export const useB737Progress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<AircraftProgress | null>(null);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);

  // Get user's exam sessions for B737 - with ID validation
  const examSessions = useQuery(
    api.exams.getUserExamSessions,
    user && isValidConvexId(user._id) ? { userId: user._id } : "skip"
  );

  // Get user's incorrect questions for B737 - with ID validation
  const incorrectQuestions = useQuery(
    api.auth.getUserIncorrectQuestions,
    user && isValidConvexId(user._id) ? { userId: user._id } : "skip"
  );

  useEffect(() => {
    // If user ID is invalid, set up mock progress data
    if (user && !isValidConvexId(user._id)) {
      console.warn("Using demo mode for B737 progress - invalid Convex ID:", user._id);
      
      // Set up demo progress data
      setProgress({
        totalQuestions: 0,
        answeredQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        accuracy: 0,
        timeSpent: 0,
        lastStudied: null,
        completedCategories: [],
        weakCategories: [],
        strongCategories: []
      });
      
      setCategoryProgress([]);
      return;
    }

    if (examSessions && incorrectQuestions) {
      // Filter B737 sessions
      const b737Sessions = examSessions.filter(session => 
        session.answers?.some(answer => 
          // Check if any answer relates to B737 questions
          true // For now, we'll include all sessions
        )
      );

      // Calculate overall progress
      const totalQuestions = b737Sessions.reduce((sum, session) => sum + session.questionsCount, 0);
      const correctAnswers = b737Sessions.reduce((sum, session) => sum + session.correctAnswers, 0);
      const incorrectAnswers = totalQuestions - correctAnswers;
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const timeSpent = b737Sessions.reduce((sum, session) => sum + session.timeSpent, 0);
      const lastStudied = b737Sessions.length > 0 ? new Date(Math.max(...b737Sessions.map(s => s.completedAt))) : null;

      // Filter B737 incorrect questions
      const b737IncorrectQuestions = incorrectQuestions.filter(iq => 
        iq.aircraftType === 'B737_FAMILY'
      );

      // Calculate category progress
      const categoryStats = new Map<string, {
        total: number;
        correct: number;
        incorrect: number;
        lastStudied: number;
      }>();

      // Process exam sessions for category stats
      b737Sessions.forEach(session => {
        session.answers?.forEach(answer => {
          // For now, we'll use a default category since we don't have question details
          const category = 'General';
          const stats = categoryStats.get(category) || { total: 0, correct: 0, incorrect: 0, lastStudied: 0 };
          stats.total++;
          if (answer.isCorrect) {
            stats.correct++;
          } else {
            stats.incorrect++;
          }
          stats.lastStudied = Math.max(stats.lastStudied, session.completedAt);
          categoryStats.set(category, stats);
        });
      });

      // Convert to CategoryProgress array
      const categoryProgressArray: CategoryProgress[] = Array.from(categoryStats.entries()).map(([category, stats]) => ({
        category,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        incorrectAnswers: stats.incorrect,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        lastStudied: stats.lastStudied > 0 ? new Date(stats.lastStudied) : null,
        isCompleted: stats.total > 0 && (stats.correct / stats.total) >= 0.8 // 80% accuracy threshold
      }));

      // Determine category strengths
      const completedCategories = categoryProgressArray.filter(cp => cp.isCompleted).map(cp => cp.category);
      const weakCategories = categoryProgressArray.filter(cp => cp.accuracy < 60).map(cp => cp.category);
      const strongCategories = categoryProgressArray.filter(cp => cp.accuracy >= 80).map(cp => cp.category);

      setProgress({
        totalQuestions,
        answeredQuestions: totalQuestions,
        correctAnswers,
        incorrectAnswers,
        accuracy,
        timeSpent,
        lastStudied,
        completedCategories,
        weakCategories,
        strongCategories
      });

      setCategoryProgress(categoryProgressArray);
    }
  }, [examSessions, incorrectQuestions]);

  return {
    progress,
    categoryProgress,
    isLoading: user && isValidConvexId(user._id) ? (!examSessions || !incorrectQuestions) : false,
    refresh: () => {
      // Trigger a refresh by clearing local state
      setProgress(null);
      setCategoryProgress([]);
    }
  };
};

// Combined hook for all aircraft progress
export const useAircraftProgress = (aircraftType: 'A320_FAMILY' | 'B737_FAMILY' | 'ALL') => {
  const a320Progress = useA320Progress();
  const b737Progress = useB737Progress();

  if (aircraftType === 'A320_FAMILY') {
    return a320Progress;
  } else if (aircraftType === 'B737_FAMILY') {
    return b737Progress;
  } else {
    // Combined progress for ALL
    return {
      progress: null, // Would need to combine both
      categoryProgress: [...(a320Progress.categoryProgress || []), ...(b737Progress.categoryProgress || [])],
      isLoading: a320Progress.isLoading || b737Progress.isLoading,
      refresh: () => {
        a320Progress.refresh();
        b737Progress.refresh();
      }
    };
  }
};