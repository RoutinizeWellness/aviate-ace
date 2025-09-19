import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useConvexAuth';
import type { Id } from "../../convex/_generated/dataModel";
import { allRealAviationQuestions } from '@/data/realAviationQuestions';

// Helper function to generate Convex-like IDs for real exam data
const generateExamId = (table: string): string => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36).substring(0, 8);
  return `${table}_${randomPart}${timestamp}`;
};

interface ConvexExam {
  _id: Id<"exams">;
  title: string;
  description?: string;
  aircraftType: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  passingScore: number;
  questionsCount: number;
  isActive: boolean;
  _creationTime: number;
}

interface ConvexExamQuestion {
  _id: Id<"examQuestions">;
  examId?: Id<"exams">;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  aircraftType: string;
  category: string;
  difficulty: string;
  isActive: boolean;
  _creationTime: number;
}

interface ExamAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

interface ExamState {
  currentQuestionIndex: number;
  answers: ExamAnswer[];
  timeRemaining: number;
  isCompleted: boolean;
  startTime: Date;
  sessionId?: string;
}

export const useExams = () => {
  const { user } = useAuth();
  
  // Helper function to validate Convex IDs
  const isValidConvexId = (id: string): boolean => {
    // Convex IDs are 32-character strings with lowercase letters and digits
    return /^[a-z0-9]{32}$/.test(id);
  };
  
  // Try to get exams from Convex
  const exams = useConvexQuery(api.exams.getExams, {});
  
  const userExamSessions = useConvexQuery(
    api.exams.getUserExamSessions,
    user && isValidConvexId(user._id) ? { userId: user._id as Id<"users"> } : "skip"
  );

  // Fallback real exam data when Convex is not available
  const realExams: ConvexExam[] = [
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "A320 Systems Evaluation - Advanced Level",
      description: "Comprehensive evaluation of A320 aircraft systems including flight protections, electrical systems, and emergency procedures based on real type rating content.",
      aircraftType: "A320_FAMILY",
      category: "Aircraft Systems",
      difficulty: "advanced",
      timeLimit: 90,
      passingScore: 85,
      questionsCount: 25,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "A320 Type Rating - Complete Evaluation",
      description: "Full A320 type rating examination covering all aircraft systems, emergency procedures, and performance calculations according to EASA standards.",
      aircraftType: "A320_FAMILY",
      category: "Type Rating",
      difficulty: "advanced",
      timeLimit: 120,
      passingScore: 80,
      questionsCount: 50,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "A320 Electrical Systems - Professional Level",
      description: "Advanced electrical systems examination covering IDG, battery operations, emergency electrical configuration, and AC/DC distribution systems.",
      aircraftType: "A320_FAMILY",
      category: "Electrical Systems",
      difficulty: "advanced",
      timeLimit: 60,
      passingScore: 85,
      questionsCount: 20,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "A320 Hydraulic Systems - Expert Level",
      description: "Comprehensive hydraulic systems knowledge including PTU operation, backup systems, and emergency procedures.",
      aircraftType: "A320_FAMILY",
      category: "Hydraulic Systems",
      difficulty: "advanced",
      timeLimit: 45,
      passingScore: 85,
      questionsCount: 15,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "A320 Flight Management and Navigation",
      description: "Advanced FMS operations, RNAV procedures, and modern navigation systems for commercial aviation operations.",
      aircraftType: "A320_FAMILY",
      category: "Navigation",
      difficulty: "advanced",
      timeLimit: 75,
      passingScore: 80,
      questionsCount: 25,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "Commercial Flight Procedures - IFR Operations", 
      description: "Examination of instrument flight procedures, approaches, communications and navigation in commercial environment based on EASA/FAA standards.",
      aircraftType: "COMMERCIAL_AIRCRAFT",
      category: "Flight Procedures",
      difficulty: "advanced",
      timeLimit: 75,
      passingScore: 80,
      questionsCount: 30,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "Aviation Meteorology for Commercial Pilots",
      description: "Advanced aeronautical meteorology knowledge, TAF/METAR interpretation, turbulence and adverse conditions per ICAO standards.",
      aircraftType: "GENERAL_AVIATION",
      category: "Meteorology",
      difficulty: "intermediate",
      timeLimit: 60,
      passingScore: 75,
      questionsCount: 20,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "Aviation Regulations ICAO - Part 121 Operations",
      description: "Commercial aviation operation regulations, safety standards, PIC responsibilities and emergency procedures per EASA Part-ORO.",
      aircraftType: "REGULATORY",
      category: "Regulations",
      difficulty: "intermediate",
      timeLimit: 45,
      passingScore: 70,
      questionsCount: 25,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "A320 Emergency Procedures Examination",
      description: "Detailed emergency management procedures for A320, including depressurization, system failures and medical emergencies per A320 QRH.",
      aircraftType: "A320_FAMILY",
      category: "Emergency Procedures",
      difficulty: "advanced",
      timeLimit: 50,
      passingScore: 85,
      questionsCount: 20,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "Boeing 737 Systems and Operations",
      description: "Comprehensive Boeing 737 systems examination including hydraulics, electrical, flight management and normal procedures.",
      aircraftType: "BOEING_737",
      category: "Aircraft Systems",
      difficulty: "advanced",
      timeLimit: 90,
      passingScore: 85,
      questionsCount: 25,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateExamId("exams") as Id<"exams">,
      title: "Advanced Navigation and FMS Operations",
      description: "Modern navigation systems, RNAV procedures, FMS programming and performance-based navigation (PBN) requirements.",
      aircraftType: "COMMERCIAL_AIRCRAFT",
      category: "Navigation",
      difficulty: "advanced",
      timeLimit: 60,
      passingScore: 80,
      questionsCount: 20,
      isActive: true,
      _creationTime: Date.now(),
    }
  ];

  // Use Convex data if available, otherwise use real exam data
  const finalExams = exams && exams.length > 0 ? exams : realExams;
  const isLoadingExams = exams === undefined;

  return {
    exams: finalExams,
    isLoadingExams,
    userExamSessions: userExamSessions || [],
  };
};

