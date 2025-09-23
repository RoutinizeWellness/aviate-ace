import { Progress } from "@/components/ui/progress";

interface ExamProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const ExamProgressBar = ({ currentQuestionIndex, totalQuestions }: ExamProgressBarProps) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="border-b border-border bg-surface-mid">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">Progreso del examen</span>
          <span className="font-medium">{Math.round(progressPercentage)}% completado</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};