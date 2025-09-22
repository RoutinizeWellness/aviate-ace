const fs = require('fs');

// Read the file content
const content = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');

// Count occurrences of categories and aircraft types
const categoryMatches = content.match(/category:\s*["'](.*?)["']/g) || [];
const aircraftMatches = content.match(/aircraftType:\s*["'](.*?)["']/g) || [];

// Extract values
const categories = categoryMatches.map(match => match.split('"')[1] || match.split("'")[1]);
const aircraftTypes = aircraftMatches.map(match => match.split('"')[1] || match.split("'")[1]);

// Get unique values
const uniqueCategories = [...new Set(categories)];
const uniqueAircraftTypes = [...new Set(aircraftTypes)];

console.log('Total questions (approx):', categoryMatches.length);
console.log('Unique categories:', uniqueCategories.sort());
console.log('Unique aircraft types:', uniqueAircraftTypes);

// Count by category
const categoryCount = {};
categories.forEach(category => {
  categoryCount[category] = (categoryCount[category] || 0) + 1;
});

console.log('\nQuestions by category (approx):');
Object.keys(categoryCount).sort().forEach(category => {
  console.log(`${category}: ${categoryCount[category]} questions`);
});