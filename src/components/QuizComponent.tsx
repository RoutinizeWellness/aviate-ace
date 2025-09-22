import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, RotateCcw, BookmarkPlus, Flag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuestionReview } from '@/hooks/useQuestionReview';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
  difficulty?: string;
  aircraftType?: string;
}

interface QuizData {
  questions: QuizQuestion[];
  passingScore: number;
}

interface QuizComponentProps {
  quizData: QuizData;
  onComplete: (score: number, passed: boolean) => void;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ 
  quizData, 
  onComplete 
}) => {
  const isMobile = useIsMobile();
  const { markQuestionForReview, getReviewCount } = useQuestionReview();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [reviewedQuestions, setReviewedQuestions] = useState<Set<number>>(new Set());

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  // Timer
  useEffect(() => {
    if (!quizCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    };

    setUserAnswers(prev => [...prev, userAnswer]);
    setIsAnswered(true);
    setShowExplanation(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsAnswered(false);
    } else {
      completeQuiz();
    }
  };

  const handleMarkForReview = async () => {
    try {
      // Convert the numeric question ID to a proper Convex ID format for examQuestions
      const questionConvexId = `examQuestions_${currentQuestion.id.toString().padStart(16, '0')}`;
      await markQuestionForReview(
        questionConvexId as any,
        currentQuestion.category || 'General',
        selectedAnswer || 0, // incorrectAnswer
        currentQuestion.correctAnswer, // correctAnswer
        'practice', // sessionType
        currentQuestion.difficulty || 'Medium',
        currentQuestion.aircraftType || 'General'
      );
      setReviewedQuestions(prev => new Set(prev).add(currentQuestion.id));
    } catch (error) {
      console.error('Error marking question for review:', error);
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    const finalScore = (score / quizData.questions.length) * 100;
    const passed = finalScore >= quizData.passingScore;
    onComplete(finalScore, passed);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsAnswered(false);
    setQuizCompleted(false);
    setScore(0);
    setTimeElapsed(0);
  };

  const getScoreColor = (scorePercentage: number) => {
    if (scorePercentage >= quizData.passingScore) return 'text-green-600';
    if (scorePercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (quizCompleted) {
    const finalScore = (score / quizData.questions.length) * 100;
    const passed = finalScore >= quizData.passingScore;

    return (
      <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              {passed ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              Quiz {passed ? 'Completado' : 'No Aprobado'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(finalScore)}`}>
                {finalScore.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {score} de {quizData.questions.length} preguntas correctas
              </div>
              <div className="text-sm text-muted-foreground">
                Tiempo: {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-muted-foreground">
                Puntuación mínima requerida: {quizData.passingScore}%
              </div>
            </div>

            {passed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ¡Felicitaciones! Has completado exitosamente el quiz.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  No has alcanzado la puntuación mínima. Revisa el material y vuelve a intentarlo.
                </p>
              </div>
            )}

            <Button 
              onClick={resetQuiz}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Intentar de Nuevo
            </Button>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Respuestas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quizData.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    {userAnswer?.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Tu respuesta:</span>{' '}
                          <span className={userAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {question.options[userAnswer?.selectedAnswer || 0]}
                          </span>
                        </p>
                        {!userAnswer?.isCorrect && (
                          <p>
                            <span className="font-medium">Respuesta correcta:</span>{' '}
                            <span className="text-green-600">
                              {question.options[question.correctAnswer]}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
      {/* Quiz Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Pregunta {currentQuestionIndex + 1} de {quizData.questions.length}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonVariant: "default" | "secondary" | "outline" = "outline";
            let buttonClass = "";

            if (isAnswered) {
              if (index === currentQuestion.correctAnswer) {
                buttonVariant = "default";
                buttonClass = "bg-green-600 hover:bg-green-700 text-white border-green-600";
              } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                buttonVariant = "secondary";
                buttonClass = "bg-red-100 hover:bg-red-200 text-red-800 border-red-300";
              }
            } else if (index === selectedAnswer) {
              buttonVariant = "secondary";
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={`w-full text-left justify-start h-auto py-4 px-4 whitespace-normal ${buttonClass}`}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                <span className="flex-1">{option}</span>
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 ml-2 flex-shrink-0" />
                )}
                {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 ml-2 flex-shrink-0" />
                )}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Explanation */}
      {showExplanation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  ¡Correcto!
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Incorrecto
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isAnswered ? (
          <>
            <Button 
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              Confirmar Respuesta
            </Button>
            <Button 
              onClick={handleMarkForReview}
              variant="outline"
              className="px-4"
              title="Marcar para repasar"
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={handleNextQuestion}
              className="flex-1"
            >
              {currentQuestionIndex < quizData.questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Quiz'}
            </Button>
            <Button 
              onClick={handleMarkForReview}
              variant="outline"
              className="px-4"
              title="Marcar para repasar"
              disabled={reviewedQuestions.has(currentQuestion.id)}
            >
              {reviewedQuestions.has(currentQuestion.id) ? (
                <Flag className="h-4 w-4 text-orange-600" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
