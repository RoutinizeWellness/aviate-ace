export interface LessonData {
  id: string;
  title: string;
  description: string;
  category: string;
  aircraft: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: string;
  objectives: string[];
  prerequisites: string[];
}

export interface FlashCard {
  id: string;
  term: string;
  definition: string;
}

export interface LessonContent {
  lesson: LessonData;
  flashcards: FlashCard[];
}