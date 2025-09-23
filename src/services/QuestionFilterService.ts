import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { categoryMappings, matchesCategory } from '@/config/categoryMappings';
import { debugLog } from '@/utils/debug';

export interface FilterCriteria {
  mode: string;
  categories: string[];
  aircraft: string;
  difficulty: string;
  questionCount: number;
}

// Add memoization for expensive operations
const categoryMatchCache = new Map<string, boolean>();
const CACHE_SIZE_LIMIT = 1000;

export class QuestionFilterService {
  private questions: RealAviationQuestion[] = [];
  private filteredCache = new Map<string, RealAviationQuestion[]>();

  constructor(questions: RealAviationQuestion[]) {
    this.questions = [...questions];
  }

  /**
   * Filters questions based on the provided criteria with caching
   */
  filterQuestions(criteria: FilterCriteria): RealAviationQuestion[] {
    // Create cache key from criteria
    const cacheKey = JSON.stringify(criteria);
    
    // Check cache first
    if (this.filteredCache.has(cacheKey)) {
      debugLog('Using cached filter result for:', criteria);
      return this.filteredCache.get(cacheKey)!;
    }

    let filteredQuestions = [...this.questions];
    
    debugLog('Starting with questions:', filteredQuestions.length);
    debugLog('Filter criteria:', criteria);

    // Apply mode-specific filtering
    filteredQuestions = this.applyModeFilter(filteredQuestions, criteria.mode);
    
    // Apply aircraft filter
    filteredQuestions = this.applyAircraftFilter(filteredQuestions, criteria.aircraft);
    
    // Apply category filter
    filteredQuestions = this.applyCategoryFilter(filteredQuestions, criteria.categories);
    
    // Apply difficulty filter
    filteredQuestions = this.applyDifficultyFilter(filteredQuestions, criteria.difficulty);
    
    // Apply fallback logic if no questions found
    if (filteredQuestions.length === 0) {
      filteredQuestions = this.applyFallbackLogic(criteria);
    }
    
    // Shuffle and limit - ensuring we always return the requested count
    const result = this.shuffleAndLimit(filteredQuestions, criteria.questionCount);
    
    // Cache the result
    this.filteredCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory leaks
    if (this.filteredCache.size > 50) {
      const firstKey = this.filteredCache.keys().next().value;
      this.filteredCache.delete(firstKey);
    }
    
    return result;
  }

  private applyModeFilter(questions: RealAviationQuestion[], mode: string): RealAviationQuestion[] {
    if (mode === 'review') {
      // For review mode, provide sample questions for testing
      return questions.filter((_, index) => index % 3 === 0);
    }
    
    if (mode === 'timed') {
      // For timed mode, shuffle all questions
      return questions.sort(() => Math.random() - 0.5);
    }
    
    return questions;
  }

  private applyAircraftFilter(questions: RealAviationQuestion[], aircraft: string): RealAviationQuestion[] {
    if (!aircraft || aircraft === 'ALL') {
      return questions;
    }

    const beforeCount = questions.length;
    
    // Normalize aircraft type for better matching
    const normalizedAircraft = aircraft.toUpperCase();
    
    const filtered = questions.filter(q => {
      const questionAircraftType = q.aircraftType?.toUpperCase() || '';
      
      // Always include general questions
      if (questionAircraftType === 'GENERAL') {
        return true;
      }
      
      // Direct match
      if (questionAircraftType === normalizedAircraft) {
        return true;
      }
      
      // Handle different aircraft type formats
      if (normalizedAircraft === 'A320_FAMILY' || normalizedAircraft === 'A320') {
        return questionAircraftType === 'A320_FAMILY' || questionAircraftType === 'A320';
      }
      
      if (normalizedAircraft === 'B737_FAMILY' || normalizedAircraft === 'B737' || normalizedAircraft === 'BOEING_737') {
        return questionAircraftType === 'B737_FAMILY' || 
               questionAircraftType === 'B737' || 
               questionAircraftType === 'BOEING_737';
      }
      
      return false;
    });
    
    debugLog(`Aircraft filter: ${aircraft} -> ${beforeCount} to ${filtered.length} questions`);
    debugLog('Sample aircraft types in filtered questions:', 
      filtered.slice(0, 5).map(q => q.aircraftType));
    
    return filtered;
  }

