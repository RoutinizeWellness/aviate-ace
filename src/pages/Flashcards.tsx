import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Check, X, ArrowLeft, Shuffle } from 'lucide-react';
import { LessonContentService } from '@/services/lessonContentService';
import { useToast } from '@/hooks/use-toast';

const Flashcards = () => {
  const { aircraft } = useParams<{ aircraft: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);

  useEffect(() => {
    // Load flashcards for the specific aircraft
    const lesson = LessonContentService.getLessonContent(1); // Get A320 lesson
    if (lesson?.flashcards) {
      setFlashcards(lesson.flashcards);
      setShuffledCards([...lesson.flashcards].sort(() => Math.random() - 0.5));
    }
  }, [aircraft]);

  const currentCard = shuffledCards[currentIndex];
  const progressPercentage = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (wasCorrect: boolean) => {
    if (wasCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setReviewCount(prev => prev + 1);
    }

    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Session complete
      toast({
        title: "Flashcards Complete!",
        description: `You got ${correctCount + (wasCorrect ? 1 : 0)} out of ${flashcards.length} correct.`,
      });
      // Reset for another round
      setCurrentIndex(0);
      setIsFlipped(false);
      setCorrectCount(0);
      setReviewCount(0);
      setShuffledCards([...flashcards].sort(() => Math.random() - 0.5));
    }
  };

  const handleShuffle = () => {
    setShuffledCards([...flashcards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setReviewCount(0);
  };

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Flashcards...</h2>
          <p className="text-muted-foreground">Please wait while we load your study materials.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/type-rating')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {aircraft?.toUpperCase() || 'A320'} Flashcards
              </h1>
              <p className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{correctCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">{reviewCount}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto p-4">
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="max-w-4xl mx-auto p-4">
        <Card 
          className="h-96 cursor-pointer transform transition-transform hover:scale-105"
          onClick={handleFlip}
        >
          <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                {currentCard.category}
              </Badge>
              <Badge variant="secondary">
                {currentCard.difficulty}
              </Badge>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="space-y-4">
                {!isFlipped ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Question</h2>
                    <p className="text-lg leading-relaxed max-w-2xl">
                      {currentCard.front}
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Click to reveal answer
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4 text-primary">Answer</h2>
                    <p className="text-lg leading-relaxed max-w-2xl">
                      {currentCard.back}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {isFlipped && (
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNext(false)}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-5 h-5" />
              Need Review
            </Button>
            <Button
              size="lg"
              onClick={() => handleNext(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-5 h-5" />
              Got It!
            </Button>
          </div>
        )}

        {!isFlipped && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={handleFlip}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Flip Card
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;