/**
 * Convex-related type definitions and utilities
 */

import type { Id } from '../../convex/_generated/dataModel';
import { CONVEX_CONSTANTS } from '@/constants/performance';

// Type guards for Convex IDs
export const isValidConvexId = (id: string | undefined | null): id is string => {
  if (typeof id !== 'string') return false;
  return CONVEX_CONSTANTS.ID_PATTERN.test(id);
};

export const isConvexTableId = <T extends string>(
  id: string | undefined | null,
  _table?: T
): id is Id<T> => {
  return isValidConvexId(id);
};

// Utility type for temporary/fallback IDs
export type TemporaryId = `temp_${string}` | `fallback_${string}`;

export type QuestionId = Id<"examQuestions"> | TemporaryId;

// Type guard for temporary IDs
export const isTemporaryId = (id: string): id is TemporaryId => {
  return id.startsWith('temp_') || id.startsWith('fallback_');
};

// Safe ID conversion utilities
export const toConvexId = <T extends string>(
  id: string,
  table: T
): Id<T> | null => {
  return isValidConvexId(id) ? id as Id<T> : null;
};

export const generateTempId = (prefix: 'temp' | 'fallback' = 'temp'): TemporaryId => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}` as TemporaryId;
};