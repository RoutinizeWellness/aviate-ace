import { loadAndFilterQuestions } from './questionLoader';
import { allRealAviationQuestions } from '@/data/realAviationQuestions';

/**
 * Test function to verify question detection and filtering works correctly
 */
export const testQuestionDetection = async () => {
  console.log('Testing question detection...');
  
  try {
    // Test 1: Load questions with specific category
    console.log('\n--- Test 1: Loading questions by category ---');
    const electricalQuestions = await loadAndFilterQuestions(
      'practice',
      'electrical',
      'A320_FAMILY',
      'all',
      5
    );
    console.log('Electrical questions found:', electricalQuestions.length);
    
    // Test 2: Load questions with different category
    console.log('\n--- Test 2: Loading navigation questions ---');
    const navigationQuestions = await loadAndFilterQuestions(
      'practice',
      'navigation',
      'A320_FAMILY',
      'all',
      5
    );
    console.log('Navigation questions found:', navigationQuestions.length);
    
    // Test 3: Load questions with 'all' category
    console.log('\n--- Test 3: Loading all questions ---');
    const allQuestions = await loadAndFilterQuestions(
      'practice',
      'all',
      'A320_FAMILY',
      'all',
      10
    );
    console.log('All questions found:', allQuestions.length);
    
    // Test 4: Load questions with specific difficulty
    console.log('\n--- Test 4: Loading advanced questions ---');
    const advancedQuestions = await loadAndFilterQuestions(
      'practice',
      'all',
      'A320_FAMILY',
      'advanced',
      5
    );
    console.log('Advanced questions found:', advancedQuestions.length);
    
    // Test 5: Load questions with relaxed filters
    console.log('\n--- Test 5: Loading questions with relaxed filters ---');
    const relaxedQuestions = await loadAndFilterQuestions(
      'practice',
      'aircraft-general',
      'ALL',
      'all',
      5
    );
    console.log('Relaxed filter questions found:', relaxedQuestions.length);
    
    console.log('\n--- Summary ---');
    console.log('Total questions in database:', allRealAviationQuestions.length);
    console.log('Question detection tests completed successfully!');
    
    return {
      electrical: electricalQuestions.length,
      navigation: navigationQuestions.length,
      all: allQuestions.length,
      advanced: advancedQuestions.length,
      relaxed: relaxedQuestions.length,
      total: allRealAviationQuestions.length
    };
  } catch (error) {
    console.error('Error in question detection test:', error);
    throw error;
  }
};

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testQuestionDetection().then(results => {
    console.log('Test results:', results);
  }).catch(error => {
    console.error('Test failed:', error);
  });
}