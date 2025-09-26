import { toast } from '@/hooks/use-toast';

export interface ModuleCompletionData {
  moduleId: string;
  aircraftType: 'A320' | 'B737';
  completedAt: string;
  totalLessons: number;
  completedLessons: number;
  userId: string;
}

export interface LessonProgress {
  lessonId: number;
  theoryCompleted: boolean;
  flashcardsCompleted: boolean;
  quizCompleted: boolean;
}

export class ModuleCompletionService {
  
  /**
   * Check if all lessons in a module are completely finished
   */
  static isModuleFullyCompleted(moduleId: string, userId: string): boolean {
    try {
      const progressKey = `lesson_progress_${userId}`;
      const storedProgress = localStorage.getItem(progressKey);
      
      if (!storedProgress) return false;
      
      const allProgress: LessonProgress[] = JSON.parse(storedProgress);
      
      // Define lesson ranges for each module
      const moduleLessonRanges: Record<string, number[]> = {
        'fundamentos': [1],
        'sistemas': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        'b737_fundamentos': [1, 2, 3],
        'b737_sistemas': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      };
      
      const lessonIds = moduleLessonRanges[moduleId] || [];
      
      // Check if all lessons in the module are fully completed
      return lessonIds.every(lessonId => {
        const progress = allProgress.find(p => p.lessonId === lessonId);
        return progress?.theoryCompleted && progress?.flashcardsCompleted && progress?.quizCompleted;
      });
    } catch (error) {
      console.error('Error checking module completion:', error);
      return false;
    }
  }

  /**
   * Mark a module as completed
   */
  static async completeModule(
    moduleId: string, 
    aircraftType: 'A320' | 'B737', 
    userId: string
  ): Promise<boolean> {
    try {
      // First verify all lessons are actually completed
      if (!this.isModuleFullyCompleted(moduleId, userId)) {
        toast({
          title: "Error",
          description: "No puedes completar el módulo hasta que todas las lecciones estén terminadas.",
          variant: "destructive",
        });
        return false;
      }

      // Save module completion
      const completionData: ModuleCompletionData = {
        moduleId,
        aircraftType,
        completedAt: new Date().toISOString(),
        totalLessons: this.getModuleLessonCount(moduleId),
        completedLessons: this.getModuleLessonCount(moduleId),
        userId
      };

      // Store in localStorage
      const completionKey = `module_completed_${moduleId}_${userId}`;
      localStorage.setItem(completionKey, JSON.stringify(completionData));

      // Also update the general module progress
      const moduleProgressKey = `module_progress_${userId}`;
      const storedModuleProgress = localStorage.getItem(moduleProgressKey);
      let moduleProgress = storedModuleProgress ? JSON.parse(storedModuleProgress) : [];

      // Update or add module progress
      const existingIndex = moduleProgress.findIndex((m: any) => m.moduleId === moduleId);
      const moduleData = {
        moduleId,
        completedLessons: this.getModuleLessonCount(moduleId),
        totalLessons: this.getModuleLessonCount(moduleId),
        isUnlocked: true,
        completedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        moduleProgress[existingIndex] = { ...moduleProgress[existingIndex], ...moduleData };
      } else {
        moduleProgress.push(moduleData);
      }

      localStorage.setItem(moduleProgressKey, JSON.stringify(moduleProgress));

      // Show success message
      toast({
        title: "¡Módulo Completado!",
        description: "El módulo se ha marcado como completado exitosamente.",
        duration: 5000,
      });

      return true;
    } catch (error) {
      console.error('Error completing module:', error);
      toast({
        title: "Error",
        description: "Hubo un error al completar el módulo. Inténtalo de nuevo.",
        variant: "destructive",
      });
      return false;
    }
  }

  /**
   * Check if a module is marked as completed
   */
  static isModuleMarkedAsCompleted(moduleId: string, userId: string): boolean {
    try {
      const completionKey = `module_completed_${moduleId}_${userId}`;
      return localStorage.getItem(completionKey) !== null;
    } catch (error) {
      console.error('Error checking module completion status:', error);
      return false;
    }
  }

  /**
   * Get module completion data
   */
  static getModuleCompletionData(moduleId: string, userId: string): ModuleCompletionData | null {
    try {
      const completionKey = `module_completed_${moduleId}_${userId}`;
      const stored = localStorage.getItem(completionKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting module completion data:', error);
      return null;
    }
  }

  /**
   * Get lesson count for a module
   */
  private static getModuleLessonCount(moduleId: string): number {
    const moduleLessonCounts: Record<string, number> = {
      'fundamentos': 1,
      'sistemas': 14,
      'b737_fundamentos': 3,
      'b737_sistemas': 12
    };
    
    return moduleLessonCounts[moduleId] || 0;
  }

  /**
   * Get all completed modules for a user
   */
  static getCompletedModules(userId: string): ModuleCompletionData[] {
    try {
      const completedModules: ModuleCompletionData[] = [];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (key.startsWith(`module_completed_`) && key.endsWith(`_${userId}`)) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              completedModules.push(JSON.parse(data));
            } catch (e) {
              console.warn('Invalid module completion data:', key);
            }
          }
        }
      });
      
      return completedModules;
    } catch (error) {
      console.error('Error getting completed modules:', error);
      return [];
    }
  }

  /**
   * Reset module completion (for testing or admin purposes)
   */
  static resetModuleCompletion(moduleId: string, userId: string): void {
    try {
      const completionKey = `module_completed_${moduleId}_${userId}`;
      localStorage.removeItem(completionKey);
      
      toast({
        title: "Progreso Reiniciado",
        description: "El progreso del módulo ha sido reiniciado.",
      });
    } catch (error) {
      console.error('Error resetting module completion:', error);
    }
  }
}