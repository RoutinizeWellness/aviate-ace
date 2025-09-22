import { Id } from "convex/_generated/dataModel";

export interface RealAviationQuestion {
  _id: Id<"examQuestions">;
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

function generateQuestionId(table: string): string {
  return `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// A320 Electrical System Questions
export const electricalSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the normal AC power source priority sequence in the A320 electrical system?",
    options: [
      "Engine generators, APU generator, external power, RAT",
      "External power, APU generator, engine generators, RAT",
      "Engine generators, external power, APU generator, RAT",
      "APU generator, engine generators, external power, RAT"
    ],
    correctAnswer: 0,
    explanation: "The A320 electrical system prioritizes engine generators first as the most reliable source, followed by APU generator, then external power for ground operations, and finally RAT (Ram Air Turbine) for emergency power.",
    aircraftType: "A320_FAMILY",
    category: "Electrical",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.10 - AC Power Supply",
    regulationCode: "EASA CS-25.1351"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What happens when both engine generators fail during flight?",
    options: [
      "Total electrical failure occurs immediately",
      "Emergency electrical configuration activates automatically",
      "APU must be started manually within 30 seconds",
      "Only one generator continues to operate"
    ],
    correctAnswer: 1,
    explanation: "In case of dual engine generator failure, the emergency electrical configuration activates automatically. The batteries power essential systems through the DC ESS BUS and AC ESS BUS via the static inverter.",
    aircraftType: "A320_FAMILY",
    category: "Electrical",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.20 - Emergency Electrical Supply",
    regulationCode: "EASA CS-25.1351"
  }
];

// B737 Questions
export const b737Questions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum altitude for B737-800 operations?",
    options: [
      "37,000 ft",
      "39,000 ft", 
      "41,000 ft",
      "43,000 ft"
    ],
    correctAnswer: 2,
    explanation: "The Boeing 737-800 has a maximum certified altitude of 41,000 feet for normal operations.",
    aircraftType: "B737_FAMILY",
    category: "Performance",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM 1.10.1",
    regulationCode: "FAA Part 25"
  }
];

// Export combined questions
export const allAviationQuestions: RealAviationQuestion[] = [
  ...electricalSystemQuestions,
  ...b737Questions
];