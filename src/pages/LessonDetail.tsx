import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Clock, 
  CheckCircle2, 
  Play,
  RotateCcw,
  Award,
  FileText,
  Brain,
  Trophy
} from "lucide-react";
import { useAuth } from "@/hooks/useConvexAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserAvatar } from "@/components/UserAvatar";
import { MobileHeader } from "@/components/MobileHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { FlashcardComponent } from '@/components/FlashcardComponent';
import { QuizComponent } from '@/components/QuizComponent';
import { ProgressService } from '@/services/progressService';

interface LessonContent {
  id: number;
  title: string;
  description: string;
  duration: string;
  module: string;
  aircraft: string;
  theory: {
    sections: Array<{
      title: string;
      content: string;
      images?: string[];
    }>;
  };
  flashcards: Array<{
    id: number;
    front: string;
    back: string;
    image?: string;
  }>;
  quiz: {
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
    passingScore: number;
  };
}

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();
  
  const [activeTab, setActiveTab] = useState("theory");
  const [lessonProgress, setLessonProgress] = useState({
    theoryCompleted: false,
    flashcardsCompleted: false,
    quizCompleted: false,
    quizScore: 0
  });

  // Load saved progress when component mounts
  useEffect(() => {
    const loadProgress = async () => {
      if (user?._id && lessonId) {
        const savedProgress = await ProgressService.getLessonProgress(user._id, parseInt(lessonId));
        if (savedProgress) {
          setLessonProgress({
            theoryCompleted: savedProgress.theoryCompleted,
            flashcardsCompleted: savedProgress.flashcardsCompleted,
            quizCompleted: savedProgress.quizCompleted,
            quizScore: savedProgress.quizScore
          });
        }
      }
    };
    
    loadProgress();
  }, [user?._id, lessonId]);

  // Save progress when it changes
  const updateProgress = async (updates: Partial<typeof lessonProgress>) => {
    if (user?._id && lessonId) {
      const newProgress = { ...lessonProgress, ...updates };
      setLessonProgress(newProgress);
      
      await ProgressService.updateLessonProgress({
        userId: user._id,
        lessonId: parseInt(lessonId),
        ...newProgress
      });
    }
  };

  // Mock lesson data - In real app, this would come from Supabase
  const [lessonData, setLessonData] = useState<LessonContent>({
    id: parseInt(lessonId || "1"),
    title: "Airplane General",
    description: "Visión general A320: arquitectura, variantes y filosofía Airbus.",
    duration: "45m",
    module: "Fundamentos",
    aircraft: "A320",
    theory: {
      sections: [
        {
          title: "Introducción al Airbus A320",
          content: `El Airbus A320 es una familia de aeronaves comerciales de pasajeros de fuselaje estrecho desarrollada por Airbus. 
          
          Características principales:
          • Primer avión comercial con controles fly-by-wire
          • Capacidad: 150-180 pasajeros
          • Alcance: hasta 6,150 km
          • Motores: CFM56 o V2500
          
          El A320 revolucionó la aviación comercial con su avanzado sistema de control de vuelo y su cabina de cristal integrada.`,
        },
        {
          title: "Variantes de la Familia A320",
          content: `La familia A320 incluye cuatro variantes principales:
          
          • A318: La versión más pequeña (107-132 asientos)
          • A319: Versión acortada (124-156 asientos)
          • A320: Modelo base (150-180 asientos)
          • A321: Versión extendida (185-220 asientos)
          
          Todas las variantes comparten la misma certificación de tipo, permitiendo a los pilotos volar cualquier modelo con el mismo rating.`,
        },
        {
          title: "Filosofía de Diseño Airbus",
          content: `Airbus implementó varios principios innovadores en el A320:
          
          1. Fly-by-Wire: Sistema de control de vuelo completamente digital
          2. Protección de envolvente: El avión previene maniobras peligrosas
          3. Cabina común: Misma configuración en toda la familia
          4. Automatización avanzada: Reduce la carga de trabajo del piloto
          
          Esta filosofía prioriza la seguridad y la eficiencia operacional.`,
        }
      ]
    },
    flashcards: [
      {
        id: 1,
        front: "¿Qué significa 'Fly-by-Wire'?",
        back: "Sistema de control de vuelo donde las entradas del piloto se procesan por computadoras antes de ser enviadas a las superficies de control, proporcionando protecciones automáticas."
      },
      {
        id: 2,
        front: "¿Cuál es la capacidad típica de pasajeros del A320?",
        back: "150-180 pasajeros en configuración típica de clase única."
      },
      {
        id: 3,
        front: "¿Qué motores puede usar el A320?",
        back: "CFM56-5 (CFM International) o V2500 (International Aero Engines)"
      },
      {
        id: 4,
        front: "¿Cuál es el alcance máximo del A320?",
        back: "Hasta 6,150 km (3,300 millas náuticas)"
      },
      {
        id: 5,
        front: "¿Qué es la 'protección de envolvente'?",
        back: "Sistema que previene automáticamente que el avión exceda sus límites operacionales de velocidad, ángulo de ataque, y factores de carga."
      }
    ],
    quiz: {
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "¿Cuál fue la principal innovación del A320 en la aviación comercial?",
          options: [
            "Primer avión bimotor de fuselaje ancho",
            "Primer avión comercial con fly-by-wire",
            "Primer avión con motores de alta derivación",
            "Primer avión con cabina de cristal"
          ],
          correctAnswer: 1,
          explanation: "El A320 fue el primer avión comercial en implementar completamente el sistema fly-by-wire, revolucionando el control de vuelo."
        },
        {
          id: 2,
          question: "¿Cuántas variantes principales tiene la familia A320?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "La familia A320 tiene 4 variantes principales: A318, A319, A320, y A321."
        },
        {
          id: 3,
          question: "¿Qué ventaja ofrece la certificación de tipo común en la familia A320?",
          options: [
            "Menor consumo de combustible",
            "Mayor velocidad de crucero",
            "Pilotos pueden volar cualquier variante con el mismo rating",
            "Menor costo de mantenimiento"
          ],
          correctAnswer: 2,
          explanation: "La certificación de tipo común permite que los pilotos operen cualquier variante de la familia A320 con una sola habilitación."
        }
      ]
    }
  });

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  const calculateOverallProgress = () => {
    let completed = 0;
    if (lessonProgress.theoryCompleted) completed++;
    if (lessonProgress.flashcardsCompleted) completed++;
    if (lessonProgress.quizCompleted) completed++;
    return Math.round((completed / 3) * 100);
  };

  const handleCompleteLesson = () => {
    // In real app, this would update the database
    alert("¡Lección completada! Desbloqueando siguiente lección...");
    navigate('/type-rating');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader 
          title="Lesson Detail"
          subtitle={lessonData.title}
          currentPage="type-rating"
        />
      )}

      {/* Main Content */}
      <main className={`${isMobile ? 'p-4' : 'p-8'}`}>
        {/* Back Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/type-rating')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Type Rating
          </Button>
        </div>

        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {lessonData.aircraft} • {lessonData.module}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{lessonData.duration}</span>
                </div>
              </div>
              <h1 className={`font-bold mb-2 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
                {lessonData.title}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {lessonData.description}
              </p>
            </div>
            {!isMobile && (
              <UserAvatar 
                avatarUrl={profile?.avatar_url} 
                displayName={displayName}
                size="md"
              />
            )}
          </div>

          {/* Progress Overview */}
          <Card className="surface-mid border-border/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center mb-4'}`}>
                <div>
                  <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                    Lesson Progress
                  </h3>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    Complete all sections to unlock the next lesson
                  </p>
                </div>
                <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>
                    {calculateOverallProgress()}%
                  </div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    Complete
                  </p>
                </div>
              </div>
              <Progress value={calculateOverallProgress()} className="h-3 mb-4" />
              
              {/* Section Progress */}
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-3 gap-4'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    lessonProgress.theoryCompleted ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {lessonProgress.theoryCompleted ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Theory</p>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      {lessonProgress.theoryCompleted ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    lessonProgress.flashcardsCompleted ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {lessonProgress.flashcardsCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Flashcards</p>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      {lessonProgress.flashcardsCompleted ? 'Completed' : 'Not Started'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    lessonProgress.quizCompleted ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {lessonProgress.quizCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Quiz</p>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      {lessonProgress.quizCompleted ? `Score: ${lessonProgress.quizScore}%` : 'Not Started'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-3 ${isMobile ? 'h-12' : ''}`}>
            <TabsTrigger value="theory" className="flex items-center gap-2">
              <BookOpen className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={isMobile ? 'text-xs' : ''}>Theory</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <Lightbulb className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={isMobile ? 'text-xs' : ''}>Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Target className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <span className={isMobile ? 'text-xs' : ''}>Quiz</span>
            </TabsTrigger>
          </TabsList>

          {/* Theory Content */}
          <TabsContent value="theory" className="space-y-6">
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  Theory Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {lessonData.theory.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-muted-foreground">
                        {section.content}
                      </div>
                    </div>
                    {index < lessonData.theory.sections.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => updateProgress({ theoryCompleted: !lessonProgress.theoryCompleted })}
                  >
                    {lessonProgress.theoryCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </Button>
                  <Button
                    onClick={() => setActiveTab('flashcards')}
                    disabled={!lessonProgress.theoryCompleted}
                  >
                    Next: Flashcards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flashcards Content */}
          <TabsContent value="flashcards" className="space-y-6">
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-primary" />
                  Interactive Flashcards ({lessonData.flashcards.length} cards)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FlashcardComponent 
                  flashcards={lessonData.flashcards}
                  onComplete={(completedCount) => {
                    updateProgress({ 
                      flashcardsCompleted: completedCount === lessonData.flashcards.length 
                    });
                  }}
                />
                
                {lessonProgress.flashcardsCompleted && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">¡Flashcards completadas!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Has completado todas las flashcards. Ahora puedes continuar con el quiz.
                    </p>
                    <Button
                      onClick={() => setActiveTab('quiz')}
                      className="mt-3"
                      size="sm"
                    >
                      Continuar al Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Content */}
          <TabsContent value="quiz" className="space-y-6">
            {!lessonProgress.flashcardsCompleted ? (
              <Card className="surface-mid border-border/50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Quiz Bloqueado</h3>
                    <p className="text-muted-foreground mb-6">
                      Completa las flashcards antes de acceder al quiz
                    </p>
                    <Button
                      onClick={() => setActiveTab('flashcards')}
                      variant="outline"
                    >
                      Ir a Flashcards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="surface-mid border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-primary" />
                    Knowledge Quiz ({lessonData.quiz.questions.length} questions)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Puntuación mínima requerida: {lessonData.quiz.passingScore}%
                  </p>
                </CardHeader>
                <CardContent>
                  <QuizComponent 
                    quizData={lessonData.quiz}
                    onComplete={(score, passed) => {
                      updateProgress({ 
                        quizCompleted: passed,
                        quizScore: Math.round(score)
                      });
                    }}
                  />
                  
                  {lessonProgress.quizCompleted && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <Award className="w-5 h-5" />
                        <span className="font-medium">¡Lección Completada!</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Has completado exitosamente la lección con una puntuación de {lessonProgress.quizScore}%.
                      </p>
                      <Button
                        onClick={handleCompleteLesson}
                        className="mt-3"
                        size="sm"
                      >
                        Finalizar Lección
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LessonDetail;