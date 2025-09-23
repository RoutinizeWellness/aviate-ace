/**
 * Category mappings for question filtering
 */

export const categoryMappings: { [key: string]: string[] } = {
  // Official Airbus A320 Categories
  'aircraft-general': [
    'General', 'Aircraft General', 'Airplane General', 'General Knowledge',
    'Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Neumático', 
    'Sistema de Combustible', 'Sistema de Presurización', 'Sistema de Frenos',
    'Controles de Vuelo', 'Tren de Aterrizaje', 'Sistema de Oxígeno',
    'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 
    'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent',
    'Aircraft Systems', 'Hydraulic Systems', 'Electrical Systems',
    'Fuel Systems', 'Oxygen Systems', 'Landing Gear Systems',
    'Flight Controls', 'APU Systems', 'Engine Systems',
    'Sistemas de Aeronave', 'Sistema General', 'Sistemas Generales',
    'General Aircraft', 'Aircraft General Systems', 'Sistemas Generales de Aeronave',
    'AIRPLANE GENERAL', 'Performance', 'Aircraft Performance'
  ],
  // Add specific mapping for systems that might be mixed up
  'sistemas': [
    'Aircraft General', 'Airplane General', 'AIRPLANE GENERAL',
    'Aircraft Systems', 'Sistemas de Aeronave', 'Performance',
    'Electrical', 'Hydraulics', 'Fuel', 'Landing Gear', 'Flight Controls'
  ],
  // Add specific mappings for Boeing categories
  'performance': [
    'Performance', 'Aircraft Performance', 'Flight Performance',
    'Rendimiento', 'Performance de Aeronave', 'Rendimiento de Vuelo'
  ],
  'electrical': [
    'Electrical', 'Electrical Systems', 'Power Systems', 'Sistema Eléctrico',
    'Aircraft Electrical', 'Power Distribution', 'Electrical Power'
  ],
  'hydraulics': [
    'Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power',
    'Aircraft Hydraulics', 'Hydraulic Actuation', 'Hydraulic Systems Management'
  ],
  'engines': [
    'Engines', 'Engine Systems', 'Motor y APU', 'Powerplant', 'Engine Operations',
    'Motores', 'Sistema de Motores', 'Operación de Motores',
    'Powerplant Systems', 'Engine Management', 'Propulsion Systems',
    'ENGINES AND APU'
  ],
  'flight-controls': [
    'Flight Controls', 'Control Systems', 'Primary Controls', 'Secondary Controls', 
    'Controles de Vuelo', 'Sistema de Controles',
    'Aircraft Controls', 'Control Surfaces', 'Flight Control Systems',
    'FLIGHT CONTROLS'
  ],
  'navigation': [
    'Navigation', 'Flight Management and Navigation', 'Navegación', 'GPS', 'FMS',
    'Sistema de Navegación', 'Flight Management', 'RNAV', 'RNP', 'ILS',
    'Flight Navigation', 'Aircraft Navigation', 'Positioning Systems',
    'FLIGHT MANAGEMENT AND NAVIGATION'
  ],
  'fuel': [
    'Fuel', 'Fuel Systems', 'Fuel Management', 'Sistema de Combustible',
    'Gestión de Combustible', 'Fuel Systems Management', 'Fuel Distribution', 'Fuel Storage'
  ],
  'apu': [
    'APU', 'Auxiliary Power Unit', 'APU Systems', 'Unidad de Potencia Auxiliar',
    'Sistema APU', 'Auxiliary Power', 'Power Generation Unit'
  ],
  'landing-gear': [
    'Landing Gear', 'Gear Systems', 'Brakes', 'Landing Gear and Brakes',
    'Tren de Aterrizaje', 'Sistema de Frenos', 'Undercarriage', 'Landing Systems', 'Braking Systems'
  ],
  'pressurization': [
    'Pressurization', 'Cabin Pressure', 'Environmental Control', 'Air Conditioning',
    'Presurización', 'Control Ambiental', 'Sistema de Presurización'
  ]
};

/**
 * Checks if a question category matches any of the target categories
 */
export const matchesCategory = (questionCategory: string, targetCategories: string[]): boolean => {
  const normalizedQuestionCategory = questionCategory
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
    
  return targetCategories.some(targetCat => {
    const normalizedTargetCat = targetCat
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
      
    // Direct match
    if (normalizedQuestionCategory === normalizedTargetCat) {
      return true;
    }
    
    // Partial match (contains)
    if (normalizedQuestionCategory.includes(normalizedTargetCat) || 
        normalizedTargetCat.includes(normalizedQuestionCategory)) {
      return true;
    }
    
    // Word-by-word match for better multilingual detection
    const questionWords = normalizedQuestionCategory.split(' ');
    const targetWords = normalizedTargetCat.split(' ');
    
    return questionWords.some(qWord => 
      targetWords.some(tWord => 
        qWord.includes(tWord) || tWord.includes(qWord)
      )
    );
  });
};