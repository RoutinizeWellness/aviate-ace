const fs = require('fs');

// Read the cleanAviationQuestions.ts file
const fileContent = fs.readFileSync('./src/data/cleanAviationQuestions.ts', 'utf8');

// Extract category information using regex
const categoryMatches = fileContent.match(/category:\s*["'](.*?)["']/g);

if (categoryMatches) {
  const categories = categoryMatches.map(match => {
    const categoryMatch = match.match(/category:\s*["'](.*?)["']/);
    return categoryMatch ? categoryMatch[1] : null;
  }).filter(Boolean);

  // Get unique categories
  const uniqueCategories = [...new Set(categories)];
  
  console.log('Unique Categories Found:');
  uniqueCategories.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`);
  });
  
  console.log(`\nTotal unique categories: ${uniqueCategories.length}`);
} else {
  console.log('No categories found in the file.');
}