interface ExamSessionOptions {
  mode?: 'practice' | 'timed' | 'review';
  category?: string;
  difficulty?: string;
  timeLimit?: number;
  questionCount?: number;
  aircraft?: string;
}

export const useExamSession = (examId: string, options: ExamSessionOptions = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    mode = 'practice',
    category = '',
    difficulty = '',
    timeLimit = 0,
    questionCount = 20,
    aircraft = 'A320_FAMILY'
  } = options;
  
  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: 0,
    isCompleted: false,
    startTime: new Date(),
  });

  // Try to get exam from Convex
  const convexExam = useConvexQuery(
    api.exams.getExam,
    examId ? { examId: examId as Id<"exams"> } : "skip"
  );

  // Try to get questions from Convex
  const convexQuestions = useConvexQuery(
    api.exams.getExamQuestions,
    examId ? { examId: examId as Id<"exams">, limit: 20 } : "skip"
  );

  // Real exam title function
  const getRealExamTitle = () => {
    if (mode === 'timed') return 'Examen Cronometrado - Simulación Oficial';
    if (mode === 'review') return 'Modo Repaso - Preguntas Incorrectas';
    if (category) {
      const categoryLabels: { [key: string]: string } = {
        // Official Airbus A320 Categories
        'aircraft-general': 'Práctica: Aircraft General',
        'load-acceleration-limits': 'Práctica: Load Acceleration Limits',
        'environment-limits': 'Práctica: Environment Limits',
        'weight-limits': 'Práctica: Weight Limits',
        'speed-limits': 'Práctica: Speed Limits',
        'air-bleed-cond-press-vent': 'Práctica: Air Bleed/Cond/Press/Vent',
        'autoflight': 'Práctica: Autoflight',
        'apu': 'Práctica: APU',
        'engines': 'Práctica: Engines',
        'flight-controls': 'Práctica: Flight Controls',
        'fuel': 'Práctica: Fuel',
        'ice-rain-protection': 'Práctica: Ice and Rain Protection',
        'landing-gear': 'Práctica: Landing Gear',
        'oxygen': 'Práctica: Oxygen',
        'gpws': 'Práctica: GPWS',
        'navigation': 'Práctica: Navigation',
        // Legacy categories for backward compatibility
        'airplane-general': 'Práctica: Airplane General',
        'air-systems': 'Práctica: Air Systems',
        'anti-ice-rain': 'Práctica: Anti-Ice and Rain',
        'automatic-flight': 'Práctica: Automatic Flight',
        'communication': 'Práctica: Communication',
        'electrical': 'Práctica: Electrical',
        'engines-apu': 'Práctica: Engines and APU',
        'fire-protection': 'Práctica: Fire Protection',
        'flight-instruments': 'Práctica: Flight Instruments and Displays',
        'flight-management': 'Práctica: Flight Management and Navigation',
        'hydraulics': 'Práctica: Hydraulics',
        'warning-systems': 'Práctica: Warning Systems',
        // Legacy Spanish categories
        'sistemas-aeronave': 'Práctica: Sistemas de Aeronave',
        'proteccion-vuelo': 'Práctica: Protección de Vuelo',
        'procedimientos-aproximacion': 'Práctica: Procedimientos de Aproximación',
        'procedimientos-emergencia': 'Práctica: Procedimientos de Emergencia',
        'meteorologia': 'Práctica: Meteorología',
        'reglamentacion': 'Práctica: Reglamentación',
        'navegacion': 'Práctica: Navegación',
        'performance': 'Práctica: Performance'
      };
      return categoryLabels[category] || 'Modo Práctica - Categoría Específica';
    }
    return 'Modo Práctica - Preguntas Aleatorias';
  };

  const getRealExamTimeLimit = () => {
    if (mode === 'timed') return timeLimit || 60;
    return 0; // No time limit for practice and review
  };

  const realExam: ConvexExam = examId ? {
    _id: examId as Id<"exams">,
    title: "Examen de Sistemas A320 - Nivel Avanzado",
    description: "Evaluación completa de sistemas de la aeronave Airbus A320 incluyendo protecciones de vuelo, sistemas eléctricos y procedimientos de emergencia.",
    aircraftType: "A320_FAMILY",
    category: "Sistemas de Aeronave",
    difficulty: "advanced",
    timeLimit: 90,
    passingScore: 85,
    questionsCount: 20,
    isActive: true,
    _creationTime: Date.now(),
  } : {
    _id: generateExamId("exams") as Id<"exams">,
    title: getRealExamTitle(),
    description: mode === 'timed' 
      ? 'Simulación del examen oficial con tiempo límite y condiciones reales.'
      : mode === 'review'
      ? 'Repasa las preguntas que has respondido incorrectamente para mejorar tu comprensión.'
      : 'Práctica sin límite de tiempo para mejorar tus conocimientos.',
    aircraftType: "GENERAL_AVIATION",
    category: category || "Práctica General",
    difficulty: difficulty || "intermediate",
    timeLimit: getRealExamTimeLimit(),
    passingScore: mode === 'timed' ? 80 : 70,
    questionsCount: questionCount,
    isActive: true,
    _creationTime: Date.now(),
  };

  // Real questions data - filter based on mode, category, difficulty, and aircraft
  const getFilteredQuestions = () => {
    let allQuestions = [...allRealAviationQuestions];
    
    console.log('Total questions available:', allQuestions.length);
    console.log('Filtering by - Mode:', mode, 'Category:', category, 'Aircraft:', aircraft, 'Difficulty:', difficulty);
    
    // For review mode, if no incorrect questions are available, show sample questions
    if (mode === 'review') {
      console.log('Review mode detected - providing sample questions for testing');
      // For now, provide a sample of questions from different categories for review mode testing
      const sampleQuestions = allQuestions.filter((q, index) => index % 3 === 0); // Every 3rd question as sample
      allQuestions = sampleQuestions;
      console.log('Review mode sample questions:', allQuestions.length);
    }
    
    // Filter by aircraft if specified and not 'ALL'
    if (aircraft && aircraft !== 'ALL') {
      const beforeCount = allQuestions.length;
      allQuestions = allQuestions.filter(q => {
        // Include questions that match the aircraft type or are general
        return q.aircraftType === aircraft || 
               q.aircraftType === 'COMMERCIAL_AIRCRAFT' || 
               q.aircraftType === 'GENERAL_AVIATION' ||
               q.aircraftType === 'REGULATORY' ||
               (aircraft === 'A320_FAMILY' && q.aircraftType === 'A320_FAMILY');
      });
      console.log('After aircraft filter:', beforeCount, '->', allQuestions.length);
    }
    
    // Filter by category if specified
    if (category && category !== 'all') {
      const beforeCount = allQuestions.length;
      const categoryMap: { [key: string]: string[] } = {
        // Official Airbus A320 Categories
        'aircraft-general': ['General', 'Aircraft General', 'Airplane General', 'General Knowledge'],
        'load-acceleration-limits': ['Load Limits', 'Acceleration Limits', 'Structural Limits', 'G-Force Limits', 'Load Acceleration Limits'],
        'environment-limits': ['Environment Limits', 'Environmental Limits', 'Weather Limits', 'Operational Limits'],
        'weight-limits': ['Weight Limits', 'Weight and Balance', 'Mass Limits', 'CG Limits'],
        'speed-limits': ['Speed Limits', 'Velocity Limits', 'Airspeed Limits', 'Mach Limits'],
        'air-bleed-cond-press-vent': ['Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent'],
        'autoflight': ['Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS', 'Autoflight'],
        'apu': ['APU', 'Auxiliary Power Unit', 'APU Systems'],
        'engines': ['Engines', 'Engine Systems', 'Motor y APU', 'Powerplant', 'Engine Operations'],
        'flight-controls': ['Flight Controls', 'Control Systems', 'Primary Controls', 'Secondary Controls', 'Flight Controls'],
        'fuel': ['Fuel', 'Fuel Systems', 'Fuel Management'],
        'ice-rain-protection': ['Ice Protection', 'Anti-Ice', 'Rain Protection', 'Ice and Rain Protection', 'Anti-Ice and Rain'],
        'landing-gear': ['Landing Gear', 'Gear Systems', 'Brakes', 'Landing Gear and Brakes'],
        'oxygen': ['Oxygen', 'Oxygen Systems', 'Emergency Oxygen', 'Life Support'],
        'gpws': ['GPWS', 'Ground Proximity Warning', 'Terrain Warning', 'TAWS'],
        'navigation': ['Navigation', 'Flight Management and Navigation', 'Navegación', 'GPS', 'FMS'],
        // Legacy categories for backward compatibility
        'airplane-general': ['General', 'Aircraft General', 'Airplane General', 'General Knowledge'],
        'air-systems': ['Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic'],
        'anti-ice-rain': ['Anti-Ice', 'Rain Protection', 'Ice Protection', 'Anti-Ice and Rain'],
        'automatic-flight': ['Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS'],
        'communication': ['Communication', 'Radio', 'ACARS', 'Communications'],
        'electrical': ['Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems'],
        'engines-apu': ['Engines', 'APU', 'Engine Systems', 'Engines and APU', 'Motor y APU', 'Powerplant'],
        'fire-protection': ['Fire Protection', 'Fire Systems', 'Fire Detection', 'Fire Suppression', 'Protección de Vuelo'],
        'flight-instruments': ['Flight Instruments', 'Displays', 'ECAM', 'EICAS', 'Flight Instruments and Displays'],
        'flight-management': ['Flight Management', 'Navigation', 'FMS', 'Flight Management and Navigation', 'Navegación'],
        'hydraulics': ['Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power'],
        'warning-systems': ['Warning Systems', 'Alert Systems', 'ECAM', 'EICAS', 'Alerting Systems'],
        // Legacy Spanish categories for backward compatibility
        'sistemas-aeronave': ['Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Neumático', 'Sistemas de Alerta', 'Motor y APU'],
        'proteccion-vuelo': ['Protección de Vuelo', 'Sistema de Vuelo', 'Fire Protection', 'Fire Systems'],
        'procedimientos-aproximacion': ['Procedimientos de Aproximación', 'Sistema de Aterrizaje Automático'],
        'procedimientos-emergencia': ['Procedimientos de Emergencia', 'Sistema de Presurización'],
        'meteorologia': ['Meteorología'],
        'reglamentacion': ['Reglamentación'],
        'navegacion': ['Navegación'],
        'performance': ['Performance', 'Procedimientos de Despegue']
      };
      
      const targetCategories = categoryMap[category] || [category];
      console.log('Target categories for', category, ':', targetCategories);
      
      allQuestions = allQuestions.filter(q => {
        const matchesCategory = targetCategories.some(cat => 
          q.category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(q.category.toLowerCase())
        );
        if (matchesCategory) {
          console.log('Question matched category:', q.question.substring(0, 50), 'Category:', q.category);
        }
        return matchesCategory;
      });
      console.log('After category filter:', beforeCount, '->', allQuestions.length);
    }
    
    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'all') {
      const beforeCount = allQuestions.length;
      allQuestions = allQuestions.filter(q => q.difficulty === difficulty);
      console.log('After difficulty filter:', beforeCount, '->', allQuestions.length);
    }
    
    // If no questions found after filtering, try without aircraft restriction
    if (allQuestions.length === 0 && aircraft && aircraft !== 'ALL') {
      console.log('No questions found with filters, trying with relaxed aircraft filter');
      // Try again without aircraft filter
      let fallbackQuestions = [...allRealAviationQuestions];
      
      // Apply category filter only
      if (category && category !== 'all') {
        const categoryMap: { [key: string]: string[] } = {
          // Official Airbus A320 Categories
          'aircraft-general': ['General', 'Aircraft General', 'Airplane General', 'General Knowledge'],
          'load-acceleration-limits': ['Load Limits', 'Acceleration Limits', 'Structural Limits', 'G-Force Limits', 'Load Acceleration Limits'],
          'environment-limits': ['Environment Limits', 'Environmental Limits', 'Weather Limits', 'Operational Limits'],
          'weight-limits': ['Weight Limits', 'Weight and Balance', 'Mass Limits', 'CG Limits'],
          'speed-limits': ['Speed Limits', 'Velocity Limits', 'Airspeed Limits', 'Mach Limits'],
          'air-bleed-cond-press-vent': ['Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic', 'Bleed Air', 'Ventilation', 'Air Bleed/Cond/Press/Vent'],
          'autoflight': ['Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS', 'Autoflight'],
          'apu': ['APU', 'Auxiliary Power Unit', 'APU Systems'],
          'engines': ['Engines', 'Engine Systems', 'Motor y APU', 'Powerplant', 'Engine Operations'],
          'flight-controls': ['Flight Controls', 'Control Systems', 'Primary Controls', 'Secondary Controls', 'Flight Controls'],
          'fuel': ['Fuel', 'Fuel Systems', 'Fuel Management'],
          'ice-rain-protection': ['Ice Protection', 'Anti-Ice', 'Rain Protection', 'Ice and Rain Protection', 'Anti-Ice and Rain'],
          'landing-gear': ['Landing Gear', 'Gear Systems', 'Brakes', 'Landing Gear and Brakes'],
          'oxygen': ['Oxygen', 'Oxygen Systems', 'Emergency Oxygen', 'Life Support'],
          'gpws': ['GPWS', 'Ground Proximity Warning', 'Terrain Warning', 'TAWS'],
          'navigation': ['Navigation', 'Flight Management and Navigation', 'Navegación', 'GPS', 'FMS'],
          // Legacy categories for backward compatibility
          'airplane-general': ['General', 'Aircraft General', 'Airplane General', 'General Knowledge'],
          'air-systems': ['Air Systems', 'Pressurization', 'Air Conditioning', 'Pneumatic'],
          'anti-ice-rain': ['Anti-Ice', 'Rain Protection', 'Ice Protection', 'Anti-Ice and Rain'],
          'automatic-flight': ['Autopilot', 'Flight Management', 'Automatic Flight', 'AFCS'],
          'communication': ['Communication', 'Radio', 'ACARS', 'Communications'],
          'electrical': ['Electrical', 'Power Systems', 'Sistema Eléctrico', 'Electrical Systems'],
          'engines-apu': ['Engines', 'APU', 'Engine Systems', 'Engines and APU', 'Motor y APU', 'Powerplant'],
          'fire-protection': ['Fire Protection', 'Fire Systems', 'Fire Detection', 'Fire Suppression', 'Protección de Vuelo'],
          'flight-instruments': ['Flight Instruments', 'Displays', 'ECAM', 'EICAS', 'Flight Instruments and Displays'],
          'flight-management': ['Flight Management', 'Navigation', 'FMS', 'Flight Management and Navigation', 'Navegación'],
          'hydraulics': ['Hydraulics', 'Hydraulic Systems', 'Sistema Hidráulico', 'Hydraulic Power'],
          'warning-systems': ['Warning Systems', 'Alert Systems', 'ECAM', 'EICAS', 'Alerting Systems'],
          // Legacy Spanish categories for backward compatibility
          'sistemas-aeronave': ['Sistema Eléctrico', 'Sistema Hidráulico', 'Sistema Neumático', 'Sistemas de Alerta', 'Motor y APU'],
          'proteccion-vuelo': ['Protección de Vuelo', 'Sistema de Vuelo', 'Fire Protection', 'Fire Systems'],
          'procedimientos-aproximacion': ['Procedimientos de Aproximación', 'Sistema de Aterrizaje Automático'],
          'procedimientos-emergencia': ['Procedimientos de Emergencia', 'Sistema de Presurización'],
          'meteorologia': ['Meteorología'],
          'reglamentacion': ['Reglamentación'],
          'navegacion': ['Navegación'],
          'performance': ['Performance', 'Procedimientos de Despegue']
        };
        
        const targetCategories = categoryMap[category] || [category];
        fallbackQuestions = fallbackQuestions.filter(q => {
          return targetCategories.some(cat => 
            q.category.toLowerCase().includes(cat.toLowerCase()) ||
            cat.toLowerCase().includes(q.category.toLowerCase())
          );
        });
      }
      
      // Apply difficulty filter
      if (difficulty && difficulty !== 'all') {
        fallbackQuestions = fallbackQuestions.filter(q => q.difficulty === difficulty);
      }
      
      console.log('Fallback questions found:', fallbackQuestions.length);
      allQuestions = fallbackQuestions;
    }
    
    // Shuffle and limit questions
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
    const limitedQuestions = shuffledQuestions.slice(0, questionCount);
    
    console.log('Final filtered questions:', limitedQuestions.length);
    return limitedQuestions;
  };

  const realQuestions: ConvexExamQuestion[] = examId 
    ? allRealAviationQuestions 
    : getFilteredQuestions();

  // Use Convex data if available, otherwise use real data
  const exam = convexExam || realExam;
  const questions = (convexQuestions && convexQuestions.length > 0) ? convexQuestions : realQuestions;

  const startExamMutation = useConvexMutation(api.exams.startExamSession);
  const completeExamMutation = useConvexMutation(api.exams.completeExamSession);
  const recordIncorrectQuestion = useConvexMutation(api.auth.recordIncorrectQuestion);
  const markQuestionResolved = useConvexMutation(api.auth.markQuestionResolved);

  const handleStartExam = async () => {
    if (!user || !exam) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para iniciar el examen.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Try to use Convex, but fallback to mock behavior if it fails
      let sessionId = `real-session-${Date.now()}`;
      
      try {
        const session = await startExamMutation({
          userId: user._id as Id<"users">,
          examId: examId as Id<"exams">,
          sessionType: mode, // Use the actual mode (practice, timed, review)
        });
        sessionId = session.sessionId;
      } catch (convexError) {
        console.log('Using real exam session (Convex not available)');
        // Continue with mock sessionId
      }
      
      setExamState(prev => ({
        ...prev,
        timeRemaining: exam.timeLimit * 60,
        startTime: new Date(),
        sessionId,
      }));
      
      toast({
        title: "Examen iniciado",
        description: "¡Buena suerte! El cronómetro ha comenzado.",
      });
    } catch (error) {
      console.error('Error starting exam:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el examen. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitExam = async (finalAnswers: ExamAnswer[]) => {
    if (!user || !questions || !exam) {
      toast({
        title: "Error",
        description: "Datos incompletos para enviar el examen.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate results
      const correctAnswers = finalAnswers.filter(answer => {
        const question = questions.find(q => q._id === answer.questionId);
        return question && answer.selectedAnswer === question.correctAnswer;
      }).length;

      const score = Math.round((correctAnswers / questions.length) * 100);

      // Track incorrect questions for review mode
      const incorrectAnswers = finalAnswers.filter(answer => {
        const question = questions.find(q => q._id === answer.questionId);
        return question && answer.selectedAnswer !== question.correctAnswer;
      });

      // Record incorrect questions for future review
      if (mode !== 'review' && incorrectAnswers.length > 0) {
        try {
          for (const incorrectAnswer of incorrectAnswers) {
            const question = questions.find(q => q._id === incorrectAnswer.questionId);
            if (question) {
              await recordIncorrectQuestion({
                userId: user._id as Id<"users">,
                questionId: question._id as Id<"examQuestions">,
                incorrectAnswer: incorrectAnswer.selectedAnswer,
                correctAnswer: question.correctAnswer,
                sessionType: mode || 'practice',
                category: question.category,
                difficulty: question.difficulty,
                aircraftType: question.aircraftType,
              });
            }
          }
        } catch (trackingError) {
          console.log('Could not track incorrect questions:', trackingError);
        }
      }

      // Mark questions as resolved in review mode if answered correctly
      if (mode === 'review') {
        const correctAnswersInReview = finalAnswers.filter(answer => {
          const question = questions.find(q => q._id === answer.questionId);
          return question && answer.selectedAnswer === question.correctAnswer;
        });

        try {
          for (const correctAnswer of correctAnswersInReview) {
            const question = questions.find(q => q._id === correctAnswer.questionId);
            if (question) {
              await markQuestionResolved({
                userId: user._id as Id<"users">,
                questionId: question._id as Id<"examQuestions">,
              });
            }
          }
        } catch (resolutionError) {
          console.log('Could not mark questions as resolved:', resolutionError);
        }
      }

      // Try to save to Convex, fallback to mock if it fails
      try {
        await completeExamMutation({
          userId: user._id as Id<"users">,
          examId: examId as Id<"exams">,
          sessionType: mode, // Use the actual mode (practice, timed, review)
          questionsCount: questions.length,
          correctAnswers,
          score,
          timeSpent: Math.floor((Date.now() - examState.startTime.getTime()) / 1000),
          answers: finalAnswers.map(answer => ({
            questionId: answer.questionId as Id<"examQuestions">,
            selectedAnswer: answer.selectedAnswer,
            isCorrect: questions.find(q => q._id === answer.questionId)?.correctAnswer === answer.selectedAnswer,
            timeSpent: answer.timeSpent,
          })),
        });
      } catch (convexError) {
        console.log('Using mock exam completion (Convex not available)');
        // Mock completion - just log to console
        console.log('Exam completed with score:', score);
      }

      setExamState(prev => ({
        ...prev,
        isCompleted: true,
        answers: finalAnswers,
      }));

      toast({
        title: "Examen completado",
        description: `Tu puntuación es ${score}%. ${score >= exam.passingScore ? '¡Aprobado!' : 'No aprobado.'}`,
      });
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el examen. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return {
    exam,
    questions,
    examState,
    handleStartExam,
    handleSubmitExam,
    setExamState,
  };
};