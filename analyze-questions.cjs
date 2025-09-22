const { allRealAviationQuestions } = require('./src/data/realAviationQuestions.ts');

console.log('Total questions:', allRealAviationQuestions.length);

// Get unique categories
const categories = [...new Set(allRealAviationQuestions.map(q => q.category))];
console.log('Categories:', categories.sort());

// Get unique aircraft types
const aircraftTypes = [...new Set(allRealAviationQuestions.map(q => q.aircraftType))];
console.log('Aircraft Types:', aircraftTypes);

// Count questions by category and aircraft type
const categoryAircraftCount = {};
allRealAviationQuestions.forEach(q => {
  const key = `${q.category}||${q.aircraftType}`;
  if (!categoryAircraftCount[key]) {
    categoryAircraftCount[key] = 0;
  }
  categoryAircraftCount[key]++;
});

console.log('\nQuestions by Category and Aircraft Type:');
Object.keys(categoryAircraftCount).sort().forEach(key => {
  const [category, aircraftType] = key.split('||');
  console.log(`${category} (${aircraftType}): ${categoryAircraftCount[key]} questions`);
});