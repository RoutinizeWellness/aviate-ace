/**
 * Utility functions for working with Convex IDs and data
 */

// Constants for ID validation
export const CONVEX_ID_PATTERN = /^[a-z0-9]{32}$/;
export const TEMP_ID_PREFIX = 'temp_';
export const FALLBACK_ID_PREFIX = 'fallback_';

/**
 * Validates if a string is a valid Convex ID
 */
export const isValidConvexId = (id: string | undefined | null): id is string => {
  if (typeof id !== 'string') return false;
  return CONVEX_ID_PATTERN.test(id);
};

/**
 * Checks if an ID is a temporary/mock ID
 */
export const isTempId = (id: string | undefined | null): boolean => {
  return typeof id === 'string' && (
    id.startsWith(TEMP_ID_PREFIX) || 
    id.startsWith(FALLBACK_ID_PREFIX)
  );
};

/**
 * Type guard for Convex table IDs
 */
export const isConvexId = (
  id: string | undefined | null,
  _table?: string
): id is string => {
  return isValidConvexId(id);
};

/**
 * Generates a temporary ID for mock data
 */
export const generateTempId = (prefix: string = 'temp'): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Generates a Convex-like ID for real data
 */
export const generateConvexLikeId = (): string => {
  // Use crypto.getRandomValues for better randomness if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(36).padStart(2, '0')).join('').substring(0, 32);
  }
  
  // Fallback to Math.random
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Safe ID conversion with validation
 */
export const safeConvexId = (
  id: string | undefined | null,
  _table?: string
): string | null => {
  if (isValidConvexId(id)) {
    return id;
  }
  return null;
};

/**
 * Query parameter builder for Convex queries
 */
export const buildConvexQueryParams = <T extends Record<string, any>>(
  params: T,
  requiredFields: (keyof T)[]
): T | "skip" => {
  // Check if all required fields are present and valid
  const hasAllRequired = requiredFields.every(field => {
    const value = params[field];
    if (typeof value === 'string' && field.toString().includes('Id')) {
      return isValidConvexId(value);
    }
    return value !== undefined && value !== null;
  });

  return hasAllRequired ? params : "skip";
};

/**
 * Error handling for Convex operations
 */
export class ConvexError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ConvexError';
  }
}

/**
 * Wraps Convex mutations with error handling
 */
export const safeConvexMutation = async <T>(
  mutationFn: () => Promise<T>,
  errorMessage: string = 'Convex operation failed'
): Promise<T | null> => {
  try {
    return await mutationFn();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    // Don't throw in production for non-critical operations
    if (import.meta.env.PROD) {
      return null;
    }
    
    throw new ConvexError(errorMessage, 'CONVEX_MUTATION_ERROR', error);
  }
};

/**
 * Wraps Convex queries with error handling
 */
export const safeConvexQuery = <T>(
  queryResult: T | undefined,
  fallback: T
): T => {
  return queryResult ?? fallback;
};