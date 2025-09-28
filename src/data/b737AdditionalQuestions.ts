// Additional B737 Questions to expand the question database
export interface AdditionalQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  aircraftType: 'B737_FAMILY';
  difficulty: 'easy' | 'medium' | 'hard';
  isTrial?: boolean;
}

// Additional Engine Questions (15 more)
export const ADDITIONAL_B737_ENGINE_QUESTIONS: AdditionalQuestion[] = [
  {
    id: 'b737-eng-add-001',
    question: '¿Cuál es la temperatura máxima de arranque del CFM56-7B?',
    options: ['725°C', '850°C', '950°C', '1050°C'],
    correctAnswer: 1,
    explanation: 'La temperatura máxima de arranque del CFM56-7B es de 850°C.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-002',
    question: '¿Cuál es la presión de aceite mínima en vuelo?',
    options: ['13 PSI', '17 PSI', '25 PSI', '30 PSI'],
    correctAnswer: 1,
    explanation: 'La presión mínima de aceite en vuelo es de 17 PSI.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-003',
    question: '¿Cuántos sistemas de ignición tiene cada motor?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Cada motor CFM56-7B tiene 2 sistemas de ignición independientes.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-004',
    question: '¿Qué combustible utiliza el CFM56-7B?',
    options: ['Jet A', 'Jet A-1', 'Jet B', 'Todos los anteriores'],
    correctAnswer: 3,
    explanation: 'El CFM56-7B puede operar con Jet A, Jet A-1 o Jet B.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy'
  },
  {
    id: 'b737-eng-add-005',
    question: '¿Cuál es el ciclo típico de arranque del motor?',
    options: ['30 segundos', '45 segundos', '60 segundos', '90 segundos'],
    correctAnswer: 2,
    explanation: 'El ciclo típico de arranque del CFM56-7B es de aproximadamente 60 segundos.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-006',
    question: '¿Qué monitorea el sistema EGT?',
    options: ['Presión de aceite', 'Temperatura de escape', 'Velocidad RPM', 'Flujo de combustible'],
    correctAnswer: 1,
    explanation: 'EGT (Exhaust Gas Temperature) monitorea la temperatura de los gases de escape.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-007',
    question: '¿Cuál es la capacidad del tanque de aceite del motor?',
    options: ['18 cuartos', '22 cuartos', '26 cuartos', '30 cuartos'],
    correctAnswer: 1,
    explanation: 'El tanque de aceite del CFM56-7B tiene una capacidad de 22 cuartos.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-008',
    question: '¿Qué indica una luz de REVERSER UNLOCKED?',
    options: ['Reversor desplegado', 'Reversor bloqueado', 'Reversor desbloqueado', 'Falla del reversor'],
    correctAnswer: 2,
    explanation: 'La luz REVERSER UNLOCKED indica que el reversor no está completamente bloqueado.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-009',
    question: '¿Cuál es la velocidad máxima del motor (N1)?',
    options: ['100%', '105%', '110%', '115%'],
    correctAnswer: 1,
    explanation: 'La velocidad máxima permitida del motor es 105% N1.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-010',
    question: '¿Qué sucede durante un arranque en caliente?',
    options: ['Temperatura alta', 'Baja presión', 'RPM alto', 'Flujo bajo'],
    correctAnswer: 0,
    explanation: 'Un arranque en caliente se caracteriza por temperaturas de escape excesivamente altas.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-011',
    question: '¿Cuándo se activa automáticamente el sistema anti-hielo del motor?',
    options: ['Siempre en vuelo', 'Solo en tierra', 'Condiciones de hielo', 'Manualmente únicamente'],
    correctAnswer: 2,
    explanation: 'El sistema anti-hielo del motor se activa automáticamente cuando se detectan condiciones de hielo.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-012',
    question: '¿Qué función tiene el sistema de venteo del motor?',
    options: ['Enfriar motor', 'Prevenir vacío', 'Filtrar aire', 'Medir presión'],
    correctAnswer: 1,
    explanation: 'El sistema de venteo previene la formación de vacío en las cavidades del motor.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-013',
    question: '¿Cuál es la diferencia principal entre N1 y N2?',
    options: ['Ubicación', 'Velocidad', 'Tamaño', 'Función'],
    correctAnswer: 3,
    explanation: 'N1 es el compresor de baja presión y N2 es el compresor de alta presión, con funciones diferentes.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-014',
    question: '¿Qué indica el parámetro EPR?',
    options: ['Relación de presión', 'Temperatura', 'Velocidad', 'Flujo'],
    correctAnswer: 0,
    explanation: 'EPR (Engine Pressure Ratio) indica la relación de presión del motor.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-eng-add-015',
    question: '¿Cuándo se debe realizar el lavado del motor?',
    options: ['Cada vuelo', 'Semanalmente', 'Según condiciones', 'Mensualmente'],
    correctAnswer: 2,
    explanation: 'El lavado del motor se realiza según las condiciones operacionales y la contaminación detectada.',
    category: 'Engines',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  }
];

// Additional Air Systems Questions (10 more)
export const ADDITIONAL_B737_AIR_SYSTEMS_QUESTIONS: AdditionalQuestion[] = [
  {
    id: 'b737-air-add-001',
    question: '¿Cuántos packs de aire acondicionado tiene el Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene 2 packs de aire acondicionado que proporcionan aire presurizado y acondicionado a la cabina.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy'
  },
  {
    id: 'b737-air-add-002',
    question: '¿Cuál es la presión máxima diferencial de cabina en el B737?',
    options: ['7.5 PSI', '8.1 PSI', '9.1 PSI', '10.5 PSI'],
    correctAnswer: 2,
    explanation: 'La presión máxima diferencial de cabina del B737 es de 9.1 PSI.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-air-add-003',
    question: '¿Qué controla automáticamente la presurización de la cabina?',
    options: ['Piloto manual', 'Sistema automático CPC', 'Control de aire acondicionado', 'Válvulas manuales'],
    correctAnswer: 1,
    explanation: 'El sistema automático CPC (Cabin Pressure Controller) controla la presurización de la cabina.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-air-add-004',
    question: '¿Cuál es la temperatura normal del aire de sangrado del motor?',
    options: ['150-200°C', '200-250°C', '250-450°C', '500-600°C'],
    correctAnswer: 2,
    explanation: 'La temperatura normal del aire de sangrado del motor está entre 250-450°C.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-air-add-005',
    question: '¿Qué función tiene la válvula de alivio de sobrepresión?',
    options: ['Controlar temperatura', 'Prevenir sobrepresurización', 'Regular flujo de aire', 'Filtrar aire'],
    correctAnswer: 1,
    explanation: 'La válvula de alivio de sobrepresión previene la sobrepresurización de la cabina en caso de falla del sistema automático.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-air-add-006',
    question: '¿Cuál es la altitud máxima de cabina en operación normal?',
    options: ['6,000 ft', '8,000 ft', '10,000 ft', '12,000 ft'],
    correctAnswer: 1,
    explanation: 'La altitud máxima de cabina en operación normal es de 8,000 ft.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-air-add-007',
    question: '¿Qué sucede si fallan ambos packs de aire acondicionado?',
    options: ['Pérdida total de aire', 'Uso de aire de emergencia', 'Descenso inmediato', 'Sistema manual backup'],
    correctAnswer: 1,
    explanation: 'Si fallan ambos packs, se puede usar el aire de emergencia del APU o descender a altitud segura.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'hard'
  },
  {
    id: 'b737-air-add-008',
    question: '¿Cuántas zonas de temperatura controla el sistema de aire acondicionado?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El sistema de aire acondicionado del B737 típicamente controla 2 zonas de temperatura independientes.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-air-add-009',
    question: '¿Qué válvula controla el flujo de aire de sangrado del motor?',
    options: ['Válvula de corte', 'Válvula reguladora', 'Válvula de alivio', 'Válvula de control'],
    correctAnswer: 1,
    explanation: 'La válvula reguladora controla el flujo de aire de sangrado del motor hacia los sistemas.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-air-add-010',
    question: '¿Cuál es la función del sistema de aire de recirculación?',
    options: ['Enfriar aire', 'Filtrar aire', 'Mezclar aire fresco y recirculado', 'Presurizar cabina'],
    correctAnswer: 2,
    explanation: 'El sistema de recirculación mezcla aire fresco del exterior con aire filtrado de la cabina.',
    category: 'Air Systems',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  }
];

