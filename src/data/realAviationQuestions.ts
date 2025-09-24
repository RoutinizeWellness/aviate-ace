import { Id } from "convex/_generated/dataModel";

export interface RealAviationQuestion {
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

// Export combined questions
export const allAviationQuestions: RealAviationQuestion[] = [
  ...electricalSystemQuestions,
  ...hydraulicSystemQuestions,
  ...fuelSystemQuestions,
  ...pressurizationSystemQuestions,
  ...brakeSystemQuestions,
  ...flightControlsQuestions,
  ...landingGearQuestions,
  ...oxygenSystemQuestions
];

// Legacy exports for compatibility
export const allRealAviationQuestions = allAviationQuestions;