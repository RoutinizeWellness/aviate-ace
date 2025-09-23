// Exam configuration constants
export const EXAM_CONSTANTS = {
  // Time limits (in minutes)
  DEFAULT_TIME_LIMIT: 60,
  PRACTICE_TIME_LIMIT: 0, // No time limit
  TIMED_EXAM_TIME_LIMIT: 90,
  QUICK_EXAM_TIME_LIMIT: 30,

  // Question counts
  DEFAULT_QUESTION_COUNT: 20,
  MIN_QUESTION_COUNT: 5,
  MAX_QUESTION_COUNT: 100,
  QUICK_EXAM_QUESTION_COUNT: 10,

  // Scoring
  DEFAULT_PASSING_SCORE: 70,
  ADVANCED_PASSING_SCORE: 80,
  EXPERT_PASSING_SCORE: 85,

  // Cache settings
  QUESTION_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 50,

  // Performance settings
  QUESTIONS_PER_BATCH: 20,
  DEBOUNCE_DELAY: 300,

  // UI settings
  OPTION_LETTERS: ['A', 'B', 'C', 'D'] as const,
  MAX_OPTION_LENGTH: 200,
  MAX_QUESTION_LENGTH: 500,
  MAX_EXPLANATION_LENGTH: 1000,
} as const;

// Exam mode labels for UI
export const EXAM_MODE_LABELS = {
  practice: 'Modo Práctica',
  timed: 'Modo Examen Cronometrado',
  review: 'Modo Repaso'
} as const;

// Difficulty labels for UI
export const DIFFICULTY_LABELS = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  beginner: 'Principiante'
} as const;

// Aircraft type labels for UI
export const AIRCRAFT_TYPE_LABELS = {
  A320_FAMILY: 'Airbus A320 Family',
  B737_FAMILY: 'Boeing 737 Family',
  BOEING_737: 'Boeing 737',
  GENERAL: 'Aviación General'
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CONVEX_ID: /^[a-z0-9]{32}$/,
  TEMP_ID: /^(temp_|fallback_)/,
} as const;