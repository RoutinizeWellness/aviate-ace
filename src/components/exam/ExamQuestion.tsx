import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Target, CheckCircle, XCircle } from 'lucide-react';

interface ExamQuestionProps {
  question: {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    category?: string;
    difficulty?: string;
  };
  questionIndex: number;
  examMode: 'practice' | 'timed' | 'review';
  selectedAnswer: number | null;
  isAnswered: boolean;
  showExplanation: boolean;
  onSelectAnswer: (answerIndex: number) => void;
  onConfirmAnswer?: () => void;
}

export const ExamQuestion: React.FC<ExamQuestionProps> = ({
  question,
  questionIndex,
  examMode,
  selectedAnswer,
  isAnswered,
  showExplanation,
  onSelectAnswer,
  onConfirmAnswer
}) => {
  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'advanced': return 'Avanzado';
      case 'intermediate': return 'Intermedio';
      case 'basic': return 'Básico';
      default: return 'Básico';
    }
  };

  const getOptionClassName = (optionIndex: number) => {
    let baseClass = 'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all';
    
    if (examMode === 'practice') {
      if (isAnswered && showExplanation) {
        // Show results after confirmation
        if (optionIndex === question.correctAnswer) {
          return `${baseClass} border-success bg-success/10`;
        } else if (optionIndex === selectedAnswer && optionIndex !== question.correctAnswer) {
          return `${baseClass} border-destructive bg-destructive/10`;
        } else {
          return `${baseClass} border-border bg-surface-light`;
        }
      } else {
        // Selection state (before confirmation)
        if (selectedAnswer === optionIndex) {
          return `${baseClass} border-primary bg-primary/5`;
        } else {
          return `${baseClass} border-border hover:border-primary/50 hover:bg-surface-light`;
        }
      }
    } else {
      // Timed/Review modes
      if (selectedAnswer === optionIndex) {
        return `${baseClass} border-primary bg-primary/5`;
      } else {
        return `${baseClass} border-border hover:border-primary/50 hover:bg-surface-light`;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Target className="w-3 h-3 mr-1" />
            {question.category || 'General'}
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning">
            {getDifficultyLabel(question.difficulty)}
          </Badge>
        </div>
        
        <Button variant="ghost" size="sm">
          <Bookmark className="w-4 h-4 mr-2" />
          Marcar
        </Button>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 
          id={`question-${questionIndex}`}
          className="text-xl font-semibold leading-relaxed mb-6"
          role="heading"
          aria-level={2}
        >
          {question.question}
        </h2>
      </div>

      {/* Debug Info - Development Only */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
          <p><strong>Debug:</strong> examMode={examMode}, isAnswered={isAnswered ? 'true' : 'false'}, selectedAnswer={selectedAnswer}, showExplanation={showExplanation ? 'true' : 'false'}</p>
          <p><strong>Question ID:</strong> {question._id}</p>
          <p><strong>Options count:</strong> {question.options?.length || 0}</p>
        </div>
      )}

      {/* Answer Options */}
      <div 
        className="space-y-4 mb-8"
        role="radiogroup"
        aria-labelledby={`question-${questionIndex}`}
      >
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const isIncorrect = isAnswered && showExplanation && isSelected && !isCorrect;
          const showResult = isAnswered && showExplanation;
          
          return (
            <div
              key={index}
              className={getOptionClassName(index)}
              onClick={() => onSelectAnswer(index)}
              role="radio"
              tabIndex={0}
              aria-checked={isSelected}
              aria-describedby={showResult ? `option-${index}-result` : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectAnswer(index);
                }
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-sm leading-relaxed">{option}</span>
                
                {/* Result indicators for accessibility */}
                {showResult && (
                  <div className="flex items-center gap-2">
                    {isCorrect && (
                      <CheckCircle 
                        className="w-5 h-5 text-success" 
                        aria-label="Respuesta correcta"
                      />
                    )}
                    {isIncorrect && (
                      <XCircle 
                        className="w-5 h-5 text-destructive" 
                        aria-label="Respuesta incorrecta"
                      />
                    )}
                  </div>
                )}
              </div>
              
              {/* Screen reader result description */}
              {showResult && (
                <span 
                  id={`option-${index}-result`}
                  className="sr-only"
                >
                  {isCorrect ? 'Esta es la respuesta correcta' : 
                   isIncorrect ? 'Esta respuesta es incorrecta' : 
                   'Esta opción no fue seleccionada'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Button for Practice Mode */}
      {examMode === 'practice' && selectedAnswer !== null && !isAnswered && onConfirmAnswer && (
        <div className="flex justify-center">
          <Button onClick={onConfirmAnswer} size="lg">
            Confirmar Respuesta
          </Button>
        </div>
      )}
    </div>
  );
};