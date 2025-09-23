import { Id } from "../../convex/_generated/dataModel";

export type ExamMode = 'practice' | 'timed' | 'review';
export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';
export type AircraftType = 'A320_FAMILY' | 'B737_FAMILY' | 'GENERAL';

export interface ExamQuestion {
  _id: Id<"examQuestions"> | string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  aircraftType: AircraftType;
  category: string;
  difficulty: DifficultyLevel;
  isActive: boolean;
  _creationTime: number;
  reference?: string;
  regulationCode?: string;
}

export interface ExamAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
  isCorrect?: boolean;
}

export interface ExamSession {
  _id: Id<"userExamSessions">;
  userId: Id<"users">;
  examId?: Id<"exams">;
  sessionType: ExamMode;
  questionsCount: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  completedAt: number;
  answers: ExamAnswer[];
}

export interface ExamConfiguration {
  mode: ExamMode;
  category?: string;
  aircraft?: AircraftType;
  difficulty?: DifficultyLevel;
  timeLimit?: number;
  questionCount: number;
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: ExamAnswer[];
  timeRemaining: number;
  isCompleted: boolean;
  startTime: Date;
  sessionId?: string;
}

export interface ExamResults {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  passed: boolean;
  incorrectQuestions: ExamAnswer[];
}

// Type guards
export const isValidExamMode = (mode: string): mode is ExamMode => {
  return ['practice', 'timed', 'review'].includes(mode);
};

export const isValidDifficulty = (difficulty: string): difficulty is DifficultyLevel => {
  return ['basic', 'intermediate', 'advanced'].includes(difficulty);
};

export const isValidAircraftType = (aircraft: string): aircraft is AircraftType => {
  return ['A320_FAMILY', 'B737_FAMILY', 'GENERAL'].includes(aircraft);
};