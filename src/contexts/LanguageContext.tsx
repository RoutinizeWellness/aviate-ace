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
  'typerating.b737': 'Boeing 737',
  
  // Exams extended
  'exams.subtitle': 'Practica con preguntas reales de exámenes de habilitación',
  'exams.practiceDescription': 'Practica sin límite de tiempo con explicaciones detalladas',
  'exams.questionsAvailable': 'Preguntas reales disponibles',
  'exams.officialExamSimulation': 'Simulación de examen oficial',
  'exams.startPractice': 'Comenzar Práctica',
  'exams.timedExamMode': 'Modo Examen Cronometrado',
  'exams.timedExamDescription': 'Simula las condiciones reales del examen oficial',
  'exams.officialTimeLimit': 'Límite de tiempo oficial',
  'exams.passingScore75': 'Puntuación mínima 75%',
  'exams.startTimedExam': 'Iniciar Examen Cronometrado',
  'exams.reviewDescription': 'Repasa preguntas falladas anteriormente',
  'exams.personalizedQuestions': 'Preguntas personalizadas',
  'exams.focusOnWeakAreas': 'Enfoque en áreas débiles',
  'exams.configurePracticeTitle': 'Configurar Práctica',
  'exams.configureDescription': 'Personaliza tu sesión de práctica',
  'exams.airbusA320Family': 'Familia Airbus A320',
  'exams.airbusA320FamilyDesc': 'A318, A319, A320, A321',
  'exams.boeing737': 'Boeing 737',
  'exams.boeing737Desc': 'B737-700, B737-800, B737 MAX',
  'exams.allTypes': 'Todos los Tipos',
  'exams.allTypesDesc': 'Preguntas mixtas de ambos aviones',
  'exams.aircraftGeneral': 'General del Avión',
  'exams.aircraftGeneralDesc': 'Conocimientos generales y limitaciones',
  'exams.electrical': 'Sistema Eléctrico',
  'exams.electricalDesc': 'Generación y distribución eléctrica',
  'exams.hydraulics': 'Sistema Hidráulico',
  'exams.hydraulicsDesc': 'Sistemas de potencia hidráulica',
  'exams.performance': 'Performance',
  'exams.performanceDesc': 'Cálculos de rendimiento y limitaciones',
  'exams.airCondPressVent': 'Aire Acond/Press/Vent',
  'exams.airCondPressVentDesc': 'Sistemas de aire acondicionado y presurización',
  'exams.autoflight': 'Vuelo Automático',
  'exams.autoflightDesc': 'Piloto automático y gestión de vuelo',
  'exams.engines': 'Motores',
  'exams.enginesDesc': 'Operación y limitaciones de motores',
  'exams.flightControls': 'Controles de Vuelo',
  'exams.flightControlsDesc': 'Sistemas de control primarios y secundarios',
  'exams.fuel': 'Combustible',
  'exams.fuelDesc': 'Sistemas de combustible y distribución',
  'exams.landingGear': 'Tren de Aterrizaje',
  'exams.landingGearDesc': 'Operación, frenos y dirección',
  'exams.airSystems': 'Sistemas de Aire',
  'exams.airSystemsDesc': 'Neumáticos, presurización y aire acondicionado',
  'exams.enginesApu': 'Motores y APU',
  'exams.enginesApuDesc': 'Motores y unidad de potencia auxiliar',
  'exams.basicLevel': 'Básico',
  'exams.fundamentalConcepts': 'Conceptos fundamentales',
  'exams.intermediateLevel': 'Intermedio',
  'exams.standardProcedures': 'Procedimientos estándar',
  'exams.advancedLevel': 'Avanzado',
  'exams.complexSituations': 'Situaciones complejas',
  'exams.questions': 'preguntas',
  'exams.shortSession': 'Sesión corta',
  'exams.standardSession': 'Sesión estándar',
  'exams.extendedSession': 'Sesión extendida',
  'exams.intensiveSession': 'Sesión intensiva',
  'exams.fullExamSimulation': 'Simulación completa de examen - 90 min',
  'exams.minutes': 'min',
  'exams.selectDifficulty': 'Seleccionar dificultad',
  'exams.allLevels': 'Preguntas de todos los niveles',
  'exams.categoriesSelected': 'categorías seleccionadas',
  'exams.timedDescription': 'Simula las condiciones reales del examen oficial con tiempo límite',
  'exams.timeLimit': 'Tiempo límite',
  'exams.questionsCount': 'Preguntas',
  'exams.minimumScore': 'Puntuación mínima',
  'exams.cancel': 'Cancelar',
  'exams.timed': 'Cronometrado',
  'exams.review': 'Repaso',
  // Quick Actions
  'quickActions.title': 'Acciones Rápidas',
  'quickActions.description': 'Tareas comunes de suscripción',
  'quickActions.updatePayment': 'Actualizar Método de Pago',
  'quickActions.viewBilling': 'Ver Historial de Facturación',
  'quickActions.requestRefund': 'Solicitar Reembolso',
  'subscription.commonTasks': 'Tareas comunes de suscripción',
  'subscription.activeSubscriptionDetails': 'Detalles de tu suscripción activa',
  'subscription.statusActive': 'Activo',
  'subscription.validUntil': 'Válido hasta',
  'subscription.supportText': '¿Necesitas ayuda con tu suscripción?'
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
  'typerating.b737': 'Boeing 737',
  
  // Exams extended - English
  'exams.subtitle': 'Practice with real type rating exam questions',
  'exams.practiceDescription': 'Practice without time limit with detailed explanations',
  'exams.questionsAvailable': 'Real questions available',
  'exams.officialExamSimulation': 'Official exam simulation',
  'exams.startPractice': 'Start Practice',
  'exams.timedExamMode': 'Timed Exam Mode',
  'exams.timedExamDescription': 'Simulates real official exam conditions',
  'exams.officialTimeLimit': 'Official time limit',
  'exams.passingScore75': 'Minimum score 75%',
  'exams.startTimedExam': 'Start Timed Exam',
  'exams.reviewDescription': 'Review previously incorrect questions',
  'exams.personalizedQuestions': 'Personalized questions',
  'exams.focusOnWeakAreas': 'Focus on weak areas',
  'exams.configurePracticeTitle': 'Configure Practice',
  'exams.configureDescription': 'Customize your practice session',
  'exams.airbusA320Family': 'Airbus A320 Family',
  'exams.airbusA320FamilyDesc': 'A318, A319, A320, A321',
  'exams.boeing737': 'Boeing 737',
  'exams.boeing737Desc': 'B737-700, B737-800, B737 MAX',
  'exams.allTypes': 'All Types',
  'exams.allTypesDesc': 'Mixed questions from both aircraft',
  'exams.aircraftGeneral': 'Aircraft General',
  'exams.aircraftGeneralDesc': 'General knowledge and limitations',
  'exams.electrical': 'Electrical System',
  'exams.electricalDesc': 'Power generation and distribution',
  'exams.hydraulics': 'Hydraulic System',
  'exams.hydraulicsDesc': 'Hydraulic power systems',
  'exams.performance': 'Performance',
  'exams.performanceDesc': 'Performance calculations and limitations',
  'exams.airCondPressVent': 'Air Cond/Press/Vent',
  'exams.airCondPressVentDesc': 'Air conditioning and pressurization systems',
  'exams.autoflight': 'Autoflight',
  'exams.autoflightDesc': 'Autopilot and flight management',
  'exams.engines': 'Engines',
  'exams.enginesDesc': 'Engine operation and limitations',
  'exams.flightControls': 'Flight Controls',
  'exams.flightControlsDesc': 'Primary and secondary control systems',
  'exams.fuel': 'Fuel',
  'exams.fuelDesc': 'Fuel systems and distribution',
  'exams.landingGear': 'Landing Gear',
  'exams.landingGearDesc': 'Operation, brakes and steering',
  'exams.airSystems': 'Air Systems',
  'exams.airSystemsDesc': 'Pneumatic, pressurization and air conditioning',
  'exams.enginesApu': 'Engines and APU',
  'exams.enginesApuDesc': 'Engines and auxiliary power unit',
  'exams.basicLevel': 'Basic',
  'exams.fundamentalConcepts': 'Fundamental concepts',
  'exams.intermediateLevel': 'Intermediate',
  'exams.standardProcedures': 'Standard procedures',
  'exams.advancedLevel': 'Advanced',
  'exams.complexSituations': 'Complex situations',
  'exams.questions': 'questions',
  'exams.shortSession': 'Short session',
  'exams.standardSession': 'Standard session',
  'exams.extendedSession': 'Extended session',
  'exams.intensiveSession': 'Intensive session',
  'exams.fullExamSimulation': 'Full exam simulation - 90 min',
  'exams.minutes': 'min',
  'exams.selectDifficulty': 'Select difficulty',
  'exams.allLevels': 'Questions from all levels',
  'exams.categoriesSelected': 'categories selected',
  'exams.timedDescription': 'Simulates real official exam conditions with time limit',
  'exams.timeLimit': 'Time limit',
  'exams.questionsCount': 'Questions',
  'exams.minimumScore': 'Minimum score',
  'exams.cancel': 'Cancel',
  'exams.timed': 'Timed',
  'exams.review': 'Review',
  // Quick Actions
  'quickActions.title': 'Quick Actions',
  'quickActions.description': 'Common subscription tasks',
  'quickActions.updatePayment': 'Update Payment Method',
  'quickActions.viewBilling': 'View Billing History', 
  'quickActions.requestRefund': 'Request Refund',
  'subscription.commonTasks': 'Common subscription tasks',
  'subscription.activeSubscriptionDetails': 'Details of your active subscription',
  'subscription.statusActive': 'Active',
  'subscription.validUntil': 'Valid until',
  'subscription.supportText': 'Need help with your subscription?'
};

const translations: Record<'es' | 'en', Record<string, string>> = {
  es: esExtended,
  en: enExtended
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'es' | 'en'>(() => {
    // First check localStorage
    const saved = localStorage.getItem('language') as 'es' | 'en' | null;
    if (saved === 'es' || saved === 'en') return saved;
    
    // Then check browser language - prioritize Spanish detection
    const browserLanguage = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();
    
    // Enhanced Spanish detection
    if (browserLanguage.startsWith('es') || 
        browserLanguage.includes('es-') ||
        browserLanguage === 'es' ||
        navigator.languages?.some(lang => lang.toLowerCase().startsWith('es'))) {
      return 'es';
    }
    
    // Default to English for all other cases
    return 'en';
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
    
    // Dispatch a custom event for language change notifications
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { newLanguage: lang } }));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Reflect language in the <html> tag and add smooth transition effects
  useEffect(() => {
    try {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
      
      // Add a temporary class for language transition effects
      document.documentElement.classList.add('language-changing');
      
      // Remove the class after the transition
      const timeout = setTimeout(() => {
        document.documentElement.classList.remove('language-changing');
      }, 300);
      
      return () => clearTimeout(timeout);
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