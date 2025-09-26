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
    1: {
      id: 1,
      title: "Airplane General",
      description: "Visión general A320: arquitectura, variantes y filosofía Airbus.",
      duration: "45m",
      module: "Fundamentos",
      aircraft: "A320",
      difficulty: "basic",
      learningObjectives: [
        "Comprender la filosofía de diseño Airbus",
        "Identificar las principales variantes de la familia A320",
        "Conocer la arquitectura básica del avión",
        "Entender los sistemas integrados y la filosofía fly-by-wire"
      ],
      theory: {
        sections: [
          {
            title: "Introducción a la Familia A320",
            content: `La familia Airbus A320 representa una revolución en la aviación comercial moderna, introduciendo conceptos innovadores que han definido el estándar de la industria.

**Filosofía de Diseño Airbus:**
Airbus desarrolló la familia A320 con tres principios fundamentales:
1. **Fly-by-Wire (FBW)**: Sistema de control digital que reemplaza los controles mecánicos tradicionales
2. **Commonality**: Similaridad entre aeronaves para reducir costos de entrenamiento
3. **Eficiencia Operacional**: Optimización de combustible y mantenimiento

**Variantes de la Familia:**
- **A318**: 107-132 asientos, alcance 5,750 km
- **A319**: 124-156 asientos, alcance 6,850 km  
- **A320**: 150-180 asientos, alcance 6,150 km
- **A321**: 185-236 asientos, alcance 5,950 km

**Características Distintivas:**
- Cabina de cristal con pantallas LCD
- Sistema de gestión de vuelo integrado (FMGS)
- Protecciones de envolvente de vuelo
- Joystick lateral (sidestick)
- Sistemas redundantes para máxima seguridad

**Certificaciones y Estándares:**
Certificado bajo EASA CS-25 y FAA Part 25, cumpliendo los más altos estándares de seguridad aeronáutica internacional.`,
            keyPoints: [
              "Primer avión comercial con fly-by-wire completo",
              "Commonality del 95% entre cockpits de la familia",
              "Más de 16,000 aeronaves entregadas globalmente",
              "Eficiencia de combustible 15% superior a generación anterior"
            ],
            technicalSpecs: {
              "Envergadura A320": "35.8 m",
              "Longitud A320": "37.57 m",
              "Altura": "11.76 m",
              "Peso máximo despegue": "78,000 kg",
              "Motores disponibles": "CFM56-5 / V2500",
              "Alcance típico": "6,150 km",
              "Altitud máxima": "39,000 ft",
              "Velocidad crucero": "M 0.78"
            }
          }
        ]
      },
      flashcards: [
        {
          id: 1,
          front: "¿Cuáles son las 4 variantes principales de la familia A320?",
          back: "A318 (107-132 asientos), A319 (124-156 asientos), A320 (150-180 asientos), A321 (185-236 asientos)",
          difficulty: "basic",
          category: "Fundamentos"
        },
        {
          id: 2,
          front: "¿Qué significa FBW y cuál es su función principal?",
          back: "Fly-by-Wire: Sistema de control digital que reemplaza controles mecánicos, proporcionando protecciones de envolvente y optimización del vuelo",
          difficulty: "intermediate",
          category: "Sistemas"
        },
        {
          id: 3,
          front: "¿Cuántas computadoras de control de vuelo tiene el A320?",
          back: "5 computadoras: 2 ELAC (Elevator Aileron Computer), 2 SEC (Spoiler Elevator Computer), 1 FAC (Flight Augmentation Computer)",
          difficulty: "advanced",
          category: "Fly-by-Wire"
        }
      ],
      quiz: {
        questions: [
          {
            id: 1,
            question: "¿Cuál es la principal ventaja del sistema Fly-by-Wire en el A320?",
            options: [
              "Reduce el peso de la aeronave",
              "Proporciona protecciones de envolvente automáticas",
              "Elimina la necesidad de pilotos",
              "Aumenta la velocidad máxima"
            ],
            correctAnswer: 1,
            explanation: "El sistema Fly-by-Wire del A320 proporciona protecciones automáticas de envolvente de vuelo, previniendo que la aeronave exceda sus límites operacionales y mejorando significativamente la seguridad.",
            difficulty: "intermediate",
            category: "Fundamentos",
            reference: "A320 FCOM 1.27.10"
          }
        ],
        passingScore: 80,
        timeLimit: 30
      }
    },
    
    // A320 Anti-Ice & Rain Protection
    3: {
      id: 3,
      title: "Anti-ice and Rain",
      description: "A320 ice protection systems including engine anti-ice, wing anti-ice, and rain protection systems",
      duration: "50m",
      module: "Sistemas",
      aircraft: "A320",
      difficulty: "intermediate",
      prerequisites: [1],
      learningObjectives: [
        "Understand ice formation and detection systems",
        "Master engine and wing anti-ice operations", 
        "Learn rain protection and visibility systems",
        "Analyze anti-ice system limitations and procedures"
      ],
      theory: {
        sections: [
          {
            title: "Ice Protection Systems Overview",
            content: `The A320 ice protection systems prevent ice accumulation on critical surfaces, ensuring safe flight operations in icing conditions.

**Ice Detection:**
- **Ice Detection System**: Sensors detect ice crystal impact
- **TAT Probes**: Heated to prevent ice blockage
- **Pitot Probes**: Automatically heated when engines running
- **Static Ports**: Heated to maintain pressure readings

**Engine Anti-Ice System:**
- **Hot Bleed Air**: Directed to engine inlet lips
- **Automatic Operation**: Activates when ice detected
- **Manual Control**: Pilot can override system
- **Cowl Anti-Ice**: Prevents ice on engine inlet

**Wing Anti-Ice System:**
- **Piccolo Tubes**: Distribute hot air along leading edge
- **Three Sections**: Per wing (inboard, middle, outboard)
- **Bleed Air Source**: From engine or APU
- **Thermal Protection**: Prevents overheating

**Rain Protection:**
- **Windshield Rain Repellent**: Chemical treatment system
- **Windshield Wipers**: Mechanical backup system
- **Windshield Heating**: Prevents ice formation
- **Side Window Heating**: Pilot visibility maintenance`,
            keyPoints: [
              "Automatic ice detection triggers protection systems",
              "Engine anti-ice uses hot bleed air to inlet lips",
              "Wing anti-ice covers three sections per wing",
              "Rain repellent provides better visibility than wipers",
              "All pitot-static probes heated automatically"
            ],
            technicalSpecs: {
              "Ice Detection Sensitivity": "0.1mm ice accumulation",
              "Engine Anti-Ice Temperature": "200-250°C at inlet lip",
              "Wing Anti-Ice Sections": "3 per wing (6 total)",
              "Windshield Heating Power": "600W per panel",
              "Rain Repellent Coverage": "Full windshield area",
              "Pitot Heating Power": "120W per probe"
            }
          }
        ]
      },
      flashcards: [
        {
          id: 7,
          front: "How does the A320 ice detection system work?",
          back: "Sensors detect ice crystal impacts on fuselage sides, automatically activating anti-ice systems when icing conditions detected",
          difficulty: "intermediate",
          category: "Ice Detection"
        },
        {
          id: 8,
          front: "What are the three wing anti-ice sections per wing?",
          back: "Inboard, middle, and outboard sections, each with independent bleed air supply and thermal protection",
          difficulty: "basic",
          category: "Wing Anti-Ice"
        }
      ],
      quiz: {
        questions: [
          {
            id: 3,
            question: "When are the pitot probes automatically heated in the A320?",
            options: [
              "Only when ice is detected",
              "When engines are running",
              "Only during flight",
              "When anti-ice is selected ON"
            ],
            correctAnswer: 1,
            explanation: "Pitot probes are automatically heated whenever engines are running to prevent ice blockage and ensure accurate airspeed readings.",
            difficulty: "intermediate",
            category: "Pitot-Static System",
            reference: "A320 FCOM 30-10-00"
          }
        ],
        passingScore: 80,
        timeLimit: 40
      }
    }
  };

  static getLessonContent(lessonId: number): LessonContent | null {
    return this.lessonContent[lessonId] || null;
  }

  static getAllLessons(): LessonContent[] {
    return Object.values(this.lessonContent);
  }

  static getLessonsByModule(module: string): LessonContent[] {
    return Object.values(this.lessonContent).filter(lesson => lesson.module === module);
  }

  static getLessonsByAircraft(aircraft: string): LessonContent[] {
    return Object.values(this.lessonContent).filter(lesson => lesson.aircraft === aircraft);
  }
}