import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RealAviationQuestion } from '@/data/realAviationQuestions';
import { loadAndFilterQuestions } from '@/utils/questionLoader';
import { OptimizedQuestionLoader } from '@/services/OptimizedQuestionLoader';

interface ExamModeConfig {
  mode: 'practice' | 'timed' | 'review';
  category: string;
  aircraft: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  examTitle: string;
}

interface ExamModeState {
  isLoading: boolean;
  questions: RealAviationQuestion[];
  dynamicQuestions: RealAviationQuestion[] | null;
  questionsError: Error | null;
  selectedAnswer: number | null;
  isAnswered: boolean;
  showExplanation: boolean;
}

export const useExamMode = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<ExamModeState>({
    isLoading: false,
    questions: [],
    dynamicQuestions: null,
    questionsError: null,
    selectedAnswer: null,
    isAnswered: false,
    showExplanation: false,
  });

  // Extract and validate exam URL parameters
  const config = useMemo((): ExamModeConfig => {
    const rawMode = searchParams.get('mode') || 'practice';
    const examMode: 'practice' | 'timed' | 'review' = 
      rawMode === 'timed' || rawMode === 'review' ? rawMode : 'practice';
    
    const selectedCategory = searchParams.get('category') || '';
    const categoriesParam = searchParams.get('categories') || '';
    const examTitle = searchParams.get('title') || '';
    
    // Extract category from title for practice exams
    const categoryFromTitle = examTitle.startsWith('Práctica:') && examTitle
      ? examTitle.replace('Práctica:', '').trim().toLowerCase().replace(/\s+/g, '-')
      : '';
    
    const categoryMap: { [key: string]: string } = {
      'electrical': 'electrical',
      'sistema-eléctrico': 'electrical', 
      'hydraulics': 'hydraulics',
      'sistema-hidráulico': 'hydraulics',
      'performance': 'performance',
    };

    const selectedCategory2 = categoryMap[categoryFromTitle] || categoryFromTitle || selectedCategory;

    if (!selectedCategory2 && categoriesParam) {
      // Handle multiple categories
    }

    return {
      mode: examMode,
      category: selectedCategory2,
      aircraft: searchParams.get('aircraft') || 'A320_FAMILY',
      difficulty: searchParams.get('difficulty') || '',
      questionCount: parseInt(searchParams.get('questionCount') || '20'),
      timeLimit: parseInt(searchParams.get('timeLimit') || '0'),
      examTitle,
    };
  }, [searchParams]);

  const shouldLoadDynamicQuestions = useCallback((examId: string | null, mode: string, category: string): boolean => {
    const hasNoRealExamId = !examId || examId.startsWith('temp_exam_');
    const isTemporary = examId && examId.startsWith('temp_exam_');
    const requiresDynamicQuestions = mode === 'practice' || mode === 'timed' || mode === 'review';
    
    return hasNoRealExamId && requiresDynamicQuestions && !!category;
  }, []);

  const loadDynamicQuestions = useCallback(async (examId: string | null, config: ExamModeConfig) => {
    if (!shouldLoadDynamicQuestions(examId, config.mode, config.category)) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, questionsError: null }));
    
    try {
      const loadedQuestions = await OptimizedQuestionLoader.loadAndFilterQuestions(
        config.mode,
        config.category || 'all',
        config.aircraft,
        config.difficulty,
        config.questionCount,
        config.examTitle
      );

      if (loadedQuestions && loadedQuestions.length > 0) {
        setState(prev => ({ ...prev, dynamicQuestions: loadedQuestions, isLoading: false }));
      } else {
        // Fallback questions
        const { allRealAviationQuestions } = await import('@/data/cleanAviationQuestions');
        const fallbackQuestions = allRealAviationQuestions
          .slice(0, config.questionCount)
          .map((q, index) => ({
            ...q,
            _id: `fallback_${index}_${Date.now()}` as any,
          }));

        setState(prev => ({ ...prev, dynamicQuestions: fallbackQuestions, isLoading: false }));
      }
    } catch (fallbackError) {
      console.error('Error loading fallback questions:', fallbackError);
      setState(prev => ({ 
        ...prev, 
        questionsError: fallbackError as Error,
        isLoading: false 
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [config.questionCount, shouldLoadDynamicQuestions]);

  useEffect(() => {
    loadDynamicQuestions(null, config);
  }, [config, loadDynamicQuestions]);

  return {
    ...state,
    config,
    setState,
  };
};