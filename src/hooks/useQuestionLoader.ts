import { useState, useCallback, useRef, useEffect } from 'react';
import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { AppErrorHandler, ErrorCodes } from '@/utils/errorHandling';
import { debugLog } from '@/utils/debug';

export interface QuestionLoadCriteria {
  mode: string;
  category: string;
  aircraft: string;
  difficulty: string;
  questionCount: number;
}

interface UseQuestionLoaderResult {
  questions: RealAviationQuestion[];
  isLoading: boolean;
  error: Error | null;
  loadQuestions: (criteria: QuestionLoadCriteria) => Promise<void>;
  retryLoad: () => Promise<void>;
  clearQuestions: () => void;
  loadingProgress: number;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  stage: 'idle' | 'importing' | 'filtering' | 'complete' | 'error';
}

export const useQuestionLoader = (): UseQuestionLoaderResult => {
  const [questions, setQuestions] = useState<RealAviationQuestion[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    stage: 'idle'
  });
  const [error, setError] = useState<Error | null>(null);
  
  // Keep track of the last criteria for retry functionality
  const lastCriteriaRef = useRef<QuestionLoadCriteria | null>(null);
  
  // Abort controller for cancelling requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const updateLoadingState = useCallback((updates: Partial<LoadingState>) => {
    setLoadingState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadQuestions = useCallback(async (criteria: QuestionLoadCriteria) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    // Store criteria for retry
    lastCriteriaRef.current = criteria;
    
    // Reset state
    setError(null);
    updateLoadingState({
      isLoading: true,
      progress: 0,
      stage: 'importing'
    });
    
    try {
      // Check if request was cancelled
      if (signal.aborted) return;
      
      debugLog('Loading questions with criteria:', criteria);
      
      // Stage 1: Import question loader (25% progress)
      updateLoadingState({ progress: 25, stage: 'importing' });
      const { loadAndFilterQuestions } = await import('@/utils/questionLoader');
      
      if (signal.aborted) return;
      
      // Stage 2: Load and filter questions (75% progress)
      updateLoadingState({ progress: 50, stage: 'filtering' });
      
      const loadedQuestions = await loadAndFilterQuestions(
        criteria.mode,
        criteria.category,
        criteria.aircraft,
        criteria.difficulty,
        criteria.questionCount
      );
      
      if (signal.aborted) return;
      
      // Stage 3: Complete (100% progress)
      updateLoadingState({ progress: 100, stage: 'complete' });
      
      setQuestions(loadedQuestions);
      debugLog(`Successfully loaded ${loadedQuestions.length} questions`);
      
    } catch (err) {
      if (signal.aborted) return;
      
      updateLoadingState({ stage: 'error' });
      
      const appError = AppErrorHandler.handle(err, ErrorCodes.QUESTION_LOAD_FAILED);
      setError(new Error(appError.message));
      AppErrorHandler.showToast(appError);
      
      // Provide fallback questions
      try {
        debugLog('Loading fallback questions...');
        const { allRealAviationQuestions } = await import('@/data/realAviationQuestions');
        const fallbackQuestions = allRealAviationQuestions
          .slice(0, criteria.questionCount)
          .map((q, index) => ({
            ...q,
            _id: `fallback_${index}_${Date.now()}` as any // Type assertion for fallback compatibility
          }));
        
        if (!signal.aborted) {
          setQuestions(fallbackQuestions as RealAviationQuestion[]);
          debugLog(`Loaded ${fallbackQuestions.length} fallback questions`);
        }
      } catch (fallbackError) {
        debugLog('Failed to load fallback questions:', fallbackError);
        if (!signal.aborted) {
          setQuestions([]);
        }
      }
    } finally {
      if (!signal.aborted) {
        updateLoadingState({
          isLoading: false,
          progress: 100
        });
      }
    }
  }, [updateLoadingState]);

  const retryLoad = useCallback(async () => {
    if (lastCriteriaRef.current) {
      await loadQuestions(lastCriteriaRef.current);
    }
  }, [loadQuestions]);

  const clearQuestions = useCallback(() => {
    setQuestions([]);
    setError(null);
    updateLoadingState({
      isLoading: false,
      progress: 0,
      stage: 'idle'
    });
    lastCriteriaRef.current = null;
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [updateLoadingState]);

  return {
    questions,
    isLoading: loadingState.isLoading,
    error,
    loadQuestions,
    retryLoad,
    clearQuestions,
    loadingProgress: loadingState.progress
  };
};