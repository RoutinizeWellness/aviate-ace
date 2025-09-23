// Clean aviation questions without the massive B737 dataset to avoid TypeScript issues
import { allSimpleQuestions } from './simpleQuestions';

// Export all questions using the simplified data to avoid TypeScript conflicts
export const allRealAviationQuestions = allSimpleQuestions;

// Legacy export for compatibility
export const allAviationQuestions = allSimpleQuestions;