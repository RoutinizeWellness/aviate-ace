/**
 * Service for normalizing and mapping category names across different languages and formats
 */

export interface CategoryMapping {
  patterns: string[];
  normalizedCategory: string;
  description: string;
}

export class CategoryNormalizationService {
  private static readonly CATEGORY_MAPPINGS: CategoryMapping[] = [
    {
      patterns: [
        'aircraft-general',
        'aircraft general',
        'airplane-general', 
        'airplane general',
        'general aircraft',
        'general airplane',
        'sistemas',
        'sistema',
        'aircraft systems',
        'airplane systems'
      ],
      normalizedCategory: 'aircraft-general',
      description: 'General aircraft systems and knowledge'
    },
    {
      patterns: [
        'electrical',
        'sistema eléctrico',
        'sistema electrico',
        'electrical systems',
        'power systems'
      ],
      normalizedCategory: 'electrical',
      description: 'Electrical power systems'
    },
    {
      patterns: [
        'hydraulics',
        'hydraulic',
        'sistema hidráulico',
        'sistema hidraulico',
        'hydraulic systems'
      ],
      normalizedCategory: 'hydraulics',
      description: 'Hydraulic power systems'
    },
    {
      patterns: [
        'performance',
        'rendimiento',
        'aircraft performance',
        'flight performance'
      ],
      normalizedCategory: 'performance',
      description: 'Aircraft performance calculations'
    }
  ];

  /**
   * Normalizes a category name to a standard format
   */
  static normalizeCategory(
    category: string, 
    examTitle?: string, 
    aircraftType?: string
  ): string {
    if (!category) return 'aircraft-general';

    const normalizedInput = this.sanitizeInput(category);
    
    // Check direct mappings first
    for (const mapping of this.CATEGORY_MAPPINGS) {
      if (this.matchesPattern(normalizedInput, mapping.patterns)) {
        return mapping.normalizedCategory;
      }
    }

    // Check exam title for additional context
    if (examTitle) {
      const normalizedTitle = this.sanitizeInput(examTitle);
      for (const mapping of this.CATEGORY_MAPPINGS) {
        if (this.matchesPattern(normalizedTitle, mapping.patterns)) {
          return mapping.normalizedCategory;
        }
      }
    }

    // Return original category if no mapping found
    return category;
  }

  /**
   * Gets all available normalized categories
   */
  static getAvailableCategories(): string[] {
    return this.CATEGORY_MAPPINGS.map(mapping => mapping.normalizedCategory);
  }

  /**
   * Gets category description
   */
  static getCategoryDescription(category: string): string {
    const mapping = this.CATEGORY_MAPPINGS.find(m => m.normalizedCategory === category);
    return mapping?.description || 'Unknown category';
  }

  private static sanitizeInput(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  private static matchesPattern(input: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      const normalizedPattern = this.sanitizeInput(pattern);
      return input === normalizedPattern || 
             input.includes(normalizedPattern) || 
             normalizedPattern.includes(input);
    });
  }
}