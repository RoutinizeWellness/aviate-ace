import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.exams': 'Exámenes',
    'nav.lessons': 'Lecciones', 
    'nav.flashcards': 'Tarjetas',
    'nav.progress': 'Progreso',
    'nav.pricing': 'Precios',
    'nav.profile': 'Perfil',
    'nav.admin': 'Admin',
    'nav.logout': 'Cerrar Sesión',
    
    // Home page
    'home.title': 'Domina la Aviación Comercial',
    'home.subtitle': 'Plataforma integral de preparación para pilotos de A320 y B737',
    'home.cta': 'Comenzar Ahora',
    'home.features.title': 'Todo lo que Necesitas para Triunfar',
    'home.features.exams': 'Exámenes Reales',
    'home.features.exams.desc': 'Practica con preguntas basadas en exámenes reales de tipo rating',
    'home.features.progress': 'Seguimiento de Progreso',
    'home.features.progress.desc': 'Monitorea tu avance con estadísticas detalladas',
    'home.features.interactive': 'Lecciones Interactivas',
    'home.features.interactive.desc': 'Aprende con contenido multimedia y simulaciones',
    
    // Pricing
    'pricing.title': 'Planes de Precios',
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
    'common.back': 'Volver',
    
    // Footer
    'footer.terms': 'Términos de Servicio',
    'footer.privacy': 'Política de Privacidad', 
    'footer.contact': 'Contacto',
    'footer.rights': 'Todos los derechos reservados.',
  },
  en: {
    // Navigation  
    'nav.dashboard': 'Dashboard',
    'nav.exams': 'Exams',
    'nav.lessons': 'Lessons',
    'nav.flashcards': 'Flashcards',
    'nav.progress': 'Progress', 
    'nav.pricing': 'Pricing',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    
    // Home page
    'home.title': 'Master Commercial Aviation',
    'home.subtitle': 'Comprehensive training platform for A320 and B737 pilots',
    'home.cta': 'Get Started',
    'home.features.title': 'Everything You Need to Succeed',
    'home.features.exams': 'Real Exams',
    'home.features.exams.desc': 'Practice with questions based on real type rating exams',
    'home.features.progress': 'Progress Tracking', 
    'home.features.progress.desc': 'Monitor your progress with detailed statistics',
    'home.features.interactive': 'Interactive Lessons',
    'home.features.interactive.desc': 'Learn with multimedia content and simulations',
    
    // Pricing
    'pricing.title': 'Pricing Plans',
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
    'common.back': 'Back',
    
    // Footer
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
  }
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