/**
 * Performance-related constants
 */

export const PERFORMANCE_CONSTANTS = {
  // Cache durations
  QUESTION_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  CATEGORY_MATCH_CACHE_SIZE: 1000,
  MAX_FILTER_CACHE_SIZE: 50,
  
  // Question limits
  MAX_QUESTIONS_PER_EXAM: 100,
  MIN_QUESTIONS_PER_EXAM: 1,
  DEFAULT_QUESTION_COUNT: 20,
  FALLBACK_QUESTION_LIMIT: 50,
  
  // Performance thresholds
  SLOW_OPERATION_THRESHOLD: 1000, // ms
  RENDER_WARNING_THRESHOLD: 16, // ms
  QUESTION_LOAD_WARNING_THRESHOLD: 100, // ms
  
  // Memory thresholds
  HIGH_MEMORY_USAGE_THRESHOLD: 0.8, // 80% of available memory
  
  // Retry settings
  AUTO_RETRY_DELAY: 5000, // ms
  MAX_RETRY_ATTEMPTS: 3,
} as const;

export const CONVEX_CONSTANTS = {
  ID_LENGTH: 32,
  ID_PATTERN: /^[a-z0-9]{32}$/,
} as const;

export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300, // ms
  ANIMATION_DURATION: 200, // ms
  TOAST_DURATION: 5000, // ms
} as const;