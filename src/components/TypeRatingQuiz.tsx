import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useConvexAuth';
import { getTrialQuestions, getAllQuestions, Question } from '@/data/questionDatabase';
import { SubscriptionCTA } from '@/components/SubscriptionCTA';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Clock,
  Target,
  Lock,
  Gift
} from "lucide-react";

interface TypeRatingQuizProps {
  aircraftType?: 'A320_FAMILY' | 'B737_FAMILY' | 'ALL';
  category?: string;
  onComplete?: (score: number, totalQuestions: number) => void;
  questionCount?: number;
}

export const TypeRatingQuiz: React.FC<TypeRatingQuizProps> = ({ 
  aircraftType = 'A320_FAMILY',
  category = 'Engines',
  onComplete,
  questionCount = 10 
}) => {
  const { user } = useAuth();
  const { hasAccessTo, isAdmin, getCurrentSubscription } = useSubscription();
  
  const isUserLoggedIn = !!user;
  const hasSubscription = hasAccessTo(aircraftType);
  const isTrialUser = isUserLoggedIn && !hasSubscription && !isAdmin();
  
  // Get questions based on user status
  const getFilteredQuestions = (): Question[] => {
    if (!aircraftType || aircraftType === 'ALL' || !category) {
      return [];
    }
    
    if (!isUserLoggedIn) {
      // Guest users get trial questions
      return getTrialQuestions(aircraftType as 'A320_FAMILY' | 'B737_FAMILY', category);
    }
    
    if (isTrialUser) {
      // Logged in users without subscription get trial questions
      return getTrialQuestions(aircraftType as 'A320_FAMILY' | 'B737_FAMILY', category);
    }
    
    if (hasSubscription || isAdmin()) {
      // Subscribed users get all questions
      const allQuestions = getAllQuestions(aircraftType as 'A320_FAMILY' | 'B737_FAMILY', category);
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(questionCount, shuffled.length));
    }
    
    return [];
  };
  
  const [questions] = useState<Question[]>(getFilteredQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showSubscriptionCTA, setShowSubscriptionCTA] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isTrialQuiz = questions.length > 0 && questions[0]?.isTrial;
  
  // Check if user has access to the content
  const canAccessQuiz = isAdmin() || hasSubscription || !isUserLoggedIn || isTrialUser;
  
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleFinishQuiz = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    
    // If this is a trial quiz, show subscription CTA instead of regular results
    if (isTrialQuiz && (isTrialUser || !isUserLoggedIn)) {
      setShowSubscriptionCTA(true);
    } else {
      setShowResults(true);
    }
    
    if (onComplete) {
      onComplete(correctAnswers, questions.length);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setShowSubscriptionCTA(false);
    setQuizStarted(false);
  };
  
  const handleSubscribe = () => {
    // Redirect to subscription page or open payment modal
    window.location.href = '/subscription';
  };
  
  const handleContinueTrial = () => {
    // Reset CTA and allow user to try another category
    setShowSubscriptionCTA(false);
    window.location.href = '/exams';
  };
  
  // Show subscription CTA for trial users who completed the quiz
  if (showSubscriptionCTA) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    return (
      <SubscriptionCTA
        trialScore={correctAnswers}
        totalTrialQuestions={questions.length}
        category={category}
        aircraftType={aircraftType === 'B737_FAMILY' ? 'BOEING_737' : 'A320'}
        onSubscribe={handleSubscribe}
        onContinueTrial={handleContinueTrial}
      />
    );
  }
  
  // Check if user has access
  if (!canAccessQuiz && currentQuestion) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Contenido Restringido</h3>
          <p className="text-muted-foreground mb-4">
            Necesitas una suscripción {currentQuestion.aircraftType === 'A320_FAMILY' ? 'A320' : 'Boeing 737'} para acceder a este quiz.
          </p>
          <Button onClick={handleSubscribe}>
            Ver Planes de Suscripción
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No hay preguntas disponibles</h3>
          <p className="text-muted-foreground">
            No se encontraron preguntas para tu suscripción actual.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (!quizStarted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {isTrialQuiz ? (
              <Gift className="w-6 h-6 text-yellow-600" />
            ) : (
              <Target className="w-6 h-6" />
            )}
            {isTrialQuiz ? 'Prueba Gratuita' : 'Type Rating Quiz'} - {category} ({aircraftType})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isTrialQuiz && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Gift className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">🎉 Prueba Gratuita Disponible</h3>
              </div>
              <p className="text-yellow-700 text-sm mb-2">
                Puedes probar {questions.length} preguntas gratuitas de {category} para {aircraftType}.
              </p>
              <p className="text-yellow-600 text-xs">
                💡 Después de completar la prueba, podrás acceder a las 200+ preguntas restantes con una suscripción.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{questions.length}</div>
              <div className="text-sm text-muted-foreground">
                {isTrialQuiz ? 'Preguntas de Prueba' : 'Preguntas'}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">Sin Límite</div>
              <div className="text-sm text-muted-foreground">Tiempo</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{isTrialQuiz ? 'Gratis' : '80%'}</div>
              <div className="text-sm text-muted-foreground">
                {isTrialQuiz ? 'Costo' : 'Mín. para Aprobar'}
              </div>
            </div>
          </div>
          
          {!isTrialQuiz && (
            <div className="space-y-4">
              <h3 className="font-semibold">Instrucciones:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Responde todas las preguntas</li>
                <li>• Puedes navegar entre preguntas usando los botones</li>
                <li>• Necesitas al menos 80% para aprobar el quiz</li>
                <li>• Al terminar verás los resultados detallados</li>
              </ul>
            </div>
          )}
          
          <Button 
            onClick={() => setQuizStarted(true)} 
            className="w-full"
            size="lg"
          >
            {isTrialQuiz ? '🚀 Comenzar Prueba Gratuita' : 'Comenzar Quiz'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = percentage >= 80;
    
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {passed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            Resultados del Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">
              {correctAnswers}/{questions.length}
            </div>
            <div className="text-xl text-primary">
              {percentage}%
            </div>
            <div className="text-muted-foreground mt-2">
              {passed ? '¡Felicitaciones! Has aprobado' : 'No aprobaste. Inténtalo de nuevo'}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={resetQuiz} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Intentar de Nuevo
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6" />
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {currentQuestion?.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentQuestion?.aircraftType}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQuestion?.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {selectedAnswers.filter(answer => answer !== -1).length} de {questions.length} respondidas
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};