import type { Id } from "../../convex/_generated/dataModel";

// Helper function to generate question IDs
const generateQuestionId = (table: string): string => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36).substring(0, 8);
  return `${table}_${randomPart}${timestamp}`;
};

export interface RealAviationQuestion {
  _id: Id<"examQuestions">;
  examId?: Id<"exams">;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  aircraftType: string;
  category: string;
  difficulty: string;
  isActive: boolean;
  _creationTime: number;
  reference: string; // Official reference documentation
  regulationCode?: string; // Applicable regulation
}

/**
 * REAL A320 ELECTRICAL SYSTEM QUESTIONS
 * Based on A320 FCOM Volume 2 - Electrical System
 */
export const electricalSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an 'ELEC IDG 1 FAULT' condition, what is the correct sequence of actions according to the QRH?",
    options: [
      "ENG 1 IDG pb - OFF, Monitor electrical parameters, Consider APU start",
      "ENG 1 IDG pb - DISC, Land as soon as practical, Emergency electrical config",
      "Continue normal ops, Monitor oil temperature, Land at nearest suitable airport",
      "IDG 1 - DISCONNECT, RAT deployment, Essential power only"
    ],
    correctAnswer: 1,
    explanation: "According to A320 QRH ELEC.IDG FAULT procedure: The IDG should be disconnected (not just turned off), land as soon as practical should be considered, and emergency electrical configuration may be required depending on the severity. The IDG disconnect is irreversible and critical for preventing fire risk.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Eléctrico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 QRH - ELEC.IDG FAULT, FCOM 2.24.30",
    regulationCode: "EASA CS-25.1351"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the minimum battery voltage required for APU start in emergency electrical configuration?",
    options: [
      "22V for at least 2 minutes duration",
      "24V for at least 3 minutes duration", 
      "25V for at least 5 minutes duration",
      "23V for at least 1 minute duration"
    ],
    correctAnswer: 0,
    explanation: "Per A320 FCOM, the minimum battery voltage for APU start in emergency conditions is 22V, and it must be maintained for at least 2 minutes to ensure successful APU start sequence and initial stabilization. Below this voltage, APU start is not recommended due to insufficient power for ignition and control systems.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Eléctrico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.20 - Emergency Electrical Supply",
    regulationCode: "EASA CS-25.1351"
  }
];

/**
 * REAL A320 HYDRAULIC SYSTEM QUESTIONS
 * Based on A320 FCOM Volume 2 - Flight Controls & Hydraulics
 */
export const hydraulicSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During a 'HYD G SYS LO PR' condition with Green system pressure below 1450 PSI, what flight control limitations apply?",
    options: [
      "Normal law degraded, rudder travel limited, manual pitch trim required",
      "Direct law only, no autopilot, maximum bank angle 67°",
      "Alternate law, speed brake effectiveness reduced, nose wheel steering limited",
      "Manual reversion all axes, backup rudder control, PTU inoperative"
    ],
    correctAnswer: 0,
    explanation: "With Green system low pressure, flight control law degrades but remains in Normal Law with limitations. Rudder travel is limited to prevent overstress, and manual pitch trim may be required as the electric backup may not provide sufficient authority. The system maintains flight safety while indicating the hydraulic degradation to the crew.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Hidráulico", 
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.30 - Green Hydraulic System",
    regulationCode: "EASA CS-25.1309"
  }
];

/**
 * REAL A320 FLIGHT MANAGEMENT QUESTIONS
 * Based on A320 FCOM Volume 3 - Flight Management System
 */
export const flightManagementQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an RNAV approach, what is the required RNP (Required Navigation Performance) accuracy for RNP 0.3 approaches?",
    options: [
      "0.3 NM lateral and longitudinal accuracy 95% of flight time",
      "0.3 NM lateral accuracy only, with integrity monitoring required",
      "0.3 NM lateral accuracy 99.7% of time, no longitudinal requirement", 
      "0.3 NM total system error including wind drift compensation"
    ],
    correctAnswer: 0,
    explanation: "RNP 0.3 requires the aircraft's navigation system to maintain lateral and longitudinal accuracy within 0.3 nautical miles for 95% of the flight time. This performance requirement includes integrity monitoring to alert the crew if the system cannot maintain the required accuracy, ensuring approach safety in reduced separation environments.",
    aircraftType: "A320_FAMILY",
    category: "Navegación",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.03.20 - RNAV Operations", 
    regulationCode: "ICAO Doc 9613 RNP Manual"
  }
];

/**
 * REAL A320 AUTOFLIGHT QUESTIONS
 * Based on A320 FCOM Volume 3 - Flight Management and Guidance
 */
export const autoflightQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an ILS approach with AP1 engaged, what happens when you press the APPR button?",
    options: [
      "LOC and G/S modes arm, autopilot captures localizer and glideslope automatically",
      "Autopilot disconnects and manual approach mode activates",
      "Only localizer mode arms, glideslope must be captured manually",
      "Autoland mode engages automatically regardless of aircraft configuration"
    ],
    correctAnswer: 0,
    explanation: "When APPR button is pressed during an ILS approach, both LOC (localizer) and G/S (glideslope) modes arm. The autopilot will automatically capture the localizer first, then the glideslope when intercepted. This provides full ILS approach capability with the autopilot engaged.",
    aircraftType: "A320_FAMILY",
    category: "Autoflight",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.22.20 - ILS Approach",
    regulationCode: "EASA CS-25.1329"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum bank angle limitation in Normal Law with autopilot engaged?",
    options: [
      "25° maximum bank angle in all phases of flight",
      "30° maximum, reduced to 25° below 100 feet AGL",
      "33° maximum bank angle with speed protection active",
      "No limitation, pilot can override with sidestick input"
    ],
    correctAnswer: 1,
    explanation: "In Normal Law with autopilot engaged, maximum bank angle is 30°. However, below 100 feet AGL, this is reduced to 25° for approach and landing safety. This limitation prevents excessive bank angles that could lead to loss of control during critical phases of flight.",
    aircraftType: "A320_FAMILY",
    category: "Autoflight",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.22.10 - Flight Control Laws",
    regulationCode: "EASA CS-25.1329"
  }
];

/**
 * REAL A320 SPEED LIMITS QUESTIONS
 * Based on A320 FCOM Volume 1 - Limitations
 */
export const speedLimitsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum operating speed (VMO) for A320 at sea level?",
    options: [
      "350 knots IAS / Mach 0.82",
      "320 knots IAS / Mach 0.80",
      "300 knots IAS / Mach 0.78",
      "380 knots IAS / Mach 0.85"
    ],
    correctAnswer: 0,
    explanation: "The A320 VMO (Maximum Operating Speed) is 350 knots IAS or Mach 0.82, whichever is lower. This limitation ensures the aircraft operates within its certified flight envelope and maintains structural integrity during all normal operations.",
    aircraftType: "A320_FAMILY",
    category: "Speed Limits",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.20 - Speed Limitations",
    regulationCode: "EASA CS-25.1505"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum flap extension speed (VFE) for Flaps 1 configuration?",
    options: [
      "230 knots",
      "215 knots",
      "200 knots",
      "185 knots"
    ],
    correctAnswer: 0,
    explanation: "VFE for Flaps 1 configuration is 230 knots. This speed limitation prevents structural damage to the flap system and ensures safe operation during configuration changes. Exceeding this speed with flaps extended can cause flap damage or loss of control.",
    aircraftType: "A320_FAMILY",
    category: "Speed Limits",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.30 - Configuration Speeds",
    regulationCode: "EASA CS-25.1505"
  }
];

/**
 * REAL A320 WEIGHT LIMITS QUESTIONS
 * Based on A320 FCOM Volume 1 - Weight and Balance Limitations
 */
