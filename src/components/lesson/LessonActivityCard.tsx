import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Play } from 'lucide-react';

interface LessonActivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isEnabled: boolean;
  onStart: () => void;
  disabledMessage?: string;
}

export const LessonActivityCard = memo<LessonActivityCardProps>(({
  title,
  description,
  icon,
  isCompleted,
  isEnabled,
  onStart,
  disabledMessage
}) => {
  return (
    <Card className={`border-2 ${isCompleted ? 'border-green-500' : 'border-border'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
        <Button 
          className="w-full"
          variant={isEnabled ? "default" : "secondary"}
          onClick={onStart}
          disabled={!isEnabled}
          aria-label={isCompleted ? `${title} completed` : `Start ${title}`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {isEnabled ? `Start ${title}` : disabledMessage || `Complete previous activities first`}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

LessonActivityCard.displayName = 'LessonActivityCard';