const fs = require('fs');
const readline = require('readline');

// Category mapping - standardize to English categories
const categoryMapping = {
  // Spanish to English mappings
  'Sistema Eléctrico': 'Electrical',
  'Sistema Hidráulico': 'Hydraulics',
  'Controles de Vuelo': 'Flight Controls',
  'Motor y APU': 'APU',
  'Motores': 'Engines',
  'Sistema de Combustible': 'Fuel',
  'Navegación': 'Navigation',
  'Rendimiento': 'Performance',
  'Procedimientos de Emergencia': 'Emergency Procedures',
  'Procedimientos de Despegue': 'Takeoff Procedures',
  'Reglamentación': 'Regulations',
  'Meteorología': 'Meteorology'
};

async function standardizeCategories() {
  console.log('Starting category standardization...');
  
  const fileStream = fs.createReadStream('./src/data/realAviationQuestions.ts');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let outputLines = [];
  let lineCount = 0;
  let replacementsMade = 0;

  for await (const line of rl) {
    lineCount++;
    
    // Check if this line contains a category that needs to be mapped
    let modifiedLine = line;
    for (const [spanish, english] of Object.entries(categoryMapping)) {
      if (line.includes(`category: "${spanish}"`) || line.includes(`category: '${spanish}'`)) {
        modifiedLine = line.replace(spanish, english);
        replacementsMade++;
        break;
      }
    }
    
    outputLines.push(modifiedLine);
    
    // Print progress every 100,000 lines
    if (lineCount % 100000 === 0) {
      console.log(`Processed ${lineCount} lines, made ${replacementsMade} replacements...`);
    }
  }

  console.log(`\nFinished processing. Made ${replacementsMade} category replacements.`);
  
  // Write the updated content back to the file
  console.log('Writing updated file...');
  fs.writeFileSync('./src/data/realAviationQuestions.ts', outputLines.join('\n'));
  
  console.log('Category standardization complete!');
  
  // Show summary of changes
  console.log('\n=== Category Mapping Summary ===');
  Object.entries(categoryMapping).forEach(([spanish, english]) => {
    console.log(`${spanish} -> ${english}`);
  });
}

standardizeCategories().catch(console.error);