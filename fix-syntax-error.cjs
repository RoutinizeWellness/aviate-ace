const fs = require('fs');
const readline = require('readline');

async function fixSyntaxError() {
  console.log('Starting syntax error fix...');
  
  const fileStream = fs.createReadStream('./src/data/realAviationQuestions.ts');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let outputLines = [];
  let inErrorSection = false;
  let lineCount = 0;
  let skipLines = 0;

  for await (const line of rl) {
    lineCount++;
    
    // Skip lines if we're in an error section
    if (skipLines > 0) {
      skipLines--;
      continue;
    }
    
    // Detect the start of the problematic section
    if (line.includes('];') && line.includes('correctAnswer: 0') && line.includes('explanation: `The minimum battery voltage')) {
      // This is the end of a duplicated section, skip the next duplicate parts
      inErrorSection = true;
      outputLines.push(line);
      continue;
    }
    
    // If we're in an error section, look for the end marker
    if (inErrorSection) {
      // Look for the next valid section start
      if (line.includes('/**') && line.includes('REAL A320 HYDRAULIC SYSTEM QUESTIONS')) {
        inErrorSection = false;
        outputLines.push(line);
        continue;
      }
      
      // Skip duplicate function and variable declarations
      if (line.includes('function generateElectricalQuestions') || 
          line.includes('const extraElectricalQuestions') ||
          line.includes('export const allElectricalQuestions') ||
          line.includes('const additionalElectricalQuestions')) {
        // Skip this line and potentially the next few lines
        if (line.includes('function generateElectricalQuestions')) {
          skipLines = 50; // Skip the entire function block
        }
        continue;
      }
      
      // Skip incomplete lines
      if (line.trim() === '];' || line.includes('question: `${template.baseQuestion}')) {
        continue;
      }
      
      continue;
    }
    
    outputLines.push(line);
  }

  console.log(`Processed ${lineCount} lines.`);
  
  // Write the updated content back to the file
  console.log('Writing fixed file...');
  fs.writeFileSync('./src/data/realAviationQuestions.ts', outputLines.join('\n'));
  
  console.log('Syntax error fix complete!');
}

fixSyntaxError().catch(console.error);