export const weightLimitsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the Maximum Takeoff Weight (MTOW) for an A320-200?",
    options: [
      "78,000 kg (171,960 lbs)",
      "75,500 kg (166,449 lbs)",
      "73,500 kg (162,040 lbs)",
      "77,000 kg (169,755 lbs)"
    ],
    correctAnswer: 0,
    explanation: "The Maximum Takeoff Weight (MTOW) for an A320-200 is 78,000 kg (171,960 lbs). This is the highest weight approved for takeoff and includes the aircraft's empty weight, fuel, payload, and any additional equipment. Operating above MTOW is prohibited and affects performance calculations.",
    aircraftType: "A320_FAMILY",
    category: "Weight Limits",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.10 - Weight Limitations",
    regulationCode: "EASA CS-25.25"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the Center of Gravity (CG) forward limit for A320 at takeoff?",
    options: [
      "15% MAC (Mean Aerodynamic Chord)",
      "18% MAC (Mean Aerodynamic Chord)",
      "12% MAC (Mean Aerodynamic Chord)",
      "21% MAC (Mean Aerodynamic Chord)"
    ],
    correctAnswer: 0,
    explanation: "The forward CG limit for A320 at takeoff is 15% MAC. Operating with CG forward of this limit can result in insufficient elevator authority for rotation and flare, potentially leading to a tail strike or inability to achieve proper takeoff attitude.",
    aircraftType: "A320_FAMILY",
    category: "Weight Limits",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.40 - Center of Gravity Limits",
    regulationCode: "EASA CS-25.161"
  }
];

/**
 * REAL A320 AIR BLEED/COND/PRESS/VENT QUESTIONS
 * Based on A320 FCOM Volume 2 - Air Conditioning and Pressurization
 */
export const airBleedCondPressVentQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the normal cabin pressure differential limit for the A320?",
    options: [
      "8.6 PSI maximum differential pressure",
      "9.0 PSI maximum differential pressure",
      "7.8 PSI maximum differential pressure",
      "8.0 PSI maximum differential pressure"
    ],
    correctAnswer: 0,
    explanation: "The A320 cabin pressure differential limit is 8.6 PSI. This limitation prevents structural damage to the fuselage while maintaining a comfortable cabin altitude. The cabin pressure controller automatically maintains this differential during normal operations.",
    aircraftType: "A320_FAMILY",
    category: "Air Bleed/Cond/Press/Vent",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.21.10 - Pressurization System",
    regulationCode: "EASA CS-25.841"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During takeoff, what is the source of bleed air for air conditioning and pressurization?",
    options: [
      "Engine bleed air from both engines, APU bleed air if running",
      "Only APU bleed air until cruise altitude",
      "Ground air conditioning unit only during takeoff roll",
      "Ram air through dedicated scoops in the fuselage"
    ],
    correctAnswer: 0,
    explanation: "During takeoff, bleed air is supplied from both engine bleeds (5th and 9th stage) and APU bleed if the APU is running. The system automatically manages bleed air distribution to maintain cabin comfort and pressurization requirements throughout all phases of flight.",
    aircraftType: "A320_FAMILY",
    category: "Air Bleed/Cond/Press/Vent",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.21.20 - Bleed Air System",
    regulationCode: "EASA CS-25.831"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What happens when the cabin altitude reaches 9,550 feet?",
    options: [
      "Cabin altitude warning horn sounds, oxygen masks deploy automatically",
      "Emergency descent procedure automatically initiated",
      "Cabin pressure relief valves open fully",
      "Air conditioning packs shut down automatically"
    ],
    correctAnswer: 0,
    explanation: "When cabin altitude reaches 9,550 feet, the cabin altitude warning horn sounds and passenger oxygen masks deploy automatically at 14,000 feet cabin altitude. This provides crew and passenger alerting to take immediate action for a pressurization failure scenario.",
    aircraftType: "A320_FAMILY",
    category: "Air Bleed/Cond/Press/Vent",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.21.30 - Cabin Pressure Warning",
    regulationCode: "EASA CS-25.841"
  }
];

/**
 * REAL A320 FLIGHT CONTROLS QUESTIONS
 * Based on A320 FCOM Volume 2 - Flight Controls
 */
export const flightControlsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "In Normal Law, what protection prevents the aircraft from stalling?",
    options: [
      "Alpha protection prevents angle of attack from exceeding alpha max",
      "Speed protection maintains minimum maneuvering speed automatically",
      "Load factor protection limits G-force to maximum structural limits",
      "Bank angle protection prevents excessive roll rates"
    ],
    correctAnswer: 0,
    explanation: "Alpha protection in Normal Law prevents the angle of attack from exceeding alpha max (stall angle). When the pilot pulls back on the sidestick beyond alpha protection, the aircraft will not stall and maintains controlled flight even with full aft sidestick input.",
    aircraftType: "A320_FAMILY",
    category: "Flight Controls",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.10 - Flight Control Laws",
    regulationCode: "EASA CS-25.143"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum deflection angle for A320 spoilers?",
    options: [
      "50 degrees maximum deflection",
      "45 degrees maximum deflection",
      "60 degrees maximum deflection",
      "35 degrees maximum deflection"
    ],
    correctAnswer: 0,
    explanation: "A320 spoilers can deflect up to 50 degrees maximum. Spoilers are used for roll control, speed brakes in flight, and ground spoilers for landing. The deflection angle varies based on flight phase and pilot input to optimize aerodynamic efficiency and control authority.",
    aircraftType: "A320_FAMILY",
    category: "Flight Controls",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.20 - Spoiler System",
    regulationCode: "EASA CS-25.143"
  }
];

/**
 * REAL A320 LOAD ACCELERATION LIMITS QUESTIONS
 * Based on A320 FCOM Volume 1 - Structural Limitations
 */
export const loadAccelerationLimitsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What are the load factor limits for A320 in Normal Law?",
    options: [
      "+2.5G to -1.0G with full protection active",
      "+3.0G to -1.5G maximum structural limits",
      "+2.0G to -0.5G for passenger comfort",
      "+4.0G to -2.0G emergency maneuvering limits"
    ],
    correctAnswer: 0,
    explanation: "In Normal Law, the A320 load factor is limited to +2.5G to -1.0G with full flight envelope protection. The flight control system prevents exceeding these limits even with full control input, protecting both aircraft structure and passenger safety during normal operations.",
    aircraftType: "A320_FAMILY",
    category: "Load Acceleration Limits",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.70 - Load Factor Limitations",
    regulationCode: "EASA CS-25.337"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum design load factor for A320 structure?",
    options: [
      "+3.75G positive, -1.5G negative ultimate load",
      "+2.5G positive, -1.0G negative limit load",
      "+4.0G positive, -2.0G negative maximum load",
      "+5.0G positive, -2.5G negative emergency load"
    ],
    correctAnswer: 0,
    explanation: "The A320 ultimate design load factors are +3.75G positive and -1.5G negative. These are the maximum loads the aircraft structure can withstand without failure. Normal operations are limited to +2.5G/-1.0G with 1.5 safety factor built into the design.",
    aircraftType: "A320_FAMILY",
    category: "Load Acceleration Limits",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.70 - Ultimate Load Factors",
    regulationCode: "EASA CS-25.337"
  }
];

/**
 * ADDITIONAL A320 ELECTRICAL SYSTEM QUESTIONS
 * Based on A320 FCOM Volume 2 - Electrical System
 */
export const additionalElectricalQuestions: RealAviationQuestion[] = [
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
    explanation: "The normal AC power source priority in A320 is: 1. Engine generators (GEN 1 and GEN 2), 2. APU generator, 3. External power, 4. RAT (Ram Air Turbine). This ensures continuous power supply with engine generators having the highest priority as they are the primary source during normal flight operations.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Eléctrico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.10 - Electrical Power Generation",
    regulationCode: "EASA CS-25.1351"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an electrical emergency with only the batteries powering the aircraft, which buses remain powered?",
    options: [
      "Only essential buses, AC ESS BUS and DC ESS BUS",
      "All buses except galleys and entertainment systems",
      "Only flight critical systems, no cabin systems",
      "No buses powered, aircraft in complete electrical failure"
    ],
    correctAnswer: 0,
    explanation: "In electrical emergency configuration with batteries only, the AC ESS BUS (Essential AC Bus) and DC ESS BUS (Essential DC Bus) remain powered. These buses supply critical flight instruments, flight controls, and essential navigation equipment needed for safe landing. Non-essential systems are shed to conserve battery power.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Eléctrico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.20 - Emergency Electrical Supply",
    regulationCode: "EASA CS-25.1351"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum continuous load capacity of each engine-driven generator in the A320?",
    options: [
      "90 KVA continuous, 100 KVA peak for 10 minutes",
      "80 KVA continuous, 90 KVA peak for 5 minutes",
      "100 KVA continuous, 110 KVA peak for 15 minutes",
      "75 KVA continuous, 85 KVA peak for 8 minutes"
    ],
    correctAnswer: 0,
    explanation: "Each engine-driven generator (VFG - Variable Frequency Generator) in the A320 has a maximum continuous load capacity of 90 KVA. It can supply up to 100 KVA for short periods (10 minutes) during peak demand situations. This capacity is sufficient for normal aircraft operations with adequate margins for system redundancy.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Eléctrico",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.10 - Electrical Power Generation",
    regulationCode: "EASA CS-25.1351"
  }
];

