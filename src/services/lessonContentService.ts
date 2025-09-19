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