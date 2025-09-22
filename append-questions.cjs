const fs = require('fs');

// Load generated questions
const { generatedA320Questions } = require('./generated-a320-questions.cjs');
const { generatedB737Questions } = require('./generated-b737-questions.cjs');

console.log(`Loaded ${generatedA320Questions.length} A320 questions`);
console.log(`Loaded ${generatedB737Questions.length} B737 questions`);

// Convert questions to TypeScript format
function convertToTSFormat(questions, arrayName) {
  let output = `\n// Generated questions for ${arrayName}\n`;
  output += `export const ${arrayName}: RealAviationQuestion[] = [\n`;
  
  questions.forEach((q, index) => {
    output += `  {\n`;
    output += `    _id: "${q._id}" as Id<"examQuestions">,\n`;
    output += `    question: \`${q.question}\`,\n`;
    output += `    options: [\n`;
    q.options.forEach(option => {
      output += `      "${option}",\n`;
    });
    output += `    ],\n`;
    output += `    correctAnswer: ${q.correctAnswer},\n`;
    output += `    explanation: \`${q.explanation}\`,\n`;
    output += `    aircraftType: "${q.aircraftType}",\n`;
    output += `    category: "${q.category}",\n`;
    output += `    difficulty: "${q.difficulty}",\n`;
    output += `    isActive: ${q.isActive},\n`;
    output += `    _creationTime: ${q._creationTime},\n`;
    output += `    reference: "${q.reference}"\n`;
    output += `  }${index < questions.length - 1 ? ',' : ''}\n`;
  });
  
  output += `];\n`;
  return output;
}

// Convert both sets of questions
const a320TS = convertToTSFormat(generatedA320Questions, 'generatedA320Questions');
const b737TS = convertToTSFormat(generatedB737Questions, 'generatedB737Questions');

// Read the current file
const filePath = './src/data/realAviationQuestions.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Find the position to insert the new arrays (before the export statement)
const exportPosition = fileContent.lastIndexOf('// Export all questions combined');
const insertPosition = fileContent.lastIndexOf('\n', exportPosition - 1);

// Insert the new arrays
const newContent = fileContent.slice(0, insertPosition) + 
                  a320TS + 
                  b737TS + 
                  fileContent.slice(insertPosition);

// Find the position to add the new arrays to the export list
const exportListPosition = newContent.indexOf('export const allRealAviationQuestions: RealAviationQuestion[] = [');
const exportListEndPosition = newContent.indexOf('];', exportListPosition);

// Add the new arrays to the export list
const updatedContent = newContent.slice(0, exportListEndPosition) + 
                      ',\n  ...generatedA320Questions,\n  ...generatedB737Questions' + 
                      newContent.slice(exportListEndPosition);

// Write the updated content back to the file
fs.writeFileSync(filePath, updatedContent);

console.log('Successfully appended generated questions to realAviationQuestions.ts');