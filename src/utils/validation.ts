/**
 * Validation utilities for aviation training platform
 */

// Question validation
export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
}

import { isValidAircraftType, isValidDifficulty } from '@/types/exam';

export const validateQuestion = (question: {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  aircraftType: string;
  category: string;
  difficulty: string;
}): QuestionValidationResult => {
  const errors: string[] = [];

  // Question text validation
  if (!question.question?.trim()) {
    errors.push('Question text is required');
  } else if (question.question.trim().length < 10) {
    errors.push('Question text must be at least 10 characters long');
  } else if (question.question.trim().length > 500) {
    errors.push('Question text must be less than 500 characters');
  }

  // Options validation
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push('Exactly 4 options are required');
  } else {
    question.options.forEach((option, index) => {
      if (!option?.trim()) {
        errors.push(`Option ${index + 1} is required`);
      } else if (option.trim().length > 200) {
        errors.push(`Option ${index + 1} must be less than 200 characters`);
      }
    });

    // Check for duplicate options
    const uniqueOptions = new Set(question.options.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== question.options.length) {
      errors.push('All options must be unique');
    }
  }

  // Correct answer validation
  if (typeof question.correctAnswer !== 'number' || 
      question.correctAnswer < 0 || 
      question.correctAnswer > 3) {
    errors.push('Correct answer must be between 0 and 3');
  }

  // Explanation validation
  if (!question.explanation?.trim()) {
    errors.push('Explanation is required');
  } else if (question.explanation.trim().length < 20) {
    errors.push('Explanation must be at least 20 characters long');
  } else if (question.explanation.trim().length > 1000) {
    errors.push('Explanation must be less than 1000 characters');
  }

  // Aircraft type validation using type guard
  const validAircraftTypes = ['A320_FAMILY', 'B737_FAMILY', 'BOEING_737', 'GENERAL'];
  if (!isValidAircraftType(question.aircraftType) && 
      !validAircraftTypes.includes(question.aircraftType)) {
    errors.push(`Invalid aircraft type. Must be one of: ${validAircraftTypes.join(', ')}`);
  }

  // Category validation
  if (!question.category?.trim()) {
    errors.push('Category is required');
  } else if (question.category.trim().length < 2) {
    errors.push('Category must be at least 2 characters long');
  }

  // Difficulty validation using type guard
  if (!isValidDifficulty(question.difficulty) && question.difficulty !== 'beginner') {
    errors.push('Invalid difficulty level. Must be basic, intermediate, advanced, or beginner');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Text sanitization
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Exam configuration validation
export const validateExamConfig = (config: {
  mode: string;
  category?: string;
  aircraft?: string;
  difficulty?: string;
  questionCount?: number;
  timeLimit?: number;
}): QuestionValidationResult => {
  const errors: string[] = [];

  // Mode validation
  const validModes = ['practice', 'timed', 'review'];
  if (!validModes.includes(config.mode)) {
    errors.push('Invalid exam mode');
  }

  // Question count validation
  if (config.questionCount !== undefined) {
    if (typeof config.questionCount !== 'number' || 
        config.questionCount < 1 || 
        config.questionCount > 100) {
      errors.push('Question count must be between 1 and 100');
    }
  }

  // Time limit validation
  if (config.timeLimit !== undefined) {
    if (typeof config.timeLimit !== 'number' || 
        config.timeLimit < 0 || 
        config.timeLimit > 300) {
      errors.push('Time limit must be between 0 and 300 minutes');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remainingTime = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, remainingTime);
  }
}