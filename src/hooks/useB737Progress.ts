import { useMemo } from 'react';

interface LessonProgress {
  lessonId: number;
  theoryCompleted: boolean;
  flashcardsCompleted: boolean;
  quizCompleted: boolean;
}

interface ModuleProgress {
  moduleId: string;
  completedLessons: number;
  totalLessons: number;
  isUnlocked: boolean;
}

export const useB737Progress = (
  moduleProgress: ModuleProgress[], 
  lessonProgress: LessonProgress[]
) => {
  const progressHelpers = useMemo(() => {
    const getLessonProgressById = (lessonId: number) => {
      return lessonProgress.find(p => p.lessonId === lessonId);
    };

    const getModuleProgressById = (moduleId: string) => {
      return moduleProgress.find(m => m.moduleId === moduleId);
    };

    const isLessonUnlocked = (lessonId: number) => {
      if (lessonId === 1) return true; // Fundamentos always unlocked
      
      // For Sistemas lessons, check if Fundamentos is completed
      const fundamentosProgress = getLessonProgressById(1);
      return fundamentosProgress ? 
        (fundamentosProgress.theoryCompleted && 
         fundamentosProgress.flashcardsCompleted && 
         fundamentosProgress.quizCompleted) : true;
    };

    const isLessonCompleted = (lessonId: number) => {
      const progress = getLessonProgressById(lessonId);
      return progress ? 
        (progress.theoryCompleted && 
         progress.flashcardsCompleted && 
         progress.quizCompleted) : false;
    };

    return {
      getLessonProgressById,
      getModuleProgressById,
      isLessonUnlocked,
      isLessonCompleted
    };
  }, [moduleProgress, lessonProgress]);

  return progressHelpers;
};