import { Id } from "../../convex/_generated/dataModel";

export interface QuestionSuggestion {
  _id: Id<"questionSuggestions">;
  userId: Id<"users">;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  aircraftType: string;
  category: string;
  difficulty: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  adminNotes?: string;
  reviewedBy?: Id<"users">;
  reviewedAt?: number;
  createdAt: number;
  updatedAt: number;
  _creationTime: number;
  user?: {
    displayName?: string;
    email: string;
  };
}

export interface QuestionSuggestionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  needsReview: number;
}

export interface QuestionSuggestionFormData {
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;
  aircraftType: 'A320_FAMILY' | 'BOEING_737';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}