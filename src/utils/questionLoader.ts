import type { RealAviationQuestion } from '@/data/realAviationQuestions';

/**
 * Dynamically loads and filters questions based on criteria
 * This function is designed to be imported dynamically to reduce initial bundle size
 */
export const loadAndFilterQuestions = async (
  mode: string,
  category: string, // This will now be a comma-separated string of categories
  aircraft: string,
  difficulty: string,
  questionCount: number
): Promise<RealAviationQuestion[]> => {
  // Dynamically import the large data file only when needed
  const { allAviationQuestions } = await import('@/data/cleanAviationQuestions');
  
  let allQuestions = [...allAviationQuestions];
  
  console.log('Total questions available:', allQuestions.length);
  console.log('Filtering by - Mode:', mode, 'Categories:', category, 'Aircraft:', aircraft, 'Difficulty:', difficulty);
  
  // For review mode, if no incorrect questions are available, show sample questions
  if (mode === 'review') {
    console.log('Review mode detected - providing sample questions for testing');
    // For now, provide a sample of questions from different categories for review mode testing
    const sampleQuestions = allQuestions.filter((q, index) => index % 3 === 0); // Every 3rd question as sample
    allQuestions = sampleQuestions;
    console.log('Review mode sample questions:', allQuestions.length);
  }
  
  // For timed mode, ensure we have enough questions
  if (mode === 'timed') {
    console.log('Timed mode detected - ensuring we have enough questions');
    // Shuffle all questions and take what we need
    allQuestions = allQuestions.sort(() => Math.random() - 0.5);
    console.log('Timed mode total questions available:', allQuestions.length);
  }
  
  // Filter by aircraft if specified and not 'ALL'
  if (aircraft && aircraft !== 'ALL') {
    const beforeCount = allQuestions.length;
    allQuestions = allQuestions.filter(q => {
      // Include questions that match the aircraft type or are general
      return q.aircraftType === aircraft || 
             q.aircraftType === 'GENERAL' || 
             (aircraft === 'A320_FAMILY' && q.aircraftType === 'A320_FAMILY') ||
             (aircraft === 'B737_FAMILY' && q.aircraftType === 'B737_FAMILY');
    });
    console.log('After aircraft filter:', beforeCount, '->', allQuestions.length);
  }
  
  // Filter by categories if specified
  if (category && category !== 'all' && category !== '') {
    // Split comma-separated categories
    const selectedCategories = category.split(',').map(cat => cat.trim());
    console.log('Selected categories:', selectedCategories);
    
    const beforeCount = allQuestions.length;
    
    // Create a category map for all possible category variations
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
        'Flight Controls', 'APU Systems', 'Engine Systems',
        // Additional Spanish categories that are actually in the database
        'Sistemas de Aeronave', 'Sistema General', 'Sistemas Generales',
        // Enhanced multilingual mapping for better detection
        'General Aircraft', 'Aircraft General Systems', 'Sistemas Generales de Aeronave',
        // B737 category
        'AIRPLANE GENERAL'
      ],
      'load-acceleration-limits': [
        'Load Limits', 'Acceleration Limits', 'Structural Limits', 'G-Force Limits', 
        'Load Acceleration Limits', 'Load Factor Limits', 'G-Limits',
        'Límites de Carga', 'Límites de Aceleración', 'Límites Estructurales',
        'Structural Loading', 'Acceleration Constraints', 'G-Force Constraints'
      ],
      'environment-limits': [
        'Environment Limits', 'Environmental Limits', 'Weather Limits', 
        'Operational Limits', 'Temperature Limits', 'Altitude Limits',
        'Límites Ambientales', 'Límites Operacionales',
        'Weather Constraints', 'Environmental Constraints', 'Operational Constraints'
      ],
      'weight-limits': [
        'Weight Limits', 'Weight and Balance', 'Mass Limits', 'CG Limits',
        'Límites de Peso', 'Peso y Balance', 'Límites de Masa',
        'Weight', 'Balance', 'Center of Gravity', 'CG', 'Mass',
        'Performance',  // Include performance questions as they often involve weight considerations
        'Weight and Balance Constraints', 'Mass Limitations', 'CG Constraints'
      ],
      'speed-limits': [
        'Speed Limits', 'Velocity Limits', 'Airspeed Limits', 'Mach Limits',
        'Límites de Velocidad', 'Velocidad Máxima', 'VMO', 'MMO',
        'Airspeed Constraints', 'Velocity Constraints', 'Mach Number Limits'
      ],
      'air-bleed-cond-press-vent': [
        'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 
        'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent',
        'Sistema Neumático', 'Presurización', 'Aire Acondicionado', 
        'Ventilación', 'Sistema de Aire',
        'Bleed Air Systems', 'Pressurization Systems', 'Air Conditioning Systems',
        // B737 category
        'AIR SYSTEMS'
      ],
      'autoflight': [
        'Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS', 'Autoflight',
        'Autopiloto', 'Sistema de Vuelo Automático', 'Gestión de Vuelo',
        'Automatic Flight Control', 'Autonomous Flight', 'Flight Automation',
        // B737 category
        'AUTOMATIC FLIGHT'
      ],
      'apu': [
        'APU', 'Auxiliary Power Unit', 'APU Systems', 'Unidad de Potencia Auxiliar',
        'Sistema APU',
        'Auxiliary Power', 'Power Generation Unit'
      ],
      'engines': [
        'Engines', 'Engine Systems', 'Motor y APU', 'Powerplant', 'Engine Operations',
        'Motores', 'Sistema de Motores', 'Operación de Motores',
        'Powerplant Systems', 'Engine Management', 'Propulsion Systems',
        // B737 category
        'ENGINES AND APU'
      ],
      'flight-controls': [
        'Flight Controls', 'Control Systems', 'Primary Controls', 'Secondary Controls', 
        'Controles de Vuelo', 'Sistema de Controles',
        'Aircraft Controls', 'Control Surfaces', 'Flight Control Systems',
        // B737 category
        'FLIGHT CONTROLS'
      ],
      'fuel': [
        'Fuel', 'Fuel Systems', 'Fuel Management', 'Sistema de Combustible',
        'Gestión de Combustible',
        'Fuel Systems Management', 'Fuel Distribution', 'Fuel Storage'
      ],
      'ice-rain-protection': [
        'Ice Protection', 'Anti-Ice', 'Rain Protection', 'Ice and Rain Protection', 
        'Anti-Ice and Rain', 'Protección contra Hielo', 'Sistema Antihielo',
        'Ice Protection Systems', 'Anti-Ice Systems', 'Weather Protection',
        // B737 category
        'ANTI-ICE AND RAIN'
      ],
      'landing-gear': [
        'Landing Gear', 'Gear Systems', 'Brakes', 'Landing Gear and Brakes',
        'Tren de Aterrizaje', 'Sistema de Frenos',
        'Undercarriage', 'Landing Systems', 'Braking Systems',
        // B737 category
        'LANDING GEAR'
      ],
      'oxygen': [
        'Oxygen', 'Oxygen Systems', 'Emergency Oxygen', 'Life Support',
        'Oxígeno', 'Sistema de Oxígeno', 'Oxígeno de Emergencia',
        'Oxygen Generation', 'Life Support Systems', 'Emergency Breathing'
      ],
      'gpws': [
        'GPWS', 'Ground Proximity Warning', 'Terrain Warning', 'TAWS',
        'Sistema de Alerta de Proximidad al Terreno',
        'Ground Proximity Systems', 'Terrain Awareness', 'Warning Systems'
      ],
      'navigation': [
        'Navigation', 'Flight Management and Navigation', 'Navegación', 'GPS', 'FMS',
        'Sistema de Navegación', 'Flight Management', 'RNAV', 'RNP', 'ILS',
        'Flight Navigation', 'Aircraft Navigation', 'Positioning Systems',
        // B737 category
        'FLIGHT MANAGEMENT AND NAVIGATION'
      ],
      'communication': [
        'Communication', 'Radio', 'ACARS', 'Communications',
        'Comunicación', 'Sistema de Comunicaciones',
        'Radio Communication', 'Aircraft Communication Systems',
        // B737 category
        'COMMUNICATION'
      ],
      'electrical': [
        'Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems',
        'Aircraft Electrical', 'Power Distribution',
        // B737 category
        'ELECTRICAL'
      ],
      'fire-protection': [
        'Fire Protection', 'Fire Systems', 'Fire Detection', 'Fire Suppression', 
        'Protección de Vuelo', 'Sistema de Protección contra Incendios',
        'Fire Safety', 'Fire Detection Systems',
        // B737 category
        'FIRE PROTECTION'
      ],
      'flight-instruments': [
        'Flight Instruments', 'Displays', 'ECAM', 'EICAS', 
        'Flight Instruments and Displays', 'Instrumentos de Vuelo',
        'Aircraft Instruments', 'Flight Displays',
        // B737 category
        'FLIGHT INSTRUMENTS AND DISPLAYS'
      ],
      'hydraulics': [
        'Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power',
        'Aircraft Hydraulics', 'Hydraulic Actuation',
        // B737 category
        'HYDRAULICS'
      ],
      'warning-systems': [
        'Warning Systems', 'Alert Systems', 'ECAM', 'EICAS', 'Alerting Systems',
        'Sistemas de Alerta',
        'Aircraft Warning Systems', 'Alerting Mechanisms',
        // B737 category
        'WARNING SYSTEMS'
      ],
      // Legacy categories for backward compatibility
      'airplane-general': [
        'General', 'Aircraft General', 'Airplane General', 'General Knowledge',
        'Sistema Eléctrico', 'Sistema Hidráulico',
        'General Aircraft Knowledge', 'Basic Aircraft Systems',
        'AIRPLANE GENERAL'
      ],
      'air-systems': [
        'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic',
        'Sistema Neumático', 'Presurización',
        'Pneumatic Systems', 'Pressurization Systems',
        'AIR SYSTEMS'
      ],
      'anti-ice-rain': [
        'Anti-Ice', 'Rain Protection', 'Ice Protection', 'Anti-Ice and Rain',
        'Protección contra Hielo',
        'Ice Prevention', 'Weather Protection Systems',
        'ANTI-ICE AND RAIN'
      ],
      'automatic-flight': [
        'Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS',
        'Autopiloto', 'Sistema de Vuelo Automático',
        'Autonomous Flight Systems', 'Automatic Flight Control',
        'AUTOMATIC FLIGHT'
      ],
      'engines-apu': [
        'Engines', 'APU', 'Engine Systems', 'Engines and APU', 'Motor y APU', 'Powerplant',
        'Motores', 'Sistema APU',
        'Propulsion Systems', 'Power Generation',
        'ENGINES AND APU'
      ],
      // Legacy Spanish categories for backward compatibility
      'sistemas-aeronave': [
        'Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Neumático', 
        'Sistemas de Alerta', 'Motor y APU', 'Sistemas de Aeronave',
        'Aircraft Systems', 'General Aircraft Systems'
      ],
      'proteccion-vuelo': [
        'Protección de Vuelo', 'Sistema de Vuelo', 'Fire Protection', 'Fire Systems',
        'Flight Safety', 'Aircraft Protection'
      ],
      'procedimientos-aproximacion': [
        'Procedimientos de Aproximación', 'Sistema de Aterrizaje Automático',
        'Approach Procedures', 'Landing Procedures'
      ],
      'procedimientos-emergencia': [
        'Procedimientos de Emergencia', 'Sistema de Presurización',
        'Emergency Procedures', 'Emergency Operations'
      ],
      // Comprehensive definitions for reglamentacion, navegacion, and performance
      'reglamentacion': ['Reglamentación', 'Regulations', 'Aviation Rules', 'EASA', 'ICAO', 'FAA',
        'Flight Time Limitations', 'Operating Rules', 'Aviation Regulations'],
      'navegacion': ['Navegación', 'Navigation', 'Flight Path Management', 'Flight Management and Navigation', 'GPS', 'FMS',
        'Sistema de Navegación', 'Flight Management', 'RNAV', 'RNP', 'ILS',
        'Flight Navigation', 'Aircraft Navigation', 'Positioning Systems'],
      'performance': ['Performance', 'Procedimientos de Despegue', 'Aircraft Performance', 'Takeoff Performance',
        'Performance Calculations', 'Aircraft Performance Limitations'],
      // Additional mappings for review system categories
      'aircraft-systems': [
        'Aircraft Systems', 'Sistema Hidráulico', 'Sistema Eléctrico', 
        'Sistema de Combustible', 'Sistema de Presurización', 'Sistema de Frenos', 
        'Controles de Vuelo', 'Tren de Aterrizaje', 'Sistema de Oxígeno', 
        'Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 
        'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent',
        'Sistemas de Aeronave',
        'General Aircraft Systems', 'Integrated Aircraft Systems',
        // Direct matches for database values
        'Sistema de Combustible', 'Sistema de Presurización', 'Sistema de Frenos',
        'Controles de Vuelo', 'Tren de Aterrizaje', 'Sistema de Oxígeno'
      ],
      'flight-protection': [
        'Flight Protection', 'Protección de Vuelo', 'Fire Protection', 'Fire Systems', 
        'Alpha Protection', 'Overspeed Protection', 'Load Factor Protection',
        'Aircraft Safety Systems', 'Protection Mechanisms'
      ],
      'approach-procedures': [
        'Approach Procedures', 'Procedimientos de Aproximación', 
        'Sistema de Aterrizaje Automático', 'ILS Approach', 'RNAV Approach', 'Autoland',
        'Landing Procedures', 'Approach Navigation'
      ],
      'emergency-procedures': [
        'Emergency Procedures', 'Procedimientos de Emergencia', 
        'Sistema de Presurización', 'Emergency Descent', 'Engine Fire', 'Rapid Decompression',
        'Emergency Operations', 'Abnormal Procedures'
      ],
      'meteorologia': [
        'Meteorology', 'Meteorología', 'Weather', 'Wind Shear', 'Turbulence', 'Icing Conditions',
        'Atmospheric Conditions', 'Weather Phenomena'
      ],
      'regulations': [
        'Regulations', 'Reglamentación', 'EASA', 'ICAO', 'FAA', 
        'Flight Time Limitations', 'Operating Rules',
        'Aviation Regulations', 'Flight Rules'
      ],
      // Additional A320-specific category mappings
      'motor-y-apu': [
        'Motor y APU', 'APU', 'Auxiliary Power Unit', 'APU Systems', 'Unidad de Potencia Auxiliar',
        'Sistema APU', 'Auxiliary Power', 'Power Generation Unit', 'Engines and APU'
      ],
      'procedimientos-de-despegue': [
        'Procedimientos de Despegue', 'Takeoff Procedures', 'Performance', 'Aircraft Performance',
        'Takeoff Performance', 'Departure Procedures'
      ],
      'sistema-electrico': [
        'Sistema Eléctrico', 'Electrical', 'Electrical Systems', 'Power Systems',
        'Aircraft Electrical', 'Power Distribution', 'Electrical Power'
      ],
      'sistema-hidraulico': [
        'Sistema Hidráulico', 'Hydraulics', 'Hydraulic Systems', 'Hydraulic Power',
        'Aircraft Hydraulics', 'Hydraulic Actuation', 'Hydraulic Systems Management'
      ]
    };
    
    // Filter questions by any of the selected categories
    allQuestions = allQuestions.filter(q => {
      // Check if question matches any of the selected categories
      return selectedCategories.some(selectedCat => {
        // Get target categories for this selected category
        const targetCategories = categoryMap[selectedCat] || [selectedCat];
        console.log('Target categories for', selectedCat, ':', targetCategories);
        
        // Normalize the question category for better matching
        const normalizedQuestionCategory = q.category
          .toLowerCase()
          .replace(/[^\w\s]/g, '') // Remove punctuation
          .replace(/\s+/g, ' ')    // Normalize whitespace
          .trim();
          
        // Check if question category matches any target category (case insensitive partial match)
        const matchesCategory = targetCategories.some(targetCat => {
          const normalizedTargetCat = targetCat
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ')    // Normalize whitespace
            .trim();
            
          // Direct match
          if (normalizedQuestionCategory === normalizedTargetCat) {
            console.log('Direct match found:', q.category, 'matches', targetCat);
            return true;
          }
          
          // Partial match (contains)
          if (normalizedQuestionCategory.includes(normalizedTargetCat) || 
              normalizedTargetCat.includes(normalizedQuestionCategory)) {
            console.log('Partial match found:', q.category, 'contains/contained in', targetCat);
            return true;
          }
          
          // Word-by-word match for better multilingual detection
          const questionWords = normalizedQuestionCategory.split(' ');
          const targetWords = normalizedTargetCat.split(' ');
          
          const wordMatch = questionWords.some(qWord => 
            targetWords.some(tWord => 
              qWord.includes(tWord) || tWord.includes(qWord)
            )
          );
          
          if (wordMatch) {
            console.log('Word match found:', q.category, 'word matches', targetCat);
          }
          
          return wordMatch;
        });
        
        if (matchesCategory) {
          console.log('Question matched category:', q.question.substring(0, 50), 'Category:', q.category);
        }
        return matchesCategory;
      });
    });
    
    console.log('After category filter:', beforeCount, '->', allQuestions.length);
  }
  
  // Apply difficulty filter
  if (difficulty && difficulty !== 'all') {
    const beforeCount = allQuestions.length;
    allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
    console.log('After difficulty filter:', beforeCount, '->', allQuestions.length);
  }
  
  // If no questions found after filtering, try without aircraft restriction
  if (allQuestions.length === 0 && aircraft && aircraft !== 'ALL') {
    console.log('No questions found with filters, trying with relaxed aircraft filter');
    // Try again without aircraft filter
    let fallbackQuestions = [...allAviationQuestions];
    
    // Apply category filter only
    if (category && category !== 'all' && category !== '') {
      // Split comma-separated categories
      const selectedCategories = category.split(',').map(cat => cat.trim());
      
      // For fallback, we'll use a simpler approach that directly matches the category
      // This avoids the complexity of the full categoryMap in the fallback section
      fallbackQuestions = fallbackQuestions.filter(q => {
        // Check if question matches any of the selected categories
        return selectedCategories.some(selectedCat => {
          // Normalize the question category for better matching
          const normalizedQuestionCategory = q.category
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ')    // Normalize whitespace
            .trim();
          
          // Normalize the target category
          const normalizedTargetCategory = selectedCat
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ')    // Normalize whitespace
            .trim();
          
          // Direct match or partial match
          return normalizedQuestionCategory.includes(normalizedTargetCategory) || 
                 normalizedTargetCategory.includes(normalizedQuestionCategory);
        });
      });
    }
    
    // Apply difficulty filter
    if (difficulty && difficulty !== 'all') {
      fallbackQuestions = fallbackQuestions.filter(q => q.difficulty === difficulty);
    }
    
    console.log('Fallback questions found:', fallbackQuestions.length);
    allQuestions = fallbackQuestions;
  }
  
  // Additional fallback: if still no questions, provide a sample from all categories
  if (allQuestions.length === 0) {
    console.log('Still no questions found, providing sample questions from all categories');
    // Provide a sample of questions (every 5th question) to ensure we have some content
    allQuestions = allAviationQuestions.filter((q, index) => index % 5 === 0);
    console.log('Sample questions provided:', allQuestions.length);
  }
  
  // Additional fallback for "Aircraft General" category specifically
  if (allQuestions.length === 0 && category === 'aircraft-general') {
    console.log('No questions found for aircraft-general, providing all aircraft system questions');
    // For aircraft-general, include questions from all major aircraft systems
    const systemCategories = [
      'Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Neumático',
      'Sistema de Combustible', 'Sistema de Presurización', 'Sistema de Frenos',
      'Controles de Vuelo', 'Tren de Aterrizaje', 'Sistema de Oxígeno',
      'Electrical Systems', 'Hydraulic Systems', 'Pneumatic Systems',
      'Fuel Systems', 'Pressurization', 'Landing Gear Systems',
      'Flight Controls', 'Oxygen Systems', 'APU Systems', 'Engine Systems'
    ];
    
    allQuestions = allAviationQuestions.filter(q => 
      systemCategories.some(sysCat => 
        q.category.toLowerCase().includes(sysCat.toLowerCase()) ||
        sysCat.toLowerCase().includes(q.category.toLowerCase())
      )
    );
    
    console.log('Aircraft system questions provided:', allQuestions.length);
  }
  
  // Shuffle and limit questions
  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
  const limitedQuestions = shuffledQuestions.slice(0, questionCount);
  
  console.log('Final filtered questions:', limitedQuestions.length);
  return limitedQuestions;
};