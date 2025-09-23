import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppErrorHandler, ErrorCodes } from '@/utils/errorHandling';

export interface ExamAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: ExamAnswer[];
  timeRemaining: number;
  isCompleted: boolean;
  startTime: Date;
  sessionId?: string;
}

interface UseExamStateOptions {
  timeLimit?: number;
  onTimeUp?: () => void;
  onError?: (error: Error) => void;
}

export const useExamState = (options: UseExamStateOptions = {}) => {
  const { timeLimit = 0, onTimeUp, onError } = options;
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: timeLimit * 60,
    isCompleted: false,
    startTime: new Date(),
  });

  const startTimer = useCallback(() => {
    if (timeLimit <= 0) return;

    timerRef.current = setInterval(() => {
      setExamState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          onTimeUp?.();
          return { ...prev, timeRemaining: 0, isCompleted: true };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);
  }, [timeLimit, onTimeUp]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateAnswer = useCallback((questionId: string, selectedAnswer: number) => {
    try {
      const timeSpent = Math.floor((Date.now() - examState.startTime.getTime()) / 1000);
      
      setExamState(prev => {
        const existingAnswerIndex = prev.answers.findIndex(a => a.questionId === questionId);
        
        const newAnswer: ExamAnswer = {
          questionId,
          selectedAnswer,
          timeSpent
        };
        
        if (existingAnswerIndex >= 0) {
          const newAnswers = [...prev.answers];
          newAnswers[existingAnswerIndex] = newAnswer;
          return { ...prev, answers: newAnswers };
        } else {
          return {
            ...prev,
            answers: [...prev.answers, newAnswer]
          };
        }
      });
    } catch (error) {
      const appError = AppErrorHandler.handle(error, ErrorCodes.VALIDATION_ERROR);
      onError?.(new Error(appError.message));
      AppErrorHandler.showToast(appError);
    }
  }, [examState.startTime, onError]);

  const navigateToQuestion = useCallback((index: number, totalQuestions: number) => {
    try {
      if (index < 0 || index >= totalQuestions) {
        throw new Error('Invalid question index');
      }
      
      setExamState(prev => ({
        ...prev,
        currentQuestionIndex: index
      }));
    } catch (error) {
      const appError = AppErrorHandler.handle(error, ErrorCodes.VALIDATION_ERROR);
      onError?.(new Error(appError.message));
      AppErrorHandler.showToast(appError);
    }
  }, [onError]);

  const resetExam = useCallback(() => {
    stopTimer();
    setExamState({
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: timeLimit * 60,
      isCompleted: false,
      startTime: new Date(),
    });
  }, [timeLimit, stopTimer]);

  const completeExam = useCallback(() => {
    stopTimer();
    setExamState(prev => ({
      ...prev,
      isCompleted: true
    }));
  }, [stopTimer]);

  return {
    examState,
    setExamState,
    updateAnswer,
    navigateToQuestion,
    startTimer,
    stopTimer,
    resetExam,
    completeExam
  };
};