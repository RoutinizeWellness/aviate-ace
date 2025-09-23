import type { RealAviationQuestion } from '@/data/realAviationQuestions';

export interface FilterStrategy {
  filter(questions: RealAviationQuestion[], criteria: any): RealAviationQuestion[];
}

export class AircraftFilterStrategy implements FilterStrategy {
  filter(questions: RealAviationQuestion[], aircraft: string): RealAviationQuestion[] {
    if (!aircraft || aircraft === 'ALL') {
      return questions;
    }

    return questions.filter(q => 
      q.aircraftType === aircraft || 
      q.aircraftType === 'GENERAL'
    );
  }
}

export class CategoryFilterStrategy implements FilterStrategy {
  filter(questions: RealAviationQuestion[], categories: string[]): RealAviationQuestion[] {
    if (categories.length === 0 || categories.includes('all')) {
      return questions;
    }

    return questions.filter(q => 
      categories.some(category => 
        this.matchesCategory(q.category, category)
      )
    );
  }

  private matchesCategory(questionCategory: string, targetCategory: string): boolean {
    const normalize = (str: string) => 
      str.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    
    const normalizedQuestion = normalize(questionCategory);
    const normalizedTarget = normalize(targetCategory);
    
    return normalizedQuestion === normalizedTarget ||
           normalizedQuestion.includes(normalizedTarget) ||
           normalizedTarget.includes(normalizedQuestion);
  }
}

export class DifficultyFilterStrategy implements FilterStrategy {
  filter(questions: RealAviationQuestion[], difficulty: string): RealAviationQuestion[] {
    if (!difficulty || difficulty === 'all') {
      return questions;
    }

    return questions.filter(q => q.difficulty === difficulty);
  }
}

export class ModeFilterStrategy implements FilterStrategy {
  filter(questions: RealAviationQuestion[], mode: string): RealAviationQuestion[] {
    switch (mode) {
      case 'review':
        // For review mode, provide sample questions for testing
        return questions.filter((_, index) => index % 3 === 0);
      case 'timed':
        // For timed mode, shuffle all questions
        return questions.sort(() => Math.random() - 0.5);
      default:
        return questions;
    }
  }
}

export class FilterContext {
  private strategies: Map<string, FilterStrategy> = new Map();

  constructor() {
    this.strategies.set('aircraft', new AircraftFilterStrategy());
    this.strategies.set('category', new CategoryFilterStrategy());
    this.strategies.set('difficulty', new DifficultyFilterStrategy());
    this.strategies.set('mode', new ModeFilterStrategy());
  }

  applyFilter(
    questions: RealAviationQuestion[], 
    filterType: string, 
    criteria: any
  ): RealAviationQuestion[] {
    const strategy = this.strategies.get(filterType);
    if (!strategy) {
      console.warn(`Unknown filter type: ${filterType}, returning unfiltered questions`);
      return questions;
    }
    
    try {
      return strategy.filter(questions, criteria);
    } catch (error) {
      console.error(`Error applying ${filterType} filter:`, error);
      return questions; // Return unfiltered questions on error
    }
  }

  applyFilters(
    questions: RealAviationQuestion[],
    filters: Record<string, any>
  ): RealAviationQuestion[] {
    let filteredQuestions = [...questions];

    for (const [filterType, criteria] of Object.entries(filters)) {
      if (criteria !== undefined && criteria !== null) {
        filteredQuestions = this.applyFilter(filteredQuestions, filterType, criteria);
      }
    }

    return filteredQuestions;
  }
}