/**
 * ADDITIONAL A320 HYDRAULIC SYSTEM QUESTIONS
 * Based on A320 FCOM Volume 2 - Flight Controls & Hydraulics
 */
export const additionalHydraulicQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the function of the Power Transfer Unit (PTU) in the A320 hydraulic system?",
    options: [
      "Transfers hydraulic power between Green and Yellow systems automatically",
      "Provides emergency hydraulic power from Blue system to all systems",
      "Boosts engine-driven pump pressure during high demand",
      "Converts electrical power to hydraulic power for backup operation"
    ],
    correctAnswer: 0,
    explanation: "The PTU automatically transfers hydraulic power between the Green and Yellow systems when a pressure differential of more than 500 PSI is detected. It operates as a hydraulic motor-pump unit, using pressure from one system to drive a pump in the other system, ensuring adequate hydraulic power for flight controls and other critical systems.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Hidráulico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.10 - Hydraulic Systems",
    regulationCode: "EASA CS-25.1309"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What happens to flight controls in case of total loss of all hydraulic systems?",
    options: [
      "Mechanical backup through cables for pitch and roll, rudder via mechanical backup",
      "Complete loss of flight controls, aircraft uncontrollable",
      "Electric backup for all flight controls with reduced authority",
      "Autopilot takes over with emergency power supply"
    ],
    correctAnswer: 0,
    explanation: "In case of total hydraulic failure, the A320 has a mechanical backup system. Pitch control is available through the trimmable horizontal stabilizer (THS) controlled by pitch trim wheels, and roll control is available through cables to the ailerons. The rudder has a mechanical backup via the rudder pedals, though with reduced authority. This ensures basic aircraft control for emergency landing.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Hidráulico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.40 - Backup Systems",
    regulationCode: "EASA CS-25.1309"
  }
];

/**
 * ADDITIONAL A320 FLIGHT CONTROLS QUESTIONS
 * Based on A320 FCOM Volume 2 - Flight Controls
 */
export const additionalFlightControlsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum deflection angle of the A320 elevator in normal law?",
    options: [
      "±30° with speed protection limiting excessive inputs",
      "±25° with no additional limitations",
      "±35° with alpha protection preventing stall",
      "±20° with automatic pitch trim assistance"
    ],
    correctAnswer: 0,
    explanation: "The A320 elevator has a maximum deflection of ±30° in normal law. However, the flight envelope protection system, particularly speed protection, will limit excessive elevator inputs that could lead to overspeed or structural damage. The actual deflection is managed by the flight control computers to maintain safe flight parameters.",
    aircraftType: "A320_FAMILY",
    category: "Flight Controls",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.20 - Flight Controls",
    regulationCode: "EASA CS-25.1329"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "How does the A320's sidestick priority system work when both pilots input commands simultaneously?",
    options: [
      "Last pilot to press priority button takes control, other sidestick disabled",
      "Commands are algebraically summed with visual warnings",
      "Captain's sidestick always has priority regardless of inputs",
      "Both commands are processed with system selecting the most appropriate"
    ],
    correctAnswer: 0,
    explanation: "The A320 uses a sidestick priority system where the last pilot to press the takeover pushbutton (red button on the sidestick) gains control. When a pilot presses the priority button, the other sidestick is mechanically disabled, and visual and aural warnings alert both pilots to the priority change. This prevents conflicting inputs during critical flight phases.",
    aircraftType: "A320_FAMILY",
    category: "Flight Controls",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.20 - Flight Controls",
    regulationCode: "EASA CS-25.1329"
  }
];

/**
 * ADDITIONAL A320 FLIGHT MANAGEMENT QUESTIONS
 * Based on A320 FCOM Volume 3 - Flight Management System
 */
export const additionalFlightManagementQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the purpose of the 'TO SHIFT' function in the A320 MCDU?",
    options: [
      "Adjusts takeoff position for accurate GPS alignment",
      "Changes the takeoff runway in flight plan",
      "Modifies takeoff speed calculations for performance",
      "Updates the takeoff time for ATC coordination"
    ],
    correctAnswer: 0,
    explanation: "The 'TO SHIFT' function in the A320 MCDU allows pilots to adjust the takeoff position to ensure accurate GPS alignment and navigation. This is particularly useful when the actual takeoff point differs from the planned runway threshold, ensuring the Flight Management System has accurate position information for navigation and performance calculations.",
    aircraftType: "A320_FAMILY",
    category: "Navegación",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.03.10 - Flight Management System",
    regulationCode: "ICAO Doc 9613 RNAV Manual"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During which phase of flight is the 'FINAL APP' mode automatically armed?",
    options: [
      "During descent when within 15 NM of destination",
      "During approach when localizer captured",
      "During descent when passing transition altitude",
      "During approach when glideslope captured"
    ],
    correctAnswer: 0,
    explanation: "The 'FINAL APP' (Final Approach) mode is automatically armed during the descent phase when the aircraft is within approximately 15 NM of the destination airport. This mode prepares the aircraft for the final approach segment, automatically configuring the flight management system for precision or non-precision approaches as programmed in the flight plan.",
    aircraftType: "A320_FAMILY",
    category: "Navegación",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.22.30 - Approach Modes",
    regulationCode: "ICAO Doc 9613 RNAV Manual"
  }
];

/**
 * ADDITIONAL A320 AUTOFLIGHT QUESTIONS
 * Based on A320 FCOM Volume 3 - Flight Management and Guidance
 */
export const additionalAutoflightQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the minimum altitude for engaging the autopilot in normal operations?",
    options: [
      "100 feet AGL after takeoff",
      "50 feet AGL after takeoff",
      "200 feet AGL after takeoff",
      "Immediately after liftoff"
    ],
    correctAnswer: 0,
    explanation: "In normal operations, the autopilot can be engaged at a minimum altitude of 100 feet AGL after takeoff. This ensures the aircraft has adequate energy and stability for autopilot engagement. During approach, the autopilot can remain engaged down to 50 feet AGL for autoland operations, but for normal flight operations, the 100 feet AGL minimum applies.",
    aircraftType: "A320_FAMILY",
    category: "Autoflight",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.22.10 - Flight Guidance",
    regulationCode: "EASA CS-25.1329"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What happens when both AP/FD switches are turned off during flight?",
    options: [
      "Flight directors disappear, autopilot disconnects, aircraft remains fly-by-wire",
      "Complete loss of flight controls, aircraft reverts to direct law",
      "Flight directors remain, autopilot stays engaged with reduced functionality",
      "System automatically switches to alternate law with limited protections"
    ],
    correctAnswer: 0,
    explanation: "When both AP/FD (Autopilot/Flight Director) switches are turned off, the flight directors disappear from the PFDs and the autopilot disconnects if engaged. However, the aircraft remains in fly-by-wire mode with full normal law protections. The flight control system continues to provide all normal protections, but without autopilot or flight director guidance.",
    aircraftType: "A320_FAMILY",
    category: "Autoflight",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.22.10 - Flight Guidance",
    regulationCode: "EASA CS-25.1329"
  }
];

/**
 * ADDITIONAL A320 PERFORMANCE QUESTIONS
 * Based on A320 FCOM Volume 1 - Performance
 */
