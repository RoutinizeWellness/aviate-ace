import React, { createContext, useContext, useState, useEffect } from 'react';
import esJson from '@/i18n/es.json';
import enJson from '@/i18n/en.json';

interface LanguageContextType {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define extended translations by merging JSON files with additional keys
const esExtended = {
  ...esJson,
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.flashcards': 'Tarjetas',
  
  // Home page extended
  'home.features.title': 'Todo lo que Necesitas para Triunfar',
  'home.features.exams': 'Exámenes Reales',
  'home.features.exams.desc': 'Practica con preguntas basadas en exámenes reales de tipo rating',
  'home.features.progress': 'Seguimiento de Progreso',
  'home.features.progress.desc': 'Monitorea tu avance con estadísticas detalladas',
  'home.features.interactive': 'Lecciones Interactivas',
  'home.features.interactive.desc': 'Aprende con contenido multimedia y simulaciones',
  
  // Pricing
  'pricing.monthly': 'mensual',
  'pricing.choose': 'Elegir Plan',
  'pricing.features': 'Características',
  
  // Exam questions
  'exam.question': 'Pregunta',
  'exam.of': 'de',
  'exam.next': 'Siguiente',
  'exam.previous': 'Anterior',
  'exam.finish': 'Finalizar',
  'exam.explanation': 'Explicación',
  'exam.correct': 'Correcto',
  'exam.incorrect': 'Incorrecto',
  
  // Admin
  'admin.panel': 'Panel de Administración',
  'admin.users': 'Usuarios',
  'admin.questions': 'Preguntas',
  'admin.analytics': 'Analytics',
  
  // Common
  'common.loading': 'Cargando...',
  'common.error': 'Error',
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',
  'common.edit': 'Editar',
  'common.back': 'Volver'
};

const enExtended = {
  ...enJson,
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.flashcards': 'Flashcards',
  
  // Home page extended
  'home.features.title': 'Everything You Need to Succeed',
  'home.features.exams': 'Real Exams',
  'home.features.exams.desc': 'Practice with questions based on real type rating exams',
  'home.features.progress': 'Progress Tracking',
  'home.features.progress.desc': 'Monitor your progress with detailed statistics',
  'home.features.interactive': 'Interactive Lessons',
  'home.features.interactive.desc': 'Learn with multimedia content and simulations',
  
  // Pricing
  'pricing.monthly': 'per month',
  'pricing.choose': 'Choose Plan',
  'pricing.features': 'Features',
  
  // Exam questions
  'exam.question': 'Question',
  'exam.of': 'of',
  'exam.next': 'Next',
  'exam.previous': 'Previous',
  'exam.finish': 'Finish',
  'exam.explanation': 'Explanation',
  'exam.correct': 'Correct',
  'exam.incorrect': 'Incorrect',
  
  // Admin
  'admin.panel': 'Administration Panel',
  'admin.users': 'Users',
  'admin.questions': 'Questions',
  'admin.analytics': 'Analytics',
  
  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.back': 'Back'
};

const translations: Record<'es' | 'en', Record<string, string>> = {
  es: esExtended,
  en: enExtended
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'es' | 'en'>(() => {
    const saved = localStorage.getItem('language') as 'es' | 'en' | null;
    if (saved === 'es' || saved === 'en') return saved;
    const browser = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();
    return browser.startsWith('es') ? 'es' : 'en';
  });

  useEffect(() => {
    const saved = localStorage.getItem('language') as 'es' | 'en' | null;
    if (saved === 'es' || saved === 'en') {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};