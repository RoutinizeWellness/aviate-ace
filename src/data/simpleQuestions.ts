// Simplified questions that avoid TypeScript issues with Convex IDs
import { SimpleAviationQuestion } from './questionTypes';

// Generate a simple ID
function generateId(): any {
  return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// A320 Questions
export const a320Questions: SimpleAviationQuestion[] = [
  {
    _id: generateId(),
    question: "What is the normal AC power source priority sequence in the A320?",
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
    _id: generateId(),
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
    _id: generateId(),
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
  }
];

// B737 Questions
export const b737Questions: SimpleAviationQuestion[] = [
  {
    _id: generateId(),
    question: "What is the maximum certified altitude for the Boeing 737-800?",
    options: [
      "37,000 feet",
      "39,000 feet",
      "41,000 feet", 
      "43,000 feet"
    ],
    correctAnswer: 2,
    explanation: "The Boeing 737-800 has a maximum certified altitude of 41,000 feet.",
    aircraftType: "B737_FAMILY",
    category: "aircraft-general",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "How many engines does the Boeing 737 have?",
    options: [
      "1 engine",
      "2 engines",
      "3 engines", 
      "4 engines"
    ],
    correctAnswer: 1,
    explanation: "The Boeing 737 is a twin-engine aircraft with two turbofan engines mounted under the wings.",
    aircraftType: "B737_FAMILY",
    category: "aircraft-general",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "What type of landing gear does the B737 have?",
    options: [
      "Fixed landing gear",
      "Retractable tricycle gear",
      "Retractable tailwheel gear", 
      "Skids"
    ],
    correctAnswer: 1,
    explanation: "The B737 has retractable tricycle landing gear with a nose wheel and two main gear assemblies.",
    aircraftType: "B737_FAMILY",
    category: "landing-gear",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "How many hydraulic systems does the Boeing 737 have?",
    options: [
      "1",
      "2",
      "3", 
      "4"
    ],
    correctAnswer: 1,
    explanation: "The Boeing 737 has 2 independent hydraulic systems: System A and System B.",
    aircraftType: "B737_FAMILY",
    category: "hydraulics",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "What type of engines does the Boeing 737-800 typically use?",
    options: [
      "CFM56-7B",
      "CFM56-5B",
      "IAE V2500", 
      "PW6000"
    ],
    correctAnswer: 0,
    explanation: "The Boeing 737-800 typically uses CFM56-7B engines manufactured by CFMI.",
    aircraftType: "B737_FAMILY",
    category: "engines-apu",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "How many main fuel tanks does the Boeing 737 have?",
    options: [
      "1",
      "2",
      "3", 
      "4"
    ],
    correctAnswer: 1,
    explanation: "The Boeing 737 has 2 main fuel tanks, one in each wing.",
    aircraftType: "B737_FAMILY",
    category: "fuel",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "What type of flight control system does the Boeing 737 use?",
    options: [
      "Fly-by-wire",
      "Hydraulically assisted manual controls",
      "Fully manual controls", 
      "Electric controls"
    ],
    correctAnswer: 1,
    explanation: "The Boeing 737 uses hydraulically assisted manual flight controls, not fly-by-wire like the A320.",
    aircraftType: "B737_FAMILY",
    category: "flight-controls",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "How many main electrical generators does the Boeing 737 have?",
    options: [
      "1",
      "2",
      "3", 
      "4"
    ],
    correctAnswer: 1,
    explanation: "The Boeing 737 has 2 main electrical generators, one driven by each engine.",
    aircraftType: "B737_FAMILY",
    category: "electrical",
    difficulty: "basic",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  },
  {
    _id: generateId(),
    question: "What system provides bleed air for the Boeing 737 air conditioning?",
    options: [
      "Separate air compressor",
      "Engine bleed air and APU",
      "Electric air pumps", 
      "Ram air only"
    ],
    correctAnswer: 1,
    explanation: "The Boeing 737 air conditioning system uses hot bleed air from the engines and APU.",
    aircraftType: "B737_FAMILY",
    category: "air-systems",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "B737 FCOM"
  }
];

// All questions combined
export const allSimpleQuestions: SimpleAviationQuestion[] = [
  ...a320Questions,
  ...b737Questions
];