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
  Flag
} from "lucide-react";
import { useState } from "react";

const ExamMode = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(1854); // 30:54 in seconds
  const [bookmarked, setBookmarked] = useState(false);

  const totalQuestions = 50;
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sampleQuestion = {
    id: 1,
    category: "Sistemas Hidráulicos",
    difficulty: "Intermedio",
    question: "En el sistema hidráulico del A320, ¿cuál es la función principal de la bomba de motor (EMP) en caso de fallo de la bomba eléctrica principal?",
    options: [
      "Proporcionar presión hidráulica de emergencia únicamente para los controles de vuelo primarios",
      "Mantener la presión del sistema hidráulico completo cuando la bomba eléctrica falla",
      "Activar automáticamente el sistema de reversión manual (manual reversion)",
      "Suministrar presión solo para el tren de aterrizaje y frenos en emergencia"
    ],
    correctAnswer: 1,
    explanation: "La bomba de motor (EMP) está diseñada para mantener la operación del sistema hidráulico completo cuando la bomba eléctrica principal falla, asegurando la continuidad operacional del circuito hidráulico.",
    reference: "A320 FCOM - Hydraulic System"
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setBookmarked(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-dark sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Salir del Examen
              </Button>
              
              <div className="flex items-center gap-3">
                <Plane className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="font-bold">Simulacro A320 - Sistemas</h1>
                  <p className="text-xs text-muted-foreground">Modo Examen Cronometrado</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-warning" />
                <span className="font-mono text-lg font-bold text-warning">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Pregunta {currentQuestion} de {totalQuestions}
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
                  {sampleQuestion.category}
                </Badge>
                <Badge variant="outline" className="bg-warning/10 text-warning">
                  {sampleQuestion.difficulty}
                </Badge>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBookmark}
                className={bookmarked ? "text-warning" : ""}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                {bookmarked ? "Marcada" : "Marcar"}
              </Button>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold leading-relaxed mb-6">
                {sampleQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {sampleQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`
                    flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedAnswer === index 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-surface-light'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
                    ${selectedAnswer === index 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground'
                    }
                  `}>
                    {selectedAnswer === index && (
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
                  onClick={handlePrevious}
                  disabled={currentQuestion === 1}
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
                {currentQuestion === totalQuestions ? (
                  <Button className="bg-success hover:bg-success/90" size="lg">
                    <Target className="w-4 h-4 mr-2" />
                    Finalizar Examen
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
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
              <p className="text-xs text-muted-foreground">Se guarda automáticamente</p>
            </CardContent>
          </Card>

          <Card className="surface-light border-border/50">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Respondidas</h3>
              <p className="text-lg font-bold text-primary">{selectedAnswer !== null ? currentQuestion : currentQuestion - 1}/50</p>
            </CardContent>
          </Card>

          <Card className="surface-light border-border/50">
            <CardContent className="p-4 text-center">
              <Bookmark className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">Marcadas</h3>
              <p className="text-lg font-bold text-warning">3</p>
            </CardContent>
          </Card>
        </div>

        {/* Backend Notice */}
        <div className="mt-8 p-4 surface-light rounded-lg border border-info/20 bg-info/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-info mb-1">Funcionalidad Completa con Supabase</p>
              <p className="text-muted-foreground">
                Esta es una demostración del modo examen. Para activar el cronómetro real, 
                guardado automático, banco completo de preguntas y estadísticas, conecta 
                el proyecto con Supabase usando el botón verde superior.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamMode;