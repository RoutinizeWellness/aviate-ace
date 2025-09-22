const fs = require('fs');

// Read the realAviationQuestions file directly
const fileContent = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');

// Extract all the category mappings from the file
const categoryRegex = /category:\s*["'](.*?)["']/g;
const categories = [];
let match;
while ((match = categoryRegex.exec(fileContent)) !== null) {
  categories.push(match[1]);
}

// Get unique categories
const uniqueCategories = [...new Set(categories)];
console.log('=== All Unique Categories in Database ===');
uniqueCategories.sort().forEach(cat => console.log(`- ${cat}`));

// Count questions per category
const categoryCounts = {};
categories.forEach(cat => {
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

console.log('\n=== Question Count by Category ===');
Object.entries(categoryCounts)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => console.log(`${category}: ${count} questions`));

// Simulate the EXACT category mapping from questionLoader.ts - only direct matches
const categoryMap = {
  'electrical': [
    'Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems',
    'Aircraft Electrical', 'Power Distribution'
  ],
  'hydraulics': [
    'Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power',
    'Aircraft Hydraulics', 'Hydraulic Actuation'
  ],
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
    'General Aircraft', 'Aircraft General Systems', 'Sistemas Generales de Aeronave'
  ]
};

// Test function to match questions to categories with EXACT matching
function matchQuestionsToCategoryExact(targetCategory) {
  const targetCategories = categoryMap[targetCategory] || [targetCategory];
  console.log(`\n=== Target categories for ${targetCategory} ===`);
  targetCategories.forEach(cat => console.log(`- ${cat}`));
  
  const matchedCategories = uniqueCategories.filter(cat => {
    // Normalize the question category for better matching
    const normalizedQuestionCategory = cat
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    // Check if question category matches any target category (case insensitive exact match)
    return targetCategories.some(targetCat => {
      const normalizedTargetCat = targetCat
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();
        
      // Direct match only
      if (normalizedQuestionCategory === normalizedTargetCat) {
        console.log(`✓ Direct match: "${cat}" matches "${targetCat}"`);
        return true;
      }
      
      return false;
    });
  });
  
  console.log(`\nFound ${matchedCategories.length} matching categories:`);
  matchedCategories.forEach(cat => console.log(`- ${cat} (${categoryCounts[cat]} questions)`));
  
  return matchedCategories;
}

// Test with "electrical" category
console.log('\n\n=== TESTING ELECTRICAL CATEGORY ===');
matchQuestionsToCategoryExact('electrical');

// Test with "hydraulics" category
console.log('\n\n=== TESTING HYDRAULICS CATEGORY ===');
matchQuestionsToCategoryExact('hydraulics');

// Test with "aircraft-general" category
console.log('\n\n=== TESTING AIRCRAFT-GENERAL CATEGORY ===');
matchQuestionsToCategoryExact('aircraft-general');

// Test what happens when we extract category from "Práctica: Electrical"
console.log('\n\n=== TESTING CATEGORY EXTRACTION FROM TITLE ===');
const examTitle = 'Práctica: Electrical';
const categoryFromTitle = examTitle.replace('Práctica: ', '').toLowerCase().replace(/\s+/g, '-');
console.log(`Exam title: ${examTitle}`);
console.log(`Extracted category: ${categoryFromTitle}`);

// Test the category mapping from ExamMode.tsx
const categoryMapExamMode = {
  'aircraft-general': 'aircraft-general',
  'airplane-general': 'airplane-general',
  'aircraft-systems': 'aircraft-systems',
  'electrical': 'electrical',
  'hydraulic': 'hydraulics',
  'hydraulics': 'hydraulics',
  'pneumatic': 'air-systems',
  'fuel': 'fuel',
  'flight-controls': 'flight-controls',
  'engines': 'engines',
  'apu': 'apu',
  'navigation': 'navigation',
  'autopilot': 'autoflight',
  'autoflight': 'autoflight',
  'performance': 'performance',
  // Additional category mappings for completeness
  'load-acceleration-limits': 'load-acceleration-limits',
  'environment-limits': 'environment-limits',
  'weight-limits': 'weight-limits',
  'speed-limits': 'speed-limits',
  'air-bleed-cond-press-vent': 'air-bleed-cond-press-vent',
  'ice-rain-protection': 'ice-rain-protection',
  'landing-gear': 'landing-gear',
  'oxygen': 'oxygen',
  'gpws': 'gpws',
  'air-systems': 'air-systems',
  'anti-ice-rain': 'anti-ice-rain',
  'automatic-flight': 'automatic-flight',
  'communication': 'communication',
  'engines-apu': 'engines-apu',
  'fire-protection': 'fire-protection',
  'flight-instruments': 'flight-instruments',
  'flight-management': 'flight-management',
  'warning-systems': 'warning-systems',
  // Spanish category mappings
  'sistemas-aeronave': 'sistemas-aeronave',
  'proteccion-vuelo': 'proteccion-vuelo',
  'procedimientos-aproximacion': 'procedimientos-aproximacion',
  'procedimientos-emergencia': 'procedimientos-emergencia',
  'meteorologia': 'meteorologia',
  'reglamentacion': 'reglamentacion',
  'navegacion': 'navegacion'
};

const mappedCategory = categoryMapExamMode[categoryFromTitle] || categoryFromTitle;
console.log(`Mapped category: ${mappedCategory}`);

// Now test matching with the mapped category
console.log(`\nTesting matching for mapped category "${mappedCategory}":`);
matchQuestionsToCategoryExact(mappedCategory);