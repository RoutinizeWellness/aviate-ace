import { RealAviationQuestion } from './realAviationQuestions';

function generateQuestionId(table: string): string {
  return `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// A320 Family Questions
export const a320Questions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as any,
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
    category: "electrical",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.10 - AC Power Supply"
  },
  {
    _id: generateQuestionId("examQuestions") as any,
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
    category: "hydraulics",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.29.10 - Hydraulic System"
  },
  {
    _id: generateQuestionId("examQuestions") as any,
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
    category: "flight-controls", 
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.10 - Flight Controls"
  },
  {
    _id: generateQuestionId("examQuestions") as any,
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
    category: "pressurization",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.21.10 - Air Conditioning and Pressurization"
  },
  {
    _id: generateQuestionId("examQuestions") as any,
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
    category: "fuel",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.28.10 - Fuel System"
  }
];