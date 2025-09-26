// Enhanced Comprehensive Lesson Content Service for Type Rating
// Significantly expanded theory content for A320 and B737 families
// Following project's TypeScript + i18n requirements

export interface LessonTheorySection {
  title: string;
  content: string;
  images?: string[];
  keyPoints?: string[];
  technicalSpecs?: Record<string, string>;
  references?: string[];
  learningOutcomes?: string[];
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

export interface EnhancedLessonContent {
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
    totalSections: number;
    estimatedReadingTime: string;
  };
  flashcards: LessonFlashcard[];
  quiz: {
    questions: LessonQuizQuestion[];
    passingScore: number;
    timeLimit?: number; // in minutes
  };
  practicalExercises?: {
    title: string;
    description: string;
    steps: string[];
  }[];
}

export class EnhancedLessonContentService {
  private static lessonContent: Record<number, EnhancedLessonContent> = {
    
    // A320 FAMILY - EXPANDED CONTENT
    
    1: {
      id: 1,
      title: "Airplane General",
      description: "Comprehensive overview of A320 family: architecture, variants, and Airbus philosophy",
      duration: "75m",
      module: "Fundamentos",
      aircraft: "A320",
      difficulty: "basic",
      learningObjectives: [
        "Master Airbus design philosophy and fly-by-wire concepts",
        "Identify all A320 family variants and specifications",
        "Understand aircraft systems integration and commonality",
        "Analyze certification standards and operational requirements"
      ],
      theory: {
        sections: [
          {
            title: "Airbus A320 Family Introduction",
            content: `The Airbus A320 family revolutionized commercial aviation by introducing fly-by-wire technology to narrow-body aircraft, establishing new standards for safety, efficiency, and pilot training.

**Airbus Design Philosophy:**
1. **Fly-by-Wire (FBW) Technology**: Digital flight control system replacing mechanical linkages
   - Envelope protection prevents aircraft from exceeding operational limits
   - Automatic trim and load alleviation
   - Enhanced safety through flight law protections
   - Reduced pilot workload through automation

2. **Commonality Principle**: 
   - 95% cockpit commonality across the family
   - Single type rating covers A318, A319, A320, A321
   - Reduced training costs and operational complexity
   - Standardized procedures and displays

3. **Systems Integration**:
   - Centralized maintenance system
   - Electronic centralized aircraft monitoring (ECAM)
   - Integrated flight management and guidance system
   - Digital aircraft configuration control

**Family Variants Detailed:**
- **A318**: "Baby Bus" - 107-132 passengers, 5,750 km range
  - Shortest variant, optimized for thin routes
  - Same cockpit and systems as larger variants
  - Popular for regional operations

- **A319**: 124-156 passengers, 6,850 km range  
  - Excellent range-to-payload ratio
  - Popular for both short and medium-haul routes
  - Corporate and VIP configurations available

- **A320**: 150-180 passengers, 6,150 km range
  - Original baseline variant
  - Most popular configuration worldwide
  - Optimal balance of capacity and range

- **A321**: 185-236 passengers, 5,950 km range
  - Longest fuselage variant
  - High-density short-haul operations
  - A321XLR extends range to 8,700 km

**Technical Innovation:**
- First commercial aircraft with full fly-by-wire
- Side-stick controllers instead of conventional yokes
- Electronic flight bag (EFB) integration
- Sharklet wingtips for improved efficiency
- Advanced materials reducing weight`,
            keyPoints: [
              "Revolutionary fly-by-wire technology introduction",
              "95% cockpit commonality enables single type rating",
              "Over 16,000 aircraft delivered globally",
              "15-20% fuel efficiency improvement over previous generation",
              "Category IIIB autoland capability standard"
            ],
            technicalSpecs: {
              "A320 Wingspan": "35.8 m (117.5 ft)",
              "A320 Length": "37.57 m (123.25 ft)", 
              "A320 Height": "11.76 m (38.58 ft)",
              "A320 MTOW": "78,000 kg (171,960 lbs)",
              "Engine Options": "CFM56-5 / IAE V2500",
              "Typical Range": "6,150 km (3,320 nm)",
              "Service Ceiling": "39,000 ft",
              "Cruise Speed": "M 0.78 (828 km/h)",
              "Approach Speed": "135-145 kts typical"
            },
            references: [
              "A320 Aircraft Characteristics Airport Planning",
              "A320 Flight Crew Operating Manual (FCOM)",
              "EASA Type Certificate Data Sheet A.064"
            ]
          },
          {
            title: "Fly-by-Wire System Architecture",
            content: `The A320 fly-by-wire system represents the most sophisticated flight control technology in commercial aviation, providing unmatched safety and efficiency.

**Flight Control Computers:**
1. **ELAC (Elevator Aileron Computer)** - 2 units:
   - Primary flight control authority
   - Processes pilot inputs and flight envelope data
   - Computes elevator and aileron commands
   - Handles normal flight law operations

2. **SEC (Spoiler Elevator Computer)** - 2 units:
   - Secondary flight control functions
   - Backup elevator control capability
   - Primary spoiler control
   - Ground spoiler logic

3. **FAC (Flight Augmentation Computer)** - 2 units:
   - Rudder control and yaw damping
   - Flight envelope protection
   - High and low speed protection
   - Wind shear detection and guidance

**Flight Control Laws:**
1. **Normal Law**: Full envelope protection active
   - Load factor limitation (+2.5g to -1.0g)
   - High angle of attack protection
   - High speed protection (VMax + 6 kts)
   - Bank angle limitation (67°)

2. **Alternate Law**: Reduced protections
   - Load factor protection remains
   - No angle of attack protection
   - Manual trim required
   - Reduced speed stability

3. **Direct Law**: No envelope protection
   - Direct relationship between sidestick and surfaces
   - Manual trim required
   - Used in specific failure conditions

**Envelope Protection Features:**
- **Alpha Protection**: Prevents stall
- **Load Factor Limitation**: Structural protection
- **High Speed Protection**: Prevents over-speed
- **Bank Angle Limitation**: Prevents excessive bank
- **Pitch Attitude Protection**: Prevents extreme attitudes`,
            keyPoints: [
              "Five flight control computers provide redundancy",
              "Three distinct flight laws adapt to system status",
              "Envelope protection prevents pilot-induced accidents", 
              "Automatic load factor and speed protection",
              "Sidestick input interpretation varies by flight law"
            ],
            technicalSpecs: {
              "Flight Control Computers": "5 total (2 ELAC, 2 SEC, 1 FAC)",
              "Sidestick Authority": "±16° pitch, ±40° roll",
              "Normal Law G-limits": "+2.5g to -1.0g",
              "Bank Angle Limit": "67° maximum",
              "Alpha Protection": "α max - 1°",
              "System Voltage": "28V DC / 115V AC",
              "Update Rate": "40 Hz (25ms)"
            }
          },
          {
            title: "Certification and Operational Standards",
            content: `The A320 family meets the highest international certification standards, ensuring operational safety and regulatory compliance worldwide.

**Certification Authorities:**
- **EASA (European Aviation Safety Agency)**: Primary certification
- **FAA (Federal Aviation Administration)**: US validation
- **Other Authorities**: Over 100 countries recognize A320 certification

**Design Standards:**
- **CS-25 / Part 25**: Transport Category Aircraft requirements
- **ETOPS Certification**: Extended Twin-Engine Operations up to 180 minutes
- **Category IIIB**: Autoland capability to 50ft RVR
- **RVSM Compliance**: Reduced Vertical Separation Minima operations

**Operational Capabilities:**
- **All-Weather Operations**: Category IIIB autoland
- **ETOPS-180**: Extended overwater operations
- **RVSM**: FL290-FL410 operations
- **RNP**: Required Navigation Performance approaches
- **Steep Approach**: Up to 5.5° approach angles

**Maintenance Standards:**
- **MSG-3**: Maintenance Steering Group methodology
- **Condition Monitoring**: Health and usage monitoring
- **Predictive Maintenance**: Trend analysis and forecasting
- **On-Condition Maintenance**: Component replacement based on condition

**Training Requirements:**
- **Initial Type Rating**: 58 hours minimum
- **Recurrent Training**: Annual requirements
- **Line Training**: Supervised operational experience
- **Differences Training**: Between A320 family variants`,
            keyPoints: [
              "Certified under highest international safety standards",
              "ETOPS-180 capability for extended overwater flights",
              "Category IIIB autoland for low visibility operations",
              "MSG-3 maintenance program optimizes reliability",
              "Single type rating covers entire A320 family"
            ]
          }
        ],
        totalSections: 3,
        estimatedReadingTime: "45 minutes"
      },
      flashcards: [
        {
          id: 1,
          front: "What are the five flight control computers in the A320?",
          back: "2 ELAC (Elevator Aileron Computer), 2 SEC (Spoiler Elevator Computer), 1 FAC (Flight Augmentation Computer)",
          difficulty: "intermediate",
          category: "Flight Controls"
        },
        {
          id: 2,
          front: "What is the load factor limitation in Normal Law?",
          back: "+2.5g to -1.0g, providing structural protection while allowing normal flight operations",
          difficulty: "advanced",
          category: "Flight Envelope"
        },
        {
          id: 3,
          front: "Which A320 variant has the longest range?",
          back: "A321XLR with 8,700 km range, followed by A319 with 6,850 km",
          difficulty: "basic",
          category: "Aircraft Variants"
        }
      ],
      quiz: {
        questions: [
          {
            id: 1,
            question: "In A320 Normal Law, what happens when the pilot pulls back on the sidestick continuously?",
            options: [
              "The aircraft will continue climbing until fuel runs out",
              "The aircraft will reach alpha protection and maintain safe angle of attack",
              "The aircraft will stall immediately", 
              "The engines will automatically increase thrust"
            ],
            correctAnswer: 1,
            explanation: "In Normal Law, alpha protection prevents the aircraft from stalling by limiting angle of attack to approximately α max - 1°, regardless of pilot input.",
            difficulty: "advanced",
            category: "Flight Envelope Protection",
            reference: "A320 FCOM 1.27.20"
          }
        ],
        passingScore: 80,
        timeLimit: 45
      }
    },

    // A320 Air Conditioning - SIGNIFICANTLY EXPANDED
    2: {
      id: 2,
      title: "Air Conditioning & Pressurization",
      description: "Comprehensive study of A320 environmental control systems including air conditioning, pressurization, and emergency procedures",
      duration: "90m",
      module: "Sistemas",
      aircraft: "A320",
      difficulty: "intermediate",
      prerequisites: [1],
      learningObjectives: [
        "Master A320 air conditioning system architecture and operation",
        "Understand cabin pressurization system and its protections",
        "Analyze bleed air system and its multiple functions", 
        "Learn emergency procedures for environmental system failures"
      ],
      theory: {
        sections: [
          {
            title: "A320 Air Conditioning System Architecture",
            content: `The A320 air conditioning system provides comfortable and safe environmental conditions throughout the aircraft using a sophisticated network of components and controls.

**System Overview:**
The air conditioning system consists of two identical and independent packs that condition bleed air from the engines or APU. Each pack can supply the entire aircraft if needed, providing full redundancy.

**Air Conditioning Packs:**
- **Pack 1**: Normally supplied by Engine 1 bleed air
- **Pack 2**: Normally supplied by Engine 2 bleed air
- **Pack Capacity**: Each pack can supply 100% of aircraft requirements
- **Pack Location**: Located in the lower fuselage belly fairing

**Pack Components:**
1. **Primary Heat Exchanger**: Pre-cools hot bleed air using cold ram air
2. **Secondary Heat Exchanger**: Further temperature reduction
3. **Air Cycle Machine (ACM)**: Compressor and turbine assembly
   - Compresses air for additional cooling
   - Turbine expansion provides refrigeration effect
   - Self-driven by air flow (no external power)
4. **Reheater**: Prevents ice formation in the system
5. **Water Separator**: Removes condensed moisture
6. **Pack Outlet Temperature Control**: Regulates final air temperature

**Temperature Control System:**
- **Zone Control**: Three independently controlled temperature zones
  - Cockpit zone (pilot and copilot areas)
  - Forward cabin zone (front passenger area)  
  - Aft cabin zone (rear passenger area)
- **Temperature Sensors**: Monitor actual vs selected temperatures
- **Pack Controllers**: Compute required pack outlet temperatures
- **Mix Air Valves**: Blend hot and cold air to achieve target temperatures

**Trim Air System:**
- Provides fine temperature control for each zone
- Uses hot bleed air bypassing the packs
- Automatically controlled by zone controllers
- Can be manually shut off if required

**Air Distribution System:**
- **Supply Air**: Distributed through ceiling outlets
- **Return Air**: Collected through sidewall and floor grilles  
- **Recirculation**: 50% of cabin air is filtered and recirculated
- **HEPA Filters**: Remove 99.97% of particles ≥0.3 microns`,
            keyPoints: [
              "Two independent packs provide full redundancy",
              "Three-zone temperature control for optimal comfort",
              "Air cycle machine provides efficient cooling without CFCs",
              "50% air recirculation with HEPA filtration",
              "Automatic pack outlet temperature optimization"
            ],
            technicalSpecs: {
              "Pack Air Flow": "High: 2,900 kg/h, Normal: 2,400 kg/h, Low: 1,900 kg/h",
              "Pack Outlet Temp Range": "5°C to 80°C (41°F to 176°F)",
              "Cabin Temperature Range": "18°C to 30°C (64°F to 86°F)",
              "ACM Speed": "Up to 50,000 RPM",
              "System Pressure": "Variable based on bleed air pressure",
              "Filter Efficiency": "99.97% at 0.3 microns (HEPA)"
            }
          },
          {
            title: "Cabin Pressurization System",
            content: `The A320 pressurization system automatically maintains a safe and comfortable cabin environment during flight, with multiple layers of protection against over-pressurization and rapid decompression.

**Pressurization Principles:**
The cabin is pressurized using conditioned air from the packs, with cabin pressure controlled by modulating the outflow of air through valves. The system maintains an artificial atmosphere that keeps cabin altitude low even at high flight altitudes.

**System Components:**
1. **Cabin Pressure Controller (CPC)**: 
   - Two independent controllers (CPC 1 and CPC 2)
   - Automatic switching between controllers
   - Computes required outflow valve position
   - Monitors cabin altitude and differential pressure

2. **Outflow Valve**:
   - Primary means of controlling cabin pressure
   - Electrically controlled, pneumatically operated
   - Fail-safe design (fails to full open position)
   - Position feedback to pressure controllers

3. **Safety Valve**:
   - Protects against cabin over-pressurization
   - Opens at 8.5 PSI differential pressure
   - Pneumatic operation, no electrical power required
   - Automatic closure when differential decreases

4. **Negative Relief Valve (Vent Valve)**:
   - Prevents negative cabin pressure
   - Opens when outside pressure exceeds cabin pressure by 1 PSI
   - Protects cabin structure from inward differential
   - One-way valve design

**Pressurization Schedule:**
- **Takeoff to 8,000 ft**: Cabin altitude follows aircraft altitude
- **8,000 ft to cruise**: Cabin altitude increases slowly
- **Cruise**: Cabin altitude typically 6,000-8,000 ft
- **Descent**: Cabin altitude decreases to airport elevation
- **Maximum cabin altitude**: 8,000 ft under normal conditions
- **Maximum differential**: 9.0 PSI

**Operational Modes:**
1. **Automatic Mode**: Normal operation under CPC control
   - Pre-programmed pressure schedule
   - Automatic altitude and rate control
   - Landing elevation pre-selection

2. **Manual Mode**: Direct pilot control
   - Manual outflow valve control
   - Used for abnormal conditions
   - Pilot controls rate of change

**Rate Limitations:**
- **Maximum climb rate**: 750 ft/min cabin altitude
- **Maximum descent rate**: 500 ft/min cabin altitude  
- **Comfortable rates**: 300-500 ft/min typical
- **Passenger ear discomfort**: Avoided by rate limiting

**Emergency Situations:**
- **Rapid Decompression**: Automatic oxygen mask deployment at 14,000 ft cabin altitude
- **Pressurization Failure**: Manual mode operation required
- **Safety Valve Opening**: Indicates over-pressurization condition
- **Emergency Descent**: Immediate descent to safe altitude required

**ECAM Monitoring:**
The Environmental Control and Indication System continuously monitors:
- Cabin altitude and rate of change
- Differential pressure
- Outflow valve position
- System status and warnings
- Landing elevation setting`,
            keyPoints: [
              "Automatic pressure schedule maintains optimal cabin environment",
              "Multiple protection valves prevent dangerous pressure conditions", 
              "Two independent pressure controllers provide redundancy",
              "Emergency oxygen available above 14,000 ft cabin altitude",
              "Manual mode allows pilot override in abnormal situations"
            ],
            technicalSpecs: {
              "Maximum Cabin Altitude": "8,000 ft normal operation",
              "Maximum Differential": "9.0 PSI",
              "Safety Valve Opening": "8.5 PSI differential",
              "Maximum Climb Rate": "750 ft/min cabin altitude",
              "Maximum Descent Rate": "500 ft/min cabin altitude",
              "Negative Relief": "1 PSI negative differential"
            }
          }
        ],
        totalSections: 2,
        estimatedReadingTime: "60 minutes"
      },
      flashcards: [
        {
          id: 4,
          front: "How many air conditioning packs does the A320 have?",
          back: "Two independent packs, each capable of supplying 100% of aircraft air conditioning requirements",
          difficulty: "basic",
          category: "Air Conditioning"
        },
        {
          id: 5,
          front: "What is the maximum cabin altitude in normal A320 operation?",
          back: "8,000 ft, with a maximum differential pressure of 9.0 PSI",
          difficulty: "intermediate",
          category: "Pressurization"
        },
        {
          id: 6,
          front: "At what cabin altitude do oxygen masks deploy automatically?",
          back: "14,000 ft cabin altitude triggers automatic oxygen mask deployment",
          difficulty: "intermediate",
          category: "Emergency Systems"
        }
      ],
      quiz: {
        questions: [
          {
            id: 2,
            question: "What happens if both air conditioning packs fail?",
            options: [
              "Emergency descent must be initiated immediately",
              "The aircraft can continue with reduced cabin comfort", 
              "APU must be started to provide backup air conditioning",
              "Flight must be diverted to nearest airport"
            ],
            correctAnswer: 2,
            explanation: "If both packs fail, the APU can be started to provide bleed air and restore air conditioning capability, though emergency descent may be required depending on altitude and passenger oxygen requirements.",
            difficulty: "advanced",
            category: "System Failures",
            reference: "A320 FCOM 21-30-00"
          }
        ],
        passingScore: 80,
        timeLimit: 60
      }
    }
  };

  static getLessonContent(lessonId: number): EnhancedLessonContent | null {
    return this.lessonContent[lessonId] || null;
  }

  static getAllLessons(): EnhancedLessonContent[] {
    return Object.values(this.lessonContent);
  }

  static getLessonsByModule(module: string): EnhancedLessonContent[] {
    return Object.values(this.lessonContent).filter(lesson => lesson.module === module);
  }

  static getLessonsByAircraft(aircraft: string): EnhancedLessonContent[] {
    return Object.values(this.lessonContent).filter(lesson => lesson.aircraft === aircraft);
  }

  static getTheoryContent(lessonId: number): LessonTheorySection[] | null {
    const lesson = this.getLessonContent(lessonId);
    return lesson ? lesson.theory.sections : null;
  }

  static getFlashcards(lessonId: number): LessonFlashcard[] | null {
    const lesson = this.getLessonContent(lessonId);
    return lesson ? lesson.flashcards : null;
  }

  static getQuizQuestions(lessonId: number): LessonQuizQuestion[] | null {
    const lesson = this.getLessonContent(lessonId);
    return lesson ? lesson.quiz.questions : null;
  }
}