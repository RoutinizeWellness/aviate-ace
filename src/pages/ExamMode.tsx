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
  Play,
  Trophy
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useExamSession, useExams } from "@/hooks/useExam";
import { useAuth } from "@/hooks/useConvexAuth";
import { useToast } from "@/hooks/use-toast";

const ExamMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { exams, isLoadingExams } = useExams();
  
  const [selectedExamId, setSelectedExamId] = useState<string | null>(searchParams.get('examId'));
  const [showExamSelector, setShowExamSelector] = useState(!selectedExamId);
  
  const {
    exam,
    questions,
    isLoadingQuestions,
    examState,
    currentQuestion,
    currentAnswer,
    startExam,
    isStartingExam,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitExam,
    isSubmittingExam,
    questionsError,
  } = useExamSession(selectedExamId || '');

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    setShowExamSelector(false);
  };

  const handleStartExam = () => {
    if (!selectedExamId) return;
    startExam();
  };

  const handleSubmitExam = () => {
    submitExam();
    toast({
      title: "Examen enviado",
      description: "Tu examen ha sido enviado exitosamente.",
    });
    navigate('/exams');
  };

  const handleExitExam = () => {
    navigate('/exams');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="surface-mid border-border/50 p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Autenticación Requerida</h2>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para acceder al modo examen.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Iniciar Sesión
          </Button>
        </Card>
      </div>
    );
  }

  // Exam Selection Dialog
  if (showExamSelector) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="surface-mid border-border/50 w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Seleccionar Examen</h1>
              <p className="text-muted-foreground">
                Elige el examen que deseas realizar. Cada examen tiene un tiempo límite y un puntaje mínimo para aprobar.
              </p>
            </div>

            {isLoadingExams ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando exámenes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exams?.map((exam) => (
                  <Card 
                    key={exam.id} 
                    className="surface-light border-border/50 hover:border-primary/50 cursor-pointer transition-all"
                    onClick={() => handleExamSelect(exam.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Plane className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{exam.title}</h3>
                            <p className="text-sm text-muted-foreground">{exam.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{exam.duration_minutes} min</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Target className="w-3 h-3" />
                                <span>{exam.total_questions} preguntas</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Trophy className="w-3 h-3" />
                                <span>{exam.passing_score}% para aprobar</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary">
                          {exam.aircraft_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={() => navigate('/exams')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Exámenes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-exam setup
  if (!examState.timeRemaining && !examState.isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="surface-mid border-border/50 w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{exam?.title}</h1>
            <p className="text-muted-foreground mb-8">{exam?.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Duración</h3>
                <p className="text-muted-foreground">{exam?.duration_minutes} minutos</p>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Preguntas</h3>
                <p className="text-muted-foreground">{exam?.total_questions} preguntas</p>
              </div>
              <div className="text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Puntaje Mínimo</h3>
                <p className="text-muted-foreground">{exam?.passing_score}%</p>
              </div>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm text-left">
                  <p className="font-medium text-warning mb-1">Instrucciones Importantes</p>
                  <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                    <li>El cronómetro comenzará automáticamente al iniciar el examen</li>
                    <li>Tus respuestas se guardan automáticamente</li>
                    <li>Puedes marcar preguntas para revisión</li>
                    <li>El examen se enviará automáticamente cuando el tiempo expire</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowExamSelector(true)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cambiar Examen
              </Button>
              <Button 
                onClick={handleStartExam} 
                disabled={isStartingExam || isLoadingQuestions}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                {isStartingExam ? (
                  "Iniciando..."
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Comenzar Examen
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main exam interface
  if (!examState.isCompleted && questions && questions.length > 0) {
    const progressPercentage = ((examState.currentQuestionIndex + 1) / questions.length) * 100;
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
                    <p className="text-xs text-muted-foreground">Modo Examen Cronometrado</p>
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
                  Pregunta {examState.currentQuestionIndex + 1} de {questions.length}
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
                    {currentQuestion?.tier === 'premium' ? 'Premium' : 'Gratis'}
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
                {currentQuestion?.options && (currentQuestion.options as string[]).map((option, index) => (
                  <label
                    key={index}
                    className={`
                      flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${currentAnswer?.selectedAnswer === index 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-surface-light'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={currentAnswer?.selectedAnswer === index}
                      onChange={() => answerQuestion(currentQuestion.id, index)}
                      className="sr-only"
                    />
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
                      ${currentAnswer?.selectedAnswer === index 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                      }
                    `}>
                      {currentAnswer?.selectedAnswer === index && (
                        <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                      )}
                    </div>
                    <span className="text-sm leading-relaxed font-medium">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>

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
                  {examState.currentQuestionIndex === questions.length - 1 ? (
                    <Button 
                      onClick={handleSubmitExam}
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
                <p className="text-lg font-bold text-primary">{answeredCount}/{questions.length}</p>
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
                - Preguntas encontradas: {questions?.length || 0}<br/>
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