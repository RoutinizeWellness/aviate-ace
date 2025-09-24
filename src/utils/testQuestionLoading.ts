/**
 * Utility to test question loading in development
 */
export async function testQuestionLoading() {
  console.log('🧪 Testing question loading...');

  try {
    // Test loading all questions
    const { allAviationQuestions } = await import("@/data/cleanAviationQuestions");
    const { getAllMassiveQuestions } = await import("@/data/massiveQuestionSeeding");
    
    console.log('📊 Question Database Stats:');
    console.log(`- Clean Aviation Questions: ${allAviationQuestions.length}`);
    console.log(`- Massive Questions: ${getAllMassiveQuestions().length}`);
    
    // Combine all questions
    const allQuestions = [
      ...allAviationQuestions,
      ...getAllMassiveQuestions()
    ];
    
    console.log(`- Total Combined: ${allQuestions.length}`);
    
    // Analyze by aircraft type
    const aircraftStats = allQuestions.reduce((acc, q) => {
      const type = q.aircraftType || 'UNKNOWN';
      if (!acc[type]) {
        acc[type] = { count: 0, categories: new Set() };
      }
      acc[type].count++;
      acc[type].categories.add(q.category);
      return acc;
    }, {} as any);
    
    console.log('✈️ Aircraft Type Breakdown:');
    Object.entries(aircraftStats).forEach(([type, stats]: [string, any]) => {
      console.log(`- ${type}: ${stats.count} questions`);
      console.log(`  Categories: ${Array.from(stats.categories).join(', ')}`);
    });
    
    // Test filtering
    const { QuestionFilterService } = await import('@/services/QuestionFilterService');
    
    // Test A320 filtering
    const a320Filter = new QuestionFilterService(allQuestions);
    const a320Questions = a320Filter.filterQuestions({
      mode: 'practice',
      categories: ['aircraft-general'],
      aircraft: 'A320_FAMILY',
      difficulty: 'all',
      questionCount: 20
    });
    
    console.log(`🔍 A320 Filter Test: ${a320Questions.length} questions found`);
    if (a320Questions.length > 0) {
      console.log('Sample A320 question:', a320Questions[0].question.substring(0, 50) + '...');
    }
    
    // Test B737 filtering
    const b737Filter = new QuestionFilterService(allQuestions);
    const b737Questions = b737Filter.filterQuestions({
      mode: 'practice',
      categories: ['aircraft-general'],
      aircraft: 'B737_FAMILY',
      difficulty: 'all',
      questionCount: 20
    });
    
    console.log(`🔍 B737 Filter Test: ${b737Questions.length} questions found`);
    if (b737Questions.length > 0) {
      console.log('Sample B737 question:', b737Questions[0].question.substring(0, 50) + '...');
    }
    
    // Test with no category filter
    const noCategoryFilter = new QuestionFilterService(allQuestions);
    const noCategoryQuestions = noCategoryFilter.filterQuestions({
      mode: 'practice',
      categories: [],
      aircraft: 'B737_FAMILY',
      difficulty: 'all',
      questionCount: 20
    });
    
    console.log(`🔍 B737 No Category Filter Test: ${noCategoryQuestions.length} questions found`);
    
    return {
      success: true,
      stats: {
        total: allQuestions.length,
        a320: a320Questions.length,
        b737: b737Questions.length,
        b737NoCategory: noCategoryQuestions.length
      }
    };
    
  } catch (error) {
    console.error('❌ Question loading test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Auto-run in development
if (import.meta.env.DEV) {
  // Run test after a short delay to ensure modules are loaded
  setTimeout(() => {
    testQuestionLoading();
  }, 1000);
}