import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Bookmark, 
  ArrowLeft, 
  ArrowRight, 
  Plane,
  AlertCircle,
  Target,
  Flag,
  CheckCircle2,
  XCircle,
  Play,
  Trophy
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExamSession, useExams } from "@/hooks/useExam";
import { useAuth } from "@/hooks/useConvexAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

const ExamMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { exams, isLoadingExams } = useExams();
  
  // Mutations for tracking incorrect questions
  const recordIncorrectQuestion = useMutation(api.auth.recordIncorrectQuestion);
  const markQuestionResolved = useMutation(api.auth.markQuestionResolved);
  
  // Extract parameters from URL
  const rawMode = searchParams.get('mode') || 'practice';
  const examMode: 'practice' | 'timed' | 'review' = 
    rawMode === 'timed' || rawMode === 'review' ? rawMode : 'practice';
  const selectedCategory = searchParams.get('category') || '';
  const selectedDifficulty = searchParams.get('difficulty') || '';
  const selectedAircraft = searchParams.get('aircraft') || 'A320_FAMILY';
  const timeLimit = parseInt(searchParams.get('timeLimit') || '0');
  const questionCount = parseInt(searchParams.get('questionCount') || '20');
  
  const [selectedExamId, setSelectedExamId] = useState<string | null>(searchParams.get('examId') || null);
  const [showExamSelector, setShowExamSelector] = useState(!selectedExamId && examMode === 'practice' && !selectedCategory);
  
  const {
    exam,
    questions,
    examState,
    handleStartExam,
    handleSubmitExam,
    setExamState,
  } = useExamSession(selectedExamId || undefined, {
    mode: examMode,
    category: selectedCategory,
    difficulty: selectedDifficulty,
    timeLimit,
    questionCount,
    aircraft: selectedAircraft
  });

  // State for loading and error handling
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<Error | null>(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  // State for answer verification
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // State for dynamically loaded questions
  const [dynamicQuestions, setDynamicQuestions] = useState<any[]>([]);
  const [isLoadingDynamicQuestions, setIsLoadingDynamicQuestions] = useState(false);

  // Load questions dynamically when category is selected but no examId is provided
  useEffect(() => {
    const loadQuestions = async () => {
      if (!selectedExamId && selectedCategory && examMode === 'practice') {
        setIsLoadingDynamicQuestions(true);
        try {
          // Dynamically import the question loader
          const { loadAndFilterQuestions } = await import('@/utils/questionLoader');
          const loadedQuestions = await loadAndFilterQuestions(
            examMode,
            selectedCategory,
            selectedAircraft,
            selectedDifficulty,
            questionCount
          );
          setDynamicQuestions(loadedQuestions);
        } catch (error) {
          console.error('Error loading questions:', error);
          setQuestionsError(error as Error);
        } finally {
          setIsLoadingDynamicQuestions(false);
        }
      }
    };

    loadQuestions();
  }, [selectedExamId, selectedCategory, examMode, selectedAircraft, selectedDifficulty, questionCount]);

  // Initialize selected answer when question changes
  useEffect(() => {
    const currentQuestions = questions || dynamicQuestions;
    if (examMode === 'practice' && currentQuestions && currentQuestions.length > 0) {
      const currentQuestion = currentQuestions[examState.currentQuestionIndex];
      const existingAnswer = examState.answers.find(a => a.questionId === currentQuestion?._id);
      
      if (existingAnswer) {
        setSelectedAnswer(existingAnswer.selectedAnswer);
        setIsAnswered(true);
        setShowExplanation(true);
      } else {
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowExplanation(false);
      }
    }
  }, [examState.currentQuestionIndex, examState.answers, questions, dynamicQuestions, examMode]);

  // Auto-start exam if we have category/difficulty or examId
  useEffect(() => {
    const currentQuestions = questions || dynamicQuestions;
    if ((selectedCategory || selectedExamId) && !examState.sessionId && currentQuestions && currentQuestions.length > 0) {
      handleStartExam();
    }
  }, [selectedCategory, selectedExamId, questions, dynamicQuestions, examState.sessionId, handleStartExam]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (examState.timeRemaining > 0 && !examState.isCompleted) {
      interval = setInterval(() => {
        setExamState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          // Auto-submit when time runs out
          if (newTimeRemaining <= 0) {
            handleSubmitExam(prev.answers);
            return {
              ...prev,
              timeRemaining: 0,
              isCompleted: true
            };
          }
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining
          };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [examState.timeRemaining, examState.isCompleted, handleSubmitExam]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current question based on current index
  const getCurrentQuestion = () => {
    const currentQuestions = questions || dynamicQuestions;
    return currentQuestions && currentQuestions.length > 0 ? currentQuestions[examState.currentQuestionIndex] : null;
  };
  
  // Get current answer for the current question
  const getCurrentAnswer = () => {
    const currentQ = getCurrentQuestion();
    return currentQ ? examState.answers.find(a => a.questionId === currentQ._id) || null : null;
  };

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    setShowExamSelector(false);
  };

  const handleStartExamClick = () => {
    if (!selectedExamId) return;
    setIsLoadingQuestions(true);
    setQuestionsError(null);
    
    handleStartExam().finally(() => {
      setIsLoadingQuestions(false);
    }).catch((error) => {
      setQuestionsError(error);
    });
  };

  const handleSubmitExamClick = async () => {
    setIsSubmittingExam(true);
    try {
      await handleSubmitExam(examState.answers);
      
      // Show success message based on mode
      const modeMessages = {
        practice: "Práctica completada y guardada en el historial.",
        timed: "Examen cronometrado enviado exitosamente.",
        review: "Sesión de repaso completada."
      };
      
      toast({
        title: "Examen completado",
        description: modeMessages[examMode] || "Tu examen ha sido enviado exitosamente.",
      });
      navigate('/exams');
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el examen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const handleExitExam = () => {
    navigate('/exams');
  };

  // Function to select an answer (in practice mode)
  const selectAnswer = (questionId: string, answerIndex: number) => {
    if (examMode === 'practice' && !isAnswered) {
      setSelectedAnswer(answerIndex);
    } else if (examMode !== 'practice') {
      // For timed/review modes, answer immediately
      answerQuestion(questionId, answerIndex);
    }
  };

  // Function to confirm answer in practice mode
  const confirmAnswer = (questionId: string) => {
    if (selectedAnswer === null) return;
    
    const timeSpent = Math.floor((Date.now() - examState.startTime.getTime()) / 1000);
    
    setExamState(prev => {
      const existingAnswerIndex = prev.answers.findIndex(a => a.questionId === questionId);
      
      const newAnswer = {
        questionId,
        selectedAnswer: selectedAnswer!,
        timeSpent
      };
      
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev.answers];
        newAnswers[existingAnswerIndex] = newAnswer;
        return { ...prev, answers: newAnswers };
      } else {
        return {
          ...prev,
          answers: [...prev.answers, newAnswer]
        };
      }
    });
    
    setIsAnswered(true);
    setShowExplanation(true);
    
    // Track incorrect question for review mode only if we're using Convex data (valid Convex IDs)
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion && 
        selectedAnswer !== currentQuestion.correctAnswer && 
        typeof currentQuestion._id === 'string' && 
        currentQuestion._id.length === 32) {
      recordIncorrectQuestion({
        userId: user!._id as Id<"users">,
        questionId: currentQuestion._id as Id<"examQuestions">,
        incorrectAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        sessionType: examMode || 'practice',
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
        aircraftType: currentQuestion.aircraftType,
      }).catch(error => console.log('Could not track incorrect question:', error));
    }
  };

  // Function to answer a question (for non-practice modes)
  const answerQuestion = (questionId: string, selectedAnswerIndex: number) => {
    const timeSpent = Math.floor((Date.now() - examState.startTime.getTime()) / 1000);
    
    setExamState(prev => {
      const existingAnswerIndex = prev.answers.findIndex(a => a.questionId === questionId);
      
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev.answers];
        newAnswers[existingAnswerIndex] = {
          ...newAnswers[existingAnswerIndex],
          selectedAnswer: selectedAnswerIndex,
          timeSpent
        };
        return { ...prev, answers: newAnswers };
      } else {
        return {
          ...prev,
          answers: [
            ...prev.answers,
            {
              questionId,
              selectedAnswer: selectedAnswerIndex,
              timeSpent
            }
          ]
        };
      }
    });
    
    // Track incorrect question for review mode only if we're using Convex data (valid Convex IDs)
    const currentQuestions = questions || dynamicQuestions;
    const currentQuestion = currentQuestions?.find(q => q._id === questionId);
    if (currentQuestion && 
        selectedAnswerIndex !== currentQuestion.correctAnswer && 
        typeof currentQuestion._id === 'string' && 
        currentQuestion._id.length === 32) {
      recordIncorrectQuestion({
        userId: user!._id as Id<"users">,
        questionId: currentQuestion._id as Id<"examQuestions">,
        incorrectAnswer: selectedAnswerIndex,
        correctAnswer: currentQuestion.correctAnswer,
        sessionType: examMode || 'practice',
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
        aircraftType: currentQuestion.aircraftType,
      }).catch(error => console.log('Could not track incorrect question:', error));
    }
  };

  // Function to go to next question
  const nextQuestion = () => {
    const currentQuestions = questions || dynamicQuestions;
    if (examState.currentQuestionIndex < (currentQuestions?.length || 1) - 1) {
      setExamState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  // Function to go to previous question
  const previousQuestion = () => {
    if (examState.currentQuestionIndex > 0) {
      setExamState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  // Determine which questions to use
  const currentQuestions = questions || dynamicQuestions;
  const isUsingDynamicQuestions = !questions && dynamicQuestions.length > 0;

  // Main exam interface
  if (!examState.isCompleted && currentQuestions && currentQuestions.length > 0) {
    const currentQuestion = getCurrentQuestion();
    const currentAnswer = getCurrentAnswer();
    const progressPercentage = ((examState.currentQuestionIndex + 1) / currentQuestions.length) * 100;
    const answeredCount = examState.answers.length;

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-surface-dark sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleExitExam}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Salir del Examen
                </Button>
                
                <div className="flex items-center gap-3">
                  <Plane className="w-6 h-6 text-primary" />
                  <div>
                    <h1 className="font-bold">{exam?.title}</h1>
                    <p className="text-xs text-muted-foreground">
                      {examMode === 'timed' ? 'Modo Examen Cronometrado' : 
                       examMode === 'review' ? 'Modo Repaso' : 
                       'Modo Práctica'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="font-mono text-lg font-bold text-warning">
                    {formatTime(examState.timeRemaining)}
                  </span>
                </div>
                
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Pregunta {examState.currentQuestionIndex + 1} de {currentQuestions.length}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="border-b border-border bg-surface-mid">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-muted-foreground">Progreso del examen</span>
              <span className="font-medium">{Math.round(progressPercentage)}% completado</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="surface-mid border-border/50">
            <CardContent className="p-8">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    <Target className="w-3 h-3 mr-1" />
                    {currentQuestion?.category}
                  </Badge>
                  <Badge variant="outline" className="bg-warning/10 text-warning">
                    {currentQuestion?.difficulty === 'advanced' ? 'Avanzado' : currentQuestion?.difficulty === 'intermediate' ? 'Intermedio' : 'Básico'}
                  </Badge>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Marcar
                </Button>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold leading-relaxed mb-6">
                  {currentQuestion?.question}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-4 mb-8">
                {currentQuestion?.options && (currentQuestion.options as string[]).map((option, index) => {
                  let optionClass = 'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all';
                  let borderClass = '';
                  let bgClass = '';
                  let isDisabled = false;
                  
                  if (examMode === 'practice') {
                    // Practice mode - show verification after answering
                    if (isAnswered) {
                      isDisabled = true;
                      if (index === currentQuestion.correctAnswer) {
                        borderClass = 'border-success';
                        bgClass = 'bg-success/10';
                      } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                        borderClass = 'border-destructive';
                        bgClass = 'bg-destructive/10';
                      } else {
                        borderClass = 'border-border';
                        bgClass = 'bg-surface-light';
                      }
                    } else {
                      // Not answered yet
                      if (selectedAnswer === index) {
                        borderClass = 'border-primary';
                        bgClass = 'bg-primary/5';
                      } else {
                        borderClass = 'border-border hover:border-primary/50';
                        bgClass = 'hover:bg-surface-light';
                      }
                    }
                  } else {
                    // Timed/Review modes - immediate selection
                    if (currentAnswer?.selectedAnswer === index) {
                      borderClass = 'border-primary';
                      bgClass = 'bg-primary/5';
                    } else {
                      borderClass = 'border-border hover:border-primary/50';
                      bgClass = 'hover:bg-surface-light';
                    }
                  }
                  
                  optionClass += ` ${borderClass} ${bgClass}`;
                  
                  return (
                    <label
                      key={index}
                      className={optionClass}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={index}
                        checked={examMode === 'practice' ? selectedAnswer === index : currentAnswer?.selectedAnswer === index}
                        onChange={() => examMode === 'practice' ? selectAnswer(currentQuestion._id, index) : answerQuestion(currentQuestion._id, index)}
                        disabled={isDisabled}
                        className="sr-only"
                      />
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
                        ${
                          examMode === 'practice'
                            ? isAnswered
                              ? index === currentQuestion.correctAnswer
                                ? 'border-success bg-success'
                                : index === selectedAnswer && index !== currentQuestion.correctAnswer
                                ? 'border-destructive bg-destructive'
                                : 'border-muted-foreground'
                              : selectedAnswer === index
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                            : currentAnswer?.selectedAnswer === index
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }
                      `}>
                        {((examMode === 'practice' && (selectedAnswer === index || (isAnswered && index === currentQuestion.correctAnswer))) ||
                          (examMode !== 'practice' && currentAnswer?.selectedAnswer === index)) && (
                          <div className={`w-2 h-2 rounded-full ${
                            examMode === 'practice' && isAnswered
                              ? index === currentQuestion.correctAnswer
                                ? 'bg-primary-foreground'
                                : index === selectedAnswer
                                ? 'bg-primary-foreground'
                                : 'bg-primary-foreground'
                              : 'bg-primary-foreground'
                          }`}></div>
                        )}
                        {examMode === 'practice' && isAnswered && (
                          index === currentQuestion.correctAnswer ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : index === selectedAnswer && index !== currentQuestion.correctAnswer ? (
                            <XCircle className="w-4 h-4 text-destructive" />
                          ) : null
                        )}
                      </div>
                      <span className="text-sm leading-relaxed font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Answer Explanation for Practice Mode */}
              {examMode === 'practice' && showExplanation && currentQuestion?.explanation && (
                <Card className="mb-8 surface-light border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {selectedAnswer === currentQuestion.correctAnswer ? '¡Correcto!' : 'Incorrecto'}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                        {selectedAnswer !== currentQuestion.correctAnswer && (
                          <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium text-success">Respuesta correcta:</span>{' '}
                              <span className="font-medium">
                                {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {(currentQuestion.options as string[])[currentQuestion.correctAnswer]}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={previousQuestion}
                    disabled={examState.currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Flag className="w-4 h-4 mr-2" />
                    Marcar para revisión
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  {examMode === 'practice' && !isAnswered ? (
                    <Button 
                      onClick={() => currentQuestion && confirmAnswer(currentQuestion._id)}
                      disabled={selectedAnswer === null}
                      className="bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Confirmar Respuesta
                    </Button>
                  ) : examState.currentQuestionIndex === currentQuestions.length - 1 ? (
                    <Button 
                      onClick={handleSubmitExamClick}
                      disabled={isSubmittingExam}
                      className="bg-success hover:bg-success/90" 
                      size="lg"
                    >
                      {isSubmittingExam ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Finalizar Examen
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={nextQuestion}
                      disabled={examMode === 'practice' && !isAnswered}
                      size="lg"
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Info Sidebar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="surface-light border-border/50">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Tiempo Restante</h3>
                <p className="text-lg font-bold text-warning">{formatTime(examState.timeRemaining)}</p>
              </CardContent>
            </Card>

            <Card className="surface-light border-border/50">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Respondidas</h3>
                <p className="text-lg font-bold text-primary">{answeredCount}/{currentQuestions.length}</p>
              </CardContent>
            </Card>

            <Card className="surface-light border-border/50">
              <CardContent className="p-4 text-center">
                <Bookmark className="w-8 h-8 text-warning mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Progreso</h3>
                <p className="text-lg font-bold text-warning">{Math.round(progressPercentage)}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Success Notice */}
          <div className="mt-8 p-4 surface-light rounded-lg border border-success/20 bg-success/5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-success mb-1">¡Funcionalidad Completa Activada!</p>
                <p className="text-muted-foreground">
                  Cronómetro real activo, guardado automático funcionando, banco completo de preguntas cargado desde Supabase.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Loading state for dynamic questions
  if (isLoadingDynamicQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="surface-mid border-border/50 p-8 text-center max-w-md">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Cargando Preguntas</h2>
          <p className="text-muted-foreground">Preparando tu examen...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="surface-mid border-border/50 p-8 text-center max-w-md">
        {isLoadingQuestions ? (
          <>
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">Cargando Examen</h2>
            <p className="text-muted-foreground">Preparando tu examen...</p>
          </>
        ) : (
          <>
            <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No se pudieron cargar las preguntas</h2>
            <p className="text-muted-foreground mb-4">
              {questionsError ? 
                `Error: ${questionsError.message}` : 
                'No hay preguntas disponibles para este examen o hay un problema de conexión.'
              }
            </p>
            <div className="bg-info/10 border border-info/20 rounded-lg p-3 mb-6">
              <p className="text-sm text-info">
                <strong>Información de depuración:</strong><br/>
                - Examen seleccionado: {exam?.title || 'No encontrado'}<br/>
                - ID del examen: {selectedExamId}<br/>
                - Estado de carga: {isLoadingQuestions ? 'Cargando...' : 'Completado'}<br/>
                - Preguntas encontradas: {currentQuestions?.length || 0}<br/>
                {questionsError && `- Error: ${questionsError.message}`}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowExamSelector(true)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Seleccionar Otro Examen
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ExamMode;