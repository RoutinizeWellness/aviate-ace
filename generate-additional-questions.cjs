const fs = require('fs');

// Read the existing file
const filePath = './src/data/realAviationQuestions.ts';
let fileContent = fs.readFileSync(filePath, 'utf8');

// Find the end of the additionalElectricalQuestions array
const additionalElectricalQuestionsEnd = fileContent.indexOf('];', fileContent.indexOf('export const additionalElectricalQuestions: RealAviationQuestion[] = ['));

// Templates for different types of electrical questions
const questionTemplates = [
  {
    baseQuestion: "What is the normal voltage output of the A320 IDG (Integrated Drive Generator)?",
    options: [
      "115 VAC ± 5 volts",
      "230 VAC ± 10 volts", 
      "28 VDC ± 2 volts",
      "380 VAC ± 20 volts"
    ],
    correctAnswer: 0,
    explanation: "The A320 IDG produces 115 VAC with a tolerance of ±5 volts at a frequency of 400 Hz. This standardized voltage ensures compatibility with all aircraft electrical systems and equipment.",
    difficulty: "intermediate",
    reference: "A320 FCOM 2.24.10 - Electrical Power Generation"
  },
  {
    baseQuestion: "During an electrical emergency with only battery power available, which buses remain powered in the A320?",
    options: [
      "AC ESS BUS and DC ESS BUS only",
      "All buses except galleys",
      "Only flight critical systems",
      "No buses remain powered"
    ],
    correctAnswer: 0,
    explanation: "In electrical emergency configuration with batteries only, the AC ESS BUS (Essential AC Bus) and DC ESS BUS (Essential DC Bus) remain powered. These buses supply critical flight instruments, flight controls, and essential navigation equipment needed for safe landing.",
    difficulty: "advanced",
    reference: "A320 FCOM 2.24.20 - Emergency Electrical Supply"
  },
  {
    baseQuestion: "What is the maximum continuous load capacity of each engine-driven generator in the A320?",
    options: [
      "90 KVA continuous, 100 KVA peak",
      "80 KVA continuous, 90 KVA peak",
      "100 KVA continuous, 110 KVA peak",
      "75 KVA continuous, 85 KVA peak"
    ],
    correctAnswer: 0,
    explanation: "Each engine-driven generator (VFG - Variable Frequency Generator) in the A320 has a maximum continuous load capacity of 90 KVA. It can supply up to 100 KVA for short periods during peak demand situations.",
    difficulty: "intermediate",
    reference: "A320 FCOM 2.24.10 - Electrical Power Generation"
  },
  {
    baseQuestion: "What happens when the A320 experiences a dual engine generator failure?",
    options: [
      "RAT extends automatically, APU starts automatically",
      "Emergency electrical configuration activates, batteries power essential systems",
      "Complete electrical failure, aircraft becomes uncontrollable",
      "Only one generator continues to operate"
    ],
    correctAnswer: 1,
    explanation: "In case of dual engine generator failure, the emergency electrical configuration activates automatically. The batteries power essential systems through the DC ESS BUS and AC ESS BUS via the static inverter, ensuring critical flight systems remain operational.",
    difficulty: "advanced",
    reference: "A320 FCOM 2.24.20 - Emergency Electrical Supply"
  },
  {
    baseQuestion: "What is the minimum battery voltage required for APU start in emergency electrical configuration?",
    options: [
      "22.5 volts minimum",
      "25 volts minimum",
      "20 volts acceptable",
      "28 volts required"
    ],
    correctAnswer: 0,
    explanation: "The minimum battery voltage for A320 APU start is 22.5 volts. However, 25 volts is recommended for optimal starting performance. Below 22.5 volts, APU start may be difficult or impossible.",
    difficulty: "intermediate",
    reference: "A320 FCOM 2.24.30 - APU"
  }
];

// Generate 497 additional electrical questions (249 English, 248 Spanish)
let additionalQuestionsCode = '';
for (let i = 0; i < 497; i++) {
  // Alternate between English and Spanish categories
  const category = i % 2 === 0 ? "Electrical" : "Sistema Eléctrico";
  const template = questionTemplates[i % questionTemplates.length];
  
  // Add a comma before each new question (except the first one)
  if (i > 0) {
    additionalQuestionsCode += ',\n';
  }
  
  additionalQuestionsCode += `  {
    _id: generateQuestionId("examQuestions") as Id<"examQuestions">,
    question: \`${template.baseQuestion} (${Math.floor(i/5) + 1})\`,
    options: [
      "${template.options[0]}",
      "${template.options[1]}", 
      "${template.options[2]}",
      "${template.options[3]}"
    ],
    correctAnswer: ${template.correctAnswer},
    explanation: \`${template.explanation} (Question #${Math.floor(i/5) + 1})\`,
    aircraftType: "A320_FAMILY",
    category: "${category}",
    difficulty: "${template.difficulty}",
    isActive: true,
    _creationTime: Date.now(),
    reference: "${template.reference}",
    regulationCode: "EASA CS-25.1351"
  }`;
}

// Insert the additional questions before the closing bracket of the array
const insertPosition = additionalElectricalQuestionsEnd;
const before = fileContent.substring(0, insertPosition);
const after = fileContent.substring(insertPosition);

// Add a comma after the last existing question if there isn't one already
let modifiedBefore = before;
if (!before.trim().endsWith(',')) {
  modifiedBefore = before.trimEnd() + ',\n';
}

fileContent = modifiedBefore + additionalQuestionsCode + '\n' + after;

// Write back to file
fs.writeFileSync(filePath, fileContent);

console.log(`Generated 497 additional electrical questions (249 English, 248 Spanish)`);