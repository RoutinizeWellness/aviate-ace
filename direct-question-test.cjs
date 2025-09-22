// Simple test to verify question loading is working
const fs = require('fs');

// Read the realAviationQuestions file and extract categories
const fileContent = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');
const categoryRegex = /category:\s*["'](.*?)["']/g;
const categories = [];
let match;
while ((match = categoryRegex.exec(fileContent)) !== null) {
  categories.push(match[1]);
}

// Get unique categories and count
const uniqueCategories = [...new Set(categories)];
const categoryCounts = {};
categories.forEach(cat => {
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

console.log('=== Question Database Summary ===');
console.log(`Total questions: ${categories.length}`);
console.log(`Unique categories: ${uniqueCategories.length}`);

// Show categories with Spanish names
console.log('\n=== Spanish Categories ===');
const spanishCategories = uniqueCategories.filter(cat => cat.includes('Sistema') || cat.includes('Procedimientos') || cat.includes('Meteorología') || cat.includes('Reglamentación') || cat.includes('Navegación'));
spanishCategories.forEach(cat => console.log(`- ${cat} (${categoryCounts[cat]} questions)`));

// Show categories with English names
console.log('\n=== English Categories ===');
const englishCategories = uniqueCategories.filter(cat => !spanishCategories.includes(cat));
englishCategories.forEach(cat => console.log(`- ${cat} (${categoryCounts[cat]} questions)`));

console.log('\n=== Testing Category Mapping ===');
// Test the category mapping for "electrical"
const electricalCategories = ['Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems', 'Aircraft Electrical', 'Power Distribution'];
console.log('Looking for electrical categories:', electricalCategories);

const foundElectrical = uniqueCategories.filter(cat => 
  electricalCategories.includes(cat)
);
console.log('Found electrical categories:', foundElectrical);
foundElectrical.forEach(cat => console.log(`- ${cat} (${categoryCounts[cat]} questions)`));

// Test the category mapping for "hydraulics"
const hydraulicsCategories = ['Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power', 'Aircraft Hydraulics', 'Hydraulic Actuation'];
console.log('\nLooking for hydraulics categories:', hydraulicsCategories);

const foundHydraulics = uniqueCategories.filter(cat => 
  hydraulicsCategories.includes(cat)
);
console.log('Found hydraulics categories:', foundHydraulics);
foundHydraulics.forEach(cat => console.log(`- ${cat} (${categoryCounts[cat]} questions)`));