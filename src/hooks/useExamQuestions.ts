import { useState, useEffect, useMemo } from 'react';
import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorCodes } from '@/utils/errorHandling';

interface UseExamQuestionsOptions {
  examId: string | null;
  selectedCategory: string;
  examMode: string;
  selectedAircraft: string;
  selectedDifficulty: string;
  questionCount: number;
  examTitle?: string;
}

interface UseExamQuestionsResult {
  questions: RealAviationQuestion[];
  isLoading: boolean;
  error: Error | null;
  retryLoading: () => void;
}

export const useExamQuestions = (options: UseExamQuestionsOptions): UseExamQuestionsResult => {
  const [questions, setQuestions] = useState<RealAviationQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { handleAsyncError } = useErrorHandler();

  const {
    examId,
    selectedCategory,
    examMode,
    selectedAircraft,
    selectedDifficulty,
    questionCount,
    examTitle
  } = options;

  // Determine if we should load dynamic questions
  const shouldLoadDynamicQuestions = useMemo(() => {
    const isTemporaryExamId = examId && examId.startsWith('temp_exam_');
    const hasNoRealExamId = !examId || isTemporaryExamId;
    const requiresDynamicQuestions = selectedCategory || examMode === 'timed' || examMode === 'review';
    
    return hasNoRealExamId && requiresDynamicQuestions;
  }, [examId, selectedCategory, examMode]);

  const loadQuestions = async () => {
    if (!shouldLoadDynamicQuestions) return;

    setIsLoading(true);
    setError(null);

    const result = await handleAsyncError(
      async () => {
        const { OptimizedQuestionLoader } = await import('@/services/OptimizedQuestionLoader');
        
        const loadedQuestions = await OptimizedQuestionLoader.loadQuestions({
          mode: examMode,
          category: selectedCategory,
          aircraft: selectedAircraft,
          difficulty: selectedDifficulty,
          questionCount,
          examTitle
        });

        if (loadedQuestions && loadedQuestions.length > 0) {
          return loadedQuestions;
        }

        // Fallback logic
        const { allRealAviationQuestions } = await import('@/data/realAviationQuestions');
        return allRealAviationQuestions
          .slice(0, questionCount)
          .map((q, index) => ({
            ...q,
            _id: `fallback_${index}_${Date.now()}` as any
          }));
      },
      ErrorCodes.QUESTION_LOAD_FAILED,
      {
        fallbackMessage: 'Error al cargar las preguntas. Usando preguntas de respaldo.',
        onError: setError
      }
    );

    if (result) {
      setQuestions(result);
    }

    setIsLoading(false);
  };

  const retryLoading = () => {
    loadQuestions();
  };

  useEffect(() => {
    loadQuestions();
  }, [examId, selectedCategory, examMode, selectedAircraft, selectedDifficulty, questionCount]);

  return {
    questions,
    isLoading,
    error,
    retryLoading
  };
};