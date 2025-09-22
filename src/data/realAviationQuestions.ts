import { Id } from "convex/_generated/dataModel";
import { allB737Questions } from "./b737Questions";

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

// A320 Hydraulic System Questions
export const hydraulicSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "How many independent hydraulic systems does the A320 have?",
    options: [
      "2 systems (Green and Blue)",
      "3 systems (Green, Blue, and Yellow)",
      "1 system with backup",
      "4 systems for redundancy"
    ],
    correctAnswer: 1,
    explanation: "The A320 has three independent hydraulic systems: Green (engine 1 driven), Blue (electric pump), and Yellow (engine 2 driven, with manual backup).",
    aircraftType: "A320_FAMILY",
    category: "Hydraulics",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.29.10 - Hydraulic System",
    regulationCode: "EASA CS-25.1301"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the normal operating pressure of the A320 hydraulic systems?",
    options: [
      "2000 psi",
      "3000 psi",
      "4000 psi",
      "5000 psi"
    ],
    correctAnswer: 1,
    explanation: "The A320 hydraulic systems operate at a normal pressure of 3000 psi (pounds per square inch).",
    aircraftType: "A320_FAMILY",
    category: "Hydraulics",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.29.10 - Hydraulic System",
    regulationCode: "EASA CS-25.1301"
  }
];

// A320 Fuel System Questions
export const fuelSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the total fuel capacity of the A320?",
    options: [
      "18,000 kg",
      "23,000 kg",
      "27,000 kg",
      "32,000 kg"
    ],
    correctAnswer: 1,
    explanation: "The A320 has a total fuel capacity of approximately 23,000 kg (50,700 lbs).",
    aircraftType: "A320_FAMILY",
    category: "Fuel",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.28.10 - Fuel System",
    regulationCode: "EASA CS-25.951"
  }
];

// A320 Pressurization System Questions
export const pressurizationSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum cabin altitude for the A320?",
    options: [
      "8,000 feet",
      "10,000 feet",
      "12,000 feet",
      "14,000 feet"
    ],
    correctAnswer: 0,
    explanation: "The A320 maintains a maximum cabin altitude of 8,000 feet during normal operations.",
    aircraftType: "A320_FAMILY",
    category: "Pressurization",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.21.10 - Air Conditioning and Pressurization",
    regulationCode: "EASA CS-25.841"
  }
];

// A320 Brake System Questions
export const brakeSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "How many independent brake systems does the A320 have?",
    options: [
      "1 system",
      "2 systems",
      "3 systems",
      "4 systems"
    ],
    correctAnswer: 1,
    explanation: "The A320 has two independent brake systems: normal braking system (powered by the green hydraulic system) and alternate braking system (powered by the blue hydraulic system).",
    aircraftType: "A320_FAMILY",
    category: "Brakes",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.14.10 - Landing Gear",
    regulationCode: "EASA CS-25.735"
  }
];

// A320 Flight Controls Questions
export const flightControlsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What type of flight control system does the A320 use?",
    options: [
      "Conventional cable-pulley system",
      "Fly-by-wire system",
      "Hydro-mechanical system",
      "Electro-mechanical system"
    ],
    correctAnswer: 1,
    explanation: "The A320 uses a fly-by-wire flight control system where pilot inputs are transmitted electronically to flight control computers which then command the control surfaces.",
    aircraftType: "A320_FAMILY",
    category: "Flight Controls",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.10 - Flight Controls",
    regulationCode: "EASA CS-25.671"
  }
];

// A320 Landing Gear Questions
export const landingGearQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "How many wheels does the A320 landing gear have in total?",
    options: [
      "8 wheels",
      "10 wheels",
      "12 wheels",
      "14 wheels"
    ],
    correctAnswer: 1,
    explanation: "The A320 landing gear consists of two main gear assemblies with 4 wheels each and a nose gear with 2 wheels, for a total of 10 wheels.",
    aircraftType: "A320_FAMILY",
    category: "Landing Gear",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.14.10 - Landing Gear",
    regulationCode: "EASA CS-25.721"
  }
];

// A320 Oxygen System Questions
export const oxygenSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "At what cabin altitude does the passenger oxygen system automatically deploy?",
    options: [
      "10,000 feet",
      "12,000 feet",
      "14,000 feet",
      "16,000 feet"
    ],
    correctAnswer: 2,
    explanation: "The passenger oxygen system automatically deploys when cabin altitude reaches 14,000 feet or when manually activated by the crew.",
    aircraftType: "A320_FAMILY",
    category: "Oxygen",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.30.10 - Oxygen",
    regulationCode: "EASA CS-25.1441"
  }
];

// Export combined questions
export const allAviationQuestions: RealAviationQuestion[] = [
  ...electricalSystemQuestions,
  ...hydraulicSystemQuestions,
  ...fuelSystemQuestions,
  ...pressurizationSystemQuestions,
  ...brakeSystemQuestions,
  ...flightControlsQuestions,
  ...landingGearQuestions,
  ...oxygenSystemQuestions,
  ...allB737Questions
];

// Legacy exports for compatibility
export const allRealAviationQuestions = allAviationQuestions;