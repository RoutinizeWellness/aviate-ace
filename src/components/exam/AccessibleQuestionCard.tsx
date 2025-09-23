import React, { useId } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Bookmark } from 'lucide-react';

interface AccessibleQuestionCardProps {
  question: {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    category: string;
    difficulty: string;
  };
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  isAnswered?: boolean;
  showExplanation?: boolean;
  onAnswerSelect: (index: number) => void;
  onBookmark?: () => void;
  mode: 'practice' | 'timed' | 'review';
}

export const AccessibleQuestionCard: React.FC<AccessibleQuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  onAnswerSelect,
  onBookmark,
  mode
}) => {
  const questionId = useId();

  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case 'advanced': return 'Avanzado';
      case 'intermediate': return 'Intermedio';
      case 'basic': 
      case 'beginner': return 'Básico';
      default: return difficulty;
    }
  };

  return (
    <Card className="surface-mid border-border/50">
      <CardContent className="p-8">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Target className="w-3 h-3 mr-1" />
              {question.category}
            </Badge>
            <Badge variant="outline" className="bg-warning/10 text-warning">
              {getDifficultyLabel(question.difficulty)}
            </Badge>
          </div>
          
          {onBookmark && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBookmark}
              aria-label="Marcar pregunta para revisión posterior"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Marcar
            </Button>
          )}
        </div>

        {/* Question Text */}
        <div className="mb-8">
          <h2 
            id={questionId}
            className="text-xl font-semibold leading-relaxed mb-6"
            role="heading"
            aria-level={2}
          >
            {question.question}
          </h2>
        </div>

        {/* Answer Options */}
        <fieldset className="space-y-4 mb-8">
          <legend className="sr-only">
            Opciones de respuesta para la pregunta {currentIndex + 1}
          </legend>
          
          <div role="radiogroup" aria-labelledby={questionId}>
            {question.options.map((option, index) => {
              const optionId = `option-${currentIndex}-${index}`;
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const isIncorrect = isAnswered && isSelected && !isCorrect;
              
              let optionClass = 'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all';
              
              if (isAnswered) {
                if (isCorrect) {
                  optionClass += ' border-success bg-success/10';
                } else if (isIncorrect) {
                  optionClass += ' border-destructive bg-destructive/10';
                } else {
                  optionClass += ' border-border bg-surface-light cursor-not-allowed';
                }
              } else {
                if (isSelected) {
                  optionClass += ' border-primary bg-primary/5';
                } else {
                  optionClass += ' border-border hover:border-primary/50 hover:bg-surface-light';
                }
              }

              return (
                <label key={index} htmlFor={optionId} className={optionClass}>
                  <input
                    type="radio"
                    id={optionId}
                    name={`question-${currentIndex}`}
                    value={index}
                    checked={isSelected}
                    onChange={() => onAnswerSelect(index)}
                    disabled={isAnswered && mode === 'practice'}
                    className="sr-only"
                  />
                  
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
                    ${isAnswered
                      ? isCorrect
                        ? 'border-success bg-success text-success-foreground'
                        : isIncorrect
                        ? 'border-destructive bg-destructive text-destructive-foreground'
                        : 'border-border bg-surface'
                      : isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-surface hover:border-primary'
                    }
                  `}>
                    <span className="text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <span className="text-sm leading-relaxed">
                      {option}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
};