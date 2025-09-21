import type { RealAviationQuestion } from '@/data/realAviationQuestions';

/**
 * Dynamically loads and filters questions based on criteria
 * This function is designed to be imported dynamically to reduce initial bundle size
 */
export const loadAndFilterQuestions = async (
  mode: string,
  category: string,
  aircraft: string,
  difficulty: string,
  questionCount: number
): Promise<RealAviationQuestion[]> => {
  // Dynamically import the large data file only when needed
  const { allRealAviationQuestions } = await import('@/data/realAviationQuestions');
  
  let allQuestions = [...allRealAviationQuestions];
  
  console.log('Total questions available:', allQuestions.length);
  console.log('Filtering by - Mode:', mode, 'Category:', category, 'Aircraft:', aircraft, 'Difficulty:', difficulty);
  
  // For review mode, if no incorrect questions are available, show sample questions
  if (mode === 'review') {
    console.log('Review mode detected - providing sample questions for testing');
    // For now, provide a sample of questions from different categories for review mode testing
    const sampleQuestions = allQuestions.filter((q, index) => index % 3 === 0); // Every 3rd question as sample
    allQuestions = sampleQuestions;
    console.log('Review mode sample questions:', allQuestions.length);
  }
  
  // Filter by aircraft if specified and not 'ALL'
  if (aircraft && aircraft !== 'ALL') {
    const beforeCount = allQuestions.length;
    allQuestions = allQuestions.filter(q => {
      // Include questions that match the aircraft type or are general
      return q.aircraftType === aircraft || 
             q.aircraftType === 'COMMERCIAL_AIRCRAFT' || 
             q.aircraftType === 'GENERAL_AVIATION' ||
             q.aircraftType === 'REGULATORY' ||
             (aircraft === 'A320_FAMILY' && q.aircraftType === 'A320_FAMILY');
    });
    console.log('After aircraft filter:', beforeCount, '->', allQuestions.length);
  }
  
  // Filter by category if specified
  if (category && category !== 'all') {
    const beforeCount = allQuestions.length;
    const categoryMap: { [key: string]: string[] } = {
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
        'Flight Controls', 'APU Systems', 'Engine Systems'
      ],
      'load-acceleration-limits': [
        'Load Limits', 'Acceleration Limits', 'Structural Limits', 'G-Force Limits', 
        'Load Acceleration Limits', 'Load Factor Limits', 'G-Limits',
        'Límites de Carga', 'Límites de Aceleración', 'Límites Estructurales'
      ],
      'environment-limits': [
        'Environment Limits', 'Environmental Limits', 'Weather Limits', 
        'Operational Limits', 'Temperature Limits', 'Altitude Limits',
        'Límites Ambientales', 'Límites Operacionales'
      ],
      'weight-limits': [
        'Weight Limits', 'Weight and Balance', 'Mass Limits', 'CG Limits',
        'Límites de Peso', 'Peso y Balance', 'Límites de Masa',
        'Weight', 'Balance', 'Center of Gravity', 'CG', 'Mass',
        'Performance'  // Include performance questions as they often involve weight considerations
      ],
      'speed-limits': [
        'Speed Limits', 'Velocity Limits', 'Airspeed Limits', 'Mach Limits',
        'Límites de Velocidad', 'Velocidad Máxima', 'VMO', 'MMO'
      ],
      'air-bleed-cond-press-vent': [
        'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 
        'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent',
        'Sistema Neumático', 'Presurización', 'Aire Acondicionado', 
        'Ventilación', 'Sistema de Aire'
      ],
      'autoflight': [
        'Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS', 'Autoflight',
        'Autopiloto', 'Sistema de Vuelo Automático', 'Gestión de Vuelo'
      ],
      'apu': [
        'APU', 'Auxiliary Power Unit', 'APU Systems', 'Unidad de Potencia Auxiliar',
        'Sistema APU'
      ],
      'engines': [
        'Engines', 'Engine Systems', 'Motor y APU', 'Powerplant', 'Engine Operations',
        'Motores', 'Sistema de Motores', 'Operación de Motores'
      ],
      'flight-controls': [
        'Flight Controls', 'Control Systems', 'Primary Controls', 'Secondary Controls', 
        'Controles de Vuelo', 'Sistema de Controles'
      ],
      'fuel': [
        'Fuel', 'Fuel Systems', 'Fuel Management', 'Sistema de Combustible',
        'Gestión de Combustible'
      ],
      'ice-rain-protection': [
        'Ice Protection', 'Anti-Ice', 'Rain Protection', 'Ice and Rain Protection', 
        'Anti-Ice and Rain', 'Protección contra Hielo', 'Sistema Antihielo'
      ],
      'landing-gear': [
        'Landing Gear', 'Gear Systems', 'Brakes', 'Landing Gear and Brakes',
        'Tren de Aterrizaje', 'Sistema de Frenos'
      ],
      'oxygen': [
        'Oxygen', 'Oxygen Systems', 'Emergency Oxygen', 'Life Support',
        'Oxígeno', 'Sistema de Oxígeno', 'Oxígeno de Emergencia'
      ],
      'gpws': [
        'GPWS', 'Ground Proximity Warning', 'Terrain Warning', 'TAWS',
        'Sistema de Alerta de Proximidad al Terreno'
      ],
      'navigation': [
        'Navigation', 'Flight Management and Navigation', 'Navegación', 'GPS', 'FMS',
        'Sistema de Navegación', 'Flight Management', 'RNAV', 'RNP', 'ILS'
      ],
      // Legacy categories for backward compatibility
      'airplane-general': [
        'General', 'Aircraft General', 'Airplane General', 'General Knowledge',
        'Sistema Eléctrico', 'Sistema Hidráulico'
      ],
      'air-systems': [
        'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic',
        'Sistema Neumático', 'Presurización'
      ],
      'anti-ice-rain': [
        'Anti-Ice', 'Rain Protection', 'Ice Protection', 'Anti-Ice and Rain',
        'Protección contra Hielo'
      ],
      'automatic-flight': [
        'Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS',
        'Autopiloto', 'Sistema de Vuelo Automático'
      ],
      'communication': [
        'Communication', 'Radio', 'ACARS', 'Communications',
        'Comunicación', 'Sistema de Comunicaciones'
      ],
      'electrical': [
        'Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems'
      ],
      'engines-apu': [
        'Engines', 'APU', 'Engine Systems', 'Engines and APU', 'Motor y APU', 'Powerplant',
        'Motores', 'Sistema APU'
      ],
      'fire-protection': [
        'Fire Protection', 'Fire Systems', 'Fire Detection', 'Fire Suppression', 
        'Protección de Vuelo', 'Sistema de Protección contra Incendios'
      ],
      'flight-instruments': [
        'Flight Instruments', 'Displays', 'ECAM', 'EICAS', 
        'Flight Instruments and Displays', 'Instrumentos de Vuelo'
      ],
      'flight-management': [
        'Flight Management', 'Navigation', 'FMS', 'Flight Management and Navigation', 
        'Navegación', 'Gestión de Vuelo'
      ],
      'hydraulics': [
        'Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power'
      ],
      'warning-systems': [
        'Warning Systems', 'Alert Systems', 'ECAM', 'EICAS', 'Alerting Systems',
        'Sistemas de Alerta'
      ],
      // Legacy Spanish categories for backward compatibility
      'sistemas-aeronave': [
        'Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Neumático', 
        'Sistemas de Alerta', 'Motor y APU'
      ],
      'proteccion-vuelo': [
        'Protección de Vuelo', 'Sistema de Vuelo', 'Fire Protection', 'Fire Systems'
      ],
      'procedimientos-aproximacion': [
        'Procedimientos de Aproximación', 'Sistema de Aterrizaje Automático'
      ],
      'procedimientos-emergencia': [
        'Procedimientos de Emergencia', 'Sistema de Presurización'
      ],
      'meteorologia': ['Meteorología'],
      'reglamentacion': ['Reglamentación'],
      'navegacion': ['Navegación'],
      'performance': ['Performance', 'Procedimientos de Despegue'],
      // Additional mappings for review system categories
      'aircraft-systems': [
        'Aircraft Systems', 'Sistema Hidráulico', 'Sistema Eléctrico', 
        'Sistema de Combustible', 'Sistema de Presurización', 'Sistema de Frenos', 
        'Controles de Vuelo', 'Tren de Aterrizaje', 'Sistema de Oxígeno', 
        'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 
        'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent'
      ],
      'flight-protection': [
        'Flight Protection', 'Protección de Vuelo', 'Fire Protection', 'Fire Systems', 
        'Alpha Protection', 'Overspeed Protection', 'Load Factor Protection'
      ],
      'approach-procedures': [
        'Approach Procedures', 'Procedimientos de Aproximación', 
        'Sistema de Aterrizaje Automático', 'ILS Approach', 'RNAV Approach', 'Autoland'
      ],
      'emergency-procedures': [
        'Emergency Procedures', 'Procedimientos de Emergencia', 
        'Sistema de Presurización', 'Emergency Descent', 'Engine Fire', 'Rapid Decompression'
      ],
      'meteorology': [
        'Meteorology', 'Meteorología', 'Weather', 'Wind Shear', 'Turbulence', 'Icing Conditions'
      ],
      'regulations': [
        'Regulations', 'Reglamentación', 'EASA', 'ICAO', 'FAA', 
        'Flight Time Limitations', 'Operating Rules'
      ]
    };
    
    const targetCategories = categoryMap[category] || [category];
    console.log('Target categories for', category, ':', targetCategories);
    
    allQuestions = allQuestions.filter(q => {
      const matchesCategory = targetCategories.some(cat => 
        q.category.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(q.category.toLowerCase())
      );
      if (matchesCategory) {
        console.log('Question matched category:', q.question.substring(0, 50), 'Category:', q.category);
      }
      return matchesCategory;
    });
    console.log('After category filter:', beforeCount, '->', allQuestions.length);
  }
  
  // Filter by difficulty if specified
  if (difficulty && difficulty !== 'all') {
    const beforeCount = allQuestions.length;
    allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
    console.log('After difficulty filter:', beforeCount, '->', allQuestions.length);
  }
  
  // If no questions found after filtering, try without aircraft restriction
  if (allQuestions.length === 0 && aircraft && aircraft !== 'ALL') {
    console.log('No questions found with filters, trying with relaxed aircraft filter');
    // Try again without aircraft filter
    let fallbackQuestions = [...allRealAviationQuestions];
    
    // Apply category filter only
    if (category && category !== 'all') {
      const categoryMap: { [key: string]: string[] } = {
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
          'Flight Controls', 'APU Systems', 'Engine Systems'
        ],
        'load-acceleration-limits': [
          'Load Limits', 'Acceleration Limits', 'Structural Limits', 'G-Force Limits', 
          'Load Acceleration Limits', 'Load Factor Limits', 'G-Limits',
          'Límites de Carga', 'Límites de Aceleración', 'Límites Estructurales'
        ],
        'environment-limits': [
          'Environment Limits', 'Environmental Limits', 'Weather Limits', 
          'Operational Limits', 'Temperature Limits', 'Altitude Limits',
          'Límites Ambientales', 'Límites Operacionales'
        ],
        'weight-limits': [
          'Weight Limits', 'Weight and Balance', 'Mass Limits', 'CG Limits',
          'Límites de Peso', 'Peso y Balance', 'Límites de Masa',
          'Weight', 'Balance', 'Center of Gravity', 'CG', 'Mass',
          'Performance'  // Include performance questions as they often involve weight considerations
        ],
        'speed-limits': [
          'Speed Limits', 'Velocity Limits', 'Airspeed Limits', 'Mach Limits',
          'Límites de Velocidad', 'Velocidad Máxima', 'VMO', 'MMO'
        ],
        'air-bleed-cond-press-vent': [
          'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 
          'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent',
          'Sistema Neumático', 'Presurización', 'Aire Acondicionado', 
          'Ventilación', 'Sistema de Aire'
        ],
        'autoflight': [
          'Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS', 'Autoflight',
          'Autopiloto', 'Sistema de Vuelo Automático', 'Gestión de Vuelo'
        ],
        'apu': [
          'APU', 'Auxiliary Power Unit', 'APU Systems', 'Unidad de Potencia Auxiliar',
          'Sistema APU'
        ],
        'engines': [
          'Engines', 'Engine Systems', 'Motor y APU', 'Powerplant', 'Engine Operations',
          'Motores', 'Sistema de Motores', 'Operación de Motores'
        ],
        'flight-controls': [
          'Flight Controls', 'Control Systems', 'Primary Controls', 'Secondary Controls', 
          'Controles de Vuelo', 'Sistema de Controles'
        ],
        'fuel': [
          'Fuel', 'Fuel Systems', 'Fuel Management', 'Sistema de Combustible',
          'Gestión de Combustible'
        ],
        'ice-rain-protection': [
          'Ice Protection', 'Anti-Ice', 'Rain Protection', 'Ice and Rain Protection', 
          'Anti-Ice and Rain', 'Protección contra Hielo', 'Sistema Antihielo'
        ],
        'landing-gear': [
          'Landing Gear', 'Gear Systems', 'Brakes', 'Landing Gear and Brakes',
          'Tren de Aterrizaje', 'Sistema de Frenos'
        ],
        'oxygen': [
          'Oxygen', 'Oxygen Systems', 'Emergency Oxygen', 'Life Support',
          'Oxígeno', 'Sistema de Oxígeno', 'Oxígeno de Emergencia'
        ],
        'gpws': [
          'GPWS', 'Ground Proximity Warning', 'Terrain Warning', 'TAWS',
          'Sistema de Alerta de Proximidad al Terreno'
        ],
        'navigation': [
          'Navigation', 'Flight Management and Navigation', 'Navegación', 'GPS', 'FMS',
          'Sistema de Navegación'
        ],
        // Legacy categories for backward compatibility
        'airplane-general': [
          'General', 'Aircraft General', 'Airplane General', 'General Knowledge',
          'Sistema Eléctrico', 'Sistema Hidráulico'
        ],
        'air-systems': [
          'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic',
          'Sistema Neumático', 'Presurización'
        ],
        'anti-ice-rain': [
          'Anti-Ice', 'Rain Protection', 'Ice Protection', 'Anti-Ice and Rain',
          'Protección contra Hielo'
        ],
        'automatic-flight': [
          'Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS',
          'Autopiloto', 'Sistema de Vuelo Automático'
        ],
        'communication': [
          'Communication', 'Radio', 'ACARS', 'Communications',
          'Comunicación', 'Sistema de Comunicaciones'
        ],
        'electrical': [
          'Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems'
        ],
        'engines-apu': [
          'Engines', 'APU', 'Engine Systems', 'Engines and APU', 'Motor y APU', 'Powerplant',
          'Motores', 'Sistema APU'
        ],
        'fire-protection': [
          'Fire Protection', 'Fire Systems', 'Fire Detection', 'Fire Suppression', 
          'Protección de Vuelo', 'Sistema de Protección contra Incendios'
        ],
        'flight-instruments': [
          'Flight Instruments', 'Displays', 'ECAM', 'EICAS', 
          'Flight Instruments and Displays', 'Instrumentos de Vuelo'
        ],
        'flight-management': [
          'Flight Management', 'Navigation', 'FMS', 'Flight Management and Navigation', 
          'Navegación', 'Gestión de Vuelo'
        ],
        'hydraulics': [
          'Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power'
        ],
        'warning-systems': [
          'Warning Systems', 'Alert Systems', 'ECAM', 'EICAS', 'Alerting Systems',
          'Sistemas de Alerta'
        ],
        // Legacy Spanish categories for backward compatibility
        'sistemas-aeronave': [
          'Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Neumático', 
          'Sistemas de Alerta', 'Motor y APU'
        ],
        'proteccion-vuelo': [
          'Protección de Vuelo', 'Sistema de Vuelo', 'Fire Protection', 'Fire Systems'
        ],
        'procedimientos-aproximacion': [
          'Procedimientos de Aproximación', 'Sistema de Aterrizaje Automático'
        ],
        'procedimientos-emergencia': [
          'Procedimientos de Emergencia', 'Sistema de Presurización'
        ],
        'meteorologia': ['Meteorología'],
        'reglamentacion': ['Reglamentación'],
        'navegacion': ['Navegación'],
        'performance': ['Performance', 'Procedimientos de Despegue'],
        // Additional mappings for review system categories
        'aircraft-systems': [
          'Aircraft Systems', 'Sistema Hidráulico', 'Sistema Eléctrico', 
          'Sistema de Combustible', 'Sistema de Presurización', 'Sistema de Frenos', 
          'Controles de Vuelo', 'Tren de Aterrizaje', 'Sistema de Oxígeno', 
          'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 
          'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent'
        ],
        'flight-protection': [
          'Flight Protection', 'Protección de Vuelo', 'Fire Protection', 'Fire Systems', 
          'Alpha Protection', 'Overspeed Protection', 'Load Factor Protection'
        ],
        'approach-procedures': [
          'Approach Procedures', 'Procedimientos de Aproximación', 
          'Sistema de Aterrizaje Automático', 'ILS Approach', 'RNAV Approach', 'Autoland'
        ],
        'emergency-procedures': [
          'Emergency Procedures', 'Procedimientos de Emergencia', 
          'Sistema de Presurización', 'Emergency Descent', 'Engine Fire', 'Rapid Decompression'
        ],
        'meteorology': [
          'Meteorology', 'Meteorología', 'Weather', 'Wind Shear', 'Turbulence', 'Icing Conditions'
        ],
        'regulations': [
          'Regulations', 'Reglamentación', 'EASA', 'ICAO', 'FAA', 
          'Flight Time Limitations', 'Operating Rules'
        ]
      };
      
      const targetCategories = categoryMap[category] || [category];
      fallbackQuestions = fallbackQuestions.filter(q => {
        return targetCategories.some(cat => 
          q.category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(q.category.toLowerCase())
        );
      });
    }
    
    // Apply difficulty filter
    if (difficulty && difficulty !== 'all') {
      fallbackQuestions = fallbackQuestions.filter(q => q.difficulty === difficulty);
    }
    
    console.log('Fallback questions found:', fallbackQuestions.length);
    allQuestions = fallbackQuestions;
  }
  
  // Shuffle and limit questions
  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
  const limitedQuestions = shuffledQuestions.slice(0, questionCount);
  
  console.log('Final filtered questions:', limitedQuestions.length);
  return limitedQuestions;
};