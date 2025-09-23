import { z } from 'zod';

// Base validation schemas
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(254, 'Email is too long');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
    'Password must contain at least one lowercase letter, one uppercase letter, and one number');

export const displayNameSchema = z.string()
  .min(2, 'Display name must be at least 2 characters')
  .max(50, 'Display name is too long')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Display name contains invalid characters');

// Question validation schemas
export const questionSchema = z.object({
  question: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question is too long')
    .refine(val => val.trim().length > 0, 'Question cannot be empty'),
  
  options: z.array(z.string().min(1, 'Option cannot be empty'))
    .length(4, 'Exactly 4 options are required')
    .refine(options => {
      const uniqueOptions = new Set(options.map(opt => opt.trim().toLowerCase()));
      return uniqueOptions.size === options.length;
    }, 'All options must be unique'),
  
  correctAnswer: z.number()
    .int('Correct answer must be an integer')
    .min(0, 'Correct answer must be between 0 and 3')
    .max(3, 'Correct answer must be between 0 and 3'),
  
  explanation: z.string()
    .min(20, 'Explanation must be at least 20 characters')
    .max(1000, 'Explanation is too long'),
  
  aircraftType: z.enum(['A320_FAMILY', 'BOEING_737', 'GENERAL'], {
    errorMap: () => ({ message: 'Invalid aircraft type' })
  }),
  
  category: z.string()
    .min(1, 'Category is required')
    .max(100, 'Category name is too long'),
  
  difficulty: z.enum(['basic', 'beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Invalid difficulty level' })
  })
});

// Exam configuration validation
export const examConfigSchema = z.object({
  mode: z.enum(['practice', 'timed', 'review'], {
    errorMap: () => ({ message: 'Invalid exam mode' })
  }),
  
  category: z.string().optional(),
  
  aircraft: z.string().optional(),
  
  difficulty: z.string().optional(),
  
  questionCount: z.number()
    .int('Question count must be an integer')
    .min(1, 'Must have at least 1 question')
    .max(100, 'Cannot exceed 100 questions')
    .optional()
    .default(20),
  
  timeLimit: z.number()
    .int('Time limit must be an integer')
    .min(0, 'Time limit cannot be negative')
    .max(300, 'Time limit cannot exceed 300 minutes')
    .optional()
    .default(0)
});

// User profile validation
export const userProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  
  bio: z.string()
    .max(500, 'Bio is too long')
    .optional(),
  
  location: z.string()
    .max(100, 'Location is too long')
    .optional(),
  
  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal(''))
});

// Validation helper functions
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};

export const validateInputAsync = async <T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): Promise<{
  success: boolean;
  data?: T;
  errors?: string[];
}> => {
  try {
    const result = await schema.parseAsync(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};

// Sanitization helpers
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 1000); // Limit length
};

// Rate limiting validation
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, number[]>();
  
  return {
    isAllowed: (key: string): boolean => {
      const now = Date.now();
      const userAttempts = attempts.get(key) || [];
      
      // Remove old attempts outside the window
      const validAttempts = userAttempts.filter(time => now - time < windowMs);
      
      if (validAttempts.length >= maxAttempts) {
        return false;
      }
      
      // Add current attempt
      validAttempts.push(now);
      attempts.set(key, validAttempts);
      
      return true;
    },
    
    getRemainingTime: (key: string): number => {
      const userAttempts = attempts.get(key) || [];
      if (userAttempts.length < maxAttempts) return 0;
      
      const oldestAttempt = Math.min(...userAttempts);
      const remainingTime = windowMs - (Date.now() - oldestAttempt);
      
      return Math.max(0, remainingTime);
    },
    
    reset: (key: string): void => {
      attempts.delete(key);
    }
  };
};