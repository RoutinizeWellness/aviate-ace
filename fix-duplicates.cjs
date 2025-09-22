const fs = require('fs');

// Read the file
let content = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');

// Split into lines for easier processing
let lines = content.split('\n');

// Find the start and end of the problematic section
let startIndex = -1;
let endIndex = -1;

// Look for the pattern that indicates the start of the problematic area
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('];') && lines[i].includes('correctAnswer: 0') && lines[i].includes('explanation: `The minimum battery voltage')) {
    startIndex = i;
    break;
  }
}

// Look for the pattern that indicates the end of the problematic area
if (startIndex !== -1) {
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes('REAL A320 HYDRAULIC SYSTEM QUESTIONS')) {
      endIndex = i;
      break;
    }
  }
}

// If we found both start and end, remove the problematic section
if (startIndex !== -1 && endIndex !== -1) {
  // Extract the good part before the problem
  let beforeProblem = lines.slice(0, startIndex + 1);
  
  // Extract the good part after the problem
  let afterProblem = lines.slice(endIndex);
  
  // Combine them
  let fixedLines = [...beforeProblem, ...afterProblem];
  
  // Join back into a string
  let fixedContent = fixedLines.join('\n');
  
  // Write back to file
  fs.writeFileSync('./src/data/realAviationQuestions.ts', fixedContent);
  
  console.log('Successfully fixed the syntax error by removing duplicated code blocks.');
} else {
  console.log('Could not locate the exact problematic section. Manual fix may be required.');
}