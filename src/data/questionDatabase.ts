export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  aircraftType: 'A320' | 'BOEING_737';
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
    difficulty: 'medium'
  },
  {
    id: 'a320-eng-002',
    question: '¿Qué significa FADEC en el contexto de los motores A320?',
    options: ['Full Authority Digital Engine Control', 'Flight Automated Digital Engine Control', 'Fuel And Digital Engine Control', 'Flight Authority Dual Engine Control'],
    correctAnswer: 0,
    explanation: 'FADEC significa Full Authority Digital Engine Control, el sistema que controla completamente los motores.',
    category: 'Engines',
    aircraftType: 'A320',
    difficulty: 'easy'
  },
  {
    id: 'a320-eng-003',
    question: '¿Cuál es la presión mínima de aceite del motor en vuelo?',
    options: ['13 PSI', '17 PSI', '25 PSI', '30 PSI'],
    correctAnswer: 1,
    explanation: 'La presión mínima de aceite del motor en vuelo es de 17 PSI.',
    category: 'Engines',
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'A320',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
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
    aircraftType: 'BOEING_737',
    difficulty: 'medium'
  },
  // Continue with more B737 flight controls questions...
];

// Combine all questions by category
export const QUESTION_DATABASE = {
  A320: {
    Engines: A320_ENGINE_QUESTIONS,
    'Flight Controls': A320_FLIGHT_CONTROLS_QUESTIONS,
    // Add more categories...
  },
  BOEING_737: {
    Engines: B737_ENGINE_QUESTIONS,
    'Flight Controls': B737_FLIGHT_CONTROLS_QUESTIONS,
    // Add more categories...
  }
};

// Helper function to get trial questions for a category
export const getTrialQuestions = (aircraftType: 'A320' | 'BOEING_737', category: string): Question[] => {
  const categoryQuestions = QUESTION_DATABASE[aircraftType]?.[category] || [];
  return categoryQuestions.filter(q => q.isTrial).slice(0, 5);
};

// Helper function to get all questions for a category (subscription required)
export const getAllQuestions = (aircraftType: 'A320' | 'BOEING_737', category: string): Question[] => {
  return QUESTION_DATABASE[aircraftType]?.[category] || [];
};