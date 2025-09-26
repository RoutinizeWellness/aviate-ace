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
      // STRICT FILTERING: Only include questions that match selected subjects
      return categories.some(selectedCat => {
        // Handle empty or undefined categories
        if (!selectedCat || selectedCat === 'none' || selectedCat === 'all') {
          return false; // Don't include unless specifically selected
        }
        
        // Create cache key for memoization
        const cacheKey = `${q.category}:${selectedCat}`;
        if (categoryMatchCache.has(cacheKey)) {
          return categoryMatchCache.get(cacheKey);
        }
        
        // First try exact matching with category mappings
        const targetCategories = categoryMappings[selectedCat] || [selectedCat];
        let matches = matchesCategory(q.category, targetCategories);
        
        // If no exact match, try normalized matching
        if (!matches) {
          const normalizedQuestionCat = (q.category || '').toLowerCase().replace(/[^\w\s]/g, '').trim();
          const normalizedSelectedCat = selectedCat.toLowerCase().replace(/[^\w\s]/g, '').trim();
          
          // EXACT subject matching - must be from selected subject only
          if (normalizedQuestionCat === normalizedSelectedCat) {
            matches = true;
          }
          // Subject-specific keyword matching
          else if (normalizedSelectedCat.includes('electrical') && normalizedQuestionCat.includes('electrical')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('hydraulic') && normalizedQuestionCat.includes('hydraulic')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('aircraft') && normalizedQuestionCat.includes('aircraft')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('general') && normalizedQuestionCat.includes('general')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('performance') && normalizedQuestionCat.includes('performance')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('engine') && normalizedQuestionCat.includes('engine')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('navigation') && normalizedQuestionCat.includes('navigation')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('weather') && normalizedQuestionCat.includes('weather')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('regulation') && normalizedQuestionCat.includes('regulation')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('procedure') && normalizedQuestionCat.includes('procedure')) {
            matches = true;
          }
          else if (normalizedSelectedCat.includes('system') && normalizedQuestionCat.includes('system')) {
            matches = true;
          }
        }
        
        // Cache the result with size limit
        if (categoryMatchCache.size < CACHE_SIZE_LIMIT) {
          categoryMatchCache.set(cacheKey, matches);
        }
        
        return matches;
      });
    });
    
    debugLog(`Category filter: ${categories.join(', ')} -> ${beforeCount} to ${filtered.length} questions`);
    
    // If strict filtering returns no questions, log warning but don't fallback
    if (filtered.length === 0) {
      debugLog('WARNING: Strict category filtering returned 0 questions. Selected categories may not exist in question bank.');
      debugLog('Available categories in question bank:', [...new Set(questions.map(q => q.category).filter(Boolean))]);
    }
    
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
    
    // IMPORTANT: Fallback must still respect subject filtering
    // We should NOT mix subjects even in fallback scenarios
    
    // Step 1: Try with exact category match but relaxed aircraft filter
    if (criteria.categories.length > 0) {
      let fallbackQuestions = this.questions.filter(q => {
        const aircraftMatch = q.aircraftType === 'GENERAL' || 
          q.aircraftType === criteria.aircraft ||
          (criteria.aircraft === 'A320_FAMILY' && q.aircraftType === 'A320_FAMILY') ||
          (criteria.aircraft === 'B737_FAMILY' && q.aircraftType === 'B737_FAMILY');
        
        const categoryMatch = criteria.categories.some(selectedCat => {
          const normalizedQuestionCat = (q.category || '').toLowerCase().replace(/[^\w\s]/g, '').trim();
          const normalizedSelectedCat = selectedCat.toLowerCase().replace(/[^\w\s]/g, '').trim();
          return normalizedQuestionCat.includes(normalizedSelectedCat) || 
                 normalizedSelectedCat.includes(normalizedQuestionCat);
        });
        
        return aircraftMatch && categoryMatch;
      });
      
      if (fallbackQuestions.length > 0) {
        debugLog('Fallback step 1 - relaxed aircraft filter with category matching:', fallbackQuestions.length);
        return fallbackQuestions.slice(0, criteria.questionCount);
      }
    }
    
    // Step 2: Try with ANY aircraft but STRICT category filter
    if (criteria.categories.length > 0) {
      let fallbackQuestions = this.questions.filter(q => {
        return criteria.categories.some(selectedCat => {
          const normalizedQuestionCat = (q.category || '').toLowerCase().replace(/[^\w\s]/g, '').trim();
          const normalizedSelectedCat = selectedCat.toLowerCase().replace(/[^\w\s]/g, '').trim();
          return normalizedQuestionCat === normalizedSelectedCat ||
                 normalizedQuestionCat.includes(normalizedSelectedCat) ||
                 normalizedSelectedCat.includes(normalizedQuestionCat);
        });
      });
      
      if (fallbackQuestions.length > 0) {
        debugLog('Fallback step 2 - any aircraft with strict category:', fallbackQuestions.length);
        return fallbackQuestions.slice(0, criteria.questionCount);
      }
    }
    
    // Step 3: Only if NO categories specified, provide aircraft-based fallback
    if (criteria.categories.length === 0) {
      let fallbackQuestions = this.questions.filter(q => 
        q.aircraftType === criteria.aircraft ||
        (criteria.aircraft === 'A320_FAMILY' && q.aircraftType === 'A320_FAMILY') ||
        (criteria.aircraft === 'B737_FAMILY' && q.aircraftType === 'B737_FAMILY')
      );
      
      if (fallbackQuestions.length > 0) {
        debugLog('Fallback step 3 - aircraft only (no categories specified):', fallbackQuestions.length);
        return fallbackQuestions.slice(0, criteria.questionCount);
      }
    }
    
    // Step 4: Log error and provide NO questions rather than mixing subjects
    debugLog('FALLBACK FAILED: No questions found matching selected subjects. This prevents subject mixing.');
    debugLog('Selected categories:', criteria.categories);
    debugLog('Available categories:', [...new Set(this.questions.map(q => q.category).filter(Boolean))]);
    
    // Return empty array to prevent subject mixing
    return [];
  }

  private shuffleAndLimit(questions: RealAviationQuestion[], limit: number): RealAviationQuestion[] {
    // Enforce uniqueness by question text
    const seen = new Set<string>();
    const unique = questions.filter(q => {
      const key = (q.question || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const shuffled = unique.sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, Math.min(limit, shuffled.length));

    if (limited.length < limit) {
      debugLog(`Only ${limited.length} unique questions available for current filters (requested ${limit}).`);
    }

    return limited;
  }
}