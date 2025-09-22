const fs = require('fs');

// Read the real questions file
const realQuestionsContent = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');

// Extract all category values
const categoryMatches = realQuestionsContent.match(/category:\s*["'][^"']*["']/g);
const categories = {};

if (categoryMatches) {
  categoryMatches.forEach(match => {
    const category = match.match(/["']([^"']*)["']/)[1];
    categories[category] = (categories[category] || 0) + 1;
  });
}

console.log('Actual categories in the question database:');
Object.keys(categories).sort().forEach(category => {
  console.log(`- ${category}: ${categories[category]} questions`);
});

// Simulate the category matching logic from questionLoader.ts
const categoryMap = {
  'electrical': [
    'Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems',
    'Aircraft Electrical', 'Power Distribution'
  ]
};

console.log('\n--- Testing electrical category matching ---');
const targetCategories = categoryMap['electrical'] || ['electrical'];
console.log('Target categories for electrical:', targetCategories);

// Find matching questions
let matchingQuestions = 0;
const questionBlocks = realQuestionsContent.split('category:');

// Skip first element as it's before the first category
for (let i = 1; i < questionBlocks.length; i++) {
  const block = questionBlocks[i];
  const categoryMatch = block.match(/^["']([^"']*)["']/);
  if (categoryMatch) {
    const questionCategory = categoryMatch[1];
    
    // Normalize the question category for better matching
    const normalizedQuestionCategory = questionCategory
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    // Check if question category matches any target category (case insensitive partial match)
    const matchesCategory = targetCategories.some(targetCat => {
      const normalizedTargetCat = targetCat
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();
        
      // Direct match
      if (normalizedQuestionCategory === normalizedTargetCat) {
        console.log(`Direct match: "${questionCategory}" matches "${targetCat}"`);
        return true;
      }
      
      // Partial match (contains)
      if (normalizedQuestionCategory.includes(normalizedTargetCat) || 
          normalizedTargetCat.includes(normalizedQuestionCategory)) {
        console.log(`Partial match: "${questionCategory}" contains/contained by "${targetCat}"`);
        return true;
      }
      
      // Word-by-word match for better multilingual detection
      const questionWords = normalizedQuestionCategory.split(' ');
      const targetWords = normalizedTargetCat.split(' ');
      
      const wordMatch = questionWords.some(qWord => 
        targetWords.some(tWord => 
          qWord.includes(tWord) || tWord.includes(qWord)
        )
      );
      
      if (wordMatch) {
        console.log(`Word match: "${questionCategory}" word matches "${targetCat}"`);
        return true;
      }
      
      return false;
    });
    
    if (matchesCategory) {
      matchingQuestions++;
    }
  }
}

console.log(`\nTotal matching questions for 'electrical' category: ${matchingQuestions}`);

// Test with Spanish category
console.log('\n--- Testing Spanish category matching ---');
const spanishTargetCategories = ['Sistema Eléctrico'];
let spanishMatchingQuestions = 0;

for (let i = 1; i < questionBlocks.length; i++) {
  const block = questionBlocks[i];
  const categoryMatch = block.match(/^["']([^"']*)["']/);
  if (categoryMatch) {
    const questionCategory = categoryMatch[1];
    
    // Normalize the question category for better matching
    const normalizedQuestionCategory = questionCategory
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    // Check if question category matches Spanish target
    const matchesCategory = spanishTargetCategories.some(targetCat => {
      const normalizedTargetCat = targetCat
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();
        
      // Direct match
      if (normalizedQuestionCategory === normalizedTargetCat) {
        console.log(`Spanish direct match: "${questionCategory}" matches "${targetCat}"`);
        return true;
      }
      
      return false;
    });
    
    if (matchesCategory) {
      spanishMatchingQuestions++;
    }
  }
}

console.log(`Total matching questions for 'Sistema Eléctrico' category: ${spanishMatchingQuestions}`);