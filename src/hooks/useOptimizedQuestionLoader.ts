import { useState, useCallback, useMemo, useRef } from 'react';
import { useQuestionLoader, type QuestionLoadCriteria } from './useQuestionLoader';
import type { RealAviationQuestion } from '@/data/realAviationQuestions';

interface CacheEntry {
  questions: RealAviationQuestion[];
  timestamp: number;
  criteria: QuestionLoadCriteria;
}

import { PERFORMANCE_CONSTANTS } from '@/constants/performance';

const CACHE_DURATION = PERFORMANCE_CONSTANTS.QUESTION_CACHE_DURATION;
const MAX_CACHE_SIZE = 10;

export const useOptimizedQuestionLoader = () => {
  const { loadQuestions, ...rest } = useQuestionLoader();
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const [lastCriteria, setLastCriteria] = useState<QuestionLoadCriteria | null>(null);

  // Generate cache key from criteria
  const getCacheKey = useCallback((criteria: QuestionLoadCriteria): string => {
    return JSON.stringify({
      mode: criteria.mode,
      category: criteria.category,
      aircraft: criteria.aircraft,
      difficulty: criteria.difficulty,
      questionCount: criteria.questionCount
    });
  }, []);

  // Check if cache entry is valid
  const isCacheValid = useCallback((entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }, []);

  // Clean expired cache entries
  const cleanCache = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;
    
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > CACHE_DURATION) {
        cache.delete(key);
      }
    }

    // Limit cache size
    if (cache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest entries
      const toRemove = entries.slice(0, cache.size - MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => cache.delete(key));
    }
  }, []);

  // Optimized load function with caching
  const optimizedLoadQuestions = useCallback(async (criteria: QuestionLoadCriteria) => {
    const cacheKey = getCacheKey(criteria);
    const cache = cacheRef.current;
    const cachedEntry = cache.get(cacheKey);

    // Return cached result if valid
    if (cachedEntry && isCacheValid(cachedEntry)) {
      console.log('Using cached questions for:', criteria);
      return cachedEntry.questions;
    }

    // Load fresh questions
    console.log('Loading fresh questions for:', criteria);
    await loadQuestions(criteria);
    
    // Cache will be updated by the parent hook
    setLastCriteria(criteria);
    cleanCache();
  }, [getCacheKey, isCacheValid, loadQuestions, cleanCache]);

  // Memoized criteria comparison
  const criteriaChanged = useMemo(() => {
    if (!lastCriteria) return true;
    
    return JSON.stringify(lastCriteria) !== JSON.stringify(lastCriteria);
  }, [lastCriteria]);

  // Cache questions when they're loaded
  const cacheQuestions = useCallback((questions: RealAviationQuestion[], criteria: QuestionLoadCriteria) => {
    const cacheKey = getCacheKey(criteria);
    const cache = cacheRef.current;
    
    cache.set(cacheKey, {
      questions: [...questions], // Create a copy to avoid mutations
      timestamp: Date.now(),
      criteria: { ...criteria }
    });
  }, [getCacheKey]);

  return {
    ...rest,
    loadQuestions: optimizedLoadQuestions,
    cacheQuestions,
    criteriaChanged,
    getCacheStats: () => ({
      size: cacheRef.current.size,
      keys: Array.from(cacheRef.current.keys())
    })
  };
};