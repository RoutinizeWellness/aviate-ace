const fs = require('fs');
const readline = require('readline');

async function analyzeFile() {
  const fileStream = fs.createReadStream('./src/data/realAviationQuestions.ts');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const categoryCount = {};
  const aircraftCount = {};
  let lineCount = 0;

  for await (const line of rl) {
    lineCount++;
    
    // Match category lines
    const categoryMatch = line.match(/category:\s*["'](.*?)["']/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
    
    // Match aircraft type lines
    const aircraftMatch = line.match(/aircraftType:\s*["'](.*?)["']/);
    if (aircraftMatch) {
      const aircraft = aircraftMatch[1];
      aircraftCount[aircraft] = (aircraftCount[aircraft] || 0) + 1;
    }
    
    // Print progress every 100,000 lines
    if (lineCount % 100000 === 0) {
      console.log(`Processed ${lineCount} lines...`);
    }
  }

  console.log('\n=== Analysis Results ===');
  console.log('Total lines processed:', lineCount);
  
  console.log('\nQuestions by category:');
  Object.keys(categoryCount).sort().forEach(category => {
    console.log(`${category}: ${categoryCount[category]} questions`);
  });
  
  console.log('\nQuestions by aircraft type:');
  Object.keys(aircraftCount).forEach(aircraft => {
    console.log(`${aircraft}: ${aircraftCount[aircraft]} questions`);
  });
  
  // Get unique categories
  const uniqueCategories = Object.keys(categoryCount);
  console.log('\nUnique categories:', uniqueCategories.sort());
  
  // Check for language consistency
  console.log('\n=== Language Consistency Check ===');
  const englishCategories = uniqueCategories.filter(cat => /^[A-Z]/.test(cat) && !/[áéíóúÁÉÍÓÚ]/.test(cat));
  const spanishCategories = uniqueCategories.filter(cat => /[áéíóúÁÉÍÓÚ]/.test(cat) || cat.includes('Sistema') || cat.includes('Procedimientos') || cat.includes('Reglamentación') || cat.includes('Meteorología') || cat.includes('Navegación') || cat.includes('Motor'));
  
  console.log('English categories:', englishCategories);
  console.log('Spanish categories:', spanishCategories);
  
  // Check if we have matching pairs
  console.log('\n=== Category Pairing Check ===');
  const categoryPairs = {
    'Electrical': 'Sistema Eléctrico',
    'Hydraulics': 'Sistema Hidráulico',
    'Flight Controls': 'Controles de Vuelo',
    'APU': 'Motor y APU',
    'Engines': 'Motores',
    'Fuel': 'Sistema de Combustible',
    'Navigation': 'Navegación',
    'Performance': 'Rendimiento',
    'Emergency Procedures': 'Procedimientos de Emergencia'
  };
  
  Object.keys(categoryPairs).forEach(english => {
    const spanish = categoryPairs[english];
    const englishCount = categoryCount[english] || 0;
    const spanishCount = categoryCount[spanish] || 0;
    console.log(`${english} (${englishCount}) <-> ${spanish} (${spanishCount})`);
  });
}

analyzeFile().catch(console.error);