// Additional Electrical Questions (8 more)
export const ADDITIONAL_B737_ELECTRICAL_QUESTIONS: AdditionalQuestion[] = [
  {
    id: 'b737-elec-add-001',
    question: '¿Cuántas baterías tiene el Boeing 737?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene 2 baterías de níquel-cadmio de 24V.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy'
  },
  {
    id: 'b737-elec-add-002',
    question: '¿Qué voltaje produce el sistema DC del B737?',
    options: ['12V', '24V', '28V', '32V'],
    correctAnswer: 2,
    explanation: 'El sistema DC del Boeing 737 opera a 28V.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-elec-add-003',
    question: '¿Cuál es la frecuencia del sistema AC?',
    options: ['50 Hz', '60 Hz', '400 Hz', '500 Hz'],
    correctAnswer: 2,
    explanation: 'El sistema AC del Boeing 737 opera a 400 Hz.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-elec-add-004',
    question: '¿Qué alimenta los sistemas esenciales en caso de falla total de generadores?',
    options: ['APU únicamente', 'Baterías', 'RAT', 'Sistema manual'],
    correctAnswer: 1,
    explanation: 'Las baterías alimentan los sistemas esenciales en caso de falla total de generadores.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-elec-add-005',
    question: '¿Cuánto tiempo pueden operar las baterías sin carga externa?',
    options: ['15 minutos', '30 minutos', '45 minutos', '60 minutos'],
    correctAnswer: 1,
    explanation: 'Las baterías pueden mantener los sistemas esenciales por aproximadamente 30 minutos.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-elec-add-006',
    question: '¿Qué tipo de generador utiliza el APU del B737?',
    options: ['AC únicamente', 'DC únicamente', 'AC y DC', 'Variable'],
    correctAnswer: 0,
    explanation: 'El generador del APU produce únicamente corriente AC.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-elec-add-007',
    question: '¿Qué sistema convierte AC a DC en el B737?',
    options: ['Inversor', 'Rectificador', 'Transformador', 'Convertidor'],
    correctAnswer: 1,
    explanation: 'Los rectificadores (TRU) convierten la corriente AC a DC.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-elec-add-008',
    question: '¿Cuántos buses eléctricos principales tiene el B737?',
    options: ['2', '3', '4', '6'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene 3 buses eléctricos principales: Izquierdo, Derecho y Esencial.',
    category: 'Electrical',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  }
];

// Additional Hydraulics Questions (8 more)
export const ADDITIONAL_B737_HYDRAULICS_QUESTIONS: AdditionalQuestion[] = [
  {
    id: 'b737-hyd-add-001',
    question: '¿Qué bombas alimentan el Sistema A?',
    options: ['Solo bomba del motor', 'Motor y eléctrica', 'Solo eléctrica', 'Manual'],
    correctAnswer: 1,
    explanation: 'El Sistema A es alimentado por una bomba del motor izquierdo y una bomba eléctrica.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-hyd-add-002',
    question: '¿Qué bombas alimentan el Sistema B?',
    options: ['Solo bomba del motor', 'Motor y eléctrica', 'Solo eléctrica', 'Manual'],
    correctAnswer: 1,
    explanation: 'El Sistema B es alimentado por una bomba del motor derecho y una bomba eléctrica.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-hyd-add-003',
    question: '¿Cuál es la capacidad del reservorio hidráulico?',
    options: ['2.5 galones', '4.2 galones', '6.8 galones', '8.5 galones'],
    correctAnswer: 1,
    explanation: 'El reservorio hidráulico del B737 tiene una capacidad de aproximadamente 4.2 galones.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-hyd-add-004',
    question: '¿Qué sistemas se alimentan del Sistema A?',
    options: ['Solo frenos', 'Frenos y controles de vuelo', 'Solo controles', 'Tren de aterrizaje'],
    correctAnswer: 1,
    explanation: 'El Sistema A alimenta los frenos automáticos y algunos controles de vuelo.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-hyd-add-005',
    question: '¿Qué sistemas se alimentan del Sistema B?',
    options: ['Solo flaps', 'Tren de aterrizaje y controles', 'Solo frenos', 'Spoilers únicamente'],
    correctAnswer: 1,
    explanation: 'El Sistema B alimenta el tren de aterrizaje, slats/flaps y algunos controles de vuelo.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-hyd-add-006',
    question: '¿Qué sucede si se pierde presión en ambos sistemas?',
    options: ['Control manual', 'Sistema de emergencia', 'RAT se despliega', 'Control backup'],
    correctAnswer: 0,
    explanation: 'Si se pierde presión en ambos sistemas, se debe usar el control manual de reversor.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'hard'
  },
  {
    id: 'b737-hyd-add-007',
    question: '¿Cuál es la temperatura máxima del fluido hidráulico?',
    options: ['90°C', '120°C', '150°C', '180°C'],
    correctAnswer: 1,
    explanation: 'La temperatura máxima del fluido hidráulico es de 120°C.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-hyd-add-008',
    question: '¿Qué indica la luz LOW PRESSURE?',
    options: ['Presión baja', 'Temperatura alta', 'Filtro obstruido', 'Nivel bajo'],
    correctAnswer: 0,
    explanation: 'La luz LOW PRESSURE indica que la presión del sistema hidráulico está por debajo del mínimo operacional.',
    category: 'Hydraulics',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  }
];

// Additional Fuel Questions (8 more)
export const ADDITIONAL_B737_FUEL_QUESTIONS: AdditionalQuestion[] = [
  {
    id: 'b737-fuel-add-001',
    question: '¿Cuál es la capacidad total de combustible del B737-800?',
    options: ['20,000 lbs', '26,000 lbs', '28,000 lbs', '32,000 lbs'],
    correctAnswer: 1,
    explanation: 'El B737-800 tiene una capacidad total de combustible de aproximadamente 26,000 libras.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-fuel-add-002',
    question: '¿Cuántas bombas de combustible tiene cada tanque?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: 'Cada tanque principal tiene 2 bombas de combustible: una principal y una de respaldo.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-fuel-add-003',
    question: '¿Qué sucede si falla la bomba principal de combustible?',
    options: ['Se detiene el motor', 'Opera bomba de respaldo', 'Alimentación por gravedad', 'Sistema manual'],
    correctAnswer: 1,
    explanation: 'Si falla la bomba principal, automáticamente opera la bomba de respaldo del mismo tanque.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-fuel-add-004',
    question: '¿Cuál es la presión normal del sistema de combustible?',
    options: ['15-25 PSI', '25-35 PSI', '35-45 PSI', '45-55 PSI'],
    correctAnswer: 1,
    explanation: 'La presión normal del sistema de combustible está entre 25-35 PSI.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-fuel-add-005',
    question: '¿Qué tipo de combustible utiliza el B737?',
    options: ['Jet A', 'Jet A-1', 'Jet B', 'Todos los anteriores'],
    correctAnswer: 3,
    explanation: 'El B737 puede usar Jet A, Jet A-1 o Jet B dependiendo de la disponibilidad regional.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-fuel-add-006',
    question: '¿Cuál es la temperatura mínima de combustible?',
    options: ['-37°C', '-43°C', '-50°C', '-60°C'],
    correctAnswer: 1,
    explanation: 'La temperatura mínima de combustible para operación segura es de -43°C.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-fuel-add-007',
    question: '¿Qué función tiene el sistema de transferencia de combustible?',
    options: ['Balancear tanques', 'Enfriar combustible', 'Filtrar combustible', 'Todas las anteriores'],
    correctAnswer: 0,
    explanation: 'El sistema de transferencia balancea automáticamente el combustible entre tanques.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  },
  {
    id: 'b737-fuel-add-008',
    question: '¿Cuándo se activa la alimentación cruzada de combustible?',
    options: ['Automáticamente', 'Solo manualmente', 'En emergencia', 'Durante despegue'],
    correctAnswer: 1,
    explanation: 'La alimentación cruzada de combustible se activa solo manualmente cuando se requiere.',
    category: 'Fuel',
    aircraftType: 'B737_FAMILY',
    difficulty: 'medium'
  }
];

// Additional Landing Gear Questions (8 more)  
export const ADDITIONAL_B737_LANDING_GEAR_QUESTIONS: AdditionalQuestion[] = [
  {
    id: 'b737-lg-add-001',
    question: '¿Qué tipo de tren de aterrizaje tiene el Boeing 737?',
    options: ['Tren fijo', 'Tren retráctil triciclo', 'Tren convencional', 'Patines'],
    correctAnswer: 1,
    explanation: 'El Boeing 737 tiene tren de aterrizaje retráctil tipo triciclo con rueda de nariz y dos trenes principales.',
    category: 'Landing Gear',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy'
  },
  {
    id: 'b737-lg-add-002',
    question: '¿Cuántas ruedas tiene cada tren principal?',
    options: ['1', '2', '4', '6'],
    correctAnswer: 1,
    explanation: 'Cada tren principal del B737 tiene 2 ruedas.',
    category: 'Landing Gear',
    aircraftType: 'B737_FAMILY',
    difficulty: 'easy'
  },
  {
    id: 'b737-