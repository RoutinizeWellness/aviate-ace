/**
 * Centralized configuration for exam-related constants and settings
 */

export const EXAM_CONFIG = {
  // Question loading
  QUESTION_LIMITS: {
    MIN_QUESTIONS: 1,
    MAX_QUESTIONS: 100,
    DEFAULT_PRACTICE: 20,
    DEFAULT_TIMED: 50,
    DEFAULT_REVIEW: 30
  },

  // Time limits (in minutes)
  TIME_LIMITS: {
    DEFAULT_PRACTICE: 0, // No time limit
    DEFAULT_TIMED: 60,
    DEFAULT_REVIEW: 0,
    MAX_TIME_LIMIT: 300 // 5 hours
  },

  // Scoring
  SCORING: {
    PASSING_SCORE_PRACTICE: 70,
    PASSING_SCORE_TIMED: 80,
    PASSING_SCORE_REVIEW: 75,
    MAX_SCORE: 100
  },

  // Cache settings
  CACHE: {
    QUESTION_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    MAX_CACHE_SIZE: 10,
    PRELOAD_CACHE_SIZE: 3
  },

  // Performance
  PERFORMANCE: {
    QUESTION_BATCH_SIZE: 50,
    LAZY_LOAD_THRESHOLD: 100,
    DEBOUNCE_DELAY: 300
  },

  // UI Constants
  UI: {
    PROGRESS_UPDATE_INTERVAL: 1000, // 1 second
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    TOAST_DURATION: 5000 // 5 seconds
  }
} as const;

export const AIRCRAFT_TYPES = {
  A320_FAMILY: 'A320_FAMILY',
  B737_FAMILY: 'B737_FAMILY',
  BOEING_737: 'BOEING_737',
  GENERAL: 'GENERAL'
} as const;

export const EXAM_MODES = {
  PRACTICE: 'practice',
  TIMED: 'timed',
  REVIEW: 'review'
} as const;

export const DIFFICULTY_LEVELS = {
  BASIC: 'basic',
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

export type AircraftType = typeof AIRCRAFT_TYPES[keyof typeof AIRCRAFT_TYPES];
export type ExamMode = typeof EXAM_MODES[keyof typeof EXAM_MODES];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];