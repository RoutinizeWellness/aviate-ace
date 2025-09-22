const fs = require('fs');

// Categories for A320_FAMILY
const a320Categories = [
  'APU',
  'Air Bleed/Cond/Press/Vent',
  'Aircraft Systems',
  'Approach Procedures',
  'Autoflight',
  'Electrical',
  'Emergency Procedures',
  'Engines',
  'Environment Limits',
  'Fire Protection',
  'Flight Controls',
  'Flight Protection',
  'Fuel',
  'GPWS',
  'Hydraulics',
  'Landing Gear',
  'Load Acceleration Limits',
  'Meteorología',
  'Motor y APU',
  'Navegación',
  'Oxygen',
  'Performance',
  'Procedimientos de Despegue',
  'Reglamentación',
  'Sistema Eléctrico',
  'Sistema Hidráulico',
  'Speed Limits',
  'Weight Limits'
];

// Function to generate a unique ID
const generateQuestionId = () => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36).substring(0, 8);
  return `examQuestions_${randomPart}${timestamp}`;
};

// Function to generate a question
const generateQuestion = (category, index, aircraftType) => {
  return {
    _id: generateQuestionId(),
    question: `What is the correct procedure for ${category} operation in ${aircraftType}? (${index})`,
    options: [
      `Follow the standard ${category} checklist from the FCOM`,
      `Consult the QRH for ${category} emergency procedures`,
      `Refer to the FCTM for best practices in ${category}`,
      `Contact maintenance for ${category} system issues`
    ],
    correctAnswer: Math.floor(Math.random() * 4),
    explanation: `This is a sample question about ${category} in ${aircraftType}. In real scenarios, pilots should always refer to the official Flight Crew Operating Manual (FCOM) and Quick Reference Handbook (QRH) for accurate procedures. (${index})`,
    aircraftType: aircraftType,
    category: category,
    difficulty: ['easy', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
    isActive: true,
    _creationTime: Date.now(),
    reference: `${aircraftType} FCOM - ${category} Procedures`
  };
};

// Generate questions for each category
let allQuestions = [];

a320Categories.forEach(category => {
  // Generate 500 questions for each category
  for (let i = 1; i <= 500; i++) {
    allQuestions.push(generateQuestion(category, i, 'A320_FAMILY'));
  }
});

// Convert to JavaScript format
let output = '';
allQuestions.forEach((q, index) => {
  output += `  {
    _id: "${q._id}",
    question: \`${q.question}\`,
    options: [
      "${q.options[0]}",
      "${q.options[1]}",
      "${q.options[2]}",
      "${q.options[3]}"
    ],
    correctAnswer: ${q.correctAnswer},
    explanation: \`${q.explanation}\`,
    aircraftType: "${q.aircraftType}",
    category: "${q.category}",
    difficulty: "${q.difficulty}",
    isActive: ${q.isActive},
    _creationTime: ${q._creationTime},
    reference: "${q.reference}"
  }${index < allQuestions.length - 1 ? ',' : ''}
`;
});

// Write to file
const fileName = 'generated-a320-questions.cjs';
fs.writeFileSync(fileName, `// Generated A320_FAMILY questions - 500 per category
const generatedA320Questions = [
${output}
];

module.exports = { generatedA320Questions };
`);

console.log(`Generated ${allQuestions.length} questions for A320_FAMILY across ${a320Categories.length} categories`);
console.log(`Questions saved to ${fileName}`);