import { toast } from '@/hooks/use-toast';

export interface FreeTrialState {
  hasUsedTrial: boolean;
  questionsUsed: number;
  maxQuestions: number;
  isTrialExpired: boolean;
  startDate?: string;
  selectedAircraft?: 'A320' | 'B737';
  completedExam?: boolean;
  examResults?: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    completedAt: string;
  };
}

export class FreeTrialManager {
  private static readonly STORAGE_KEY = 'free_trial_state';
  private static readonly MAX_FREE_QUESTIONS = 25; // 5 questions per subject for 5 subjects
  private static readonly QUESTIONS_PER_SUBJECT = 5;
  
  // Available subjects for each aircraft
  private static readonly AIRCRAFT_SUBJECTS = {
    A320: ['electrical', 'hydraulics', 'performance', 'systems', 'procedures'],
    B737: ['electrical', 'hydraulics', 'performance', 'systems', 'procedures']
  };

  /**
   * Gets the current free trial state for a user
   */
  static getFreeTrialState(userId?: string): FreeTrialState {
    try {
      const key = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return {
          hasUsedTrial: false,
          questionsUsed: 0,
          maxQuestions: this.MAX_FREE_QUESTIONS,
          isTrialExpired: false
        };
      }

      const state: FreeTrialState = JSON.parse(stored);
      
      // Check if trial is expired
      const isExpired = state.questionsUsed >= this.MAX_FREE_QUESTIONS;
      
      return {
        ...state,
        isTrialExpired: isExpired,
        maxQuestions: this.MAX_FREE_QUESTIONS
      };
    } catch (error) {
      console.error('Error getting free trial state:', error);
      return {
        hasUsedTrial: false,
        questionsUsed: 0,
        maxQuestions: this.MAX_FREE_QUESTIONS,
        isTrialExpired: false
      };
    }
  }

  /**
   * Checks if user has already selected an aircraft for their free trial
   */
  static hasSelectedAircraft(userId?: string): boolean {
    const state = this.getFreeTrialState(userId);
    return !!state.selectedAircraft;
  }

  /**
   * Gets the selected aircraft for the user's free trial
   */
  static getSelectedAircraft(userId?: string): 'A320' | 'B737' | null {
    const state = this.getFreeTrialState(userId);
    return state.selectedAircraft || null;
  }

  /**
   * Selects an aircraft for the free trial (can only be done once)
   */
  static selectAircraft(aircraft: 'A320' | 'B737', userId?: string): boolean {
    try {
      const currentState = this.getFreeTrialState(userId);
      
      // If aircraft already selected, cannot change it
      if (currentState.selectedAircraft) {
        return false;
      }

      const newState: FreeTrialState = {
        ...currentState,
        hasUsedTrial: true,
        selectedAircraft: aircraft,
        startDate: new Date().toISOString()
      };

      const key = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      localStorage.setItem(key, JSON.stringify(newState));
      
      return true;
    } catch (error) {
      console.error('Error selecting aircraft:', error);
      return false;
    }
  }

  /**
   * Gets available subjects for the selected aircraft
   */
  static getAvailableSubjects(userId?: string): string[] {
    const aircraft = this.getSelectedAircraft(userId);
    if (!aircraft) return [];
    return this.AIRCRAFT_SUBJECTS[aircraft] || [];
  }

  /**
   * Completes the free trial exam and saves results
   */
  static completeExam(results: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
  }, userId?: string): boolean {
    try {
      const currentState = this.getFreeTrialState(userId);
      
      const updatedState: FreeTrialState = {
        ...currentState,
        completedExam: true,
        isTrialExpired: true,
        examResults: {
          ...results,
          completedAt: new Date().toISOString()
        }
      };

      const key = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      localStorage.setItem(key, JSON.stringify(updatedState));
      
      return true;
    } catch (error) {
      console.error('Error completing exam:', error);
      return false;
    }
  }

  /**
   * Gets exam results if available
   */
  static getExamResults(userId?: string) {
    const state = this.getFreeTrialState(userId);
    return state.examResults || null;
  }

  /**
   * Uses a question from the free trial
   */
  static useTrialQuestion(userId?: string): boolean {
    try {
      const currentState = this.getFreeTrialState(userId);
      
      if (currentState.isTrialExpired || currentState.questionsUsed >= this.MAX_FREE_QUESTIONS) {
        return false; // Trial expired
      }

      const updatedState: FreeTrialState = {
        ...currentState,
        questionsUsed: currentState.questionsUsed + 1,
        isTrialExpired: (currentState.questionsUsed + 1) >= this.MAX_FREE_QUESTIONS
      };

      const key = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      localStorage.setItem(key, JSON.stringify(updatedState));
      
      return true;
    } catch (error) {
      console.error('Error using trial question:', error);
      return false;
    }
  }

  /**
   * Checks if user can access free trial content
   */
  static canAccessFreeTrial(userId?: string): boolean {
    const state = this.getFreeTrialState(userId);
    return !state.isTrialExpired && state.questionsUsed < this.MAX_FREE_QUESTIONS;
  }

  /**
   * Gets remaining free questions
   */
  static getRemainingQuestions(userId?: string): number {
    const state = this.getFreeTrialState(userId);
    return Math.max(0, this.MAX_FREE_QUESTIONS - state.questionsUsed);
  }

  /**
   * Determines what should happen when "Comenzar ahora" is clicked
   */
  static getStartNowAction(userId?: string): {
    action: 'aircraft_selection' | 'continue_exam' | 'subscription' | 'dashboard';
    message?: string;
    redirectUrl: string;
  } {
    const state = this.getFreeTrialState(userId);
    
    if (!state.hasUsedTrial && !state.selectedAircraft) {
      // User hasn't started trial yet - show aircraft selection
      return {
        action: 'aircraft_selection',
        message: 'Selecciona tu aeronave para comenzar la prueba gratuita',
        redirectUrl: '/aircraft-selection'
      };
    }
    
    if (state.selectedAircraft && !state.completedExam) {
      // User has selected aircraft but hasn't completed exam
      return {
        action: 'continue_exam',
        message: `Continúa tu examen gratuito del ${state.selectedAircraft}`,
        redirectUrl: `/exam?mode=practice&trial=true&aircraft=${state.selectedAircraft}`
      };
    }
    
    if (state.completedExam || state.isTrialExpired) {
      // Trial is finished
      return {
        action: 'subscription',
        message: 'Tu prueba ha terminado. Selecciona un plan de suscripción',
        redirectUrl: '/subscription-management'
      };
    }
    
    // Fallback to dashboard
    return {
      action: 'dashboard',
      message: 'Acceder al panel principal',
      redirectUrl: '/dashboard'
    };
  }

  /**
   * Handles the "Comenzar ahora" click with proper navigation and messages
   */
  static async handleStartNow(
    userId?: string,
    navigate?: (url: string) => void,
    showMessage?: (message: string, type: 'info' | 'warning') => void
  ): Promise<void> {
    const action = this.getStartNowAction(userId);
    
    // Show appropriate message
    if (showMessage && action.message) {
      const messageType = action.action === 'subscription' ? 'warning' : 'info';
      showMessage(action.message, messageType);
    }
    
    // Navigate to appropriate page
    if (navigate) {
      navigate(action.redirectUrl);
    } else {
      window.location.href = action.redirectUrl;
    }
  }

  /**
   * Shows trial status toast message
   */
  static showTrialStatus(userId?: string): void {
    const state = this.getFreeTrialState(userId);
    
    if (state.isTrialExpired) {
      toast({
        title: "Prueba Gratuita Terminada",
        description: "Has usado todas tus preguntas gratuitas. Suscríbete para acceso ilimitado.",
        variant: "destructive",
        duration: 5000,
      });
    } else if (state.hasUsedTrial) {
      const remaining = this.getRemainingQuestions(userId);
      toast({
        title: "Prueba Gratuita Activa",
        description: `Te quedan ${remaining} preguntas gratuitas.`,
        duration: 3000,
      });
    } else {
      toast({
        title: "¡Bienvenido a tu Prueba Gratuita!",
        description: `Tienes ${this.MAX_FREE_QUESTIONS} preguntas gratuitas para evaluar la plataforma.`,
        duration: 4000,
      });
    }
  }

  /**
   * Resets the free trial (for testing or admin purposes)
   */
  static resetFreeTrial(userId?: string): void {
    try {
      const key = userId ? `${this.STORAGE_KEY}_${userId}` : this.STORAGE_KEY;
      localStorage.removeItem(key);
      
      toast({
        title: "Prueba Gratuita Reiniciada",
        description: "El estado de la prueba gratuita ha sido reiniciado.",
      });
    } catch (error) {
      console.error('Error resetting free trial:', error);
    }
  }
}