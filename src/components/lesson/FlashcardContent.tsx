import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

interface FlashcardContentProps {
  flashcards: Flashcard[];
  onComplete: () => void;
  onClose: () => void;
}

const FlashcardContent: React.FC<FlashcardContentProps> = ({ 
  flashcards, 
  onComplete, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());

  const currentCard = flashcards[currentIndex];
  const progress = ((studiedCards.size) / flashcards.length) * 100;
  const allStudied = studiedCards.size === flashcards.length;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    
    // Mark card as studied when flipped to see the answer
    if (!isFlipped) {
      setStudiedCards(prev => new Set([...prev, currentCard.id]));
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Card {currentIndex + 1} of {flashcards.length}</span>
          <span>{studiedCards.size} studied</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <Card className="h-80 cursor-pointer" onClick={flipCard}>
        <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center">
          {!isFlipped ? (
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground uppercase">
                {currentCard.category}
              </div>
              <h3 className="text-xl font-semibold">
                {currentCard.front}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                Click to reveal answer
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-primary uppercase">Answer</div>
              <p className="text-lg">{currentCard.back}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <EyeOff className="w-4 h-4" />
                Click to flip back
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevCard}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button variant="ghost" onClick={flipCard}>
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </Button>

        <Button
          variant="outline"
          onClick={nextCard}
          disabled={currentIndex === flashcards.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Completion */}
      {allStudied && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Great job!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've studied all {flashcards.length} flashcards.
            </p>
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {allStudied && (
          <Button onClick={onComplete}>
            Complete Flashcards
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlashcardContent;