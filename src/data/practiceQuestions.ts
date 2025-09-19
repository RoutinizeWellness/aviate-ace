import type { Id } from "../../convex/_generated/dataModel";

// Helper function to generate Convex-like IDs
const generateQuestionId = (table: string): string => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36).substring(0, 8);
  return `${table}_${randomPart}${timestamp}`;
};

export interface PracticeQuestion {
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
  reference?: string; // Reference to official documentation
  regulationCode?: string; // Applicable regulation
}

/**
 * REAL A320 SYSTEM QUESTIONS - ADVANCED LEVEL
 * Based on actual EASA/FAA type rating exam content
 * References: A320 FCOM, QRH, and official training materials
 */
export const advancedPracticeQuestions: PracticeQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "Durante una aproximación ILS CAT II con autoland, ¿cuál es el requerimiento crítico de altura de radio altímetro para considerar la transición a fase de flare?",
    options: [
      "50 pies RA, con velocidad de descenso < 10 ft/s",
      "30 pies RA, con velocidad de descenso < 5 ft/s",
      "70 pies RA, con velocidad de descenso < 15 ft/s",
      "100 pies RA, con velocidad de descenso < 20 ft/s"
    ],
    correctAnswer: 0,
    explanation: "Durante aproximaciones autoland CAT II, el sistema de aterrizaje automático transiciona a fase de flare a 50 pies de altura de radio altímetro, siempre que la velocidad de descenso sea menor a 10 ft/s. Esta transición es crítica para asegurar un aterrizaje suave y controlado.",
    aircraftType: "A320_FAMILY",
    category: "Sistema de Aterrizaje Automático",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Cuál es la secuencia correcta de protección contra pérdida (α-FLOOR) en un A320 y qué condiciones la activan?",
    options: [
      "Ángulo de ataque crítico → Activación automática → TOGA LOCK → Mantenimiento manual",
      "Stall warning → α-FLOOR → TOGA LOCK → Manual override",
      "Low speed → α-FLOOR → Autothrust → Pilot input",
      "High AOA → Stall protection → Autothrust → Manual control"
    ],
    correctAnswer: 0,
    explanation: "La protección α-FLOOR se activa cuando los sensores detectan un ángulo de ataque crítico. Primero se activa automáticamente, luego se establece TOGA LOCK que mantiene máxima potencia incluso si se mueve la palanca, y finalmente requiere entrada manual del piloto para desactivarla.",
    aircraftType: "A320_FAMILY",
    category: "Protección de Vuelo",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "En caso de 'ELEC AC BUS 1 FAULT' en un A320, ¿cuál es la configuración eléctrica resultante y qué sistemas se ven afectados?",
    options: [
      "AC BUS 1 shed, GEN 2 alimenta ambos buses, sistemas esenciales operativos",
      "AC BUS 1 y 2 shed, operación en baterías solamente",
      "GEN 1 desconectado, APU GEN alimenta AC BUS 1",
      "AC ESS BUS falla, pérdida de sistemas de navegación"
    ],
    correctAnswer: 0,
    explanation: "Con 'ELEC AC BUS 1 FAULT', el AC BUS 1 se desconecta (shed) y el generador del motor 2 alimenta ambos buses AC BUS 1 y 2 a través del bus tie. Los sistemas esenciales continúan operativos alimentados por el AC ESS BUS.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Eléctrico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Cuál es el procedimiento correcto para manejar una 'HYD G RSVR LO AIR PR' en vuelo y qué implicaciones tiene para el control de vuelo?",
    options: [
      "Evitar movimientos súbitos del timón, limitar banqueo a 25°, preparar para aterrizaje corto",
      "Aplicar máxima presión en pedales de timón, aumentar velocidad, continuar normalmente",
      "Seleccionar HYD PTU ON, continuar con control normal",
      "Declarar emergencia inmediata, solicitar vector radar, aterrizar en pista larga"
    ],
    correctAnswer: 0,
    explanation: "Con 'HYD G RSVR LO AIR PR' (presión baja en reservorio del sistema verde), se debe evitar movimientos súbitos del timón para prevenir 'rudder travel limitation'. Se limita el banqueo a 25° y se prepara para aterrizaje corto debido a posible reducción en eficacia de frenos y reversores.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Hidráulico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "Durante una aproximación con mínimos de 100 pies DH, ¿cuál es el requerimiento de visibilidad RVR y qué elementos de la pista deben ser visualizados?",
    options: [
      "RVR 300m, elementos de la pista, marcadores de umbral y luces de aproximación",
      "RVR 550m, solo la pista completa debe ser visible",
      "RVR 200m, marcadores de centro de pista y luces de borde",
      "RVR 400m, luces de aproximación y marcadores de umbral"
    ],
    correctAnswer: 0,
    explanation: "Para aproximaciones con DH de 100 pies (CAT I), se requiere un RVR mínimo de 300 metros. El piloto debe visualizar elementos de la pista, marcadores de umbral y luces de aproximación para continuar con el aterrizaje. Si no se visualizan estos elementos, se debe ejecutar aproximación frustrada.",
    aircraftType: "A320_FAMILY",
    category: "Procedimientos de Aproximación",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  },
  // Additional advanced questions
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Cuál es el procedimiento correcto para manejar una falla de 'FAC 1 FAULT' durante la fase de aproximación final?",
    options: [
      "Continuar con FAC 2, monitorizar indicadores de control de vuelo, verificar yaw damper",
      "Declarar emergencia, solicitar vector radar, aterrizar inmediatamente",
      "Apagar FAC 1, reiniciar sistema, continuar normalmente",
      "Seleccionar备用computadora, verificar sistemas de navegación"
    ],
    correctAnswer: 0,
    explanation: "Con 'FAC 1 FAULT', el sistema automáticamente cambia a FAC 2. El piloto debe monitorizar los indicadores de control de vuelo, especialmente el yaw damper y los indicadores de velocidad de viraje. La aproximación puede continuar normalmente ya que el FAC 2 proporciona todas las funciones esenciales.",
    aircraftType: "A320_FAMILY",
    category: "Sistema de Vuelo",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "Durante un 'EMER ELEC CONFIG', ¿cuál es la secuencia de prioridad para restaurar sistemas eléctricos?",
    options: [
      "Essential systems → Navigation → Communication → Comfort systems",
      "All systems simultaneously → Prioritize based on crew discretion",
      "Communication → Navigation → Essential systems → Comfort",
      "Comfort systems → Essential → Navigation → Communication"
    ],
    correctAnswer: 0,
    explanation: "En configuración eléctrica de emergencia, la prioridad es restaurar primero sistemas esenciales (flight controls, basic instruments), luego navegación, comunicación y finalmente sistemas de confort. Esta secuencia asegura la seguridad del vuelo y operación mínima requerida.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Eléctrico",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Cuál es el procedimiento correcto para manejar una 'CAB PR EXCESS CAB ALT' durante climb?",
    options: [
      "Descender inmediatamente a 10,000 ft o MSA, don oxygen masks, declare MAYDAY",
      "Aumentar velocidad, continuar climb normalmente",
      "Seleccionar manual pressurization, continuar climb",
      "Reducir potencia, verificar altímetro"
    ],
    correctAnswer: 0,
    explanation: "Una 'CAB PR EXCESS CAB ALT' indica que la cabina ha excedido la altitud máxima permitida. El procedimiento es descender inmediatamente a 10,000 ft o MSA (lo que sea mayor), don oxygen masks y declarar MAYDAY. Esta es una emergencia de despresurización que requiere acción inmediata.",
    aircraftType: "A320_FAMILY",
    category: "Sistema de Presurización",
    difficulty: "advanced",
    isActive: true,
    _creationTime: Date.now(),
  }
];

