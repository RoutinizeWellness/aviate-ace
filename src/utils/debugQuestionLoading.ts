import { FreeTrialManager } from '@/services/FreeTrialManager';
import { OptimizedQuestionLoader } from '@/services/OptimizedQuestionLoader';

export const debugQuestionLoading = async (userId?: string) => {
  console.log('=== FREE TRIAL DEBUG ===');
  
  // Check free trial state
  const trialState = FreeTrialManager.getFreeTrialState(userId);
  console.log('Trial State:', trialState);
  
  const selectedAircraft = FreeTrialManager.getSelectedAircraft(userId);
  console.log('Selected Aircraft:', selectedAircraft);
  
  const availableSubjects = FreeTrialManager.getAvailableSubjects(userId);
  console.log('Available Subjects:', availableSubjects);
  
  if (selectedAircraft && availableSubjects.length > 0) {
    console.log('Attempting to load questions with:');
    const config = {
      mode: 'practice',
      category: availableSubjects.join(','),
      aircraft: selectedAircraft,
      difficulty: '',
      questionCount: 25
    };
    console.log('Load Config:', config);
    
    try {
      const questions = await OptimizedQuestionLoader.loadQuestions(config);
      console.log('Successfully loaded questions:', questions.length);
      console.log('Sample questions:', questions.slice(0, 3).map(q => ({
        id: q._id,
        question: q.question?.substring(0, 50) + '...',
        category: q.category,
        aircraft: q.aircraftType
      })));
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  }
  
  console.log('=== END DEBUG ===');
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).debugQuestionLoading = debugQuestionLoading;
}