import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  completeButtonText?: string;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  title,
  icon,
  children,
  completeButtonText = "Mark as Complete"
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <Card className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <CardHeader>
          <CardTitle 
            id="modal-title"
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {icon}
              {title}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {completeButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};