  private applyCategoryFilter(questions: RealAviationQuestion[], categories: string[]): RealAviationQuestion[] {
    if (categories.length === 0 || categories.includes('all') || categories.includes('none')) {
      return questions;
    }

    const beforeCount = questions.length;
    
    debugLog('Applying category filter with categories:', categories);
    debugLog('Sample question categories:', questions.slice(0, 5).map(q => q.category));
    
    const filtered = questions.filter(q => {
      return categories.some(selectedCat => {
        // Handle empty or undefined categories
        if (!selectedCat || selectedCat === 'none' || selectedCat === 'all') {
          return true;
        }
        
        // Create cache key for memoization
        const cacheKey = `${q.category}:${selectedCat}`;
        if (categoryMatchCache.has(cacheKey)) {
          return categoryMatchCache.get(cacheKey);
        }
        
        const targetCategories = categoryMappings[selectedCat] || [selectedCat];
        const matches = matchesCategory(q.category, targetCategories);
        
        // Cache the result with size limit
        if (categoryMatchCache.size < CACHE_SIZE_LIMIT) {
          categoryMatchCache.set(cacheKey, matches);
        }
        
        // Additional direct matching for common cases
        if (!matches) {
          const normalizedQuestionCat = q.category?.toLowerCase().replace(/[^\w\s]/g, '').trim();
          const normalizedSelectedCat = selectedCat.toLowerCase().replace(/[^\w\s]/g, '').trim();
          
          // Direct match
          if (normalizedQuestionCat === normalizedSelectedCat) {
            return true;
          }
          
          // Partial match for systems
          if (normalizedSelectedCat.includes('electrical') && normalizedQuestionCat.includes('electrical')) {
            return true;
          }
          if (normalizedSelectedCat.includes('hydraulic') && normalizedQuestionCat.includes('hydraulic')) {
            return true;
          }
          if (normalizedSelectedCat.includes('aircraft') && normalizedQuestionCat.includes('aircraft')) {
            return true;
          }
          if (normalizedSelectedCat.includes('general') && normalizedQuestionCat.includes('general')) {
            return true;
          }
          if (normalizedSelectedCat.includes('airplane') && normalizedQuestionCat.includes('airplane')) {
            return true;
          }
        }
        
        return matches;
      });
    });
    
    debugLog(`Category filter: ${categories.join(', ')} -> ${beforeCount} to ${filtered.length} questions`);
    
    return filtered;
  }

  private applyDifficultyFilter(questions: RealAviationQuestion[], difficulty: string): RealAviationQuestion[] {
    if (!difficulty || difficulty === 'all') {
      return questions;
    }

    const beforeCount = questions.length;
    const filtered = questions.filter(q => q.difficulty === difficulty);
    
    debugLog('After difficulty filter:', beforeCount, '->', filtered.length);
    return filtered;
  }

  private applyFallbackLogic(criteria: FilterCriteria): RealAviationQuestion[] {
    debugLog('Applying fallback logic for criteria:', criteria);
    
    // Step 1: Try with relaxed aircraft filter (include GENERAL questions)
    let fallbackQuestions = this.questions.filter(q => 
      q.aircraftType === 'GENERAL' || 
      q.aircraftType === criteria.aircraft ||
      (criteria.aircraft === 'A320_FAMILY' && q.aircraftType === 'A320_FAMILY') ||
      (criteria.aircraft === 'B737_FAMILY' && q.aircraftType === 'B737_FAMILY')
    );
    
    if (fallbackQuestions.length > 0) {
      debugLog('Fallback step 1 - relaxed aircraft filter:', fallbackQuestions.length);
      return fallbackQuestions.slice(0, criteria.questionCount);
    }
    
    // Step 2: Try with just aircraft filter, ignore categories
    fallbackQuestions = this.questions.filter(q => 
      q.aircraftType === criteria.aircraft ||
      (criteria.aircraft === 'A320_FAMILY' && q.aircraftType === 'A320_FAMILY') ||
      (criteria.aircraft === 'B737_FAMILY' && q.aircraftType === 'B737_FAMILY')
    );
    
    if (fallbackQuestions.length > 0) {
      debugLog('Fallback step 2 - aircraft only:', fallbackQuestions.length);
      return fallbackQuestions.slice(0, criteria.questionCount);
    }
    
    // Step 3: Try any questions from the aircraft type
    fallbackQuestions = this.questions.filter(q => {
      const aircraftMatch = criteria.aircraft === 'A320_FAMILY' ? 
        q.aircraftType?.includes('A320') : 
        criteria.aircraft === 'B737_FAMILY' ? 
          (q.aircraftType?.includes('B737') || q.aircraftType?.includes('BOEING')) :
          q.aircraftType === criteria.aircraft;
      return aircraftMatch;
    });
    
    if (fallbackQuestions.length > 0) {
      debugLog('Fallback step 3 - loose aircraft matching:', fallbackQuestions.length);
      return fallbackQuestions.slice(0, criteria.questionCount);
    }
    
    // Step 4: Provide sample questions as last resort
    debugLog('Fallback step 4 - using sample questions as last resort');
    const sampleQuestions = this.questions.filter((_, index) => index % 3 === 0);
    return sampleQuestions.slice(0, Math.min(criteria.questionCount, 20));
  }

  private shuffleAndLimit(questions: RealAviationQuestion[], limit: number): RealAviationQuestion[] {
    const shuffled = questions.sort(() => Math.random() - 0.5);
    
    // If we don't have enough questions, duplicate some to reach the target count
    let finalQuestions = [...shuffled];
    
    if (finalQuestions.length < limit && finalQuestions.length > 0) {
      debugLog(`Not enough unique questions (${finalQuestions.length}), duplicating to reach ${limit}`);
      
      while (finalQuestions.length < limit) {
        const remainingNeeded = limit - finalQuestions.length;
        const questionsToAdd = shuffled.slice(0, Math.min(remainingNeeded, shuffled.length));
        
        // Create duplicates with modified questions to avoid exact duplicates
        const duplicatedQuestions = questionsToAdd.map((q, index) => ({
          ...q,
          _id: `${q._id}_dup_${Date.now()}_${index}` as any,
          question: `${q.question} (Variante ${Math.floor(finalQuestions.length / shuffled.length) + 1})`
        }));
        
        finalQuestions.push(...duplicatedQuestions);
      }
    }
    
    const limited = finalQuestions.slice(0, limit);
    
    debugLog(`Final filtered questions: ${limited.length} (requested: ${limit})`);
    return limited;
  }
}