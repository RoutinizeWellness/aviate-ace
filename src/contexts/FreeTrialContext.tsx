import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useConvexAuth';
import { useLanguage } from './LanguageContext';

interface FreeTrialContextType {
  remainingQuestions: number;
  totalFreeQuestions: number;
  isTrialExpired: boolean;
  useQuestion: () => boolean;
  resetTrial: () => void;
  checkTrialStatus: () => boolean;
}

const FreeTrialContext = createContext<FreeTrialContextType | undefined>(undefined);

const TOTAL_FREE_QUESTIONS = 5;
const TRIAL_STORAGE_KEY = 'freeTrialQuestions';

export const FreeTrialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [remainingQuestions, setRemainingQuestions] = useState(TOTAL_FREE_QUESTIONS);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  // Load trial state from localStorage when component mounts or user changes
  useEffect(() => {
    loadTrialState();
  }, [user]);

  const getStorageKey = () => {
    if (user) {
      return `${TRIAL_STORAGE_KEY}_${user._id}`;
    }
    return `${TRIAL_STORAGE_KEY}_guest`;
  };

  const loadTrialState = () => {
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const trialData = JSON.parse(stored);
        const questionsUsed = trialData.questionsUsed || 0;
        const remaining = Math.max(0, TOTAL_FREE_QUESTIONS - questionsUsed);
        
        setRemainingQuestions(remaining);
        setIsTrialExpired(remaining === 0);
      } else {
        // First time user
        setRemainingQuestions(TOTAL_FREE_QUESTIONS);
        setIsTrialExpired(false);
      }
    } catch (error) {
      console.error('Error loading trial state:', error);
      setRemainingQuestions(TOTAL_FREE_QUESTIONS);
      setIsTrialExpired(false);
    }
  };

  const saveTrialState = (questionsUsed: number) => {
    try {
      const storageKey = getStorageKey();
      const trialData = {
        questionsUsed,
        lastUsed: Date.now(),
        userId: user?._id || 'guest'
      };
      localStorage.setItem(storageKey, JSON.stringify(trialData));
    } catch (error) {
      console.error('Error saving trial state:', error);
    }
  };

  const useQuestion = (): boolean => {
    if (isTrialExpired || remainingQuestions <= 0) {
      return false;
    }

    const newRemaining = remainingQuestions - 1;
    const questionsUsed = TOTAL_FREE_QUESTIONS - newRemaining;
    
    setRemainingQuestions(newRemaining);
    saveTrialState(questionsUsed);
    
    if (newRemaining === 0) {
      setIsTrialExpired(true);
      // Redirect to subscription page after a short delay
      setTimeout(() => {
        window.location.href = '/subscription-management';
      }, 2000);
    }
    
    return true;
  };

  const resetTrial = () => {
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      setRemainingQuestions(TOTAL_FREE_QUESTIONS);
      setIsTrialExpired(false);
    } catch (error) {
      console.error('Error resetting trial:', error);
    }
  };

  const checkTrialStatus = (): boolean => {
    return !isTrialExpired && remainingQuestions > 0;
  };

  return (
    <FreeTrialContext.Provider value={{
      remainingQuestions,
      totalFreeQuestions: TOTAL_FREE_QUESTIONS,
      isTrialExpired,
      useQuestion,
      resetTrial,
      checkTrialStatus
    }}>
      {children}
    </FreeTrialContext.Provider>
  );
};

export const useFreeTrial = () => {
  const context = useContext(FreeTrialContext);
  if (!context) {
    throw new Error('useFreeTrial must be used within a FreeTrialProvider');
  }
  return context;
};