export const intermediatePracticeQuestions: PracticeQuestion[] = [
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Cuál es la diferencia entre 'SPEED BRK' y 'GROUND SPOILER' en términos de función y activación en un A320?",
    options: [
      "SPEED BRK reduce sustentación en vuelo, GROUND SPOILERS despliegan automáticamente en tierra",
      "SPEED BRK solo funciona en modo manual, GROUND SPOILERS en modo automático",
      "SPEED BRK aumenta resistencia, GROUND SPOILERS reduce sustentación",
      "Ambos son idénticos, solo cambia la terminología"
    ],
    correctAnswer: 0,
    explanation: "Los SPEED BRK (speed brakes) son los spoilers 2, 3 y 4 que se usan en vuelo para aumentar resistencia y reducir sustentación. Los GROUND SPOILERS (spoilers 1 y 5) se despliegan automáticamente al contacto con tierra para destruir sustentación y mejorar eficacia de frenos.",
    aircraftType: "A320_FAMILY",
    category: "Sistema de Vuelo",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Qué indica 'ENG 1 BLEED FAULT' en la EWD del A320 y qué procedimiento debe seguirse?",
    options: [
      "Falla en el sistema de sangrado del motor 1, usar APU bleed o crossbleed",
      "Falla del motor 1, apagar inmediatamente",
      "Sobretemperatura del motor 1, reducir potencia",
      "Presión baja en sangrado, aumentar RPM del motor"
    ],
    correctAnswer: 0,
    explanation: "'ENG 1 BLEED FAULT' indica una falla en el sistema de sangrado del motor 1. El procedimiento es usar sangrado del APU o activar crossbleed valve para mantener suministro neumático a sistemas esenciales como aire acondicionado y presurización.",
    aircraftType: "A320_FAMILY",
    category: "Sistema Neumático",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
  },
  // Additional intermediate questions
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Cuál es la diferencia entre 'AP OFF' y 'FD OFF' en términos de control de vuelo?",
    options: [
      "AP OFF desactiva piloto automático, FD OFF desactiva directrices de vuelo",
      "Ambos son idénticos, solo cambia la terminología",
      "AP OFF afecta controles, FD OFF solo indicadores",
      "FD OFF desactiva piloto automático, AP OFF solo directrices"
    ],
    correctAnswer: 0,
    explanation: "'AP OFF' (Autopilot Off) desactiva el piloto automático, lo que significa que el avión no se controlará automáticamente. 'FD OFF' (Flight Director Off) desactiva las directrices de vuelo, que son los comandos visuales en el PFD. El piloto puede volar manualmente sin directrices.",
    aircraftType: "A320_FAMILY",
    category: "Sistema de Vuelo",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
  },
  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: "¿Qué significa 'SLAT SYS 1 FAULT' y qué procedimiento debe seguirse?",
    options: [
      "Falla en sistema de slats 1, continuar con slat system 2, limitar velocidad",
      "Falla total de slats, aterrizar inmediatamente",
      "Reiniciar sistema, continuar normalmente",
      "Slat 1 bloqueado, usar slat 2 manualmente"
    ],
    correctAnswer: 0,
    explanation: "'SLAT SYS 1 FAULT' indica una falla en el sistema de slats 1. El sistema automáticamente cambia a slat system 2. El piloto debe limitar la velocidad según las tablas de límites de slats y continuar el vuelo normalmente, monitoreando la posición de slats en el EWD.",
    aircraftType: "A320_FAMILY",
    category: "Sistema de Vuelo",
    difficulty: "intermediate",
    isActive: true,
    _creationTime: Date.now(),
  }
];