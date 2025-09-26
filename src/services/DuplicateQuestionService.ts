import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { useLanguage } from '@/contexts/LanguageContext';

export interface DuplicateAnalysis {
  totalQuestions: number;
  duplicateGroups: DuplicateGroup[];
  duplicateCount: number;
  uniqueQuestions: number;
  duplicatesRemoved: number;
}

interface DuplicateGroup {
  normalizedText: string;
  questions: RealAviationQuestion[];
  count: number;
}

interface CleanQuestionResult {
  cleanQuestions: RealAviationQuestion[];
  duplicatesRemoved: RealAviationQuestion[];
  analysis: DuplicateAnalysis;
}

export class DuplicateQuestionService {
  /**
   * Normalizes question text for comparison by removing extra spaces, 
   * converting to lowercase, and removing common variations
   */
  private static normalizeQuestionText(question: string): string {
    return question
      .toLowerCase()
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common punctuation variations
      .replace(/[¿?¡!\.,:;]/g, '')
      // Remove common Spanish/English variations
      .replace(/\b(cuál|cual|what|which|how|cómo|como)\b/g, '')
      // Remove question numbers/variants
      .replace(/\(?\s*(variante?|variant)\s*\d+\s*\)?/gi, '')
      .replace(/#\s*\d+/g, '')
      // Remove aircraft type prefixes that might cause false duplicates
      .replace(/\b(a320|airbus\s*a320|boeing\s*737|b737)\b/gi, '')
      .trim();
  }

  /**
   * Compares two questions for similarity
   * Returns true if they are considered duplicates
   */
  private static areQuestionsSimilar(q1: RealAviationQuestion, q2: RealAviationQuestion): boolean {
    const normalizedQ1 = this.normalizeQuestionText(q1.question);
    const normalizedQ2 = this.normalizeQuestionText(q2.question);
    
    // Direct text match
    if (normalizedQ1 === normalizedQ2) {
      return true;
    }
    
    // Check if one question is contained within another (accounting for variations)
    if (normalizedQ1.length > 20 && normalizedQ2.length > 20) {
      const longer = normalizedQ1.length > normalizedQ2.length ? normalizedQ1 : normalizedQ2;
      const shorter = normalizedQ1.length > normalizedQ2.length ? normalizedQ2 : normalizedQ1;
      
      // If shorter question is 80% contained in longer, consider duplicate
      if (longer.includes(shorter) && shorter.length / longer.length > 0.8) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Analyzes questions to find duplicates
   */
  static analyzeQuestions(questions: RealAviationQuestion[]): DuplicateAnalysis {
    const duplicateGroups: Map<string, RealAviationQuestion[]> = new Map();
    const processedQuestions = new Set<string>();
    
    for (let i = 0; i < questions.length; i++) {
      const currentQuestion = questions[i];
      const currentNormalized = this.normalizeQuestionText(currentQuestion.question);
      
      // Skip if already processed
      if (processedQuestions.has(currentQuestion._id as string)) {
        continue;
      }
      
      const similarQuestions: RealAviationQuestion[] = [currentQuestion];
      
      // Find similar questions
      for (let j = i + 1; j < questions.length; j++) {
        const compareQuestion = questions[j];
        
        if (processedQuestions.has(compareQuestion._id as string)) {
          continue;
        }
        
        if (this.areQuestionsSimilar(currentQuestion, compareQuestion)) {
          similarQuestions.push(compareQuestion);
          processedQuestions.add(compareQuestion._id as string);
        }
      }
      
      processedQuestions.add(currentQuestion._id as string);
      
      // Only add to duplicates if more than one question found
      if (similarQuestions.length > 1) {
        duplicateGroups.set(currentNormalized, similarQuestions);
      }
    }
    
    const duplicateGroupsArray: DuplicateGroup[] = Array.from(duplicateGroups.entries()).map(
      ([normalizedText, questions]) => ({
        normalizedText,
        questions,
        count: questions.length,
      })
    );
    
    const duplicateCount = duplicateGroupsArray.reduce((sum, group) => sum + group.count - 1, 0);
    
    return {
      totalQuestions: questions.length,
      duplicateGroups: duplicateGroupsArray,
      duplicateCount,
      uniqueQuestions: questions.length - duplicateCount,
      duplicatesRemoved: duplicateCount,
    };
  }

  /**
   * Removes duplicate questions and returns clean set
   */
  static removeDuplicates(questions: RealAviationQuestion[]): CleanQuestionResult {
    const analysis = this.analyzeQuestions(questions);
    const cleanQuestions: RealAviationQuestion[] = [];
    const duplicatesRemoved: RealAviationQuestion[] = [];
    const processedIds = new Set<string>();
    
    // Add unique questions
    for (const question of questions) {
      const questionId = question._id as string;
      
      if (processedIds.has(questionId)) {
        continue;
      }
      
      // Check if this question is part of a duplicate group
      const duplicateGroup = analysis.duplicateGroups.find(group =>
        group.questions.some(q => (q._id as string) === questionId)
      );
      
      if (duplicateGroup) {
        // For duplicate groups, keep the first question (usually has better data)
        // or the one with most complete information
        const bestQuestion = this.selectBestQuestion(duplicateGroup.questions);
        cleanQuestions.push(bestQuestion);
        
        // Mark all questions in this group as processed
        duplicateGroup.questions.forEach(q => {
          processedIds.add(q._id as string);
          if ((q._id as string) !== (bestQuestion._id as string)) {
            duplicatesRemoved.push(q);
          }
        });
      } else {
        // Not a duplicate, add to clean questions
        cleanQuestions.push(question);
        processedIds.add(questionId);
      }
    }
    
    return {
      cleanQuestions,
      duplicatesRemoved,
      analysis,
    };
  }

  /**
   * Selects the best question from a group of duplicates
   * Priority: complete explanation > reference > creation time
   */
  private static selectBestQuestion(questions: RealAviationQuestion[]): RealAviationQuestion {
    return questions.reduce((best, current) => {
      // Prefer questions with explanations
      if (current.explanation && current.explanation.length > (best.explanation?.length || 0)) {
        return current;
      }
      
      // Prefer questions with references
      if (current.reference && !best.reference) {
        return current;
      }
      
      // Prefer newer questions (higher creation time)
      if (current._creationTime > best._creationTime) {
        return current;
      }
      
      return best;
    });
  }

  /**
   * Generates a detailed report of duplicate analysis
   */
  static generateDuplicateReport(analysis: DuplicateAnalysis): string {
    const report = [
      '='.repeat(60),
      '          DUPLICATE QUESTIONS ANALYSIS REPORT',
      '='.repeat(60),
      '',
      `📊 SUMMARY:`,
      `   Total Questions: ${analysis.totalQuestions}`,
      `   Unique Questions: ${analysis.uniqueQuestions}`,
      `   Duplicate Questions: ${analysis.duplicateCount}`,
      `   Duplicate Groups: ${analysis.duplicateGroups.length}`,
      `   Cleanup Success Rate: ${((analysis.duplicatesRemoved / analysis.totalQuestions) * 100).toFixed(1)}%`,
      '',
      '🔍 DUPLICATE GROUPS FOUND:',
      ''
    ];

    if (analysis.duplicateGroups.length === 0) {
      report.push('   ✅ No duplicate questions found!');
    } else {
      analysis.duplicateGroups.forEach((group, index) => {
        report.push(`   ${index + 1}. Group with ${group.count} duplicates:`);
        report.push(`      Normalized: "${group.normalizedText}"`);
        report.push(`      Questions:`);
        
        group.questions.forEach((q, qIndex) => {
          const preview = q.question.substring(0, 80) + (q.question.length > 80 ? '...' : '');
          report.push(`         ${qIndex + 1}) ${preview}`);
          report.push(`            Category: ${q.category} | Aircraft: ${q.aircraftType}`);
        });
        
        report.push('');
      });
    }

    report.push('='.repeat(60));
    
    return report.join('\n');
  }

  /**
   * Cleans questions from multiple data sources
   */
  static async cleanAllQuestionSources(): Promise<{
    totalCleaned: number;
    report: string;
    cleanedQuestions: RealAviationQuestion[];
  }> {
    const allQuestions: RealAviationQuestion[] = [];
    
    try {
      // Load all question sources
      const sources = [
        async () => {
          const module = await import('@/data/cleanAviationQuestions');
          return (module as any).allRealAviationQuestions || (module as any).allAviationQuestions || [];
        },
        async () => {
          const module = await import('@/data/simpleQuestions');
          return (module as any).allSimpleQuestions || [];
        },
        async () => {
          const module = await import('@/data/a320Questions');
          return (module as any).a320Questions || [];
        },
        async () => {
          const module = await import('@/data/massiveQuestionSeeding');
          return (module as any).getAllMassiveQuestions?.() || (module as any).massiveQuestionDatabase || [];
        },
      ];
      
      for (const loadSource of sources) {
        try {
          const questions = await loadSource();
          
          if (Array.isArray(questions)) {
            allQuestions.push(...questions);
          }
        } catch (error) {
          console.warn('Failed to load question source:', error);
        }
      }
      
      // Remove duplicates
      const cleanResult = this.removeDuplicates(allQuestions);
      const report = this.generateDuplicateReport(cleanResult.analysis);
      
      return {
        totalCleaned: cleanResult.duplicatesRemoved.length,
        report,
        cleanedQuestions: cleanResult.cleanQuestions,
      };
      
    } catch (error) {
      console.error('Error cleaning question sources:', error);
      throw new Error(`Failed to clean questions: ${error}`);
    }
  }
}

/**
 * Utility function for components to get clean questions
 */
export const useCleanQuestions = () => {
  const { t } = useLanguage();
  
  const cleanQuestions = async (): Promise<RealAviationQuestion[]> => {
    try {
      const result = await DuplicateQuestionService.cleanAllQuestionSources();
      console.log(result.report);
      return result.cleanedQuestions;
    } catch (error) {
      console.error(t('errors.questionCleaningFailed'), error);
      return [];
    }
  };
  
  return { cleanQuestions };
};