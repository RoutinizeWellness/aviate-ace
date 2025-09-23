import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { QuestionFilterService, type FilterCriteria } from '@/services/QuestionFilterService';
import { CategoryNormalizationService } from '@/services/CategoryNormalizationService';
import { performanceMonitor } from '@/utils/performance';

interface QuestionLoadOptions {
  mode: string;
  category: string;
  aircraft: string;
  difficulty: string;
  questionCount: number;
  examTitle?: string;
}

interface QuestionCache {
  questions: RealAviationQuestion[];
  timestamp: number;
  key: string;
}

export class OptimizedQuestionLoader {
  private static cache = new Map<string, QuestionCache>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_CACHE_SIZE = 10;

  /**
   * Loads and filters questions with caching and performance optimization
   */
  static async loadQuestions(options: QuestionLoadOptions): Promise<RealAviationQuestion[]> {
    return performanceMonitor.measure('OptimizedQuestionLoader.loadQuestions', async () => {
      // Normalize category first
      const normalizedCategory = CategoryNormalizationService.normalizeCategory(
        options.category,
        options.examTitle,
        options.aircraft
      );

      const cacheKey = this.generateCacheKey({
        ...options,
        category: normalizedCategory
      });

      // Check cache first
      const cachedResult = this.getCachedQuestions(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Load questions from data sources
      const allQuestions = await this.loadAllQuestions();
      
      // Filter questions
      const filterCriteria: FilterCriteria = {
        mode: options.mode,
        categories: normalizedCategory ? [normalizedCategory] : [],
        aircraft: options.aircraft,
        difficulty: options.difficulty,
        questionCount: options.questionCount
      };

      const filterService = new QuestionFilterService(allQuestions);
      const filteredQuestions = filterService.filterQuestions(filterCriteria);

      // Cache the result
      this.cacheQuestions(cacheKey, filteredQuestions);

      return filteredQuestions;
    });
  }

  /**
   * Preloads questions for better performance
   */
  static async preloadQuestions(): Promise<void> {
    try {
      await this.loadAllQuestions();
    } catch (error) {
      console.warn('Failed to preload questions:', error);
    }
  }

  /**
   * Clears the question cache
   */
  static clearCache(): void {
    this.cache.clear();
  }

  private static async loadAllQuestions(): Promise<RealAviationQuestion[]> {
    return performanceMonitor.measure('loadAllQuestions', async () => {
      try {
        // Load both clean aviation questions and massive question database
        const [cleanModule, massiveModule] = await Promise.all([
          import('@/data/cleanAviationQuestions'),
          import('@/data/massiveQuestionSeeding')
        ]);
        
        const cleanQuestions = cleanModule.allAviationQuestions || [];
        const massiveQuestions = massiveModule.getAllMassiveQuestions() || [];
        
        return [...cleanQuestions, ...massiveQuestions];
      } catch (error) {
        console.warn('Error loading question databases:', error);
        
        // Fallback to just massive questions
        try {
          const { getAllMassiveQuestions } = await import('@/data/massiveQuestionSeeding');
          return getAllMassiveQuestions();
        } catch (massiveError) {
          console.warn('Failed to load massive questions:', massiveError);
          
          // Last resort fallback
          const { allRealAviationQuestions } = await import('@/data/realAviationQuestions');
          return allRealAviationQuestions.slice(0, 100);
        }
      }
    });
  }

  private static generateCacheKey(options: QuestionLoadOptions): string {
    return JSON.stringify({
      mode: options.mode,
      category: options.category,
      aircraft: options.aircraft,
      difficulty: options.difficulty,
      questionCount: options.questionCount
    });
  }

  private static getCachedQuestions(key: string): RealAviationQuestion[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.questions;
  }

  private static cacheQuestions(key: string, questions: RealAviationQuestion[]): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      questions: [...questions], // Create a copy to avoid mutations
      timestamp: Date.now(),
      key
    });
  }
}