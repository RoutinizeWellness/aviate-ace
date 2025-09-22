const fs = require('fs');

// Read the file
let content = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');

// Split into lines
let lines = content.split('\n');

// Fix the specific syntax error around line 9685
// We need to remove the incomplete section and ensure proper closure

// Find the problematic area
let problemStart = -1;
for (let i = 9680; i < 9700; i++) {
  if (lines[i].includes('];') && lines[i].includes('correctAnswer: 0')) {
    problemStart = i;
    break;
  }
}

if (problemStart !== -1) {
  // Look for where the proper section should continue
  let continuePoint = -1;
  for (let i = problemStart + 10; i < problemStart + 100; i++) {
    if (lines[i] && lines[i].includes('/**') && lines[i].includes('REAL A320 HYDRAULIC SYSTEM QUESTIONS')) {
      continuePoint = i;
      break;
    }
  }
  
  if (continuePoint !== -1) {
    // Remove the problematic lines and keep the rest
    let beforeProblem = lines.slice(0, 9681); // Keep up to the first }
    let afterProblem = lines.slice(continuePoint); // Keep from the hydraulic section onward
    let fixedLines = [...beforeProblem, ...afterProblem];
    let fixedContent = fixedLines.join('\n');
    
    // Write back to file
    fs.writeFileSync('./src/data/realAviationQuestions.ts', fixedContent);
    
    console.log('Successfully fixed the syntax error around line 9685.');
  } else {
    console.log('Could not find continuation point. Manual fix required.');
  }
} else {
  console.log('Could not locate the problem start. Manual fix required.');
}