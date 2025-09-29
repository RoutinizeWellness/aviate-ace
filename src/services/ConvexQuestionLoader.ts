import { api } from '../../convex/_generated/api';
import type { ConvexReactClient } from 'convex/react';

interface ConvexQuestionOptions {
  mode: string;
  category: string;
  aircraft: string;
  difficulty: string;
  questionCount: number;
}

export class ConvexQuestionLoader {
  private static convexClient: ConvexReactClient | null = null;
  
  static setConvexClient(client: ConvexReactClient) {
    this.convexClient = client;
  }

  /**
   * Load questions using appropriate Convex query based on mode
   */
  static async loadQuestions(options: ConvexQuestionOptions): Promise<any[]> {
    if (!this.convexClient) {
      throw new Error('Convex client not initialized');
    }

    const { mode, category, aircraft, difficulty, questionCount } = options;

    try {
      // For timed exams, use the specialized query
      if (mode === 'timed') {
        console.log(`Loading timed exam questions: ${questionCount} questions for ${aircraft}`);
        console.log(`Categories: ${category}`);
        console.log(`Difficulty: ${difficulty}`);
        
        // Parse categories if it's a comma-separated string
        const categories = category && category !== 'all' 
          ? category.split(',').map(cat => cat.trim()).filter(Boolean)
          : undefined;

        console.log(`Parsed categories:`, categories);

        let questions = await this.convexClient.query(api.exams.getTimedExamQuestions, {
          aircraftType: aircraft,
          questionCount: questionCount || 75,
          categories,
          difficulty: difficulty !== 'all' ? difficulty : undefined,
        });

        console.log(`Loaded ${questions.length} timed exam questions from Convex`);
        
        // If we don't get enough questions, try with relaxed filters
        if (questions.length < (questionCount || 75)) {
          console.warn(`Expected ${questionCount || 75} questions but only got ${questions.length}`);
          console.warn(`Trying with relaxed filters...`);
          
          // Try without categories first
          if (categories && categories.length > 0) {
            const relaxedQuestions = await this.convexClient.query(api.exams.getTimedExamQuestions, {
              aircraftType: aircraft,
              questionCount: questionCount || 75,
              difficulty: difficulty !== 'all' ? difficulty : undefined,
            });
            
            if (relaxedQuestions.length > questions.length) {
              console.log(`Got ${relaxedQuestions.length} questions without category filter`);
              questions = relaxedQuestions;
            }
          }
          
          // If still not enough, try without difficulty filter
          if (questions.length < (questionCount || 75)) {
            const basicQuestions = await this.convexClient.query(api.exams.getTimedExamQuestions, {
              aircraftType: aircraft,
              questionCount: questionCount || 75,
            });
            
            if (basicQuestions.length > questions.length) {
              console.log(`Got ${basicQuestions.length} questions with basic filter`);
              questions = basicQuestions;
            }
          }
        }
        
        return questions;
      }

      // For practice and review modes, use the improved random query
      if (mode === 'practice' || mode === 'review') {
        console.log(`Loading ${mode} questions: ${questionCount} questions for ${aircraft}`);
        
        // Parse categories if it's a comma-separated string
        const categories = category && category !== 'all' 
          ? category.split(',').map(cat => cat.trim()).filter(Boolean)
          : undefined;

        const questions = await this.convexClient.query(api.exams.getRandomExamQuestions, {
          aircraftType: aircraft,
          count: questionCount || 20,
          categories,
          difficulty: difficulty !== 'all' ? difficulty : undefined,
        });

        console.log(`Loaded ${questions.length} ${mode} questions`);
        return questions;
      }

      // Fallback for other modes
      console.log('Using fallback query for general questions');
      const questions = await this.convexClient.query(api.exams.getExamQuestions, {
        aircraftType: aircraft,
        category: category !== 'all' ? category : undefined,
        difficulty: difficulty !== 'all' ? difficulty : undefined,
        limit: questionCount || 50,
      });

      return questions;
    } catch (error) {
      console.error('Error loading questions from Convex:', error);
      throw error;
    }
  }

  /**
   * Check if Convex is available
   */
  static isAvailable(): boolean {
    return this.convexClient !== null;
  }
}