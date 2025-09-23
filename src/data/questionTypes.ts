// Common question types to avoid TypeScript issues with Convex IDs
export interface SimpleAviationQuestion {
  _id: any;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  aircraftType: "A320_FAMILY" | "B737_FAMILY" | "GENERAL";
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  isActive: boolean;
  _creationTime: number;
  reference?: string;
  regulationCode?: string;
}