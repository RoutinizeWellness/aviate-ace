// Test the loadAndFilterQuestions function directly
async function testQuestionLoading() {
  try {
    const { loadAndFilterQuestions } = await import('./src/utils/questionLoader');
    
    console.log('Testing question loading for "electrical" category...');
    
    const questions = await loadAndFilterQuestions(
      'practice',
      'electrical',
      'A320_FAMILY',
      'all',
      20
    );
    
    console.log(`Found ${questions.length} questions for electrical category:`);
    questions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.category}: ${q.question.substring(0, 50)}...`);
    });
    
    console.log('\nTesting question loading for "hydraulics" category...');
    
    const hydraulicsQuestions = await loadAndFilterQuestions(
      'practice',
      'hydraulics',
      'A320_FAMILY',
      'all',
      20
    );
    
    console.log(`Found ${hydraulicsQuestions.length} questions for hydraulics category:`);
    hydraulicsQuestions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.category}: ${q.question.substring(0, 50)}...`);
    });
    
    console.log('\nTesting question loading for "aircraft-general" category...');
    
    const generalQuestions = await loadAndFilterQuestions(
      'practice',
      'aircraft-general',
      'A320_FAMILY',
      'all',
      20
    );
    
    console.log(`Found ${generalQuestions.length} questions for aircraft-general category:`);
    generalQuestions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.category}: ${q.question.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('Error testing question loading:', error);
  }
}

testQuestionLoading();