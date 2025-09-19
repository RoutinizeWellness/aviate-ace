// This is a placeholder file for Convex data model
// In a real Convex project, this file would be generated automatically

export type Id<T> = string & { __tableName: T };

export interface User {
  _id: Id<"users">;
  email: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'premium';
  accountType?: 'free' | 'premium' | 'enterprise';
  subscription?: string;
  isActive?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Exam {
  _id: Id<"exams">;
  title: string;
  description: string;
  questions: Question[];
  duration: number;
  passingScore: number;
  category: string;
  createdAt: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ExamResult {
  _id: Id<"examResults">;
  userId: Id<"users">;
  examId: Id<"exams">;
  score: number;
  answers: UserAnswer[];
  completedAt: number;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}