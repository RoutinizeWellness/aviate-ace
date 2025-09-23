import React from 'react';
import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VirtualizedQuestionListProps {
  questions: RealAviationQuestion[];
  height?: number;
  itemHeight?: number;
  onQuestionSelect?: (question: RealAviationQuestion) => void;
  className?: string;
}

export const VirtualizedQuestionList: React.FC<VirtualizedQuestionListProps> = ({
  questions,
  height = 600,
  onQuestionSelect,
  className = ''
}) => {
  if (questions.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <p className="text-muted-foreground">No questions available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 overflow-y-auto ${className}`} style={{ maxHeight: height }}>
      {questions.slice(0, 50).map((question, index) => (
        <Card 
          key={question._id || index}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onQuestionSelect?.(question)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {question.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  question.difficulty === 'advanced' ? 'bg-red-50 text-red-700' :
                  question.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-green-50 text-green-700'
                }`}
              >
                {question.difficulty}
              </Badge>
            </div>
            
            <p className="text-sm font-medium line-clamp-2 mb-2">
              {question.question}
            </p>
            
            <div className="text-xs text-muted-foreground">
              {question.aircraftType} • {question.options.length} options
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};