export const additionalPerformanceQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum demonstrated crosswind component for A320 takeoff and landing?",
    options: [
      "38 knots with gusts up to 50 knots",
      "32 knots with gusts up to 45 knots",
      "45 knots with no gust limitations",
      "30 knots with gusts up to 40 knots"
    ],
    correctAnswer: 0,
    explanation: "The A320 has a maximum demonstrated crosswind component of 38 knots for both takeoff and landing. Gusts up to 50 knots may be acceptable depending on pilot technique and specific conditions. Operations beyond these limits are not prohibited but are not demonstrated by the manufacturer and require special pilot training and approval.",
    aircraftType: "A320_FAMILY",
    category: "Performance",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.25.10 - Performance Limitations",
    regulationCode: "EASA CS-25.1501"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum takeoff weight limitation due to brake energy considerations?",
    options: [
      "Increases with airport elevation and temperature",
      "Decreases with airport elevation and temperature",
      "Independent of airport elevation and temperature",
      "Only affected by runway slope and wind conditions"
    ],
    correctAnswer: 1,
    explanation: "Brake energy limitations decrease the maximum takeoff weight as airport elevation and temperature increase. Higher elevations and temperatures result in higher true airspeeds for the same indicated airspeed, which increases the kinetic energy that must be dissipated by the brakes during rejected takeoffs. This requires reduced takeoff weights to stay within brake energy limits.",
    aircraftType: "A320_FAMILY",
    category: "Performance",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.25.20 - Takeoff Performance",
    regulationCode: "EASA CS-25.1501"
  }
];

/**
 * ADDITIONAL A320 ENGINE SYSTEM QUESTIONS
 * Based on A320 FCOM Volume 2 - Powerplant
 */
export const additionalEngineQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum continuous EGT (Exhaust Gas Temperature) limit for the CFM56-5B engine?",
    options: [
      "950°C continuous, 1050°C for takeoff",
      "900°C continuous, 1000°C for takeoff",
      "980°C continuous, 1100°C for takeoff",
      "850°C continuous, 950°C for takeoff"
    ],
    correctAnswer: 0,
    explanation: "The CFM56-5B engine has a maximum continuous EGT limit of 950°C. During takeoff and go-around operations, the limit increases to 1050°C for up to 10 minutes. These limits ensure engine longevity while providing adequate performance margins for critical flight operations. Exceeding these limits can cause engine damage and require inspection.",
    aircraftType: "A320_FAMILY",
    category: "Engines",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.70.20 - Powerplant",
    regulationCode: "EASA CS-25.1305"
  }
];

/**
 * ADDITIONAL QUESTIONS TO REACH 75+ FOR TIMED EXAM
 */
export const additionalQuestionsSet1: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum crosswind component for A320 landing operations?",
    options: [
      "38 knots demonstrated, up to 50 knots with pilot approval",
      "30 knots for all operations",
      "45 knots with no restrictions",
      "25 knots for normal operations"
    ],
    correctAnswer: 0,
    explanation: "The A320 has a maximum demonstrated crosswind component of 38 knots. Operations beyond this limit are not prohibited but are not manufacturer-demonstrated. Winds up to 50 knots may be acceptable with special pilot training and approval. This ensures safe landing operations under various wind conditions.",
    aircraftType: "A320_FAMILY",
    category: "Performance",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.25.10 - Performance Limitations",
    regulationCode: "EASA CS-25.1501"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During engine failure after V1, what is the minimum acceleration height for A320?",
    options: [
      "Minimum 400 ft AGL, maximum 2000 ft AGL",
      "Fixed at 1000 ft AGL regardless of conditions",
      "Minimum 800 ft AGL, no maximum specified",
      "Equal to obstacle clearance height"
    ],
    correctAnswer: 0,
    explanation: "After V1 with engine failure, the A320 must accelerate to takeoff safety speed (V2) and reach a minimum acceleration height of 400 ft AGL. The maximum acceleration height is 2000 ft AGL. This ensures adequate obstacle clearance while maintaining optimal climb performance on the remaining engine.",
    aircraftType: "A320_FAMILY",
    category: "Performance",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.25.20 - Takeoff Performance",
    regulationCode: "EASA CS-25.1501"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the function of the A320's Flight Augmentation Computer (FAC)?",
    options: [
      "Yaw damper, rudder trim, rudder travel limitation, flight envelope protection",
      "Autopilot control and flight director guidance",
      "Flight management and navigation calculations",
      "Engine control and thrust management"
    ],
    correctAnswer: 0,
    explanation: "The FAC (Flight Augmentation Computer) provides several critical functions: yaw damper for Dutch roll damping, rudder trim for coordinated flight, rudder travel limitation to prevent excessive rudder inputs, and flight envelope protection including alpha floor and speed protection. Two FAC units provide redundancy for these essential functions.",
    aircraftType: "A320_FAMILY",
    category: "Flight Controls",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.20 - Flight Controls",
    regulationCode: "EASA CS-25.1329"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What happens when the A320's spoilers are armed for landing?",
    options: [
      "Deploy automatically upon touchdown with main gear compression",
      "Must be manually deployed after landing",
      "Deploy when speedbrake lever is pulled",
      "Only deploy if autobrake is selected"
    ],
    correctAnswer: 0,
    explanation: "When spoilers are armed for landing, they deploy automatically upon touchdown when the main gear compresses and the aircraft is in ground mode. This provides maximum aerodynamic drag and increases wheel brake effectiveness. The system ensures immediate spoiler deployment for optimal landing performance and deceleration.",
    aircraftType: "A320_FAMILY",
    category: "Flight Controls",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.20 - Flight Controls",
    regulationCode: "EASA CS-25.1309"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum altitude for A320 passenger oxygen system operation?",
    options: [
      "42,000 feet for 15 minutes with 100% oxygen supply",
      "35,000 feet for 30 minutes with normal supply",
      "45,000 feet for 10 minutes with emergency supply",
      "30,000 feet for continuous operation"
    ],
    correctAnswer: 0,
    explanation: "The A320 passenger oxygen system is certified for operation up to 42,000 feet for a minimum of 15 minutes. This ensures adequate oxygen supply for emergency descent to 10,000 feet or minimum safe altitude. The system provides 100% oxygen automatically when cabin altitude exceeds 14,000 feet.",
    aircraftType: "A320_FAMILY",
    category: "Oxygen",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.40.10 - Oxygen System",
    regulationCode: "EASA CS-25.1441"
  }
];

export const additionalQuestionsSet2: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the minimum visibility requirement for CAT II ILS approach in A320?",
    options: [
      "300 meters RVR with decision height of 100 feet",
      "550 meters RVR with decision height of 200 feet",
      "200 meters RVR with decision height of 50 feet",
      "800 meters visibility with decision height of 150 feet"
    ],
    correctAnswer: 0,
    explanation: "CAT II ILS approach minimums for A320 require 300 meters RVR (Runway Visual Range) with a decision height of 100 feet AGL. These conditions require special pilot training and aircraft equipment certification. The autopilot must be capable of autoland with these minimums for safe operation.",
    aircraftType: "A320_FAMILY",
    category: "Approach Procedures",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.22.30 - Approach Modes",
    regulationCode: "EASA CS-25.1329"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During rapid decompression, what is the priority sequence for A320 emergency procedures?",
    options: [
      "Don oxygen masks, establish communication, control aircraft, initiate descent",
      "Initiate descent, don oxygen masks, establish communication, control aircraft",
      "Control aircraft, don oxygen masks, initiate descent, establish communication",
      "Establish communication, control aircraft, don oxygen masks, initiate descent"
    ],
    correctAnswer: 0,
    explanation: "In rapid decompression, the priority sequence is: 1) Don oxygen masks immediately to prevent hypoxia, 2) Establish communication with crew and passengers, 3) Control aircraft to maintain safe flight path, 4) Initiate emergency descent to 10,000 feet or minimum safe altitude. This sequence ensures crew capability is maintained before addressing other emergencies.",
    aircraftType: "A320_FAMILY",
    category: "Emergency Procedures",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 QRH - Emergency Procedures",
    regulationCode: "EASA CS-25.1441"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum fuel imbalance allowed between A320 wing tanks?",
    options: [
      "370 kg during flight, 1500 kg at takeoff with special procedures",
      "500 kg at all times",
      "1000 kg with no restrictions",
      "Zero imbalance allowed"
    ],
    correctAnswer: 0,
    explanation: "The A320 allows a maximum fuel imbalance of 370 kg between wing tanks during flight. At takeoff, up to 1500 kg imbalance is permitted with special procedures including specific CG considerations. Exceeding these limits can affect aircraft handling, structural loads, and fuel system operation.",
    aircraftType: "A320_FAMILY",
    category: "Fuel",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.28.10 - Fuel System",
    regulationCode: "EASA CS-25.1309"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the minimum battery voltage for A320 APU start?",
    options: [
      "22.5 volts with 25 volts recommended",
      "25 volts minimum at all times",
      "20 volts acceptable for emergency starts",
      "28 volts required for normal operation"
    ],
    correctAnswer: 0,
    explanation: "The minimum battery voltage for A320 APU start is 22.5 volts. However, 25 volts is recommended for optimal starting performance. Below 22.5 volts, APU start may be difficult or impossible. The batteries should be charged to at least this voltage before attempting APU start, especially in cold weather conditions.",
    aircraftType: "A320_FAMILY",
    category: "Electrical",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.30 - APU",
    regulationCode: "EASA CS-25.1351"
  }
];

