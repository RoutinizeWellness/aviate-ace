import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star,
  ArrowRight,
  Plane,
  Crown,
  TrendingUp
} from 'lucide-react';
import { FreeTrialManager } from '@/services/FreeTrialManager';

const ExamResults: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get exam results from FreeTrialManager
  const examResults = FreeTrialManager.getExamResults(user?._id);
  const selectedAircraft = FreeTrialManager.getSelectedAircraft(user?._id);
  
  // Fallback to URL parameters if no stored results
  const score = examResults?.score || parseInt(searchParams.get('score') || '0');
  const totalQuestions = examResults?.totalQuestions || parseInt(searchParams.get('total') || '0');
  const correctAnswers = examResults?.correctAnswers || parseInt(searchParams.get('correct') || '0');
  
  if (!examResults && (!score || !totalQuestions)) {
    // No exam results found, redirect to home
    navigate('/');
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return '¡Excelente! Demuestras un dominio sobresaliente.';
    if (score >= 80) return '¡Muy bien! Tu conocimiento es sólido.';
    if (score >= 70) return 'Buen trabajo. Con más práctica puedes mejorar.';
    if (score >= 60) return 'Necesitas repasar algunos conceptos.';
    return 'Te recomendamos estudiar más antes de continuar.';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="w-6 h-6 text-primary" />
              <div>
                <h1 className="font-bold">Resultados del Examen</h1>
                <p className="text-xs text-muted-foreground">
                  Prueba Gratuita - {selectedAircraft || 'Aeronave'}
                </p>
              </div>
            </div>

            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Star className="w-3 h-3 mr-1" />
              Completado
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Results Overview */}
        <Card className="mb-8 surface-mid border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">¡Examen Completado!</CardTitle>
            <p className="text-muted-foreground">
              Has terminado tu prueba gratuita del {selectedAircraft}
            </p>
          </CardHeader>

          <CardContent>
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <Badge variant={getScoreBadgeVariant(score)} className="text-lg px-4 py-2">
                {correctAnswers} de {totalQuestions} correctas
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso del examen</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>

            {/* Performance Message */}
            <div className="text-center mb-6">
              <p className="text-lg text-muted-foreground">
                {getPerformanceMessage(score)}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="surface-light border-border/50">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Precisión</h3>
                  <p className="text-2xl font-bold text-primary">{score}%</p>
                </CardContent>
              </Card>

              <Card className="surface-light border-border/50">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Correctas</h3>
                  <p className="text-2xl font-bold text-success">{correctAnswers}</p>
                </CardContent>
              </Card>

              <Card className="surface-light border-border/50">
                <CardContent className="p-4 text-center">
                  <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Incorrectas</h3>
                  <p className="text-2xl font-bold text-destructive">{totalQuestions - correctAnswers}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Promotion */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                ¡Continúa tu Aprendizaje!
              </h2>
              
              <p className="text-blue-700 mb-6 text-lg">
                Has completado tu prueba gratuita. Desbloquea acceso completo a:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Preguntas Ilimitadas</h4>
                    <p className="text-sm text-blue-600">Miles de preguntas actualizadas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Todos los Aviones</h4>
                    <p className="text-sm text-blue-600">A320, B737, B777, A350 y más</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Análisis Detallado</h4>
                    <p className="text-sm text-blue-600">Estadísticas y progreso personalizado</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Simuladores</h4>
                    <p className="text-sm text-blue-600">Exámenes en condiciones reales</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/subscription-management')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Ver Planes de Suscripción
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  size="lg"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trial Summary */}
        <Card className="surface-light border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Resumen de la Prueba Gratuita</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Aeronave seleccionada:</span>
                <span className="font-medium ml-2">{selectedAircraft}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha de finalización:</span>
                <span className="font-medium ml-2">
                  {examResults?.completedAt 
                    ? new Date(examResults.completedAt).toLocaleDateString()
                    : new Date().toLocaleDateString()
                  }
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Preguntas totales:</span>
                <span className="font-medium ml-2">{totalQuestions}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Puntuación final:</span>
                <span className={`font-medium ml-2 ${getScoreColor(score)}`}>{score}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ExamResults;