import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { RealAviationQuestion } from '@/data/realAviationQuestions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuestionItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    questions: RealAviationQuestion[];
    onQuestionSelect?: (question: RealAviationQuestion) => void;
  };
}

const QuestionItem: React.FC<QuestionItemProps> = ({ index, style, data }) => {
  const { questions, onQuestionSelect } = data;
  const question = questions[index];

  const handleClick = useCallback(() => {
    onQuestionSelect?.(question);
  }, [question, onQuestionSelect]);

  if (!question) return null;

  return (
    <div style={style} className="px-2 py-1">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleClick}
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
    </div>
  );
};

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
  itemHeight = 120,
  onQuestionSelect,
  className = ''
}) => {
  const itemData = useMemo(() => ({
    questions,
    onQuestionSelect
  }), [questions, onQuestionSelect]);

  if (questions.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <p className="text-muted-foreground">No questions available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={questions.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={5} // Render 5 extra items for smooth scrolling
      >
        {QuestionItem}
      </List>
    </div>
  );
};