export const additionalEngineQuestions2: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the minimum oil quantity required for engine start in the A320?",
    options: [
      "11 quarts plus estimated consumption",
      "9 quarts plus estimated consumption",
      "15 quarts with no additional requirements",
      "7 quarts plus estimated consumption"
    ],
    correctAnswer: 0,
    explanation: "The minimum oil quantity for CFM56-5B engine start is 11 quarts plus estimated consumption for the planned flight. This ensures adequate lubrication during engine operation. The 'estimated consumption' accounts for the flight duration, as the engine consumes approximately 0.5 quarts per hour. Starting with less than this minimum quantity can cause engine damage.",
    aircraftType: "A320_FAMILY",
    category: "Engines",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.70.10 - Powerplant",
    regulationCode: "EASA CS-25.1305"
  }
];

/**
 * ADDITIONAL A320 APU QUESTIONS
 * Based on A320 FCOM Volume 2 - Powerplant
 */
export const additionalAPUQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum altitude for APU pneumatic supply in the A320?",
    options: [
      "22,500 feet for air conditioning, 15,000 feet for engine start",
      "25,000 feet for all pneumatic functions",
      "20,000 feet for air conditioning, 10,000 feet for engine start",
      "30,000 feet for air conditioning, 25,000 feet for engine start"
    ],
    correctAnswer: 0,
    explanation: "The A320 APU has altitude limitations for pneumatic supply: 22,500 feet for air conditioning and 15,000 feet for engine start. These limitations are due to the APU's compressor performance decreasing with altitude. Above these altitudes, the APU cannot provide adequate bleed air pressure and temperature for the respective systems.",
    aircraftType: "A320_FAMILY",
    category: "APU",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.70.30 - APU",
    regulationCode: "EASA CS-25.1305"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum EGT during APU start sequence?",
    options: [
      "1250°C for maximum 60 seconds",
      "1050°C with no time limitation",
      "1450°C for maximum 30 seconds",
      "950°C with no time limitation"
    ],
    correctAnswer: 0,
    explanation: "During APU start sequence, the maximum EGT is 1250°C for a maximum of 60 seconds. This higher temperature is acceptable during start because it's a transient condition. If EGT exceeds 1250°C or remains above 950°C for more than 60 seconds, the APU will automatically shut down to prevent damage. Normal operating EGT is typically below 950°C.",
    aircraftType: "A320_FAMILY",
    category: "APU",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.70.30 - APU",
    regulationCode: "EASA CS-25.1305"
  }
];

/**
 * ADDITIONAL A320 LANDING GEAR QUESTIONS
 * Based on A320 FCOM Volume 2 - Landing Gear
 */
export const additionalLandingGearQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum speed for extending and retracting the landing gear in the A320?",
    options: [
      "250 KIAS for extension, 220 KIAS for retraction",
      "280 KIAS for extension, 250 KIAS for retraction",
      "230 KIAS for extension, 200 KIAS for retraction",
      "300 KIAS for extension, 270 KIAS for retraction"
    ],
    correctAnswer: 0,
    explanation: "The A320 landing gear has speed limitations: maximum 250 KIAS for extension and 220 KIAS for retraction. These limits protect the landing gear system from aerodynamic loads that could cause damage. The lower retraction limit ensures the gear doors can close properly without excessive aerodynamic forces. Exceeding these limits can cause gear system damage.",
    aircraftType: "A320_FAMILY",
    category: "Landing Gear",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.30.10 - Landing Gear",
    regulationCode: "EASA CS-25.1309"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What happens if the landing gear is not down and locked during landing?",
    options: [
      "Landing gear lever flashes red, aural warning sounds",
      "Aircraft automatically deploys landing gear",
      "No warnings, pilots must visually confirm",
      "Autopilot disconnects with visual alert only"
    ],
    correctAnswer: 0,
    explanation: "If the landing gear is not down and locked during landing approach below 800 feet RA, the landing gear lever will flash red and an aural warning (five-tone chime) will sound. This continues until the gear is down and locked or the aircraft climbs above 800 feet RA. This system prevents landing gear up landings by providing clear visual and aural warnings.",
    aircraftType: "A320_FAMILY",
    category: "Landing Gear",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.30.20 - Landing Gear System",
    regulationCode: "EASA CS-25.1309"
  }
];

