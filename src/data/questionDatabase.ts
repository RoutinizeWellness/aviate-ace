export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  aircraftType: 'A320_FAMILY' | 'B737_FAMILY';
  difficulty: 'easy' | 'medium' | 'hard';
  isTrial?: boolean; // Mark questions as trial/sample questions
}

// A320 Engine Questions (200 questions)
export const A320_ENGINE_QUESTIONS: Question[] = [
  // Trial Questions (first 5 are always available)
  {
    id: 'a320-eng-trial-1',
    question: '¿Cuál es la presión máxima de aceite del motor CFM56-5B en un A320?',
    options: ['95 PSI', '105 PSI', '115 PSI', '125 PSI'],
    correctAnswer: 2,
    explanation: 'La presión máxima de aceite del motor CFM56-5B es de 115 PSI según las especificaciones técnicas del A320.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'a320-eng-trial-2',
    question: '¿Cuál es la temperatura máxima de arranque del motor CFM56-5B?',
    options: ['725°C', '875°C', '1000°C', '1050°C'],
    correctAnswer: 1,
    explanation: 'La temperatura máxima de arranque del motor CFM56-5B es de 875°C.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'hard',
    isTrial: true
  },
  {
    id: 'a320-eng-trial-3',
    question: '¿Qué tipo de motores equipa típicamente el A320?',
    options: ['CFM56-5B o IAE V2500', 'Solo CFM56-5B', 'Solo IAE V2500', 'PW6000'],
    correctAnswer: 0,
    explanation: 'El A320 puede equipar motores CFM56-5B de CFMI o IAE V2500 de International Aero Engines.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'a320-eng-trial-4',
    question: '¿Cuál es el empuje típico del motor CFM56-5B4 en un A320?',
    options: ['22,000 lbf', '24,500 lbf', '27,000 lbf', '33,000 lbf'],
    correctAnswer: 2,
    explanation: 'El motor CFM56-5B4 produce típicamente 27,000 lbf de empuje.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'a320-eng-trial-5',
    question: '¿Qué sistema controla automáticamente el empuje en el A320?',
    options: ['Autopilot', 'Autothrust', 'FADEC', 'FMS'],
    correctAnswer: 1,
    explanation: 'El sistema Autothrust controla automáticamente el empuje de los motores en el A320.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  // Premium Questions (195 more questions - subscription required)
  {
    id: 'a320-eng-001',
    question: '¿Cuál es la velocidad de ralentí en vuelo (Flight Idle) del CFM56-5B?',
    options: ['1500 RPM', '1800 RPM', '2000 RPM', '2200 RPM'],
    correctAnswer: 1,
    explanation: 'La velocidad de ralentí en vuelo del CFM56-5B es aproximadamente 1800 RPM.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'a320-eng-002',
    question: '¿Qué significa FADEC en el contexto de los motores A320?',
    options: ['Full Authority Digital Engine Control', 'Flight Automated Digital Engine Control', 'Fuel And Digital Engine Control', 'Flight Authority Dual Engine Control'],
    correctAnswer: 0,
    explanation: 'FADEC significa Full Authority Digital Engine Control, el sistema que controla completamente los motores.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'easy'
  },
  {
    id: 'a320-eng-003',
    question: '¿Cuál es la presión mínima de aceite del motor en vuelo?',
    options: ['13 PSI', '17 PSI', '25 PSI', '30 PSI'],
    correctAnswer: 1,
    explanation: 'La presión mínima de aceite del motor en vuelo es de 17 PSI.',
    category: 'Engines',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium'
  },
  // Continue with more engine questions...
  // [This would continue for 195 more questions to reach 200 total]
];

// A320 Flight Controls Questions (200 questions)
export const A320_FLIGHT_CONTROLS_QUESTIONS: Question[] = [
  // Trial Questions
  {
    id: 'a320-fc-trial-1',
    question: '¿Qué sistema controla automáticamente el trim del A320?',
    options: ['Autopilot', 'Flight Management System', 'Fly-by-Wire', 'Autothrust'],
    correctAnswer: 2,
    explanation: 'El sistema Fly-by-Wire controla automáticamente el trim en el A320.',
    category: 'Flight Controls',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'a320-fc-trial-2',
    question: '¿Cuántos sistemas hidráulicos independientes tiene el A320?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation: 'El A320 tiene 3 sistemas hidráulicos independientes: Green, Blue y Yellow.',
    category: 'Flight Controls',
    aircraftType: 'A320_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'a320-fc-trial-3',
    question: '¿Qué modo de protección evita la pérdida en el A320?',
    options: ['Alpha Protection', 'Speed Protection', 'Load Factor Protection', 'Bank Angle Protection'],
    correctAnswer: 0,
    explanation: 'Alpha Protection evita que la aeronave entre en pérdida al limitar el ángulo de ataque.',
    category: 'Flight Controls',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'a320-fc-trial-4',
    question: '¿Cuál es la velocidad máxima con flaps extendidos (VFE) en configuración 1?',
    options: ['215 kts', '230 kts', '250 kts', '270 kts'],
    correctAnswer: 1,
    explanation: 'La velocidad máxima con flaps en configuración 1 es 230 kts.',
    category: 'Flight Controls',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'a320-fc-trial-5',
    question: '¿Qué superficie de control primaria proporciona control de alabeo?',
    options: ['Elevadores', 'Timón', 'Alerones', 'Spoilers'],
    correctAnswer: 2,
    explanation: 'Los alerones proporcionan el control primario de alabeo en el A320.',
    category: 'Flight Controls',
    aircraftType: 'A320_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  // Premium Questions (195 more)
  {
    id: 'a320-fc-001',
    question: '¿Cuál es la presión normal del sistema hidráulico del A320?',
    options: ['3000 PSI', '3500 PSI', '4000 PSI', '5000 PSI'],
    correctAnswer: 0,
    explanation: 'La presión normal del sistema hidráulico del A320 es de 3000 PSI.',
    category: 'Flight Controls',
    aircraftType: 'A320_FAMILY',
    difficulty: 'medium'
  },
  // Continue with more flight controls questions...
];

// Boeing 737 Engine Questions (200 questions)
export const B737_ENGINE_QUESTIONS: Question[] = [
  // Trial Questions
  {
    id: 'b737-eng-trial-1',
    question: '¿Cuántos motores tiene un Boeing 737-800?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737-800 tiene 2 motores turbofan montados bajo las alas.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'b737-eng-trial-2',
    question: '¿Qué tipo de motores equipa típicamente el Boeing 737-800?',
    options: ['CFM56-7B', 'CFM56-5B', 'IAE V2500', 'PW6000'],
    correctAnswer: 0,
    explanation: 'El Boeing 737-800 típicamente equipa motores CFM56-7B de CFMI.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'b737-eng-trial-3',
    question: '¿Cuál es el empuje típico del motor CFM56-7B24?',
    options: ['22,000 lbf', '24,500 lbf', '26,300 lbf', '28,000 lbf'],
    correctAnswer: 1,
    explanation: 'El motor CFM56-7B24 produce típicamente 24,500 lbf de empuje.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'b737-eng-trial-4',
    question: '¿Qué sistema controla los motores en el Boeing 737?',
    options: ['FADEC', 'EEC', 'PMC', 'FMC'],
    correctAnswer: 0,
    explanation: 'Los motores del Boeing 737 son controlados por el sistema FADEC (Full Authority Digital Engine Control).',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'b737-eng-trial-5',
    question: '¿Cuál es la temperatura máxima de arranque del CFM56-7B?',
    options: ['725°C', '815°C', '875°C', '925°C'],
    correctAnswer: 1,
    explanation: 'La temperatura máxima de arranque del CFM56-7B es de 815°C.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'hard',
    isTrial: true
  },
  // Premium Questions (195 more)
  {
    id: 'b737-eng-001',
    question: '¿Cuál es la velocidad de ralentí en tierra del CFM56-7B?',
    options: ['1200 RPM', '1400 RPM', '1600 RPM', '1800 RPM'],
    correctAnswer: 1,
    explanation: 'La velocidad de ralentí en tierra del CFM56-7B es aproximadamente 1400 RPM.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  // Continue with more B737 engine questions...
];

// Boeing 737 Flight Controls Questions (200 questions)
export const B737_FLIGHT_CONTROLS_QUESTIONS: Question[] = [
  // Trial Questions
  {
    id: 'b737-fc-trial-1',
    question: '¿Qué sistema de control de vuelo utiliza el Boeing 737?',
    options: ['Fly-by-Wire', 'Control mecánico directo', 'Control hidráulico asistido', 'Control eléctrico'],
    correctAnswer: 2,
    explanation: 'El Boeing 737 utiliza un sistema de control hidráulico asistido, no fly-by-wire como el A320.',
    category: 'Flight Controls',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'b737-fc-trial-2',
    question: '¿Cuántos sistemas hidráulicos tiene el Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene 2 sistemas hidráulicos independientes: Sistema A y Sistema B.',
    category: 'Flight Controls',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'b737-fc-trial-3',
    question: '¿Cuál es la velocidad máxima de operación (VMO) del Boeing 737-800?',
    options: ['340 kts', '350 kts', '370 kts', '390 kts'],
    correctAnswer: 1,
    explanation: 'La velocidad máxima de operación (VMO) del Boeing 737-800 es de 350 kts.',
    category: 'Flight Controls',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'b737-fc-trial-4',
    question: '¿Qué superficie de control se utiliza para el control de guiñada?',
    options: ['Alerones', 'Elevadores', 'Timón', 'Spoilers'],
    correctAnswer: 2,
    explanation: 'El timón de dirección se utiliza para el control de guiñada en el Boeing 737.',
    category: 'Flight Controls',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'b737-fc-trial-5',
    question: '¿Cuál es la presión normal del sistema hidráulico del Boeing 737?',
    options: ['3000 PSI', '3200 PSI', '3500 PSI', '4000 PSI'],
    correctAnswer: 0,
    explanation: 'La presión normal del sistema hidráulico del Boeing 737 es de 3000 PSI.',
    category: 'Flight Controls',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  // Premium Questions (195 more)
  {
    id: 'b737-fc-001',
    question: '¿Cuál es la velocidad máxima con flaps extendidos en el Boeing 737?',
    options: ['200 kts', '230 kts', '250 kts', '280 kts'],
    correctAnswer: 1,
    explanation: 'La velocidad máxima con flaps extendidos varía según la configuración, pero típicamente es alrededor de 230 kts.',
    category: 'Flight Controls',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  // Continue with more B737 flight controls questions...
];

// Boeing 737 Air Systems Questions
export const B737_AIR_SYSTEMS_QUESTIONS: Question[] = [
  {
    id: 'b737-air-001',
    question: '¿Cuáles son las fuentes principales de aire de sangrado en el Boeing 737?',
    options: ['Solo motores', 'Motores y APU', 'APU únicamente', 'Compresor auxiliar'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 obtiene aire de sangrado principalmente de los motores y del APU.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  },
  {
    id: 'b737-air-002',
    question: '¿Cuál es la presión típica del aire de sangrado del motor?',
    options: ['15-25 PSI', '25-60 PSI', '80-100 PSI', '150-200 PSI'],
    correctAnswer: 1,
    explanation: 'La presión típica del aire de sangrado del motor varía entre 25-60 PSI dependiendo de la configuración del motor.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  }
];

// Boeing 737 Electrical Questions
export const B737_ELECTRICAL_QUESTIONS: Question[] = [
  {
    id: 'b737-elec-001',
    question: '¿Cuántos generadores principales tiene el Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene 2 generadores principales, uno por cada motor.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'b737-elec-002',
    question: '¿Cuál es el voltaje de salida de los generadores principales?',
    options: ['115V AC', '28V DC', '220V AC', '12V DC'],
    correctAnswer: 0,
    explanation: 'Los generadores principales del Boeing 737 producen 115V AC a 400Hz.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  }
];

// Boeing 737 Hydraulics Questions
export const B737_HYDRAULICS_QUESTIONS: Question[] = [
  {
    id: 'b737-hyd-001',
    question: '¿Cuántos sistemas hidráulicos independientes tiene el Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene 2 sistemas hidráulicos independientes: Sistema A y Sistema B.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  },
  {
    id: 'b737-hyd-002',
    question: '¿Cuál es la presión normal de operación del sistema hidráulico?',
    options: ['2000 PSI', '3000 PSI', '4000 PSI', '5000 PSI'],
    correctAnswer: 1,
    explanation: 'La presión normal de operación del sistema hidráulico del Boeing 737 es de 3000 PSI.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  }
];

// Boeing 737 Fuel Questions
export const B737_FUEL_QUESTIONS: Question[] = [
  {
    id: 'b737-fuel-001',
    question: '¿Cuántos tanques de combustible principales tiene el Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene 2 tanques de combustible principales, uno en cada ala.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  }
];

// Boeing 737 Landing Gear Questions
export const B737_LANDING_GEAR_QUESTIONS: Question[] = [
  {
    id: 'b737-lg-001',
    question: '¿Qué tipo de tren de aterrizaje tiene el Boeing 737?',
    options: ['Tren fijo', 'Tren retráctil triciclo', 'Tren convencional', 'Patines'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene tren de aterrizaje retráctil tipo triciclo con rueda de nariz y dos trenes principales.',
    category: 'Landing Gear',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  }
];

// Boeing 737 Anti-Ice Questions
export const B737_ANTI_ICE_QUESTIONS: Question[] = [
  {
    id: 'b737-ai-001',
    question: '¿Qué sistema se utiliza para el antihielo de las alas en el Boeing 737?',
    options: ['Fluido antihielo', 'Aire caliente de sangrado', 'Resistencias eléctricas', 'Ultrasonidos'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 utiliza aire caliente de sangrado de los motores para el sistema antihielo de las alas.',
    category: 'Anti-Ice Rain',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  }
];

// Boeing 737 Automatic Flight Questions
export const B737_AUTOMATIC_FLIGHT_QUESTIONS: Question[] = [
  {
    id: 'b737-af-001',
    question: '¿Cómo se llama el sistema de gestión de vuelo del Boeing 737?',
    options: ['FMGS', 'FMS', 'AFCS', 'MCDU'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 utiliza el sistema FMS (Flight Management System) para la gestión de vuelo.',
    category: 'Automatic Flight',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  }
];

// Boeing 737 Communication Questions
export const B737_COMMUNICATION_QUESTIONS: Question[] = [
  {
    id: 'b737-comm-001',
    question: '¿Cuántas radios VHF tiene típicamente el Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 típicamente tiene 2 radios VHF para comunicaciones.',
    category: 'Communication',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  }
];

// Boeing 737 Fire Protection Questions
export const B737_FIRE_PROTECTION_QUESTIONS: Question[] = [
  {
    id: 'b737-fire-001',
    question: '¿Cuántas botellas de extinción de incendios tiene cada motor del Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 0,
    explanation: 'Cada motor del Boeing 737 tiene 1 botella de extinción de incendios.',
    category: 'Fire Protection',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  }
];

// Boeing 737 Flight Instruments Questions
export const B737_FLIGHT_INSTRUMENTS_QUESTIONS: Question[] = [
  {
    id: 'b737-fi-001',
    question: '¿Qué tipo de pantallas utiliza el Boeing 737 moderno?',
    options: ['Instrumentos analógicos', 'LCD/LED displays', 'CRT displays', 'Instrumentos mecánicos'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 moderno utiliza pantallas LCD/LED para los instrumentos de vuelo.',
    category: 'Flight Instruments',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy',
    isTrial: true
  }
];

// Boeing 737 Warning Systems Questions
export const B737_WARNING_SYSTEMS_QUESTIONS: Question[] = [
  {
    id: 'b737-warn-001',
    question: '¿Cómo se llama el sistema principal de alertas del Boeing 737?',
    options: ['ECAM', 'EICAS', 'CAS', 'WAS'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 utiliza el sistema EICAS (Engine Indication and Crew Alerting System) para las alertas principales.',
    category: 'Warning Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium',
    isTrial: true
  }
];

// Combine all questions by category
export const QUESTION_DATABASE = {
  A320_FAMILY: {
    Engines: A320_ENGINE_QUESTIONS,
    'Flight Controls': A320_FLIGHT_CONTROLS_QUESTIONS,
    // Add more categories...
  },
  B737_FAMILY: {
    Engines: B737_ENGINE_QUESTIONS,
    'Flight Controls': B737_FLIGHT_CONTROLS_QUESTIONS,
    'Air Systems': B737_AIR_SYSTEMS_QUESTIONS,
    'Electrical': B737_ELECTRICAL_QUESTIONS,
    'Hydraulics': B737_HYDRAULICS_QUESTIONS,
    'Fuel': B737_FUEL_QUESTIONS,
    'Landing Gear': B737_LANDING_GEAR_QUESTIONS,
    'Anti-Ice Rain': B737_ANTI_ICE_QUESTIONS,
    'Automatic Flight': B737_AUTOMATIC_FLIGHT_QUESTIONS,
    'Communication': B737_COMMUNICATION_QUESTIONS,
    'Fire Protection': B737_FIRE_PROTECTION_QUESTIONS,
    'Flight Instruments': B737_FLIGHT_INSTRUMENTS_QUESTIONS,
    'Warning Systems': B737_WARNING_SYSTEMS_QUESTIONS
  }
};

// Helper function to get trial questions for a category
export const getTrialQuestions = (aircraftType: 'A320_FAMILY' | 'B737_FAMILY', category: string): Question[] => {
  const categoryQuestions = QUESTION_DATABASE[aircraftType]?.[category] || [];
  return categoryQuestions.filter(q => q.isTrial).slice(0, 5);
};

// Helper function to get all questions for a category (subscription required)
export const getAllQuestions = (aircraftType: 'A320_FAMILY' | 'B737_FAMILY', category: string): Question[] => {
  return QUESTION_DATABASE[aircraftType]?.[category] || [];
};