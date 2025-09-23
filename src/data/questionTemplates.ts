import { Id } from "convex/_generated/dataModel";

export interface BaseQuestionTemplate {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "basic" | "intermediate" | "advanced";
}

export interface QuestionGenerationConfig {
  aircraftType: "A320_FAMILY" | "B737_FAMILY" | "GENERAL";
  category: string;
  reference: string;
  regulationCode: string;
  count: number;
  categoryPrefix?: string;
}

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

// Centralized question templates by category
export const questionTemplates = {
  a320FlightControls: [
    {
      question: "What type of flight control system does the A320 use?",
      options: ["Conventional controls", "Fly-by-wire", "Mechanical controls", "Hydraulic boost"],
      correctAnswer: 1,
      explanation: "The A320 was the first commercial airliner to use digital fly-by-wire flight controls as standard equipment.",
      difficulty: "intermediate" as const
    },
    {
      question: "How many flight control computers does the A320 have?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 2,
      explanation: "The A320 has 4 flight control computers: 2 ELACs and 2 SECs for redundancy.",
      difficulty: "advanced" as const
    },
    {
      question: "What is the primary function of the sidestick in the A320?",
      options: ["Direct control surfaces", "Send signals to flight computers", "Hydraulic actuation", "Manual backup"],
      correctAnswer: 1,
      explanation: "The sidestick sends electrical signals to the flight control computers, which then move the control surfaces.",
      difficulty: "intermediate" as const
    },
    {
      question: "What happens if both pilots move their sidesticks simultaneously?",
      options: ["Left sidestick has priority", "Right sidestick has priority", "Inputs are averaged", "Priority button must be pressed"],
      correctAnswer: 3,
      explanation: "When both sidesticks are moved, a priority button must be pressed to give one pilot full control.",
      difficulty: "advanced" as const
    },
    {
      question: "What is the normal law in A320 flight controls?",
      options: ["Direct law", "Alternate law", "Normal law with protections", "Manual reversion"],
      correctAnswer: 2,
      explanation: "Normal law provides full flight envelope protection including alpha protection, load factor limitation, and bank angle protection.",
      difficulty: "intermediate" as const
    }
  ],

  a320Electrical: [
    {
      question: "What is the normal AC power source priority in the A320?",
      options: ["Engine generators, APU generator, external power", "External power, engine generators, APU generator", "APU generator, engine generators, external power", "Engine generators, external power, APU generator"],
      correctAnswer: 0,
      explanation: "The A320 electrical system prioritizes engine generators first, then APU generator, then external power.",
      difficulty: "intermediate" as const
    },
    {
      question: "How many engine-driven generators does the A320 have?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 1,
      explanation: "The A320 has two engine-driven generators, one on each engine.",
      difficulty: "basic" as const
    },
    {
      question: "What voltage do the A320 engine generators produce?",
      options: ["115V AC", "28V DC", "200V AC", "24V DC"],
      correctAnswer: 0,
      explanation: "The A320 engine generators produce 115V AC at 400Hz.",
      difficulty: "intermediate" as const
    },
    {
      question: "What happens when both engine generators fail?",
      options: ["Total electrical failure", "Emergency electrical configuration", "APU starts automatically", "RAT deploys automatically"],
      correctAnswer: 1,
      explanation: "When both engine generators fail, the aircraft enters emergency electrical configuration with battery power and RAT deployment.",
      difficulty: "advanced" as const
    },
    {
      question: "How long can the batteries power essential systems?",
      options: ["15 minutes", "30 minutes", "45 minutes", "60 minutes"],
      correctAnswer: 1,
      explanation: "The A320 batteries can power essential systems for approximately 30 minutes in emergency configuration.",
      difficulty: "intermediate" as const
    }
  ],

  a320Hydraulics: [
    {
      question: "How many independent hydraulic systems does the A320 have?",
      options: ["2", "3", "4", "1"],
      correctAnswer: 1,
      explanation: "The A320 has three independent hydraulic systems: Green, Blue, and Yellow.",
      difficulty: "basic" as const
    },
    {
      question: "What is the normal operating pressure of the A320 hydraulic systems?",
      options: ["3000 PSI", "5000 PSI", "2500 PSI", "4000 PSI"],
      correctAnswer: 0,
      explanation: "The A320 hydraulic systems operate at 3000 PSI (207 bar) normal pressure.",
      difficulty: "intermediate" as const
    },
    {
      question: "Which hydraulic system powers the PTU (Power Transfer Unit)?",
      options: ["Green to Yellow", "Blue to Green", "Yellow to Blue", "Green to Blue"],
      correctAnswer: 0,
      explanation: "The PTU transfers power from the Green system to the Yellow system when needed.",
      difficulty: "intermediate" as const
    },
    {
      question: "What happens if the Green hydraulic system fails?",
      options: ["Total hydraulic failure", "PTU activates automatically", "Manual reversion only", "Emergency landing required"],
      correctAnswer: 1,
      explanation: "If the Green system fails, the PTU automatically activates to provide Yellow system pressure from the Green system reservoir.",
      difficulty: "advanced" as const
    },
    {
      question: "Which system powers the landing gear retraction?",
      options: ["Green system", "Yellow system", "Blue system", "All systems"],
      correctAnswer: 0,
      explanation: "The Green hydraulic system is the primary system for landing gear operation.",
      difficulty: "intermediate" as const
    }
  ]
} as const;

// Generic question generator factory
export function generateQuestions(
  baseQuestions: BaseQuestionTemplate[],
  config: QuestionGenerationConfig
): RealAviationQuestion[] {
  const questions: RealAviationQuestion[] = [];
  const baseTime = Date.now();
  
  for (let i = 0; i < config.count; i++) {
    const baseIndex = i % baseQuestions.length;
    const base = baseQuestions[baseIndex];
    const variation = Math.floor(i / baseQuestions.length);
    
    // Only add variant suffix if we're generating more questions than base templates
    const questionText = config.count > baseQuestions.length 
      ? `${base.question} (${config.categoryPrefix || 'Variant'} ${variation + 1})`
      : base.question;
    
    questions.push({
      _id: generateConvexLikeId() as Id<"examQuestions">,
      question: questionText,
      options: [...base.options], // Create new array to avoid reference issues
      correctAnswer: base.correctAnswer,
      explanation: base.explanation,
      aircraftType: config.aircraftType,
      category: config.category,
      difficulty: base.difficulty,
      isActive: true,
      _creationTime: baseTime + i,
      reference: config.reference,
      regulationCode: config.regulationCode
    });
  }
  
  return questions;
}

// Generates a Convex-like ID for real data
function generateConvexLikeId(): string {
  // Use crypto.getRandomValues for better randomness if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(36).padStart(2, '0')).join('').substring(0, 32);
  }
  
  // Fallback to Math.random
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}