export const apuQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum altitude for APU start and operation?",
    options: [
      "41,000 feet for start, 41,000 feet for operation",
      "39,000 feet for start, 41,000 feet for operation",
      "35,000 feet for start, 39,000 feet for operation",
      "37,000 feet for start, 41,000 feet for operation"
    ],
    correctAnswer: 1,
    explanation: "APU can be started up to 39,000 feet and operated up to 41,000 feet maximum altitude. Above 39,000 feet, if the APU shuts down it cannot be restarted until the aircraft descends below the start limit altitude.",
    aircraftType: "A320_FAMILY",
    category: "APU",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.49.10 - APU Limitations",
    regulationCode: "EASA CS-25.1305"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "How long does a normal APU start sequence take from START button press to available?",
    options: [
      "Approximately 2-3 minutes for complete start sequence",
      "45-60 seconds for normal start sequence",
      "5 minutes maximum start time allowed",
      "90 seconds to reach idle, 3 minutes to full operation"
    ],
    correctAnswer: 0,
    explanation: "Normal APU start sequence takes approximately 2-3 minutes from START button press to AVAIL light illumination. This includes ignition, acceleration to idle, and stabilization. The exact time varies with ambient conditions and APU condition.",
    aircraftType: "A320_FAMILY",
    category: "APU",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.49.20 - APU Start Sequence",
    regulationCode: "EASA CS-25.1305"
  }
];
export const environmentLimitsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum operating altitude for the A320?",
    options: [
      "39,000 feet (FL390)",
      "41,000 feet (FL410)",
      "37,000 feet (FL370)",
      "42,000 feet (FL420)"
    ],
    correctAnswer: 0,
    explanation: "The maximum operating altitude for A320 is 39,000 feet (FL390). This limitation is based on cabin pressurization system capabilities, engine performance, and structural certification. Operating above this altitude requires special approval and may not be covered by standard operating procedures.",
    aircraftType: "A320_FAMILY",
    category: "Environment Limits",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.50 - Environmental Limitations",
    regulationCode: "EASA CS-25.841"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum crosswind component for A320 takeoff and landing?",
    options: [
      "38 knots for takeoff, 38 knots for landing",
      "35 knots for takeoff, 38 knots for landing",
      "33 knots for takeoff, 35 knots for landing",
      "40 knots for takeoff, 35 knots for landing"
    ],
    correctAnswer: 1,
    explanation: "A320 maximum demonstrated crosswind is 35 knots for takeoff and 38 knots for landing. The higher landing limit accounts for better controllability at slower speeds and the ability to use more aggressive control inputs during the landing phase.",
    aircraftType: "A320_FAMILY",
    category: "Environment Limits",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.21.60 - Wind Limitations",
    regulationCode: "EASA CS-25.237"
  }
];
export const gpwsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What triggers a GPWS 'TERRAIN TERRAIN PULL UP' warning?",
    options: [
      "Excessive rate of descent toward terrain with insufficient recovery time",
      "Aircraft below glide path during approach phase only",
      "Landing gear not extended below 500 feet AGL",
      "Flaps not in landing configuration during final approach"
    ],
    correctAnswer: 0,
    explanation: "GPWS 'TERRAIN TERRAIN PULL UP' warning (Mode 1) is triggered when the aircraft has an excessive rate of descent toward terrain with insufficient time for recovery. This is the most urgent GPWS warning requiring immediate action: disconnect autopilot, apply maximum thrust, and pull up aggressively.",
    aircraftType: "A320_FAMILY",
    category: "GPWS",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.31.60 - Ground Proximity Warning System",
    regulationCode: "EASA CS-25.1309"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the correct crew response to a GPWS 'TOO LOW GEAR' warning?",
    options: [
      "Extend landing gear immediately if landing is intended, or climb if not landing",
      "Continue approach normally, warning is advisory only",
      "Execute missed approach procedure immediately",
      "Disconnect GPWS system and continue visually"
    ],
    correctAnswer: 0,
    explanation: "GPWS 'TOO LOW GEAR' warning (Mode 4) indicates the aircraft is below 500 feet AGL without landing gear extended. If landing is intended, extend gear immediately. If not landing (e.g., low approach), initiate climb immediately. This warning prevents gear-up landings.",
    aircraftType: "A320_FAMILY",
    category: "GPWS",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.31.60 - GPWS Mode 4",
    regulationCode: "EASA CS-25.1309"
  }
];
export const landingGearQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the maximum speed for landing gear extension (VLE) on the A320?",
    options: [
      "250 knots / Mach 0.67",
      "280 knots / Mach 0.70",
      "220 knots / Mach 0.60",
      "200 knots / Mach 0.55"
    ],
    correctAnswer: 0,
    explanation: "VLE (Landing gear Extended speed) for A320 is 250 knots or Mach 0.67, whichever is lower. This limitation ensures the landing gear structure can withstand aerodynamic loads when extended. Exceeding this speed with gear extended can cause structural damage.",
    aircraftType: "A320_FAMILY",
    category: "Landing Gear",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.32.20 - Landing Gear Limitations",
    regulationCode: "EASA CS-25.729"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During landing gear retraction, what happens if the gear does not retract within the normal time limit?",
    options: [
      "ECAM warning appears, gear retraction stops automatically, manual override required",
      "System continues attempting retraction indefinitely",
      "Gear automatically extends again for safety",
      "Hydraulic system shuts down to prevent damage"
    ],
    correctAnswer: 0,
    explanation: "If landing gear doesn't retract within the normal time limit (typically 15-20 seconds), an ECAM warning appears and the retraction sequence stops automatically to prevent hydraulic motor overheating. Manual override or troubleshooting via QRH procedures is then required.",
    aircraftType: "A320_FAMILY",
    category: "Landing Gear",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.32.30 - Landing Gear Operations",
    regulationCode: "EASA CS-25.729"
  }
];
export const oxygenQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "At what cabin altitude do the passenger oxygen masks automatically deploy?",
    options: [
      "14,000 feet cabin altitude",
      "12,500 feet cabin altitude",
      "15,000 feet cabin altitude",
      "10,000 feet cabin altitude"
    ],
    correctAnswer: 0,
    explanation: "Passenger oxygen masks automatically deploy when cabin altitude reaches 14,000 feet. This ensures passenger safety during rapid decompression events by providing supplemental oxygen before hypoxia becomes a serious threat to passenger well-being.",
    aircraftType: "A320_FAMILY",
    category: "Oxygen",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.35.10 - Oxygen System",
    regulationCode: "EASA CS-25.1447"
  }
];
export const fireProtectionQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an 'ENG 1 FIRE' warning, what is the immediate action required according to A320 QRH?",
    options: [
      "Engine 1 Master Switch - OFF, Engine 1 Fire Push Button - PUSH, Discharge Agent 1 - PRESS",
      "Thrust Lever 1 - IDLE, Engine 1 Fire Button - PUSH, Land immediately",
      "Autothrust - OFF, Engine 1 Master - OFF, Consider single engine approach",
      "Engine 1 Fire Push Button - PUSH only, Monitor fire detection system"
    ],
    correctAnswer: 0,
    explanation: "For an engine fire, the immediate memory items are: 1) Engine Master Switch OFF (stops fuel flow), 2) Engine Fire Push Button PUSH (arms fire extinguisher and shuts engine systems), 3) Discharge Agent PRESS (releases extinguishing agent). This sequence must be executed immediately to prevent fire spread and structural damage.",
    aircraftType: "A320_FAMILY",
    category: "Fire Protection",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 QRH - ENG FIRE, FCOM 2.78.10",
    regulationCode: "EASA CS-25.1193"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "In case of 'APU FIRE' warning during ground operations, what is the correct action sequence?",
    options: [
      "APU Fire Push Button - PUSH, APU Agent - DISCHARGE, Evacuate if fire persists",
      "APU Master Switch - OFF, APU Fire Button - PUSH, Call ground services",
      "Continue APU shutdown normally, Monitor fire detection, Alert ground crew",
      "APU Emergency Stop, External fire services, Passenger evacuation"
    ],
    correctAnswer: 0,
    explanation: "For APU fire on ground: 1) APU Fire Push Button PUSH (shuts down APU and arms extinguisher), 2) APU Agent DISCHARGE (releases fire suppressant), 3) If fire persists after agent discharge, evacuate aircraft immediately. The APU fire system is designed for single-shot suppression.",
    aircraftType: "A320_FAMILY",
    category: "Fire Protection",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 QRH - APU FIRE, FCOM 2.78.20",
    regulationCode: "EASA CS-25.1193"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What does a 'CARGO SMOKE' warning indicate and what is the immediate crew response?",
    options: [
      "Smoke detected in cargo compartment, Land at nearest suitable airport immediately",
      "Smoke in passenger cabin, Deploy oxygen masks, Emergency descent",
      "False warning due to dust, Continue normal flight, Monitor system",
      "Smoke in avionics bay, Electrical emergency checklist, Consider diversion"
    ],
    correctAnswer: 0,
    explanation: "CARGO SMOKE indicates smoke detection in the cargo compartment, which is equipped with automatic fire suppression. However, the suppression system has limited duration, so immediate landing at the nearest suitable airport is required. The cargo fire suppression system cannot be recharged in flight.",
    aircraftType: "A320_FAMILY",
    category: "Fire Protection",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 QRH - CARGO SMOKE, FCOM 2.78.30",
    regulationCode: "EASA CS-25.857"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During engine fire drill, what systems are automatically shut off when the fire push button is pressed?",
    options: [
      "Fuel shut-off valve, Hydraulic shut-off valve, Bleed air valve, IDG disconnect",
      "Only fuel shut-off valve and electrical power to engine",
      "Fuel, oil, hydraulic, and pneumatic connections to the engine",
      "All engine systems except thrust reverser and ignition system"
    ],
    correctAnswer: 0,
    explanation: "When the engine fire push button is pressed, it automatically shuts off: fuel shut-off valve (stops fuel flow), hydraulic shut-off valve (isolates hydraulic system), bleed air valve (stops pneumatic supply), and disconnects the IDG (integrated drive generator) to prevent electrical arc risk during fire conditions.",
    aircraftType: "A320_FAMILY",
    category: "Fire Protection",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.78.10 - Engine Fire Protection",
    regulationCode: "EASA CS-25.1189"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the capacity and discharge duration of the A320 engine fire extinguishing system?",
    options: [
      "Two bottles per engine, each provides 10 seconds of agent discharge",
      "One bottle per engine, provides 5 seconds of concentrated agent discharge",
      "Two bottles shared between engines, 15 seconds total discharge time",
      "Three bottles total, two for engines and one for APU, 8 seconds each"
    ],
    correctAnswer: 0,
    explanation: "The A320 has two fire extinguisher bottles per engine, each containing Halon 1301 or equivalent agent. Each bottle provides approximately 10 seconds of discharge when activated. The crew can discharge them sequentially if the first bottle doesn't extinguish the fire, providing up to 20 seconds of fire suppression capability per engine.",
    aircraftType: "A320_FAMILY",
    category: "Fire Protection",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.78.10 - Fire Extinguishing System",
    regulationCode: "EASA CS-25.1195"
  }
];
export const engineSystemQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an engine start with 'ENG 1 START FAULT' indication, what are the critical parameters to monitor for hot start prevention?",
    options: [
      "EGT <1083°C (ITT limit), N2 acceleration normal, oil pressure >60 PSI within 30 seconds",
      "EGT <900°C continuously, N1 >25% within 60 seconds, no unusual vibrations",
      "ITT <680°C at idle, N2 >95% within 2 minutes, hydraulic pressure normal",
      "EGT peak <725°C, stable idle within 90 seconds, no compressor stall indications"
    ],
    correctAnswer: 0,
    explanation: "Critical hot start monitoring requires EGT to remain below 1083°C (the ITT limit for CFMI engines), normal N2 acceleration indicating proper air flow, and oil pressure establishment within 30 seconds indicating adequate lubrication. Exceeding EGT limits can cause turbine damage requiring engine replacement.",
    aircraftType: "A320_FAMILY",
    category: "Motor y APU",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.31.10 - Engine Operation Limits",
    regulationCode: "EASA CS-25.1305"
  }
];

/**
 * REAL METEOROLOGY QUESTIONS
 * Based on ICAO Standards and WMO Codes
 */
export const meteorologyQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "En un reporte METAR que indica 'TEMPO 1012/1015 3000 RA BKN008', ¿qué significa este pronóstico temporal?",
    options: [
      "Entre las 10:12 y 10:15 UTC, temporalmente visibilidad 3000m, lluvia, nubes rotas a 800 pies",
      "Desde las 10:12 hasta las 10:15 horas locales, lluvia temporal con nubes a 8000 pies",
      "Temperatura entre 10-12°C y 10-15°C, con lluvia y nubes bajas",
      "Viento temporal de 100°/12kt a 100°/15kt, con lluvia y visibilidad reducida"
    ],
    correctAnswer: 0,
    explanation: "TEMPO indica condiciones temporales que durarán menos de una hora en total y no más de media hora cada vez, entre las 10:12 y 10:15 UTC. 3000 es visibilidad de 3000 metros, RA es lluvia, BKN008 indica nubes rotas (5-7 octavos) a 800 pies AGL.",
    aircraftType: "COMMERCIAL_AIRCRAFT",
    category: "Meteorología",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "ICAO Annex 3 - Meteorological Service, WMO Code 4678",
    regulationCode: "ICAO Doc 8896"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "En condiciones de engelamiento moderado a severo, ¿cuál es el procedimiento operacional correcto para un A320?",
    options: [
      "Activar anti-ice de motor y alas, solicitar cambio de altitud, acelerar salida de condiciones",
      "Solo activar anti-ice si se observa acumulación, mantener velocidad mínima",
      "Desactivar autopiloto, volar manualmente, usar máxima potencia disponible",
      "Activar todos los sistemas anti-ice, incluido pitot y parabrisas, reducir velocidad"
    ],
    correctAnswer: 0,
    explanation: "En condiciones de engelamiento moderado a severo, se debe activar inmediatamente el anti-ice de motores y alas, solicitar cambio de altitud para salir de las condiciones de engelamiento, y acelerar para minimizar el tiempo de exposición. El engelamiento severo puede afectar significativamente la performance y controlabilidad del avión.",
    aircraftType: "A320_FAMILY",
    category: "Meteorología",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.30.10 - Ice and Rain Protection",
    regulationCode: "EASA CS-25.1419"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Cuál es la definición correcta de 'wind shear' y su impacto crítico durante aproximación?",
    options: [
      "Cambio abrupto de dirección/velocidad de viento que puede causar pérdida de sustentación",
      "Viento cruzado superior a 25 kt que afecta la trayectoria de aterrizaje",
      "Turbulencia asociada con tormentas que requiere cambio de ruta",
      "Condición de viento variable que solo afecta el confort de pasajeros"
    ],
    correctAnswer: 0,
    explanation: "Wind shear es un cambio súbito en velocidad y/o dirección del viento que puede causar pérdida peligrosa de sustentación, especialmente durante aproximación cuando la aeronave está en configuración lenta. Puede provocar stall inadvertido o imposibilidad de mantener senda de planeo, requiriendo escape inmediato.",
    aircraftType: "COMMERCIAL_AIRCRAFT",
    category: "Meteorología",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "ICAO Doc 9817 - Manual on Low-level Wind Shear",
    regulationCode: "ICAO Annex 6"
  }
];

/**
 * REAL AVIATION REGULATIONS QUESTIONS
 * Based on ICAO, EASA, and FAA Standards
 */
export const regulationsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "Según EASA Part-ORO, ¿cuál es el tiempo máximo de vuelo permitido para un piloto en operaciones comerciales en un período de 28 días?",
    options: [
      "100 horas de vuelo en cualquier período consecutivo de 28 días",
      "120 horas de vuelo en cualquier período consecutivo de 28 días",
      "90 horas de vuelo distribuidas uniformemente en 28 días",
      "110 horas de vuelo con mínimo 8 días de descanso"
    ],
    correctAnswer: 0,
    explanation: "Según EASA Part-ORO.FTL.210, el límite de tiempo de vuelo es de 100 horas en cualquier período consecutivo de 28 días. Este límite se estableció para prevenir la fatiga del piloto y mantener altos estándares de seguridad en operaciones comerciales. Los operadores deben monitorear continuamente estos límites.",
    aircraftType: "REGULATORY",
    category: "Reglamentación",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "EASA Part-ORO.FTL.210 - Flight Time Limitations",
    regulationCode: "EASA Part-ORO"
  }
];

/**
 * REAL NAVIGATION QUESTIONS
 * Based on Modern Navigation Systems and RNAV Operations
 */
export const navigationQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "Durante una aproximación RNAV (GNSS) RNP 0.3, ¿qué precisión de navegación es requerida y qué equipo de monitoreo es mandatorio?",
    options: [
      "Precisión lateral ±0.3 NM 95% del tiempo, con RAIM o integración multi-sensor",
      "Precisión total ±0.3 NM 99% del tiempo, solo con GPS primario",
      "Precisión vertical ±0.3 NM, con ILS backup mandatorio",
      "Precisión longitudinal ±0.3 NM, sin requerimientos especiales de monitoreo"
    ],
    correctAnswer: 0,
    explanation: "RNP 0.3 requiere precisión de navegación lateral de ±0.3 millas náuticas el 95% del tiempo. Es mandatorio tener capacidad de monitoreo de integridad (alerting) como RAIM (Receiver Autonomous Integrity Monitoring) o integración multi-sensor. Este nivel de precisión permite aproximaciones con separación reducida en aeropuertos congestionados.",
    aircraftType: "COMMERCIAL_AIRCRAFT",
    category: "Navegación",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "ICAO Doc 9613 - Performance-based Navigation Manual",
    regulationCode: "ICAO PBN Manual"
  }
];

/**
 * REAL PERFORMANCE QUESTIONS
 * Based on A320 Performance Calculations and Limitations
 */
export const performanceQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "Para un A320 con peso de despegue de 73,000 kg en pista mojada, ¿cuál es el factor de corrección de distancia de despegue requerido?",
    options: [
      "Incremento del 15% en distancia de despegue calculada",
      "Incremento del 10% solo si hay agua estancada visible",
      "Sin corrección si la pista tiene buen drenaje",
      "Incremento del 25% independientemente de las condiciones"
    ],
    correctAnswer: 0,
    explanation: "Según el manual de performance A320, en pistas mojadas (wet runway) se requiere un incremento del 15% en la distancia de despegue calculada. Esto compensa la reducción en eficiencia de frenado de las ruedas y la posible pérdida de adherencia durante el despegue, especialmente importante en operaciones con peso máximo.",
    aircraftType: "A320_FAMILY",
    category: "Performance",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 AFM - Performance Section",
    regulationCode: "EASA CS-25.109"
  }
];

/**
 * APPROACH PROCEDURES QUESTIONS
 */
export const approachProceduresQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an ILS approach with AP1 engaged, what happens when you press the APPR button?",
    options: [
      "LOC and G/S modes arm, autopilot captures localizer and glideslope automatically",
      "Autopilot disconnects and manual approach mode activates",
      "Only localizer mode arms, glideslope must be captured manually",
      "Autoland mode engages automatically regardless of aircraft configuration"
    ],
    correctAnswer: 0,
    explanation: "When APPR button is pressed during an ILS approach, both LOC (localizer) and G/S (glideslope) modes arm. The autopilot will automatically capture the localizer first, then the glideslope when intercepted. This provides full ILS approach capability with the autopilot engaged.",
    aircraftType: "A320_FAMILY",
    category: "Approach Procedures",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 3.22.20 - ILS Approach",
    regulationCode: "EASA CS-25.1329"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the minimum decision height for CAT I ILS approach?",
    options: [
      "200 feet AGL",
      "100 feet AGL",
      "50 feet AGL",
      "Not applicable for CAT I"
    ],
    correctAnswer: 0,
    explanation: "For CAT I ILS approach, the minimum decision height is 200 feet AGL. Below this height, the approach must be continued visually to landing or a missed approach must be executed. CAT II and CAT III approaches have lower decision heights but require additional equipment and crew certification.",
    aircraftType: "COMMERCIAL_AIRCRAFT",
    category: "Approach Procedures",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "ICAO Annex 10 - CAT I minimums",
    regulationCode: "ICAO Annex 6"
  }
];

/**
 * EMERGENCY PROCEDURES QUESTIONS
 */
export const emergencyProceduresQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During an 'ENG 1 FIRE' warning, what is the immediate action required according to A320 QRH?",
    options: [
      "Engine 1 Master Switch - OFF, Engine 1 Fire Push Button - PUSH, Discharge Agent 1 - PRESS",
      "Thrust Lever 1 - IDLE, Engine 1 Fire Button - PUSH, Land immediately",
      "Autothrust - OFF, Engine 1 Master - OFF, Consider single engine approach",
      "Engine 1 Fire Push Button - PUSH only, Monitor fire detection system"
    ],
    correctAnswer: 0,
    explanation: "For an engine fire, the immediate memory items are: 1) Engine Master Switch OFF (stops fuel flow), 2) Engine Fire Push Button PUSH (arms fire extinguisher and shuts engine systems), 3) Discharge Agent PRESS (releases extinguishing agent). This sequence must be executed immediately to prevent fire spread and structural damage.",
    aircraftType: "A320_FAMILY",
    category: "Emergency Procedures",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 QRH - ENG FIRE, FCOM 2.78.10",
    regulationCode: "EASA CS-25.1193"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "In case of rapid decompression, what is the immediate crew action?",
    options: [
      "Don oxygen masks, establish crew communication, initiate emergency descent",
      "Declare MAYDAY, request immediate vectors to nearest airport",
      "Secure cabin, deploy passenger oxygen masks, reduce altitude",
      "Notify ATC, start APU, prepare for emergency landing"
    ],
    correctAnswer: 0,
    explanation: "In rapid decompression, immediate actions are: 1) Don oxygen masks (within 5 seconds), 2) Establish crew communication, 3) Initiate emergency descent to 10,000 ft or MSA (whichever is higher). This sequence ensures crew survival and ability to control the aircraft while rapidly descending to a safe altitude.",
    aircraftType: "COMMERCIAL_AIRCRAFT",
    category: "Emergency Procedures",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "ICAO Doc 9858 - Emergency Descent Procedures",
    regulationCode: "EASA CS-25.841"
  }
];

/**
 * FLIGHT PROTECTION QUESTIONS
 */
export const flightProtectionQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "In Normal Law, what protection prevents the aircraft from stalling?",
    options: [
      "Alpha protection prevents angle of attack from exceeding alpha max",
      "Speed protection maintains minimum maneuvering speed automatically",
      "Load factor protection limits G-force to maximum structural limits",
      "Bank angle protection prevents excessive roll rates"
    ],
    correctAnswer: 0,
    explanation: "Alpha protection in Normal Law prevents the angle of attack from exceeding alpha max (stall angle). When the pilot pulls back on the sidestick beyond alpha protection, the aircraft will not stall and maintains controlled flight even with full aft sidestick input.",
    aircraftType: "A320_FAMILY",
    category: "Flight Protection",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.10 - Flight Control Laws",
    regulationCode: "EASA CS-25.143"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What happens when the aircraft exceeds maximum operating speed (VMO/MMO)?",
    options: [
      "Overspeed protection automatically reduces thrust and applies speed brakes",
      "Stick shaker activates and autopilot disconnects automatically",
      "Aural warning sounds and red warning message appears on ECAM",
      "Aircraft automatically pitches up to reduce airspeed"
    ],
    correctAnswer: 0,
    explanation: "When VMO/MMO is exceeded, overspeed protection automatically activates by reducing thrust and deploying speed brakes to prevent structural damage. This protection works even with autopilot engaged and is designed to prevent dangerous overspeed conditions that could damage the aircraft structure.",
    aircraftType: "A320_FAMILY",
    category: "Flight Protection",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.27.10 - Overspeed Protection",
    regulationCode: "EASA CS-25.143"
  }
];

/**
 * AIRCRAFT SYSTEMS QUESTIONS
 */
export const aircraftSystemsQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the normal cabin pressure differential limit for the A320?",
    options: [
      "8.6 PSI maximum differential pressure",
      "9.0 PSI maximum differential pressure",
      "7.8 PSI maximum differential pressure",
      "8.0 PSI maximum differential pressure"
    ],
    correctAnswer: 0,
    explanation: "The A320 cabin pressure differential limit is 8.6 PSI. This limitation prevents structural damage to the fuselage while maintaining a comfortable cabin altitude. The cabin pressure controller automatically maintains this differential during normal operations.",
    aircraftType: "A320_FAMILY",
    category: "Aircraft Systems",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.21.10 - Pressurization System",
    regulationCode: "EASA CS-25.841"
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "During takeoff, what is the source of bleed air for air conditioning and pressurization?",
    options: [
      "Engine bleed air from both engines, APU bleed air if running",
      "Only APU bleed air until cruise altitude",
      "Ground air conditioning unit only during takeoff roll",
      "Ram air through dedicated scoops in the fuselage"
    ],
    correctAnswer: 0,
    explanation: "During takeoff, bleed air is supplied from both engine bleeds (5th and 9th stage) and APU bleed if the APU is running. The system automatically manages bleed air distribution to maintain cabin comfort and pressurization requirements throughout all phases of flight.",
    aircraftType: "A320_FAMILY",
    category: "Aircraft Systems",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.21.20 - Bleed Air System",
    regulationCode: "EASA CS-25.831"
  }
];

/**
 * INTERMEDIATE LEVEL QUESTIONS
 * For building foundational knowledge
 */
export const intermediatePracticeQuestions: RealAviationQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "What is the standard procedure for verifying correct flap setting before takeoff in an A320?",
    options: [
      "Check ECAM memo, verify flap handle position matches MCDU PERF page",
      "Visually confirm flap position, check airspeed for configuration",
      "Verify CONFIG button on glareshield, check takeoff config warning",
      "Cross-check flap indicator with FMGC computed takeoff speeds"
    ],
    correctAnswer: 0,
    explanation: "Correct flap verification involves checking the ECAM memo page which displays current flap setting and ensuring the physical flap handle position matches the setting programmed in the MCDU PERF TAKE OFF page. This dual verification prevents configuration errors that could affect takeoff performance calculations.",
    aircraftType: "A320_FAMILY",
    category: "Procedimientos de Despegue",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 1.27.10 - Normal Procedures",
    regulationCode: "EASA CS-25.1583"
  }
];

// Export all questions combined
export const allRealAviationQuestions: RealAviationQuestion[] = [
  ...electricalSystemQuestions,
  ...hydraulicSystemQuestions, 
  ...flightManagementQuestions,
  ...autoflightQuestions,
  ...speedLimitsQuestions,
  ...weightLimitsQuestions,
  ...loadAccelerationLimitsQuestions,
  ...environmentLimitsQuestions,
  ...airBleedCondPressVentQuestions,
  ...flightControlsQuestions,
  ...apuQuestions,
  ...landingGearQuestions,
  ...gpwsQuestions,
  ...oxygenQuestions,
  ...fireProtectionQuestions,
  ...engineSystemQuestions,
  ...meteorologyQuestions,
  ...regulationsQuestions,
  ...navigationQuestions,
  ...performanceQuestions,
  ...approachProceduresQuestions,
  ...emergencyProceduresQuestions,
  ...flightProtectionQuestions,
  ...aircraftSystemsQuestions,
  ...intermediatePracticeQuestions,
  ...additionalElectricalQuestions,
  ...additionalHydraulicQuestions,
  ...additionalFlightControlsQuestions,
  ...additionalFlightManagementQuestions,
  ...additionalAutoflightQuestions,
  ...additionalPerformanceQuestions,
  ...additionalEngineQuestions,
  ...additionalAPUQuestions,
  ...additionalLandingGearQuestions,
  ...additionalQuestionsSet1,
  ...additionalQuestionsSet2
];