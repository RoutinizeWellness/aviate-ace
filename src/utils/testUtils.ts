/**
 * Testing utilities for the aviation training platform
 */

import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { AIRCRAFT_TYPES, DIFFICULTY_LEVELS, EXAM_MODES } from '@/config/examConfig';

/**
 * Creates mock aviation questions for testing
 */
export const createMockQuestion = (overrides: Partial<RealAviationQuestion> = {}): RealAviationQuestion => {
  const baseQuestion: RealAviationQuestion = {
    _id: `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` as any,
    question: "What is the maximum operating altitude for the A320?",
    options: [
      "39,000 ft",
      "41,000 ft", 
      "37,000 ft",
      "43,000 ft"
    ],
    correctAnswer: 1,
    explanation: "The A320 has a maximum certified altitude of 41,000 feet according to the flight manual.",
    aircraftType: AIRCRAFT_TYPES.A320_FAMILY,
    category: "Aircraft General",
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM",
    regulationCode: "EASA CS-25"
  };

  return { ...baseQuestion, ...overrides };
};

/**
 * Creates a batch of mock questions
 */
export const createMockQuestions = (count: number, overrides: Partial<RealAviationQuestion> = {}): RealAviationQuestion[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockQuestion({
      ...overrides,
      _id: `mock_${Date.now()}_${index}` as any,
      question: `Mock question ${index + 1}: ${overrides.question || 'What is the correct answer?'}`,
    })
  );
};

/**
 * Mock exam session data
 */
export const createMockExamSession = (overrides = {}) => ({
  sessionId: `session_${Date.now()}`,
  examId: `exam_${Date.now()}`,
  userId: `user_${Date.now()}`,
  startTime: new Date(),
  endTime: null,
  mode: EXAM_MODES.PRACTICE,
  questionsCount: 20,
  correctAnswers: 0,
  score: 0,
  timeSpent: 0,
  isCompleted: false,
  ...overrides
});

/**
 * Mock user data
 */
export const createMockUser = (overrides = {}) => ({
  _id: `user_${Date.now()}`,
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'user',
  accountType: 'free',
  isActive: true,
  _creationTime: Date.now(),
  ...overrides
});

/**
 * Delays execution for testing async operations
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(key => delete store[key]); },
    length: Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] || null
  };
};

/**
 * Mock performance.now() for consistent timing in tests
 */
export const mockPerformanceNow = () => {
  let currentTime = 0;
  
  return {
    now: () => currentTime,
    advance: (ms: number) => { currentTime += ms; },
    reset: () => { currentTime = 0; }
  };
};

/**
 * Validates question structure
 */
export const validateQuestionStructure = (question: any): boolean => {
  const requiredFields = ['_id', 'question', 'options', 'correctAnswer', 'explanation', 'aircraftType', 'category', 'difficulty'];
  
  return requiredFields.every(field => question.hasOwnProperty(field)) &&
         Array.isArray(question.options) &&
         question.options.length === 4 &&
         typeof question.correctAnswer === 'number' &&
         question.correctAnswer >= 0 &&
         question.correctAnswer <= 3;
};