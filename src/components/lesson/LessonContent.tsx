import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface LessonContentProps {
  content: string;
  title?: string;
}

export const LessonContent: React.FC<LessonContentProps> = ({ 
  content, 
  title = "Lesson Content" 
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
          role="article"
          aria-label="Lesson content"
        />
      </CardContent>
    </Card>
  );
};