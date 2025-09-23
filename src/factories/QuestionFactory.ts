import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { Id } from '../../convex/_generated/dataModel';

export interface QuestionTemplate {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface QuestionConfig {
  aircraftType: 'A320_FAMILY' | 'B737_FAMILY' | 'GENERAL';
  category: string;
  reference?: string;
  regulationCode?: string;
}

export class QuestionFactory {
  private static generateId(): Id<"examQuestions"> {
    // Generate a Convex-like ID for consistency
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result as Id<"examQuestions">;
  }

  static createQuestion(
    template: QuestionTemplate,
    config: QuestionConfig,
    variant?: number
  ): RealAviationQuestion {
    const questionText = variant 
      ? `${template.question} (Variante ${variant})`
      : template.question;

    return {
      _id: this.generateId() as Id<"examQuestions">,
      question: questionText,
      options: [...template.options],
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      aircraftType: config.aircraftType,
      category: config.category,
      difficulty: template.difficulty,
      isActive: true,
      _creationTime: Date.now(),
      reference: config.reference,
      regulationCode: config.regulationCode
    };
  }

  static createQuestionBatch(
    templates: QuestionTemplate[],
    config: QuestionConfig,
    count: number
  ): RealAviationQuestion[] {
    const questions: RealAviationQuestion[] = [];
    
    for (let i = 0; i < count; i++) {
      const templateIndex = i % templates.length;
      const variant = Math.floor(i / templates.length) + 1;
      const template = templates[templateIndex];
      
      questions.push(
        this.createQuestion(
          template,
          config,
          count > templates.length ? variant : undefined
        )
      );
    }
    
    return questions;
  }

  static validateTemplate(template: QuestionTemplate): string[] {
    const errors: string[] = [];
    
    if (!template.question?.trim()) {
      errors.push('Question text is required');
    }
    
    if (!Array.isArray(template.options) || template.options.length !== 4) {
      errors.push('Exactly 4 options are required');
    }
    
    if (template.correctAnswer < 0 || template.correctAnswer > 3) {
      errors.push('Correct answer must be between 0 and 3');
    }
    
    if (!template.explanation?.trim()) {
      errors.push('Explanation is required');
    }
    
    return errors;
  }
}