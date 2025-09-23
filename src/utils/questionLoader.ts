import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import type { Id } from '../../convex/_generated/dataModel';
import { QuestionFilterService } from '@/services/QuestionFilterService';
import { debugLog, debugWarn } from '@/utils/debug';
import { performanceMonitor, MemoryMonitor } from '@/utils/performance';

// Cache for loaded questions to avoid repeated imports
let questionCache: RealAviationQuestion[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface QuestionLoadCriteria {
  mode: string;
  category: string;
  aircraft: string;
  difficulty: string;
  questionCount: number;
}

/**
 * Dynamically loads and filters questions based on criteria with caching
 * This function is designed to be imported dynamically to reduce initial bundle size
 */
export const loadAndFilterQuestions = async (
  mode: string,
  category: string,
  aircraft: string,
  difficulty: string,
  questionCount: number
): Promise<RealAviationQuestion[]> => {
  return performanceMonitor.measure('loadAndFilterQuestions', async () => {
    // Log memory usage before loading
    MemoryMonitor.logMemoryUsage('before_question_loading');
    
    try {
      // Check cache validity
      const now = Date.now();
      const isCacheValid = questionCache && (now - cacheTimestamp) < CACHE_DURATION;
      
      let questions: RealAviationQuestion[];
      
      if (isCacheValid) {
        debugLog('Using cached questions');
        questions = questionCache!;
      } else {
        debugLog('Loading questions from data source');
        
        // Try to load from multiple sources with priority
        try {
          // Load both clean aviation questions and massive question database
          const [cleanModule, massiveModule] = await Promise.all([
            import('@/data/cleanAviationQuestions'),
            import('@/data/massiveQuestionSeeding')
          ]);
          
          // Combine all questions for maximum coverage
          const cleanQuestions = cleanModule.allAviationQuestions || [];
          const massiveQuestions = massiveModule.getAllMassiveQuestions() || [];
          
          questions = [...cleanQuestions, ...massiveQuestions];
          
          debugLog(`Loaded ${cleanQuestions.length} clean questions and ${massiveQuestions.length} massive questions`);
        } catch (loadError) {
          debugWarn('Error loading question databases:', loadError);
          // Final fallback to just massive questions
          try {
            const { getAllMassiveQuestions } = await import('@/data/massiveQuestionSeeding');
            questions = getAllMassiveQuestions();
          } catch (massiveError) {
            debugWarn('Failed to load massive questions:', massiveError);
            // Last resort fallback
            const { allRealAviationQuestions } = await import('@/data/realAviationQuestions');
            questions = allRealAviationQuestions.slice(0, 100); // Limit to prevent memory issues
          }
        }
        
        // Update cache
        questionCache = questions;
        cacheTimestamp = now;
      }
      
      // Parse categories from comma-separated string
      const categories = category ? category.split(',').map(cat => cat.trim()).filter(Boolean) : [];
      
      // Validate input parameters
      const criteria = validateAndNormalizeCriteria({
        mode,
        categories,
        aircraft,
        difficulty,
        questionCount
      });
      
      // Use the filter service with performance monitoring
      const filterService = new QuestionFilterService(questions);
      const filteredQuestions = performanceMonitor.measureSync('filterQuestions', () => 
        filterService.filterQuestions(criteria),
        { totalQuestions: questions.length, criteria }
      );
      
      // Log memory usage after filtering
      MemoryMonitor.logMemoryUsage('after_question_filtering');
      
      debugLog(`Loaded ${filteredQuestions.length} questions from ${questions.length} total`);
      
      return filteredQuestions;
      
    } catch (error) {
      debugWarn('Error loading questions:', error);
      
      // Final fallback to basic questions
      try {
        const { allRealAviationQuestions } = await import('@/data/realAviationQuestions');
        const fallbackQuestions = allRealAviationQuestions
          .slice(0, Math.min(questionCount, 50))
          .map((q, index) => ({
            ...q,
            _id: `fallback_${index}_${Date.now()}` as Id<"examQuestions">
          }));
        
        debugWarn(`Using ${fallbackQuestions.length} fallback questions`);
        return fallbackQuestions;
      } catch (fallbackError) {
        debugWarn('Fallback loading also failed:', fallbackError);
        throw new Error('Failed to load questions from all sources');
      }
    }
  }, { mode, category, aircraft, difficulty, questionCount });
};

/**
 * Validates and normalizes filter criteria
 */
function validateAndNormalizeCriteria(criteria: {
  mode: string;
  categories: string[];
  aircraft: string;
  difficulty: string;
  questionCount: number;
}): {
  mode: string;
  categories: string[];
  aircraft: string;
  difficulty: string;
  questionCount: number;
} {
  return {
    mode: criteria.mode || 'practice',
    categories: criteria.categories.filter(Boolean),
    aircraft: criteria.aircraft || 'ALL',
    difficulty: criteria.difficulty || 'all',
    questionCount: Math.max(1, Math.min(criteria.questionCount || 20, 100)) // Limit between 1-100
  };
}

/**
 * Clears the question cache (useful for testing or memory management)
 */
export const clearQuestionCache = (): void => {
  questionCache = null;
  cacheTimestamp = 0;
  
  // Clear any module-level caches in imported modules
  if (typeof window !== 'undefined') {
    // Clear any global caches that might exist
    (window as any).__questionCache__ = null;
  }
  
  debugLog('Question cache cleared');
};

/**
 * Preloads questions for better performance
 */
export const preloadQuestions = async (): Promise<void> => {
  try {
    const { allAviationQuestions } = await import('@/data/cleanAviationQuestions');
    questionCache = allAviationQuestions;
    cacheTimestamp = Date.now();
    debugLog(`Preloaded ${allAviationQuestions.length} questions`);
  } catch (error) {
    debugWarn('Failed to preload questions:', error);
  }
};