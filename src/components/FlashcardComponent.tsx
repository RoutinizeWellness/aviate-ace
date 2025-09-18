import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff,
  CheckCircle2,
  X,
  RefreshCw,
  Trophy
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  image?: string;
}

interface FlashcardComponentProps {
  flashcards: Flashcard[];
  onComplete?: (completedCount: number) => void;
}

export const FlashcardComponent = ({ flashcards, onComplete }: FlashcardComponentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [incorrectCards, setIncorrectCards] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const isMobile = useIsMobile();

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnowCard = () => {
    if (!completedCards.includes(currentCard.id)) {
      setCompletedCards([...completedCards, currentCard.id]);
    }
    // Remove from incorrect if it was there
    setIncorrectCards(incorrectCards.filter(id => id !== currentCard.id));
    handleNext();
  };

  const handleDontKnowCard = () => {
    if (!incorrectCards.includes(currentCard.id)) {
      setIncorrectCards([...incorrectCards, currentCard.id]);
    }
    // Remove from completed if it was there
    setCompletedCards(completedCards.filter(id => id !== currentCard.id));
    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompletedCards([]);
    setIncorrectCards([]);
    setShowResults(false);
  };

  const handleStudyIncorrect = () => {
    // Filter to only incorrect cards and reset
    const incorrectCardsList = flashcards.filter(card => incorrectCards.includes(card.id));
    if (incorrectCardsList.length > 0) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowResults(false);
      // Reset progress for incorrect cards
      setCompletedCards([]);
      setIncorrectCards([]);
    }
  };

  const calculateScore = () => {
    return Math.round((completedCards.length / flashcards.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <Card className="surface-mid border-border/50">
        <CardContent className={`${isMobile ? 'p-4' : 'p-8'} text-center`}>
          <Trophy className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 text-primary`} />
          <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>
            Flashcard Session Complete!
          </h3>
          <p className="text-muted-foreground mb-6">
            You've completed all {flashcards.length} flashcards
          </p>
          
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'} mb-8`}>
            <div className="text-center">
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-success mb-1`}>
                {completedCards.length}
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Known Cards
              </p>
            </div>
            <div className="text-center">
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-destructive mb-1`}>
                {incorrectCards.length}
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Need Review
              </p>
            </div>
            <div className="text-center">
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary mb-1`}>
                {score}%
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Success Rate
              </p>
            </div>
          </div>

          <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'justify-center'}`}>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Study Again
            </Button>
            {incorrectCards.length > 0 && (
              <Button onClick={handleStudyIncorrect} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Review Incorrect ({incorrectCards.length})
              </Button>
            )}
            <Button 
              onClick={() => {
                onComplete?.(completedCards.length);
              }}
              disabled={score < 80}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {score >= 80 ? 'Mark Complete' : `Need 80% to Complete (${score}%)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
            Card {currentIndex + 1} of {flashcards.length}
          </h3>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            Tap card to flip • Mark your knowledge level
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-success/10 text-success">
            Known: {completedCards.length}
          </Badge>
          <Badge variant="outline" className="bg-destructive/10 text-destructive">
            Review: {incorrectCards.length}
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Flashcard */}
      <Card 
        className={`surface-mid border-border/50 cursor-pointer transition-all duration-300 hover:shadow-lg ${
          isMobile ? 'min-h-[300px]' : 'min-h-[400px]'
        }`}
        onClick={handleFlip}
      >
        <CardContent className={`${isMobile ? 'p-6' : 'p-8'} h-full flex flex-col justify-center`}>
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              {isFlipped ? (
                <EyeOff className="w-6 h-6 text-muted-foreground" />
              ) : (
                <Eye className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            
            <div className={`${isMobile ? 'min-h-[200px]' : 'min-h-[250px]'} flex items-center justify-center`}>
              <div className="space-y-4 max-w-2xl">
                {!isFlipped ? (
                  <>
                    <Badge className="bg-primary/10 text-primary">Question</Badge>
                    <h3 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      {currentCard.front}
                    </h3>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      Click to reveal answer
                    </p>
                  </>
                ) : (
                  <>
                    <Badge className="bg-success/10 text-success">Answer</Badge>
                    <div className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground leading-relaxed`}>
                      {currentCard.back}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {isFlipped && (
          <div className={`flex gap-3 ${isMobile ? 'flex-col' : ''}`}>
            <Button
              variant="outline"
              onClick={handleDontKnowCard}
              className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-4 h-4" />
              {isMobile ? 'Review' : 'Need Review'}
            </Button>
            <Button
              onClick={handleKnowCard}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isMobile ? 'Know' : 'I Know This'}
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={!isFlipped}
          className="flex items-center gap-2"
        >
          {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardComponent;