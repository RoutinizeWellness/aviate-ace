// Comprehensive lesson content service for A320 Type Rating
// Organized by aircraft type with detailed theory, flashcards, and quiz content

export interface LessonTheorySection {
  title: string;
  content: string;
  images?: string[];
  keyPoints?: string[];
  technicalSpecs?: Record<string, string>;
}

export interface LessonFlashcard {
  id: number;
  front: string;
  back: string;
  image?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: string;
}

export interface LessonQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: string;
  reference?: string;
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  duration: string;
  module: string;
  aircraft: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  prerequisites?: number[];
  learningObjectives: string[];
  theory: {
    sections: LessonTheorySection[];
  };
  flashcards: LessonFlashcard[];
  quiz: {
    questions: LessonQuizQuestion[];
    passingScore: number;
    timeLimit?: number; // in minutes
  };
}

export class LessonContentService {
  private static lessonContent: Record<number, LessonContent> = {
    // FUNDAMENTOS MODULE
    1: {
      id: 1,
      title: "Airplane General",
      description: "Comprehensive overview of A320 architecture, variants, and Airbus philosophy.",
      duration: "60m",
      module: "Fundamentos",
      aircraft: "A320",
      difficulty: "basic",
      learningObjectives: [
        "Understand A320 family variants and specifications",
        "Learn Airbus design philosophy and fly-by-wire concepts",
        "Identify key systems and components",
        "Recognize cockpit layout and instrumentation"
      ],
      theory: {
        sections: [
          {
            title: "A320 Family Overview",
            content: `The Airbus A320 family is a series of narrow-body airliners developed by Airbus. The family includes four aircraft types: A318, A319, A320, and A321.

**Key Specifications:**
• Maximum seating: 100-240 passengers depending on variant
• Range: 3,200-6,150 km (1,700-3,300 nautical miles)
• Cruise speed: Mach 0.78 (828 km/h at 11,000m)
• Service ceiling: 12,500m (41,000 ft)

**Variants Comparison:**
A318 "Baby Bus": Shortest variant, 107-132 seats
A319: Shortened fuselage, 124-156 seats  
A320: Original baseline model, 150-180 seats
A321: Longest variant, 185-220 seats

All variants share the same pilot type rating due to common systems and handling characteristics.`,
            keyPoints: [
              "Common pilot type rating across all variants",
              "Fly-by-wire flight control system",
              "Glass cockpit with side-stick controllers",
              "High fuel efficiency and low operating costs"
            ],
            technicalSpecs: {
              "Length (A320)": "37.57 m",
              "Wingspan": "35.8 m",
              "Height": "11.76 m", 
              "MTOW": "78,000 kg",
              "Fuel Capacity": "24,210 L",
              "Engines": "CFM56-5 or V2500"
            }
          },
          {
            title: "Airbus Design Philosophy",
            content: `Airbus introduced revolutionary concepts with the A320 that fundamentally changed commercial aviation:

**Fly-by-Wire (FBW) Technology:**
The A320 was the first commercial aircraft to feature full digital fly-by-wire flight controls. The system interprets pilot inputs and manages control surfaces electronically, providing:

• Flight envelope protection
• Automatic trim and stability
• Reduced pilot workload
• Enhanced safety through limiting dangerous maneuvers

**Flight Envelope Protection:**
The system prevents the aircraft from exceeding safe operating limits:
- Angle of Attack Protection: Prevents stall
- High Speed Protection: Prevents overspeeding  
- Load Factor Protection: Prevents structural damage
- Bank Angle Protection: Limits excessive banking

**Common Cockpit Philosophy:**
All A320 family aircraft share identical cockpit layouts, procedures, and systems, enabling:
- Single type rating for all variants
- Reduced training costs
- Pilot flexibility across fleet`,
            keyPoints: [
              "First commercial fly-by-wire aircraft",
              "Electronic flight control system",
              "Flight envelope protection prevents dangerous flight conditions",
              "Side-stick controllers instead of traditional yoke"
            ]
          },
          {
            title: "Cockpit and Systems Overview",
            content: `The A320 cockpit represents a paradigm shift from traditional aircraft design:

**Electronic Flight Instrument System (EFIS):**
- Six large LCD displays replace traditional instruments
- Primary Flight Display (PFD) for each pilot
- Navigation Display (ND) for each pilot  
- Engine/Warning Display (E/WD) and System Display (SD)

**Flight Management System (FMS):**
- Integrated navigation and performance management
- Flight plan programming and modification
- Automatic guidance for lateral and vertical navigation
- Performance optimization calculations

**Electronic Centralized Aircraft Monitor (ECAM):**
- Real-time system monitoring
- Automatic failure detection and crew alerting
- Step-by-step troubleshooting procedures
- System synoptic displays

**Key Cockpit Features:**
- Side-stick controllers for pilot input
- Thrust levers with automatic thrust control
- Electronic checklist system
- Paperless cockpit concept`,
            keyPoints: [
              "Glass cockpit with LCD displays",
              "Integrated flight management system",
              "ECAM for system monitoring and troubleshooting",
              "Side-stick flight controls"
            ]
          }
        ]
      },
      flashcards: [
        {
          id: 1,
          front: "What was revolutionary about the A320 when it first flew?",
          back: "It was the first commercial aircraft with full digital fly-by-wire flight controls, introducing electronic flight envelope protection.",
          difficulty: "basic",
          category: "History & Innovation"
        },
        {
          id: 2, 
          front: "What are the four variants in the A320 family?",
          back: "A318 (shortest), A319 (short), A320 (baseline), A321 (longest). All share the same pilot type rating.",
          difficulty: "basic",
          category: "Aircraft Variants"
        },
        {
          id: 3,
          front: "What is flight envelope protection?",
          back: "FBW system that prevents the aircraft from exceeding safe operating limits including angle of attack, speed, load factor, and bank angle protection.",
          difficulty: "intermediate",
          category: "Flight Controls"
        },
        {
          id: 4,
          front: "What engines can power the A320?",
          back: "CFM56-5 series (by CFM International) or V2500 series (by International Aero Engines).",
          difficulty: "basic",
          category: "Powerplant"
        },
        {
          id: 5,
          front: "What is ECAM and what does it do?",
          back: "Electronic Centralized Aircraft Monitor - provides real-time system monitoring, automatic failure detection, crew alerting, and step-by-step troubleshooting procedures.",
          difficulty: "intermediate",
          category: "Cockpit Systems"
        },
        {
          id: 6,
          front: "What is the typical cruise speed and altitude for the A320?",
          back: "Mach 0.78 (828 km/h) at typical cruise altitude of 11,000m (36,000 ft), with service ceiling of 12,500m (41,000 ft).",
          difficulty: "basic",
          category: "Performance"
        },
        {
          id: 7,
          front: "How does the A320 side-stick differ from traditional controls?",
          back: "Side-stick provides electronic input to flight computers rather than direct mechanical linkage. It doesn't move in response to autopilot or other pilot's inputs.",
          difficulty: "intermediate",
          category: "Flight Controls"
        },
        {
          id: 8,
          front: "What displays are found in the A320 cockpit?",
          back: "Six LCD displays: Two PFDs (Primary Flight Display), two NDs (Navigation Display), one E/WD (Engine/Warning Display), and one SD (System Display).",
          difficulty: "intermediate",
          category: "Cockpit Systems"
        }
      ],
      quiz: {
        passingScore: 80,
        timeLimit: 30,
        questions: [
          {
            id: 1,
            question: "What was the primary innovation that made the A320 revolutionary in commercial aviation?",
            options: [
              "First twin-engine aircraft",
              "First fly-by-wire commercial aircraft", 
              "First aircraft with jet engines",
              "First aircraft with pressurized cabin"
            ],
            correctAnswer: 1,
            explanation: "The A320 was the first commercial aircraft to implement full digital fly-by-wire flight controls, revolutionizing aircraft control systems and introducing flight envelope protection.",
            difficulty: "basic",
            category: "History & Innovation"
          },
          {
            id: 2,
            question: "How many variants are in the A320 family and do they require separate type ratings?",
            options: [
              "3 variants, separate ratings required",
              "4 variants, separate ratings required",
              "4 variants, single type rating covers all",
              "5 variants, single type rating covers all"
            ],
            correctAnswer: 2,
            explanation: "The A320 family has 4 variants (A318, A319, A320, A321) that all share a common type rating due to identical cockpit design and systems.",
            difficulty: "basic",
            category: "Aircraft Variants"
          },
          {
            id: 3,
            question: "Which of the following is NOT a component of A320 flight envelope protection?",
            options: [
              "Angle of attack protection",
              "High speed protection", 
              "Fuel quantity protection",
              "Bank angle protection"
            ],
            correctAnswer: 2,
            explanation: "Flight envelope protection includes angle of attack, high speed, load factor, and bank angle protection. Fuel quantity monitoring is handled by other systems, not flight envelope protection.",
            difficulty: "intermediate",
            category: "Flight Controls"
          },
          {
            id: 4,
            question: "What does ECAM stand for and what is its primary function?",
            options: [
              "Engine Control and Monitoring - controls engine parameters",
              "Electronic Centralized Aircraft Monitor - system monitoring and alerts",
              "Emergency Crew Alert Manager - handles emergency procedures",
              "Electronic Communication and Management - radio communications"
            ],
            correctAnswer: 1,
            explanation: "ECAM (Electronic Centralized Aircraft Monitor) provides real-time system monitoring, automatic failure detection, crew alerting, and troubleshooting procedures.",
            difficulty: "intermediate",
            category: "Cockpit Systems"
          },
          {
            id: 5,
            question: "What is the typical cruise speed of the A320?",
            options: [
              "Mach 0.74",
              "Mach 0.78",
              "Mach 0.82", 
              "Mach 0.85"
            ],
            correctAnswer: 1,
            explanation: "The A320 typically cruises at Mach 0.78, which provides an optimal balance between speed and fuel efficiency.",
            difficulty: "basic",
            category: "Performance"
          },
          {
            id: 6,
            question: "How many main LCD displays are in the A320 cockpit?",
            options: [
              "4 displays",
              "5 displays",
              "6 displays",
              "8 displays"
            ],
            correctAnswer: 2,
            explanation: "The A320 has 6 main LCD displays: 2 PFDs (Primary Flight Display), 2 NDs (Navigation Display), 1 E/WD (Engine/Warning Display), and 1 SD (System Display).",
            difficulty: "intermediate", 
            category: "Cockpit Systems"
          },
          {
            id: 7,
            question: "Which engine options are available for the A320?",
            options: [
              "Only CFM56-5 series",
              "Only V2500 series", 
              "CFM56-5 or V2500 series",
              "PW4000 or RB211 series"
            ],
            correctAnswer: 2,
            explanation: "The A320 can be equipped with either CFM56-5 series engines (by CFM International) or V2500 series engines (by International Aero Engines).",
            difficulty: "basic",
            category: "Powerplant"
          },
          {
            id: 8,
            question: "What is unique about the A320's side-stick controller compared to traditional control yokes?",
            options: [
              "It provides direct mechanical linkage to control surfaces",
              "It moves to show autopilot inputs",
              "It provides electronic input with no mechanical feedback",
              "It controls only the rudder"
            ],
            correctAnswer: 2,
            explanation: "The A320 side-stick provides electronic input to flight computers with no mechanical linkage or feedback. It doesn't move in response to autopilot or the other pilot's inputs.",
            difficulty: "intermediate",
            category: "Flight Controls"
          }
        ]
      }
    },

    // SISTEMAS MODULE - Air Conditioning & Pressurization
    2: {
      id: 2,
      title: "Air Conditioning & Pressurization",
      description: "Complete study of cabin environmental control systems including air conditioning, pressurization, and ventilation systems.",
      duration: "75m",
      module: "Sistemas",
      aircraft: "A320",
      difficulty: "intermediate",
      prerequisites: [1],
      learningObjectives: [
        "Understand the complete air conditioning system architecture",
        "Learn pressurization system operation and controls",
        "Master emergency procedures for system failures",
        "Identify system components and their functions"
      ],
      theory: {
        sections: [
          {
            title: "System Overview and Architecture",
            content: `The A320 Air Conditioning and Pressurization System ensures passenger and crew comfort while maintaining a safe cabin environment at all altitudes.

**System Components:**
• Two independent packs (Pack 1 and Pack 2)
• Cabin pressure controller
• Safety and dump valves
• Temperature control zones
• Recirculation fans and filters

**Air Sources:**
- Engine bleed air (primary)
- APU bleed air (ground/backup)
- External ground air conditioning

**Distribution Zones:**
The cabin is divided into multiple temperature control zones:
- Cockpit zone
- Forward cabin zone  
- Aft cabin zone
- Cargo compartment zones

Each zone can be individually controlled for optimal comfort and efficiency.`,
            keyPoints: [
              "Two redundant air conditioning packs",
              "Multiple independent temperature zones",
              "Automatic pressure control system",
              "Multiple air source options"
            ],
            technicalSpecs: {
              "Normal cabin altitude": "8,000 ft max",
              "Maximum differential pressure": "8.6 PSI",
              "Pack flow rate": "120-150 kg/min each",
              "Temperature range": "18°C to 30°C",
              "Air change rate": "20-30 changes/hour"
            }
          },
          {
            title: "Pressurization System Operation",
            content: `The pressurization system maintains a comfortable and safe cabin environment during flight:

**Automatic Mode:**
- Cabin Pressure Controller (CPC) manages the system
- Target cabin altitude set based on flight plan
- Gradual pressure changes for passenger comfort
- Automatic landing field elevation adjustment

**Pressure Control Components:**
- Two independent cabin pressure controllers
- Two outflow valves (primary control)
- One safety valve (8.6 PSI relief)
- Multiple dump valves for rapid depressurization

**Normal Operation Phases:**
1. Pre-flight: System test and initialization
2. Takeoff: Controlled cabin altitude increase
3. Climb: Gradual pressure reduction to cruise cabin altitude
4. Cruise: Maintained at optimum cabin altitude
5. Descent: Controlled repressurization
6. Landing: Cabin pressure equalized with ambient

**Cabin Altitude Management:**
- Sea level to 8,000 ft: No cabin altitude warning
- 8,000 to 10,000 ft: Master caution
- Above 10,000 ft: Master warning and oxygen masks`,
            keyPoints: [
              "Automatic cabin pressure control",
              "Maximum cabin altitude 8,000 ft",
              "Dual redundant pressure controllers",
              "Progressive warning system for altitude"
            ]
          }
        ]
      },
      flashcards: [
        {
          id: 1,
          front: "What is the maximum cabin altitude in normal operation?",
          back: "8,000 feet. Above this altitude, a master caution is activated.",
          difficulty: "basic",
          category: "Pressurization"
        },
        {
          id: 2,
          front: "How many air conditioning packs does the A320 have?",
          back: "Two independent packs (Pack 1 and Pack 2) for redundancy and sufficient air flow.",
          difficulty: "basic",
          category: "Air Conditioning"
        },
        {
          id: 3,
          front: "What is the maximum differential pressure for the A320 cabin?",
          back: "8.6 PSI. This is relieved automatically by the safety valve if exceeded.",
          difficulty: "intermediate",
          category: "Pressurization"
        },
        {
          id: 4,
          front: "What are the primary air sources for the environmental system?",
          back: "Engine bleed air (primary), APU bleed air (ground/backup), and external ground air conditioning.",
          difficulty: "basic",
          category: "Air Sources"
        },
        {
          id: 5,
          front: "How many temperature control zones are in the A320 cabin?",
          back: "Multiple zones: Cockpit, forward cabin, aft cabin, and cargo compartments - each individually controllable.",
          difficulty: "intermediate",
          category: "Temperature Control"
        }
      ],
      quiz: {
        passingScore: 75,
        timeLimit: 25,
        questions: [
          {
            id: 1,
            question: "What is the maximum cabin altitude in normal A320 operation?",
            options: ["6,000 feet", "8,000 feet", "10,000 feet", "12,000 feet"],
            correctAnswer: 1,
            explanation: "The maximum cabin altitude in normal operation is 8,000 feet. Above this, a master caution is activated.",
            difficulty: "basic",
            category: "Pressurization"
          },
          {
            id: 2, 
            question: "How many independent air conditioning packs does the A320 have?",
            options: ["One", "Two", "Three", "Four"],
            correctAnswer: 1,
            explanation: "The A320 has two independent air conditioning packs for redundancy and adequate air flow capacity.",
            difficulty: "basic",
            category: "Air Conditioning"
          },
          {
            id: 3,
            question: "At what cabin altitude do oxygen masks automatically deploy?",
            options: ["8,000 feet", "10,000 feet", "12,000 feet", "14,000 feet"],
            correctAnswer: 2,
            explanation: "Oxygen masks automatically deploy when cabin altitude exceeds approximately 14,000 feet as a safety measure.",
            difficulty: "intermediate",
            category: "Emergency Systems"
          }
        ]
      }
    },

    // SISTEMAS MODULE - Electrical System
    3: {
      id: 3,
      title: "Electrical System",
      description: "Complete analysis of A320 electrical power generation, distribution, and emergency systems.",
      duration: "90m",
      module: "Sistemas",
      aircraft: "A320",
      difficulty: "advanced",
      prerequisites: [1, 2],
      learningObjectives: [
        "Understand electrical power generation and distribution architecture",
        "Learn normal and emergency electrical configurations",
        "Master electrical system controls and indications",
        "Identify backup power systems and their limitations"
      ],
      theory: {
        sections: [
          {
            title: "Electrical Power Generation",
            content: `The A320 electrical system provides reliable power through multiple independent sources with automatic load management and backup systems.

**Primary Power Sources:**
• Two engine-driven generators (IDG - Integrated Drive Generator)
• APU generator
• External ground power
• Ram Air Turbine (RAT) emergency generator
• Batteries for backup power

**Generator Specifications:**
- Engine IDGs: 90 kVA, 115V AC, 400 Hz
- APU Generator: 90 kVA, 115V AC, 400 Hz  
- RAT Generator: 5 kVA emergency power
- Batteries: 24V DC, 44 Ah nickel-cadmium

**Automatic Load Management:**
The electrical system automatically manages power distribution through:
- Generator Load Control Units (GLCUs)
- Automatic source switching
- Load shedding during emergencies
- Priority power distribution`,
            keyPoints: [
              "Dual redundant AC power generation",
              "Automatic load management system",
              "Emergency RAT generator backup",
              "Integrated battery backup systems"
            ],
            technicalSpecs: {
              "Main generators": "90 kVA each",
              "Emergency generator": "5 kVA RAT",
              "Battery capacity": "44 Ah each",
              "Frequency": "400 Hz AC",
              "Voltage": "115V AC / 24V DC"
            }
          },
          {
            title: "Distribution Architecture",
            content: `Power distribution ensures reliable electrical supply to all aircraft systems through redundant pathways:

**AC Distribution:**
- AC BUS 1 and AC BUS 2 (main buses)
- AC ESS BUS (essential bus)
- Emergency AC supply from inverter or RAT

**DC Distribution:**
- DC BUS 1 and DC BUS 2 (from TRUs)
- DC BAT BUS (battery bus)
- DC ESS BUS (essential DC bus)
- HOT BUS (always powered when batteries connected)

**Load Categories:**
1. Essential loads: Critical for flight safety
2. Non-essential loads: Can be shed during emergencies
3. Emergency loads: Powered by emergency systems

**Normal Configuration:**
- Each engine generator powers its respective AC bus
- Cross-feeding available between buses
- TRUs convert AC to DC for DC systems
- Batteries on standby/floating charge`,
            keyPoints: [
              "Segregated AC and DC distribution systems",
              "Essential vs non-essential load prioritization",
              "Automatic and manual bus tie capabilities",
              "Emergency power distribution pathways"
            ]
          }
        ]
      },
      flashcards: [
        {
          id: 1,
          front: "What is the power output of each A320 engine-driven generator?",
          back: "90 kVA at 115V AC, 400 Hz. Each generator can power its respective electrical systems independently.",
          difficulty: "basic",
          category: "Power Generation"
        },
        {
          id: 2,
          front: "What provides emergency electrical power if both engines fail?",
          back: "The Ram Air Turbine (RAT) automatically deploys and provides 5 kVA of emergency electrical power.",
          difficulty: "intermediate",
          category: "Emergency Systems"
        },
        {
          id: 3,
          front: "What type of batteries does the A320 use?",
          back: "Two 24V DC, 44 Ah nickel-cadmium batteries provide backup and emergency power.",
          difficulty: "basic",
          category: "Battery Systems"
        },
        {
          id: 4,
          front: "What does TRU stand for and what is its function?",
          back: "Transformer Rectifier Unit - converts 115V AC to 28V DC for DC-powered systems and battery charging.",
          difficulty: "intermediate",
          category: "Power Conversion"
        }
      ],
      quiz: {
        passingScore: 80,
        timeLimit: 30,
        questions: [
          {
            id: 1,
            question: "What is the power rating of each A320 engine-driven generator?",
            options: ["75 kVA", "90 kVA", "110 kVA", "125 kVA"],
            correctAnswer: 1,
            explanation: "Each Integrated Drive Generator (IDG) produces 90 kVA at 115V AC, 400 Hz.",
            difficulty: "basic",
            category: "Power Generation"
          },
          {
            id: 2,
            question: "In an emergency with both engines failed, what provides electrical power?",
            options: ["APU only", "Batteries only", "RAT generator and batteries", "External ground power"],
            correctAnswer: 2,
            explanation: "The Ram Air Turbine (RAT) automatically deploys to provide 5 kVA emergency power, supplemented by battery power.",
            difficulty: "intermediate",
            category: "Emergency Systems"
          },
          {
            id: 3,
            question: "What type and capacity are the A320 batteries?",
            options: ["Lead-acid, 36 Ah", "Nickel-cadmium, 44 Ah", "Lithium-ion, 50 Ah", "Lead-acid, 44 Ah"],
            correctAnswer: 1,
            explanation: "The A320 uses two 24V DC, 44 Ah nickel-cadmium batteries for backup and emergency power.",
            difficulty: "basic",
            category: "Battery Systems"
          }
        ]
      }
    },

    // SISTEMAS MODULE - Hydraulic System
    4: {
      id: 4,
      title: "Hydraulic System",
      description: "In-depth study of A320 hydraulic power systems, including normal operation and emergency backup systems.",
      duration: "85m",
      module: "Sistemas",
      aircraft: "A320",
      difficulty: "advanced",
      prerequisites: [1, 2, 3],
      learningObjectives: [
        "Understand the three independent hydraulic systems",
        "Learn hydraulic power distribution and prioritization",
        "Master emergency and backup hydraulic procedures",
        "Identify hydraulic system components and operation"
      ],
      theory: {
        sections: [
          {
            title: "Hydraulic System Architecture",
            content: `The A320 features three independent hydraulic systems providing redundant power for critical flight controls and systems.

**System Configuration:**
• Green System: Engine 1 driven, primary flight controls
• Blue System: Electric pump driven, backup and landing gear
• Yellow System: Engine 2 driven, primary flight controls

**System Specifications:**
- Operating pressure: 3,000 PSI (207 bar)
- Reservoir capacity: 12 liters each
- Flow rate: Variable based on demand
- Filtration: Multiple stages with bypass capability

**Power Sources:**
Green System:
- Engine 1 driven pump (primary)
- Electric pump (backup)
- Manual hand pump (emergency)

Blue System:
- Electric pump (primary)
- RAT pump (emergency)

Yellow System:
- Engine 2 driven pump (primary)
- Electric pump (backup)
- Manual hand pump (emergency)`,
            keyPoints: [
              "Three independent hydraulic systems",
              "3,000 PSI operating pressure",
              "Multiple power source options per system",
              "Redundant pumps for critical systems"
            ],
            technicalSpecs: {
              "Operating pressure": "3,000 PSI (207 bar)",
              "Reservoir capacity": "12 liters each",
              "Number of systems": "3 (Green, Blue, Yellow)",
              "Emergency backup": "RAT and manual pumps",
              "Filter rating": "10 micron nominal"
            }
          },
          {
            title: "System Functions and Prioritization",
            content: `Each hydraulic system powers specific aircraft functions with carefully designed redundancy:

**Green System Powers:**
- Left engine thrust reverser
- Normal brake system (alternate)
- Nose wheel steering (backup)
- Some flight control surfaces

**Blue System Powers:**
- Landing gear extension/retraction
- Normal brake system (primary)
- Nose wheel steering (primary)
- Emergency generator (RAT)
- Some flight control surfaces

**Yellow System Powers:**
- Right engine thrust reverser
- Cargo door operation
- Landing gear doors
- Some flight control surfaces

**Flight Control Distribution:**
Primary flight controls are powered by multiple systems:
- Elevator: Green + Yellow systems
- Rudder: Green + Blue + Yellow systems  
- Ailerons: Green + Blue systems
- Spoilers: Green + Yellow systems

**Priority Valve System:**
During low pressure conditions, priority valves ensure:
1. Flight controls receive priority
2. Secondary systems are isolated
3. Essential functions maintained`,
            keyPoints: [
              "Redundant power for all critical flight controls",
              "Priority valve system protects flight controls",
              "Each system has specific primary functions",
              "Multiple systems back up essential functions"
            ]
          }
        ]
      },
      flashcards: [
        {
          id: 1,
          front: "What is the operating pressure of A320 hydraulic systems?",
          back: "3,000 PSI (207 bar) for all three hydraulic systems - Green, Blue, and Yellow.",
          difficulty: "basic",
          category: "System Specifications"
        },
        {
          id: 2,
          front: "Which hydraulic system powers the landing gear?",
          back: "Blue system powers landing gear extension/retraction, while Yellow system operates the landing gear doors.",
          difficulty: "intermediate",
          category: "System Functions"
        },
        {
          id: 3,
          front: "What happens if hydraulic pressure drops in a system?",
          back: "Priority valves automatically isolate non-essential functions to preserve hydraulic power for flight controls.",
          difficulty: "advanced",
          category: "Emergency Procedures"
        },
        {
          id: 4,
          front: "How many hydraulic systems power the rudder?",
          back: "All three systems (Green, Blue, and Yellow) can power the rudder for maximum redundancy.",
          difficulty: "intermediate",
          category: "Flight Controls"
        }
      ],
      quiz: {
        passingScore: 75,
        timeLimit: 25,
        questions: [
          {
            id: 1,
            question: "What is the normal operating pressure for A320 hydraulic systems?",
            options: ["2,500 PSI", "3,000 PSI", "3,500 PSI", "4,000 PSI"],
            correctAnswer: 1,
            explanation: "All three A320 hydraulic systems operate at 3,000 PSI (207 bar) normal pressure.",
            difficulty: "basic",
            category: "System Specifications"
          },
          {
            id: 2,
            question: "Which hydraulic system primarily powers the landing gear operation?",
            options: ["Green system", "Blue system", "Yellow system", "All systems together"],
            correctAnswer: 1,
            explanation: "The Blue hydraulic system powers landing gear extension and retraction, while Yellow operates the gear doors.",
            difficulty: "intermediate",
            category: "System Functions"
          },
          {
            id: 3,
            question: "How many hydraulic systems can power the rudder?",
            options: ["One", "Two", "Three", "Four"],
            correctAnswer: 2,
            explanation: "All three hydraulic systems (Green, Blue, and Yellow) can power the rudder, providing maximum redundancy for this critical flight control.",
            difficulty: "intermediate",
            category: "Flight Controls"
          }
        ]
      }
    },

    // SISTEMAS MODULE - Flight Controls
    5: {
      id: 5,
      title: "Flight Controls",
      description: "Advanced study of A320 fly-by-wire flight control system, including normal and alternate laws.",
      duration: "100m",
      module: "Sistemas",
      aircraft: "A320",
      difficulty: "advanced",
      prerequisites: [1, 2, 3, 4],
      learningObjectives: [
        "Master fly-by-wire control laws and protections",
        "Understand flight control surface distribution and redundancy",
        "Learn degraded mode operations and limitations",
        "Identify flight control system components and operation"
      ],
      theory: {
        sections: [
          {
            title: "Fly-by-Wire System Overview",
            content: `The A320 fly-by-wire system represents a fundamental shift from conventional mechanical flight controls to computer-mediated control.

**Flight Control Computers:**
• 2 Elevator and Aileron Computers (ELACs)
• 3 Spoiler and Elevator Computers (SECs)
• 2 Flight Augmentation Computers (FACs)

**Control Laws:**
1. Normal Law: Full flight envelope protection active
2. Alternate Law: Reduced protections, some limitations
3. Direct Law: Minimal computer assistance
4. Mechanical Backup: Manual reversion for pitch control

**Flight Envelope Protections (Normal Law):**
- High Angle of Attack Protection
- High Speed Protection  
- Load Factor Protection (+2.5g to -1g)
- Bank Angle Protection (67° maximum)
- High Pitch Attitude Protection

**Primary Flight Controls:**
- Elevator (hydraulic: Green + Yellow)
- Rudder (hydraulic: Green + Blue + Yellow)
- Ailerons (hydraulic: Green + Blue)
- Spoilers/Speed brakes (hydraulic: Green + Yellow)`,
            keyPoints: [
              "Computer-mediated flight control system",
              "Multiple control law configurations",
              "Comprehensive flight envelope protection",
              "Redundant hydraulic power distribution"
            ],
            technicalSpecs: {
              "Control computers": "7 total (2 ELAC, 3 SEC, 2 FAC)",
              "Hydraulic systems": "3 independent systems",
              "Max bank angle": "67° (normal law)",
              "Load factor limits": "+2.5g to -1g",
              "Pitch attitude limit": "25° up / 15° down"
            }
          },
          {
            title: "Control Law Degradation",
            content: `The flight control system can operate in different control law modes based on system availability and failure conditions:

**Normal Law:**
- Full flight envelope protection active
- Load factor and bank angle limitations
- High/low speed protection
- Automatic pitch trim
- Alpha floor protection

**Alternate Law:**
- Reduced envelope protections
- No automatic trim
- Load factor protection reduced
- Speed stability reduced
- Manual pitch control required

**Direct Law:**
- Minimal computer assistance
- Direct relationship between sidestick and surface deflection
- No envelope protections
- Manual trim required
- Reduced system redundancy

**Mechanical Backup:**
- Manual pitch control via trim wheel
- Rudder control through pedals
- Limited to pitch control only
- Emergency use only

**Degradation Triggers:**
- Multiple computer failures
- Air data sensor failures
- Hydraulic system failures
- Electrical system failures
- Configuration warnings`,
            keyPoints: [
              "Four distinct control law modes",
              "Progressive degradation based on failures",
              "Envelope protections vary by mode",
              "Manual backup systems available"
            ]
          }
        ]
      },
      flashcards: [
        {
          id: 1,
          front: "How many flight control computers are in the A320?",
          back: "Seven computers: 2 ELACs (Elevator/Aileron), 3 SECs (Spoiler/Elevator), and 2 FACs (Flight Augmentation).",
          difficulty: "intermediate",
          category: "System Architecture"
        },
        {
          id: 2,
          front: "What is the maximum bank angle in Normal Law?",
          back: "67 degrees. Beyond this, the system provides bank angle protection to prevent excessive banking.",
          difficulty: "basic",
          category: "Flight Envelope Protection"
        },
        {
          id: 3,
          front: "What are the four flight control law modes?",
          back: "Normal Law (full protection), Alternate Law (reduced protection), Direct Law (minimal assistance), and Mechanical Backup (manual only).",
          difficulty: "advanced",
          category: "Control Laws"
        },
        {
          id: 4,
          front: "What load factor limits apply in Normal Law?",
          back: "+2.5g to -1g. The system prevents exceeding these limits to protect aircraft structure.",
          difficulty: "intermediate",
          category: "Flight Envelope Protection"
        }
      ],
      quiz: {
        passingScore: 80,
        timeLimit: 35,
        questions: [
          {
            id: 1,
            question: "How many flight control computers does the A320 have in total?",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2,
            explanation: "The A320 has 7 flight control computers: 2 ELACs, 3 SECs, and 2 FACs for redundancy and safety.",
            difficulty: "intermediate",
            category: "System Architecture"
          },
          {
            id: 2,
            question: "In Normal Law, what is the maximum bank angle protection limit?",
            options: ["60 degrees", "67 degrees", "70 degrees", "75 degrees"],
            correctAnswer: 1,
            explanation: "Normal Law provides bank angle protection at 67 degrees to prevent excessive banking maneuvers.",
            difficulty: "basic",
            category: "Flight Envelope Protection"
          },
          {
            id: 3,
            question: "Which control law mode provides the least computer assistance?",
            options: ["Normal Law", "Alternate Law", "Direct Law", "Mechanical Backup"],
            correctAnswer: 2,
            explanation: "Direct Law provides minimal computer assistance with direct relationship between sidestick input and control surface deflection.",
            difficulty: "advanced",
            category: "Control Laws"
          }
        ]
      }
    }
  };

  // Get lesson content by ID
  static getLessonContent(lessonId: number): LessonContent | null {
    return this.lessonContent[lessonId] || null;
  }

  // Get all available lessons
  static getAllLessons(): LessonContent[] {
    return Object.values(this.lessonContent);
  }

  // Get lessons by module
  static getLessonsByModule(module: string): LessonContent[] {
    return Object.values(this.lessonContent).filter(lesson => lesson.module === module);
  }

  // Get lessons by difficulty
  static getLessonsByDifficulty(difficulty: 'basic' | 'intermediate' | 'advanced'): LessonContent[] {
    return Object.values(this.lessonContent).filter(lesson => lesson.difficulty === difficulty);
  }

  // Check if lesson prerequisites are met
  static arePrerequisitesMet(lessonId: number, completedLessons: number[]): boolean {
    const lesson = this.getLessonContent(lessonId);
    if (!lesson || !lesson.prerequisites) return true;
    
    return lesson.prerequisites.every(prereq => completedLessons.includes(prereq));
  }

  // Get next recommended lesson
  static getNextRecommendedLesson(completedLessons: number[]): LessonContent | null {
    const allLessons = this.getAllLessons();
    
    // Find first incomplete lesson where prerequisites are met
    for (const lesson of allLessons) {
      if (!completedLessons.includes(lesson.id) && 
          this.arePrerequisitesMet(lesson.id, completedLessons)) {
        return lesson;
      }
    }
    
    return null;
  }

  // Get lesson statistics
  static getLessonStats(lessonId: number): {
    totalFlashcards: number;
    totalQuizQuestions: number;
    estimatedStudyTime: number; // in minutes
    difficulty: string;
  } {
    const lesson = this.getLessonContent(lessonId);
    if (!lesson) {
      return { totalFlashcards: 0, totalQuizQuestions: 0, estimatedStudyTime: 0, difficulty: 'unknown' };
    }

    return {
      totalFlashcards: lesson.flashcards.length,
      totalQuizQuestions: lesson.quiz.questions.length,
      estimatedStudyTime: parseInt(lesson.duration),
      difficulty: lesson.difficulty
    };
  }
}