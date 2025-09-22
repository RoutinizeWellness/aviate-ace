const fs = require('fs');

// Read the real questions file
const realQuestionsContent = fs.readFileSync('./src/data/realAviationQuestions.ts', 'utf8');

// Extract all questions with their categories
const questionPattern = /{\s*_id:[^}]*category:\s*["']([^"']*)["'][^}]*}/gs;
const questionMatches = realQuestionsContent.match(questionPattern) || [];

console.log(`Found ${questionMatches.length} questions in the database`);

// Count questions by category
const categoryCount = {};
questionMatches.forEach((questionBlock, index) => {
  const categoryMatch = questionBlock.match(/category:\s*["']([^"']*)["']/);
  if (categoryMatch) {
    const category = categoryMatch[1];
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  }
});

console.log('\nQuestion count by category:');
Object.keys(categoryCount).sort().forEach(category => {
  console.log(`- ${category}: ${categoryCount[category]} questions`);
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

let matchingQuestions = 0;
questionMatches.forEach((questionBlock, index) => {
  const categoryMatch = questionBlock.match(/category:\s*["']([^"']*)["']/);
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
});

console.log(`\nTotal matching questions for 'electrical' category: ${matchingQuestions}`);

// Test with Spanish category directly
console.log('\n--- Testing Spanish category matching directly ---');
let spanishMatchingQuestions = 0;

questionMatches.forEach((questionBlock, index) => {
  const categoryMatch = questionBlock.match(/category:\s*["']([^"']*)["']/);
  if (categoryMatch) {
    const questionCategory = categoryMatch[1];
    if (questionCategory === 'Sistema Eléctrico') {
      console.log(`Found Spanish electrical question: ${questionCategory}`);
      spanishMatchingQuestions++;
    }
    if (questionCategory === 'Electrical') {
      console.log(`Found English electrical question: ${questionCategory}`);
      spanishMatchingQuestions++;
    }
  }
});

console.log(`Total matching questions for electrical categories: ${spanishMatchingQuestions}`);