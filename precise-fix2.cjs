const fs = require('fs');

// Read the file
let content = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');

// Find and remove the duplicated sections
// We need to find the pattern and remove duplicates

// First, find the end of the valid electrical section
let lines = content.split('\n');
let validEndIndex = -1;

// Look for the hydraulic system questions section which marks the end of the electrical section
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('REAL A320 HYDRAULIC SYSTEM QUESTIONS')) {
    validEndIndex = i;
    break;
  }
}

if (validEndIndex !== -1) {
  // Now we need to find where the valid electrical section ends
  // Look backwards from the hydraulic section for the last valid export
  let electricalEndIndex = -1;
  for (let i = validEndIndex - 1; i > 0; i--) {
    if (lines[i].includes('export const allElectricalQuestions: RealAviationQuestion[] = [')) {
      // This should be the last valid export, find its end
      for (let j = i; j < validEndIndex; j++) {
        if (lines[j].trim() === '];') {
          electricalEndIndex = j;
          break;
        }
      }
      break;
    }
  }
  
  if (electricalEndIndex !== -1) {
    // Keep everything up to the end of the valid electrical section
    // and everything from the hydraulic section onward
    let beforeDuplicate = lines.slice(0, electricalEndIndex + 1);
    let afterDuplicate = lines.slice(validEndIndex);
    let fixedLines = [...beforeDuplicate, ...afterDuplicate];
    let fixedContent = fixedLines.join('\n');
    
    // Write back to file
    fs.writeFileSync('./src/data/realAviationQuestions.ts', fixedContent);
    
    console.log('Successfully removed duplicated electrical question sections.');
  } else {
    console.log('Could not find the end of valid electrical section.');
  }
} else {
  console.log('Could not find the hydraulic system questions section.');
}