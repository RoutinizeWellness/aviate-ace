import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from './useConvexAuth';
import { useToast } from './use-toast';
import type { Id } from '../../convex/_generated/dataModel';

// Helper function to validate Convex IDs
const isValidConvexId = (id: string): boolean => {
  // Convex IDs are 32-character strings with lowercase letters and digits
  return /^[a-z0-9]{32}$/.test(id);
};

export interface QuestionReview {
  _id: Id<"userIncorrectQuestions">;
  userId: Id<"users">;
  questionId: Id<"examQuestions">;
  category: string;
  difficulty?: string;
  aircraftType?: string;
  isResolved: boolean;
  attemptCount: number;
  lastAttemptAt: number;
  createdAt: number;
  question?: any; // The actual question data
}

export const useQuestionReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Convex mutations
  const markIncorrectMutation = useMutation(api.auth.recordIncorrectQuestion);
  const markResolvedMutation = useMutation(api.auth.markQuestionResolved);

  // Convex queries
  const reviewQuestions = useQuery(
    api.auth.getUserIncorrectQuestions,
    user && isValidConvexId(user._id) 
      ? { userId: user._id, onlyUnresolved: true }
      : "skip"
  );

  const getReviewQuestionsByCategory = (category?: string) => {
    return useQuery(
      api.auth.getUserIncorrectQuestions,
      user && isValidConvexId(user._id)
        ? { userId: user._id, category, onlyUnresolved: true }
        : "skip"
    );
  };

  // Mark a question for review (when answered incorrectly)
  const markQuestionForReview = async (
    questionId: Id<"examQuestions">,
    category: string,
    incorrectAnswer: number,
    correctAnswer: number,
    sessionType: string = 'practice',
    difficulty?: string,
    aircraftType?: string
  ) => {
    if (!user || !isValidConvexId(user._id)) {
      toast({
        title: "Error",
        description: "Usuario no autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await markIncorrectMutation({
        userId: user._id,
        questionId,
        incorrectAnswer,
        correctAnswer,
        sessionType,
        category,
        difficulty: difficulty || 'intermediate',
        aircraftType: aircraftType || 'A320_FAMILY',
      });

      toast({
        title: "Pregunta marcada para repasar",
        description: "Esta pregunta se ha añadido a tu lista de repaso.",
      });
    } catch (error) {
      console.error('Error marking question for review:', error);
      toast({
        title: "Error",
        description: "No se pudo marcar la pregunta para repaso.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a question as resolved (no longer needs review)
  const markQuestionResolved = async (questionId: Id<"examQuestions">) => {
    if (!user || !isValidConvexId(user._id)) {
      toast({
        title: "Error", 
        description: "Usuario no autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await markResolvedMutation({
        userId: user._id,
        questionId,
      });

      toast({
        title: "Pregunta resuelta",
        description: "Esta pregunta ya no aparecerá en tu lista de repaso.",
      });
    } catch (error) {
      console.error('Error marking question as resolved:', error);
      toast({
        title: "Error",
        description: "No se pudo marcar la pregunta como resuelta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the count of questions marked for review
  const getReviewCount = () => {
    return reviewQuestions?.length || 0;
  };

  // Get review questions by category
  const getReviewQuestionsByCategories = () => {
    const categories = ['Aircraft Systems', 'Flight Protection', 'Approach Procedures', 
                      'Emergency Procedures', 'Meteorology', 'Regulations', 'Navigation', 'Performance'];
    
    const categoryCounts: Record<string, number> = {};
    
    if (reviewQuestions) {
      categories.forEach(category => {
        categoryCounts[category] = reviewQuestions.filter(q => q.category === category).length;
      });
    }
    
    return categoryCounts;
  };

  return {
    reviewQuestions: reviewQuestions || [],
    markQuestionForReview,
    markQuestionResolved,
    getReviewCount,
    getReviewQuestionsByCategories,
    getReviewQuestionsByCategory,
    isLoading,
  };
};