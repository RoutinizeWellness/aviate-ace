import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMutation as useConvexMutation, useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useConvexAuth';
import type { Id } from "../../convex/_generated/dataModel";

// Helper function to generate Convex-like IDs for mock data
const generateMockConvexId = (table: string): string => {
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
    return /^[a-z]+_[a-z2-7]{16}$/.test(id);
  };
  
  // Try to get exams from Convex
  const exams = useConvexQuery(api.exams.getExams, {});
  
  const userExamSessions = useConvexQuery(
    api.exams.getUserExamSessions,
    user && isValidConvexId(user._id) ? { userId: user._id as Id<"users"> } : "skip"
  );

  // Fallback mock data when Convex is not available
  const mockExams: ConvexExam[] = [
    {
      _id: generateMockConvexId("exams") as Id<"exams">,
      title: "Examen Básico de Aviación Comercial",
      description: "Examen básico que cubre los fundamentos de la aviación comercial incluyendo sistemas de aeronave y procedimientos básicos.",
      aircraftType: "A320_FAMILY",
      category: "General",
      difficulty: "intermediate",
      timeLimit: 60,
      passingScore: 75,
      questionsCount: 10,
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateMockConvexId("exams") as Id<"exams">,
      title: "Sistemas de Navegación",
      description: "Evaluación completa de los sistemas de navegación modernos utilizados en aviación comercial.",
      aircraftType: "BOEING_737",
      category: "Navigation",
      difficulty: "advanced",
      timeLimit: 90,
      passingScore: 80,
      questionsCount: 15,
      isActive: true,
      _creationTime: Date.now(),
    }
  ];

  // Use Convex data if available, otherwise use mock data
  const finalExams = exams && exams.length > 0 ? exams : mockExams;
  const isLoadingExams = exams === undefined;

  return {
    exams: finalExams,
    isLoadingExams,
    userExamSessions: userExamSessions || [],
  };
};

export const useExamSession = (examId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  // Mock exam data
  const mockExam: ConvexExam = {
    _id: examId as Id<"exams">,
    title: "Examen Básico de Aviación Comercial",
    description: "Examen básico que cubre los fundamentos de la aviación comercial.",
    aircraftType: "A320_FAMILY",
    category: "General",
    difficulty: "intermediate",
    timeLimit: 60,
    passingScore: 75,
    questionsCount: 10,
    isActive: true,
    _creationTime: Date.now(),
  };

  // Mock questions data
  const mockQuestions: ConvexExamQuestion[] = [
    {
      _id: generateMockConvexId("examQuestions") as Id<"examQuestions">,
      examId: examId as Id<"exams">,
      question: "¿Cuál es la presión normal del sistema hidráulico principal en una aeronave comercial?",
      options: ["3000 PSI", "2500 PSI", "3500 PSI", "4000 PSI"],
      correctAnswer: 0,
      explanation: "La presión normal del sistema hidráulico principal es de 3000 PSI.",
      aircraftType: "A320_FAMILY",
      category: "Sistema Hidráulico",
      difficulty: "intermediate",
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateMockConvexId("examQuestions") as Id<"examQuestions">,
      examId: examId as Id<"exams">,
      question: "¿Qué voltaje proporciona el generador principal de una aeronave comercial?",
      options: ["115V AC", "28V DC", "220V AC", "12V DC"],
      correctAnswer: 0,
      explanation: "El generador principal proporciona 115V AC trifásico a 400Hz.",
      aircraftType: "A320_FAMILY",
      category: "Sistema Eléctrico",
      difficulty: "intermediate",
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateMockConvexId("examQuestions") as Id<"examQuestions">,
      examId: examId as Id<"exams">,
      question: "¿Cuál es la función principal del sistema de combustible en una aeronave?",
      options: ["Proporcionar energía para los motores", "Controlar la presión en la cabina", "Mantener la temperatura en la cabina", "Operar los sistemas hidráulicos"],
      correctAnswer: 0,
      explanation: "El sistema de combustible tiene como función principal almacenar y suministrar combustible a los motores para generar empuje.",
      aircraftType: "A320_FAMILY",
      category: "Sistema de Combustible",
      difficulty: "intermediate",
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateMockConvexId("examQuestions") as Id<"examQuestions">,
      examId: examId as Id<"exams">,
      question: "¿Qué instrumento muestra la altitud de la aeronave?",
      options: ["Velocímetro", "Altimetro", "Variómetro", "Indicador de actitud"],
      correctAnswer: 1,
      explanation: "El altímetro es el instrumento que muestra la altitud de la aeronave sobre el nivel del mar.",
      aircraftType: "A320_FAMILY",
      category: "Instrumentos de Vuelo",
      difficulty: "beginner",
      isActive: true,
      _creationTime: Date.now(),
    },
    {
      _id: generateMockConvexId("examQuestions") as Id<"examQuestions">,
      examId: examId as Id<"exams">,
      question: "¿Qué tipo de sistema de frenos utilizan las aeronaves comerciales modernas?",
      options: ["Sistema hidráulico con discos múltiples", "Sistema neumático simple", "Frenos eléctricos electromagnéticos", "Sistema mecánico con cables"],
      correctAnswer: 0,
      explanation: "Las aeronaves modernas utilizan sistemas de frenos hidráulicos con discos múltiples.",
      aircraftType: "A320_FAMILY",
      category: "Sistema de Frenos",
      difficulty: "intermediate",
      isActive: true,
      _creationTime: Date.now(),
    },
  ];

  // Use Convex data if available, otherwise use mock data
  const exam = convexExam || mockExam;
  const questions = (convexQuestions && convexQuestions.length > 0) ? convexQuestions : mockQuestions;

  const startExamMutation = useConvexMutation(api.exams.startExamSession);
  const completeExamMutation = useConvexMutation(api.exams.completeExamSession);

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
      let sessionId = `mock-session-${Date.now()}`;
      
      try {
        const session = await startExamMutation({
          userId: user._id as Id<"users">,
          examId: examId as Id<"exams">,
          sessionType: "exam",
        });
        sessionId = session.sessionId;
      } catch (convexError) {
        console.log('Using mock exam session (Convex not available)');
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

      // Try to save to Convex, fallback to mock if it fails
      try {
        await completeExamMutation({
          userId: user._id as Id<"users">,
          examId: examId as Id<"exams">,
          sessionType: "exam",
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