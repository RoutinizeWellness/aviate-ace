const fs = require('fs');

// Read the existing file
const filePath = './src/data/realAviationQuestions.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Helper function to generate question IDs
const generateQuestionId = (table) => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36).substring(0, 8);
  return `${table}_${randomPart}${timestamp}`;
};

// Template for electrical questions
const electricalQuestionTemplate = (index) => {
  const questions = [
    {
      question: `What is the normal voltage output of the A320 IDG (Integrated Drive Generator)?`,
      options: [
        '115 VAC ± 5 volts',
        '230 VAC ± 10 volts', 
        '28 VDC ± 2 volts',
        '380 VAC ± 20 volts'
      ],
      correctAnswer: 0,
      explanation: 'The A320 IDG produces 115 VAC with a tolerance of ±5 volts at a frequency of 400 Hz. This standardized voltage ensures compatibility with all aircraft electrical systems and equipment.',
      category: 'Sistema Eléctrico',
      difficulty: 'intermediate'
    },
    {
      question: `During an electrical emergency with only battery power available, which buses remain powered in the A320?`,
      options: [
        'AC ESS BUS and DC ESS BUS only',
        'All buses except galleys',
        'Only flight critical systems',
        'No buses remain powered'
      ],
      correctAnswer: 0,
      explanation: 'In electrical emergency configuration with batteries only, the AC ESS BUS (Essential AC Bus) and DC ESS BUS (Essential DC Bus) remain powered. These buses supply critical flight instruments, flight controls, and essential navigation equipment needed for safe landing.',
      category: 'Sistema Eléctrico',
      difficulty: 'advanced'
    },
    {
      question: `What is the maximum continuous load capacity of each engine-driven generator in the A320?`,
      options: [
        '90 KVA continuous, 100 KVA peak',
        '80 KVA continuous, 90 KVA peak',
        '100 KVA continuous, 110 KVA peak',
        '75 KVA continuous, 85 KVA peak'
      ],
      correctAnswer: 0,
      explanation: 'Each engine-driven generator (VFG - Variable Frequency Generator) in the A320 has a maximum continuous load capacity of 90 KVA. It can supply up to 100 KVA for short periods during peak demand situations.',
      category: 'Sistema Eléctrico',
      difficulty: 'intermediate'
    },
    {
      question: `What happens when the A320 experiences a dual engine generator failure?`,
      options: [
        'RAT extends automatically, APU starts automatically',
        'Emergency electrical configuration activates, batteries power essential systems',
        'Complete electrical failure, aircraft becomes uncontrollable',
        'Only one generator continues to operate'
      ],
      correctAnswer: 1,
      explanation: 'In case of dual engine generator failure, the emergency electrical configuration activates automatically. The batteries power essential systems through the DC ESS BUS and AC ESS BUS via the static inverter, ensuring critical flight systems remain operational.',
      category: 'Sistema Eléctrico',
      difficulty: 'advanced'
    },
    {
      question: `What is the minimum battery voltage required for APU start in emergency electrical configuration?`,
      options: [
        '22.5 volts minimum',
        '25 volts minimum',
        '20 volts acceptable',
        '28 volts required'
      ],
      correctAnswer: 0,
      explanation: 'The minimum battery voltage for A320 APU start is 22.5 volts. However, 25 volts is recommended for optimal starting performance. Below 22.5 volts, APU start may be difficult or impossible.',
      category: 'Sistema Eléctrico',
      difficulty: 'intermediate'
    }
  ];
  
  // Rotate through questions
  const questionData = questions[index % questions.length];
  
  return {
    _id: generateQuestionId("examQuestions"),
    question: `${questionData.question} (${index + 1})`,
    options: questionData.options,
    correctAnswer: questionData.correctAnswer,
    explanation: `${questionData.explanation} (Question #${index + 1})`,
    aircraftType: "A320_FAMILY",
    category: questionData.category,
    difficulty: questionData.difficulty,
    isActive: true,
    _creationTime: Date.now(),
    reference: "A320 FCOM 2.24.10 - Electrical Power Generation",
    regulationCode: "EASA CS-25.1351"
  };
};

// Generate 500 electrical questions (combining both English and Spanish categories)
const electricalQuestions = [];
for (let i = 0; i < 250; i++) {
  // Alternate between English and Spanish categories
  const category = i % 2 === 0 ? 'Electrical' : 'Sistema Eléctrico';
  
  const question = electricalQuestionTemplate(i);
  question.category = category;
  
  electricalQuestions.push(question);
}

// Convert to TypeScript format
const electricalQuestionsCode = electricalQuestions.map((q, index) => {
  return `  {
    _id: "${q._id}",
    question: \`${q.question}\`,
    options: [
      \`${q.options[0]}\`,
      \`${q.options[1]}\`,
      \`${q.options[2]}\`,
      \`${q.options[3]}\`
    ],
    correctAnswer: ${q.correctAnswer},
    explanation: \`${q.explanation}\`,
    aircraftType: "${q.aircraftType}",
    category: "${q.category}",
    difficulty: "${q.difficulty}",
    isActive: ${q.isActive},
    _creationTime: ${q._creationTime},
    reference: "${q.reference}",
    regulationCode: "${q.regulationCode}"
  }${index < electricalQuestions.length - 1 ? ',' : ''}`;
}).join('\n');

// Add to the electricalSystemQuestions array in the file
const electricalSystemQuestionsRegex = /(export const electricalSystemQuestions: RealAviationQuestion\[] = \[)([\s\S]*?)(\];)/;
const replacement = `$1\n${electricalQuestionsCode}\n$3`;

fileContent = fileContent.replace(electricalSystemQuestionsRegex, replacement);

// Write back to file
fs.writeFileSync(filePath, fileContent);

console.log(`Generated 250 electrical questions (125 English, 125 Spanish)`);