import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Plane } from "lucide-react";

interface ExamHeaderProps {
  examTitle: string;
  examMode: 'practice' | 'timed' | 'review';
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  onExitExam: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getModeLabel = (mode: string): string => {
  switch (mode) {
    case 'timed': return 'Modo Examen Cronometrado';
    case 'review': return 'Modo Repaso';
    default: return 'Modo Práctica';
  }
};

export const ExamHeader = ({
  examTitle,
  examMode,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  onExitExam
}: ExamHeaderProps) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <header 
      className="border-b border-border bg-surface-dark sticky top-0 z-50"
      role="banner"
      aria-label="Encabezado del examen"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExitExam}
              aria-label="Salir del examen y volver al menú principal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Salir del Examen
            </Button>
            
            <div className="flex items-center gap-3">
              <Plane className="w-6 h-6 text-primary" aria-hidden="true" />
              <div>
                <h1 className="font-bold" id="exam-title">{examTitle}</h1>
                <p className="text-xs text-muted-foreground" id="exam-mode">
                  {getModeLabel(examMode)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2 text-sm"
              role="timer"
              aria-label={`Tiempo restante: ${formatTime(timeRemaining)}`}
            >
              <Clock className="w-4 h-4 text-warning" aria-hidden="true" />
              <span 
                className="font-mono text-lg font-bold text-warning"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`${Math.floor(timeRemaining / 60)} minutos y ${timeRemaining % 60} segundos restantes`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary"
              role="status"
              aria-label={`Progreso del examen: pregunta ${currentQuestionIndex + 1} de ${totalQuestions}, ${Math.round(progressPercentage)}% completado`}
            >
              Pregunta {currentQuestionIndex + 1} de {totalQuestions}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};