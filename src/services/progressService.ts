// Progress tracking service using localStorage for now
// Can be easily migrated to Supabase when tables are ready

export interface LessonProgress {
  lessonId: number;
  userId: string;
  theoryCompleted: boolean;
  flashcardsCompleted: boolean;
  quizCompleted: boolean;
  quizScore: number;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  userId: string;
  completedLessons: number;
  totalLessons: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export class ProgressService {
  private static getStorageKey(userId: string, type: 'lessons' | 'modules'): string {
    return `aviate_ace_${type}_${userId}`;
  }

  // Get lesson progress for a specific user and lesson
  static async getLessonProgress(userId: string, lessonId: number): Promise<LessonProgress | null> {
    try {
      const storageKey = this.getStorageKey(userId, 'lessons');
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return null;
      
      const allProgress: LessonProgress[] = JSON.parse(stored);
      return allProgress.find(p => p.lessonId === lessonId) || null;
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return null;
    }
  }

  // Update lesson progress
  static async updateLessonProgress(progress: Partial<LessonProgress> & { userId: string; lessonId: number }): Promise<boolean> {
    try {
      const storageKey = this.getStorageKey(progress.userId, 'lessons');
      const stored = localStorage.getItem(storageKey);
      const allProgress: LessonProgress[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = allProgress.findIndex(p => p.lessonId === progress.lessonId);
      
      const updatedProgress: LessonProgress = {
        lessonId: progress.lessonId,
        userId: progress.userId,
        theoryCompleted: progress.theoryCompleted || false,
        flashcardsCompleted: progress.flashcardsCompleted || false,
        quizCompleted: progress.quizCompleted || false,
        quizScore: progress.quizScore || 0,
        completedAt: (progress.theoryCompleted && progress.flashcardsCompleted && progress.quizCompleted) 
          ? new Date().toISOString() : undefined,
        lastAccessedAt: new Date().toISOString(),
      };
      
      if (existingIndex >= 0) {
        allProgress[existingIndex] = { ...allProgress[existingIndex], ...updatedProgress };
      } else {
        allProgress.push(updatedProgress);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(allProgress));
      
      // Check if lesson is fully completed and update module progress
      if (updatedProgress.theoryCompleted && updatedProgress.flashcardsCompleted && updatedProgress.quizCompleted) {
        await this.updateModuleProgress(progress.userId, progress.lessonId);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      return false;
    }
  }

  // Get module progress for a user
  static async getModuleProgress(userId: string): Promise<ModuleProgress[]> {
    try {
      const storageKey = this.getStorageKey(userId, 'modules');
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) {
        // Initialize with default modules
        const defaultModules: ModuleProgress[] = [
          {
            moduleId: 'fundamentos',
            userId,
            completedLessons: 0,
            totalLessons: 1,
            isUnlocked: true,
            unlockedAt: new Date().toISOString()
          },
          {
            moduleId: 'sistemas',
            userId,
            completedLessons: 0,
            totalLessons: 14,
            isUnlocked: false
          }
        ];
        
        localStorage.setItem(storageKey, JSON.stringify(defaultModules));
        return defaultModules;
      }
      
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error getting module progress:', error);
      return [];
    }
  }

  // Update module progress when a lesson is completed
  static async updateModuleProgress(userId: string, completedLessonId: number): Promise<void> {
    try {
      // Get the module for this lesson
      const moduleMapping: { [key: number]: { moduleId: string; totalLessons: number } } = {
        1: { moduleId: 'fundamentos', totalLessons: 1 },
        2: { moduleId: 'sistemas', totalLessons: 14 },
        3: { moduleId: 'sistemas', totalLessons: 14 },
        4: { moduleId: 'sistemas', totalLessons: 14 },
        5: { moduleId: 'sistemas', totalLessons: 14 },
        6: { moduleId: 'sistemas', totalLessons: 14 },
        7: { moduleId: 'sistemas', totalLessons: 14 },
        8: { moduleId: 'sistemas', totalLessons: 14 },
        9: { moduleId: 'sistemas', totalLessons: 14 },
        10: { moduleId: 'sistemas', totalLessons: 14 },
        11: { moduleId: 'sistemas', totalLessons: 14 },
        12: { moduleId: 'sistemas', totalLessons: 14 },
        13: { moduleId: 'sistemas', totalLessons: 14 },
        14: { moduleId: 'sistemas', totalLessons: 14 },
        15: { moduleId: 'sistemas', totalLessons: 14 },
      };

      const moduleInfo = moduleMapping[completedLessonId];
      if (!moduleInfo) return;

      // Get all completed lessons
      const lessonStorageKey = this.getStorageKey(userId, 'lessons');
      const lessonsStored = localStorage.getItem(lessonStorageKey);
      const allLessonProgress: LessonProgress[] = lessonsStored ? JSON.parse(lessonsStored) : [];
      
      // Count completed lessons for this module
      const moduleCompletedCount = allLessonProgress.filter(lesson => {
        const lessonModuleInfo = moduleMapping[lesson.lessonId];
        return lessonModuleInfo?.moduleId === moduleInfo.moduleId &&
               lesson.theoryCompleted && lesson.flashcardsCompleted && lesson.quizCompleted;
      }).length;

      // Update module progress
      const moduleStorageKey = this.getStorageKey(userId, 'modules');
      const moduleStored = localStorage.getItem(moduleStorageKey);
      const allModuleProgress: ModuleProgress[] = moduleStored ? JSON.parse(moduleStored) : [];
      
      const moduleIndex = allModuleProgress.findIndex(m => m.moduleId === moduleInfo.moduleId);
      
      if (moduleIndex >= 0) {
        allModuleProgress[moduleIndex].completedLessons = moduleCompletedCount;
      }
      
      localStorage.setItem(moduleStorageKey, JSON.stringify(allModuleProgress));

      // Check if next module should be unlocked
      await this.checkAndUnlockNextModule(userId, moduleInfo.moduleId, moduleCompletedCount, moduleInfo.totalLessons);
    } catch (error) {
      console.error('Error updating module progress:', error);
    }
  }

  // Check if next module should be unlocked based on current module completion
  static async checkAndUnlockNextModule(userId: string, currentModuleId: string, completedLessons: number, totalLessons: number): Promise<void> {
    try {
      // If current module is fully completed, unlock next module
      if (completedLessons >= totalLessons) {
        const nextModuleId = currentModuleId === 'fundamentos' ? 'sistemas' : null;
        
        if (nextModuleId) {
          const moduleStorageKey = this.getStorageKey(userId, 'modules');
          const moduleStored = localStorage.getItem(moduleStorageKey);
          const allModuleProgress: ModuleProgress[] = moduleStored ? JSON.parse(moduleStored) : [];
          
          const nextModuleIndex = allModuleProgress.findIndex(m => m.moduleId === nextModuleId);
          
          if (nextModuleIndex >= 0) {
            allModuleProgress[nextModuleIndex].isUnlocked = true;
            allModuleProgress[nextModuleIndex].unlockedAt = new Date().toISOString();
            
            localStorage.setItem(moduleStorageKey, JSON.stringify(allModuleProgress));
          }
        }
      }
    } catch (error) {
      console.error('Error unlocking next module:', error);
    }
  }

  // Initialize progress for a new user
  static async initializeUserProgress(userId: string): Promise<void> {
    try {
      // Check if user already has progress
      const existing = await this.getModuleProgress(userId);
      if (existing.length === 0) {
        // This will create default modules via getModuleProgress
        await this.getModuleProgress(userId);
      }
    } catch (error) {
      console.error('Error initializing user progress:', error);
    }
  }

  // Get user's overall Type Rating progress
  static async getOverallProgress(userId: string): Promise<{ 
    totalLessons: number; 
    completedLessons: number; 
    percentage: number;
    unlockedModules: string[];
  }> {
    try {
      const [lessonProgress, moduleProgress] = await Promise.all([
        this.getAllLessonProgress(userId),
        this.getModuleProgress(userId)
      ]);

      const completedLessons = lessonProgress.filter(lesson => 
        lesson.theoryCompleted && lesson.flashcardsCompleted && lesson.quizCompleted
      ).length;
      
      const totalLessons = 15; // 1 Fundamentos + 14 Sistemas
      const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const unlockedModules = moduleProgress.filter(m => m.isUnlocked).map(m => m.moduleId);

      return {
        totalLessons,
        completedLessons,
        percentage,
        unlockedModules
      };
    } catch (error) {
      console.error('Error getting overall progress:', error);
      return {
        totalLessons: 15,
        completedLessons: 0,
        percentage: 0,
        unlockedModules: ['fundamentos']
      };
    }
  }

  // Get all lesson progress for a user
  static async getAllLessonProgress(userId: string): Promise<LessonProgress[]> {
    try {
      const storageKey = this.getStorageKey(userId, 'lessons');
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting all lesson progress:', error);
      return [];
    }
  }

  // Check if a specific lesson is unlocked for a user
  static async isLessonUnlocked(userId: string, lessonId: number): Promise<boolean> {
    try {
      // Lesson 1 (Fundamentos) is always unlocked
      if (lessonId === 1) return true;

      // For Sistemas lessons (2-15), check if Fundamentos is completed
      if (lessonId >= 2 && lessonId <= 15) {
        const fundamentosProgress = await this.getLessonProgress(userId, 1);
        return fundamentosProgress ? 
          (fundamentosProgress.theoryCompleted && 
           fundamentosProgress.flashcardsCompleted && 
           fundamentosProgress.quizCompleted) : false;
      }

      return false;
    } catch (error) {
      console.error('Error checking lesson unlock status:', error);
      return false;
    }
  }
}