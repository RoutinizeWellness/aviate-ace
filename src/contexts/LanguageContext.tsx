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
  'nav.exams': 'Exámenes',
  'nav.typeRating': 'Type Rating',
  'nav.progress': 'Progreso',
  'nav.profile': 'Perfil',
  'nav.admin': 'Administración',
'nav.logout': 'Cerrar sesión',
  // Exams
  'exams.title': 'Exámenes',
  'exams.categories': 'Categorías de Examen',
  'exams.practiceMode': 'Modo Práctica',
  'exams.configurePractice': 'Configurar Práctica',
  'exams.recommended': 'Recomendado',
  'exams.selectAircraftType': 'Tipo de Aeronave',
  'exams.categoriesLabel': 'Categorías',
  'exams.clearAll': 'Limpiar todo',
  'exams.difficulty': 'Dificultad',
  'exams.allDifficulties': 'Todas las dificultades',
  'exams.mixedAllTypes': 'Todos los Tipos',
  'exams.startPractice': 'Comenzar Práctica',
  'exams.timedMode': 'Modo Examen Cronometrado',
  'exams.startTimed': 'Iniciar Examen',
  'exams.reviewMode': 'Modo Repaso',
  'exams.startReview': 'Comenzar Repaso',
  // Subscription
  'subscription.title': 'Gestión de Suscripciones',
  'subscription.subtitle': 'Administra tu plan y facturación',
  'subscription.availablePlans': 'Planes Disponibles',
  'subscription.selectPlan': 'Selecciona un plan para suscribirte con Autumn',
  'subscription.email': 'Correo electrónico',
  'subscription.useEmailNote': 'Usaremos este correo para crear tu cliente en el checkout.',
  'subscription.subscribe': 'Suscribirme',
  'subscription.currentPlan': 'Plan Actual',
  'subscription.planFeatures': 'Características del Plan',
  'subscription.quickActions': 'Acciones Rápidas',
  'subscription.updatePaymentMethod': 'Actualizar Método de Pago',
  'subscription.viewBillingHistory': 'Ver Historial de Facturación',
  'subscription.requestRefund': 'Solicitar Reembolso',
  'subscription.needHelp': '¿Necesitas Ayuda?',
  'subscription.contactSupport': 'Contactar Soporte',
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
'common.back': 'Volver',
  // Type Rating
  'typerating.quickActions': 'Acciones Rápidas',
  'typerating.practiceExam': 'Examen de Práctica',
  'typerating.startPractice': 'Iniciar Práctica',
  'typerating.flashcards': 'Tarjetas (Flashcards)',
  'typerating.startFlashcards': 'Empezar Flashcards',
  'typerating.examSimulator': 'Simulador de Examen',
  'typerating.startExam': 'Iniciar Examen',
  'typerating.selectAircraft': 'Selecciona tu Aeronave',
  'typerating.a320': 'Airbus A320',
  'typerating.b737': 'Boeing 737'
};

const enExtended = {
  ...enJson,
  // Navigation
'nav.dashboard': 'Dashboard',
  'nav.exams': 'Exams',
  'nav.typeRating': 'Type Rating',
  'nav.progress': 'Progress',
  'nav.profile': 'Profile',
  'nav.admin': 'Admin',
'nav.logout': 'Log out',
  // Exams
  'exams.title': 'Exams',
  'exams.categories': 'Exam Categories',
  'exams.practiceMode': 'Practice Mode',
  'exams.configurePractice': 'Configure Practice',
  'exams.recommended': 'Recommended',
  'exams.selectAircraftType': 'Aircraft Type',
  'exams.categoriesLabel': 'Categories',
  'exams.clearAll': 'Clear all',
  'exams.difficulty': 'Difficulty',
  'exams.allDifficulties': 'All difficulties',
  'exams.mixedAllTypes': 'All Types',
  'exams.startPractice': 'Start Practice',
  'exams.timedMode': 'Timed Exam Mode',
  'exams.startTimed': 'Start Exam',
  'exams.reviewMode': 'Review Mode',
  'exams.startReview': 'Start Review',
  // Subscription
  'subscription.title': 'Subscription Management',
  'subscription.subtitle': 'Manage your plan and billing',
  'subscription.availablePlans': 'Available Plans',
  'subscription.selectPlan': 'Select a plan to subscribe via Autumn',
  'subscription.email': 'Email',
  'subscription.useEmailNote': 'We will use this email to create your customer for checkout.',
  'subscription.subscribe': 'Subscribe',
  'subscription.currentPlan': 'Current Plan',
  'subscription.planFeatures': 'Plan Features',
  'subscription.quickActions': 'Quick Actions',
  'subscription.updatePaymentMethod': 'Update Payment Method',
  'subscription.viewBillingHistory': 'View Billing History',
  'subscription.requestRefund': 'Request Refund',
  'subscription.needHelp': 'Need Help?',
  'subscription.contactSupport': 'Contact Support',
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
'common.back': 'Back',
  // Type Rating
  'typerating.quickActions': 'Quick Actions',
  'typerating.practiceExam': 'Practice Exam',
  'typerating.startPractice': 'Start Practice',
  'typerating.flashcards': 'Flashcards',
  'typerating.startFlashcards': 'Start Flashcards',
  'typerating.examSimulator': 'Exam Simulator',
  'typerating.startExam': 'Start Exam',
  'typerating.selectAircraft': 'Select your Aircraft',
  'typerating.a320': 'Airbus A320',
  'typerating.b737': 'Boeing 737'
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

  // Reflect language in the <html> tag and force minimal visual updates without reload
  useEffect(() => {
    try {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
    } catch {}
  }, [language]);

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