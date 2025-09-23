export interface B737Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  hasTheory: boolean;
  hasFlashcards: boolean;
  hasQuiz: boolean;
  difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
  topics?: string[];
}

export interface B737Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  isUnlocked: boolean;
  category: 'foundation' | 'systems' | 'procedures' | 'performance';
  estimatedTime?: string;
  difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
  lessons: B737Lesson[];
}

export interface LessonProgress {
  lessonId: number;
  theoryCompleted: boolean;
  flashcardsCompleted: boolean;
  quizCompleted: boolean;
}

export interface ModuleProgress {
  moduleId: string;
  completedLessons: number;
  totalLessons: number;
  isUnlocked: boolean;
}

export interface B737ProgressStats {
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
}