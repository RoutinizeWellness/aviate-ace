import { useState, useEffect } from 'react';

export interface LessonProgress {
  theoryCompleted: boolean;
  flashcardsCompleted: boolean;
  quizCompleted: boolean;
  overallProgress: number;
}

export const useLessonProgress = (userId: string | undefined, lessonId: string | undefined) => {
  const [progress, setProgress] = useState<LessonProgress>({
    theoryCompleted: false,
    flashcardsCompleted: false,
    quizCompleted: false,
    overallProgress: 0
  });

  // Load progress from localStorage
  useEffect(() => {
    if (userId && lessonId) {
      const storedProgress = localStorage.getItem(`lesson_progress_${userId}_${lessonId}`);
      if (storedProgress) {
        try {
          setProgress(JSON.parse(storedProgress));
        } catch (error) {
          console.error('Failed to parse lesson progress:', error);
        }
      }
    }
  }, [userId, lessonId]);

  // Calculate overall progress based on completed activities
  const calculateOverallProgress = (newProgress: Partial<LessonProgress>): number => {
    const activities = [
      newProgress.theoryCompleted ?? progress.theoryCompleted,
      newProgress.flashcardsCompleted ?? progress.flashcardsCompleted,
      newProgress.quizCompleted ?? progress.quizCompleted
    ];
    
    const completedCount = activities.filter(Boolean).length;
    return Math.round((completedCount / activities.length) * 100);
  };

  // Save progress to localStorage
  const updateProgress = (updates: Partial<LessonProgress>) => {
    if (!userId || !lessonId) return;

    const newProgress: LessonProgress = {
      ...progress,
      ...updates,
      overallProgress: calculateOverallProgress(updates)
    };

    try {
      localStorage.setItem(`lesson_progress_${userId}_${lessonId}`, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save lesson progress:', error);
    }
  };

  const markTheoryComplete = () => updateProgress({ theoryCompleted: true });
  const markFlashcardsComplete = () => updateProgress({ flashcardsCompleted: true });
  const markQuizComplete = () => updateProgress({ quizCompleted: true });

  return {
    progress,
    markTheoryComplete,
    markFlashcardsComplete,
    markQuizComplete
  };
};