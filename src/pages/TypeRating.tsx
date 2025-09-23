import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Lock,
  Play,
  Clock,
  CheckCircle2,
  Star,
  Lightbulb,
  Target,
  BookOpen,
  Plane,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { UserAvatar } from "@/components/UserAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";

const TypeRating = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasAccessTo, getCurrentSubscription, isAdmin, getSubscriptionDisplayName } = useSubscription();
  
  // Check if user has access to A320 content
  const hasA320Access = hasAccessTo('A320_FAMILY');
  const userSubscription = getCurrentSubscription();
  const adminUser = isAdmin();
  
  // Mock data for development
  const userProfile = {
    user: {
      displayName: user?.displayName || user?.email?.split('@')[0] || 'Usuario',
      avatarUrl: undefined
    }
  };
  const userStats = {
    currentLevel: 1,
    totalPoints: 0
  };
  
  const isMobile = useIsMobile();
  
  const [isLoading, setIsLoading] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<any[]>([]);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<'A320_FAMILY' | 'B737_FAMILY'>('A320_FAMILY');

  // Load progress data when component mounts - using localStorage for now
  useEffect(() => {
    const loadProgressData = async () => {
      if (user?._id) {
        setIsLoading(true);
        try {
          // Load from localStorage temporarily until Convex is deployed
          const storedModuleProgress = localStorage.getItem(`module_progress_${user._id}`);
          const storedLessonProgress = localStorage.getItem(`lesson_progress_${user._id}`);
          
          if (storedModuleProgress) {
            setModuleProgress(JSON.parse(storedModuleProgress));
          }
          
          if (storedLessonProgress) {
            setLessonProgress(JSON.parse(storedLessonProgress));
          }
        } catch (error) {
          console.error('Error loading progress:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadProgressData();
  }, [user?._id]);

  const displayName = userProfile?.user?.displayName || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  // Helper function to get lesson progress
  const getLessonProgressById = (lessonId: number) => {
    return lessonProgress.find(p => p.lessonId === lessonId);
  };

  // Helper function to get module progress
  const getModuleProgressById = (moduleId: string) => {
    return moduleProgress.find(m => m.moduleId === moduleId);
  };

  // Helper function to check if lesson is unlocked
  const isLessonUnlocked = (lessonId: number) => {
    if (lessonId === 1) return true; // Fundamentos always unlocked
    
    // For Sistemas lessons, check if Fundamentos is completed
    const fundamentosProgress = getLessonProgressById(1);
    return fundamentosProgress ? 
      (fundamentosProgress.theoryCompleted && 
       fundamentosProgress.flashcardsCompleted && 
       fundamentosProgress.quizCompleted) : false;
  };

  // Helper function to check if lesson is completed
  const isLessonCompleted = (lessonId: number) => {
    const progress = getLessonProgressById(lessonId);
    return progress ? 
      (progress.theoryCompleted && 
       progress.flashcardsCompleted && 
       progress.quizCompleted) : false;
  };

  // Module data structure with dynamic progress
  const getModulesWithProgress = () => {
    const fundamentosProgress = getModuleProgressById('fundamentos');
    const sistemasProgress = getModuleProgressById('sistemas');
    
    return [
      {
        id: 1,
        title: "Fundamentos",
        description: "Completa cada módulo para desbloquear el siguiente",
        progress: fundamentosProgress ? Math.round((fundamentosProgress.completedLessons / fundamentosProgress.totalLessons) * 100) : 0,
        totalLessons: 1,
        completedLessons: fundamentosProgress?.completedLessons || 0,
        isUnlocked: fundamentosProgress?.isUnlocked || true,
        category: "foundation",
        lessons: [
          {
            id: 1,
            title: "Airplane General",
            description: "Visión general A320: arquitectura, variantes y filosofía Airbus.",
            duration: "45m",
            isCompleted: isLessonCompleted(1),
            isUnlocked: true,
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          }
        ]
      },
      {
        id: 2,
        title: "Sistemas",
        description: "Sistemas críticos de la aeronave A320",
        progress: sistemasProgress ? Math.round((sistemasProgress.completedLessons / sistemasProgress.totalLessons) * 100) : 0,
        totalLessons: 14,
        completedLessons: sistemasProgress?.completedLessons || 0,
        isUnlocked: sistemasProgress?.isUnlocked || false,
        category: "systems",
        lessons: [
          {
            id: 2,
            title: "Air Conditioning & Pressurization",
            description: "Control de la temperatura, la presión y la calidad del aire en cabina, garantizando confort y seguridad para tripulación y pasajeros",
            duration: "60m",
            isCompleted: isLessonCompleted(2),
            isUnlocked: isLessonUnlocked(2),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 3,
            title: "Anti-ice and Rain",
            description: "Protege al avión contra hielo y lluvia, asegurando la seguridad y el rendimiento óptimo durante el vuelo en condiciones adversas",
            duration: "50m",
            isCompleted: isLessonCompleted(3),
            isUnlocked: isLessonUnlocked(3),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 4,
            title: "Automatic Flight",
            description: "Controla el avión de manera automatizada, gestionando rumbo, altitud y velocidad para un vuelo seguro y eficiente.",
            duration: "55m",
            isCompleted: isLessonCompleted(4),
            isUnlocked: isLessonUnlocked(4),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 5,
            title: "Communication",
            description: "Transmisión y recepción de mensajes entre la tripulación, control de tráfico aéreo y otras aeronaves, asegurando coordinación y seguridad",
            duration: "40m",
            isCompleted: isLessonCompleted(5),
            isUnlocked: isLessonUnlocked(5),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 6,
            title: "Electrical",
            description: "Sistema eléctrico: generación, distribución y emergencia",
            duration: "45m",
            isCompleted: isLessonCompleted(6),
            isUnlocked: isLessonUnlocked(6),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 7,
            title: "Engines and APU",
            description: "Motorización y motor auxiliar que proporciona energía eléctrica y aire presurizado al avión cuando los motores principales están apagados, garantizando autonomía en tierra y soporte en vuelo",
            duration: "70m",
            isCompleted: isLessonCompleted(7),
            isUnlocked: isLessonUnlocked(7),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 8,
            title: "Fire Protection",
            description: "Detecta, alerta y combate incendios en motores, cabina y otros sistemas críticos, garantizando la seguridad de la aeronave y sus ocupantes",
            duration: "80m",
            isCompleted: isLessonCompleted(8),
            isUnlocked: isLessonUnlocked(8),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 9,
            title: "Flight Controls",
            description: "Mandos y superficies del avión, divididos en primarios (alerones, timón y elevador) y secundarios (flaps, slats, spoilers, trim)",
            duration: "30m",
            isCompleted: isLessonCompleted(9),
            isUnlocked: isLessonUnlocked(9),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 10,
            title: "Flight Instruments and Displays",
            description: "Flight Instruments and Displays proporcionan toda la información clave de vuelo al piloto de manera clara y confiable, garantizando seguridad y control total en cada maniobra",
            duration: "30m",
            isCompleted: isLessonCompleted(10),
            isUnlocked: isLessonUnlocked(10),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 11,
            title: "Flight Management and Navigation",
            description: "Permite planificar, gestionar y guiar el vuelo de manera eficiente, asegurando rutas precisas y operaciones seguras.",
            duration: "10m",
            isCompleted: isLessonCompleted(11),
            isUnlocked: isLessonUnlocked(11),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 12,
            title: "Fuel System",
            description: "Gestiona el almacenamiento, suministro y distribución de combustible, garantizando que el avión opere de manera segura y eficiente durante todo el vuelo",
            duration: "30m",
            isCompleted: isLessonCompleted(12),
            isUnlocked: isLessonUnlocked(12),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 13,
            title: "Hydraulic System",
            description: "Suministra la fuerza necesaria para operar sistemas críticos del avión, como tren de aterrizaje, flaps y controles de vuelo",
            duration: "45m",
            isCompleted: isLessonCompleted(13),
            isUnlocked: isLessonUnlocked(13),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 14,
            title: "Landing Gear",
            description: "Sistema de tren de aterrizaje que permite al avión despegar, aterrizar y maniobrar en tierra",
            duration: "30m",
            isCompleted: isLessonCompleted(14),
            isUnlocked: isLessonUnlocked(14),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          },
          {
            id: 15,
            title: "Warning Systems",
            description: "Alertan al piloto sobre fallos, condiciones críticas o situaciones de riesgo, garantizando la seguridad y la respuesta rápida durante el vuelo",
            duration: "45m",
            isCompleted: isLessonCompleted(15),
            isUnlocked: isLessonUnlocked(15),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true
          }
        ]
      }
    ];
  };

  const modules = getModulesWithProgress();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando progreso...</p>
        </div>
      </div>
    );
  }

  const handleLessonClick = (lesson: any) => {
    if (lesson.isUnlocked) {
      // Navigate to lesson content
      navigate(`/lesson/${lesson.id}`);
    }
  };

  // Aircraft options for dropdown
  const aircraftOptions = [
    {
      value: 'A320_FAMILY',
      label: 'Airbus A320 Family',
      description: 'A318, A319, A320, A321',
      hasAccess: hasA320Access
    },
    {
      value: 'B737_FAMILY',
      label: 'Boeing 737 Family',
      description: 'B737-700, B737-800, B737 MAX',
      hasAccess: hasAccessTo('B737_FAMILY')
    }
  ];

  const handleAircraftChange = (aircraftType: 'A320_FAMILY' | 'B737_FAMILY') => {
    setSelectedAircraft(aircraftType);
    if (aircraftType === 'B737_FAMILY') {
      navigate('/b737-type-rating');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Sidebar */}
      <UnifiedSidebar activePage="type-rating" />
      
      {/* Main Content */}
      <main className={`${isMobile ? 'p-4' : 'ml-64 p-8'}`}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6 bg-background/95 backdrop-blur sticky top-0 z-30 py-4 border-b">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-bold text-lg">Type Rating</h1>
                <p className="text-xs text-muted-foreground">A320 Training</p>
              </div>
            </div>
            <UserAvatar 
              avatarUrl={userProfile?.user?.avatarUrl} 
              displayName={displayName}
              size="sm"
            />
          </div>
        )}
        {/* Header - Desktop */}
        {!isMobile && (
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
              </Button>
              {!hasA320Access && selectedAircraft === 'A320_FAMILY' && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  <Lock className="w-3 h-3 mr-1" />
                  Contenido Restringido
                </Badge>
              )}
            </div>
            
            {/* Aircraft Selection Dropdown */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Selecciona el Tipo de Aeronave</label>
              <Select value={selectedAircraft} onValueChange={handleAircraftChange}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Selecciona una aeronave" />
                </SelectTrigger>
                <SelectContent>
                  {aircraftOptions.map((aircraft) => (
                    <SelectItem
                      key={aircraft.value}
                      value={aircraft.value}
                      disabled={!aircraft.hasAccess && !adminUser}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{aircraft.label}</div>
                          <div className="text-xs text-muted-foreground">{aircraft.description}</div>
                        </div>
                        {!aircraft.hasAccess && !adminUser && (
                          <Lock className="w-4 h-4 text-muted-foreground ml-2" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {selectedAircraft === 'A320_FAMILY' ? 'A320 Type Rating' : 'B737 Type Rating'}
                </h1>
                <p className="text-muted-foreground">
                  Entrenamiento completo para habilitación de tipo en {selectedAircraft === 'A320_FAMILY' ? 'Airbus A320' : 'Boeing 737'}. Aprende la teoría y practica con exámenes.
                </p>
              </div>
              <div className="text-right">
                <Badge className="bg-primary/10 text-primary">
                  {getSubscriptionDisplayName()}
                </Badge>
                {!hasA320Access && selectedAircraft === 'A320_FAMILY' && (
                  <p className="text-xs text-warning mt-2">Necesitas suscripción A320</p>
                )}
                {!hasAccessTo('B737_FAMILY') && selectedAircraft === 'B737_FAMILY' && (
                  <p className="text-xs text-warning mt-2">Necesitas suscripción B737</p>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Header - Mobile */}
        {isMobile && (
          <header className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold">A320 Type Rating</h1>
              <Badge className="bg-primary/10 text-primary text-xs">
                {getSubscriptionDisplayName()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Entrenamiento completo para habilitación de tipo en Airbus A320.</p>
            {!hasA320Access && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Contenido Restringido - Necesitas suscripción A320
              </Badge>
            )}
          </header>
        )}

        {/* Progress Overview */}
        <section className={`${isMobile ? 'mb-6' : 'mb-10'}`}>
          <Card className="surface-mid border-border/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center mb-4'}`}>
                <div>
                  <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Progreso General del Type Rating</h3>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {modules.reduce((acc, module) => acc + module.completedLessons, 0)} de {modules.reduce((acc, module) => acc + module.totalLessons, 0)} lecciones completadas
                  </p>
                </div>
                <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>0%</div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Completado</p>
                </div>
              </div>
              <Progress value={0} className={`h-3 ${isMobile ? 'mb-3' : 'mb-4'}`} />
              <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                <Lightbulb className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-warning`} />
                <span>Completa las lecciones de teoría antes de tomar los exámenes oficiales</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Modules */}
        <div className={`${isMobile ? 'space-y-6' : 'space-y-8'}`}>
          {modules.map((module) => (
            <Card key={module.id} className="surface-mid border-border/50">
              <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
                <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
                  <div>
                    <CardTitle className={`flex items-center gap-3 ${isMobile ? 'text-lg' : ''}`}>
                      <span>{module.title}</span>
                      {!module.isUnlocked && <Lock className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-muted-foreground`} />}
                    </CardTitle>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>{module.description}</p>
                  </div>
                  <Badge className={`${module.progress > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"} ${isMobile ? 'text-xs' : ''}`}>
                    {module.progress}% completado • {module.totalLessons} lecciones
                  </Badge>
                </div>
                {module.progress > 0 && (
                  <Progress value={module.progress} className={`h-2 ${isMobile ? 'mt-3' : 'mt-4'}`} />
                )}
              </CardHeader>
              <CardContent className={`${isMobile ? 'space-y-3 p-4 pt-0' : 'space-y-4'}`}>
                {module.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`${isMobile ? 'p-3' : 'flex items-center justify-between p-4'} rounded-lg border transition-colors ${
                      lesson.isUnlocked 
                        ? 'border-border hover:bg-muted/50 cursor-pointer' 
                        : 'border-muted bg-muted/20 cursor-not-allowed'
                    }`}
                    onClick={() => lesson.isUnlocked && handleLessonClick(lesson)}
                  >
                    {isMobile ? (
                      /* Mobile Layout */
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                            lesson.isCompleted 
                              ? 'bg-success text-success-foreground' 
                              : lesson.isUnlocked 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                          }`}>
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : lesson.isUnlocked ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </div>
                          <span className="font-medium text-sm">{index + 1}.</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold text-sm ${
                            lesson.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {lesson.title}
                          </h4>
                          <p className={`text-xs mt-1 ${
                            lesson.isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'
                          }`}>
                            {lesson.description}
                          </p>
                        </div>
                        {/* Content Type Indicators - Mobile */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {lesson.hasTheory && (
                            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-200 px-1 py-0">
                              <BookOpen className="w-2 h-2 mr-1" />
                              Teoría
                            </Badge>
                          )}
                          {lesson.hasFlashcards && (
                            <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-200 px-1 py-0">
                              <Lightbulb className="w-2 h-2 mr-1" />
                              Cards
                            </Badge>
                          )}
                          {lesson.hasQuiz && (
                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-200 px-1 py-0">
                              <Target className="w-2 h-2 mr-1" />
                              Quiz
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-end">
                          {lesson.isUnlocked ? (
                            <Button variant="outline" size="sm" className="text-xs h-8">
                              {lesson.isCompleted ? 'Revisar' : 'Abrir'}
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled className="text-xs h-8">
                              Bloqueado
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Desktop Layout */
                      <>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                              lesson.isCompleted 
                                ? 'bg-success text-success-foreground' 
                                : lesson.isUnlocked 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              {lesson.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : lesson.isUnlocked ? (
                                <Play className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </div>
                            <span className="font-medium text-sm">{index + 1}.</span>
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${
                              lesson.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {lesson.title}
                            </h4>
                            <p className={`text-sm ${
                              lesson.isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'
                            }`}>
                              {lesson.description}
                            </p>
                            {/* Content Type Indicators */}
                            <div className="flex items-center gap-2 mt-2">
                              {lesson.hasTheory && (
                                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-200">
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  Teoría
                                </Badge>
                              )}
                              {lesson.hasFlashcards && (
                                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-200">
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  Flashcards
                                </Badge>
                              )}
                              {lesson.hasQuiz && (
                                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-200">
                                  <Target className="w-3 h-3 mr-1" />
                                  Quiz
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          {lesson.isUnlocked ? (
                            <Button variant="outline" size="sm">
                              {lesson.isCompleted ? 'Revisar' : 'Abrir'}
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              Bloqueado
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Cards */}
        <section className={isMobile ? 'mt-6' : 'mt-10'}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${isMobile ? 'mb-4' : 'mb-6'}`}>Acciones Rápidas</h2>
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
            <Card className="surface-mid border-border/50 hover-lift cursor-pointer" onClick={() => navigate('/exam')}>
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-primary/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Target className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary`} />
                </div>
                <h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>Examen de Práctica</h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>Practica con preguntas del examen oficial A320</p>
                <Button className={`w-full ${isMobile ? 'text-xs h-8' : ''}`}>Iniciar Práctica</Button>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-warning/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Lightbulb className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-warning`} />
                </div>
                <h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>Real A320 Flashcards</h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>Study key concepts with advanced interactive flashcards</p>
                <Button className={`w-full ${isMobile ? 'text-xs h-8' : ''}`} onClick={() => navigate('/flashcards/a320')}>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Start Flashcards
                </Button>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-success/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <CheckCircle2 className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-success`} />
                </div>
                <h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>Simulador de Examen</h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>Examen completo con límite de tiempo</p>
                <Button variant="outline" className={`w-full ${isMobile ? 'text-xs h-8' : ''}`} disabled>
                  Completar lecciones primero
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Aircraft Selection */}
        <section className={isMobile ? 'mt-6' : 'mt-10'}>
          <h2 className={`font-bold ${isMobile ? 'text-xl mb-4' : 'text-2xl mb-6'}`}>Selecciona tu Aeronave</h2>
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
            <Card 
              className={`surface-mid border-border/50 ${
                hasA320Access ? 'hover-lift cursor-pointer' : 'opacity-60'
              }`} 
              onClick={() => hasA320Access && navigate('/type-rating')}
            >
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-primary/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Plane className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary`} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>Airbus A320</h3>
                  {!hasA320Access && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  Entrenamiento completo para habilitación de tipo en Airbus A320
                </p>
                {hasA320Access ? (
                  <Button className={`w-full ${isMobile ? 'text-xs h-8' : ''}`}>Iniciar A320</Button>
                ) : (
                  <Button variant="outline" className={`w-full ${isMobile ? 'text-xs h-8' : ''}`} disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Requiere Suscripción A320
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card 
              className={`surface-mid border-border/50 ${
                hasAccessTo('B737_FAMILY') ? 'hover-lift cursor-pointer' : 'opacity-60'
              }`} 
              onClick={() => hasAccessTo('B737_FAMILY') && navigate('/b737-type-rating')}
            >
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Plane className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-blue-500`} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>Boeing 737</h3>
                  {!hasAccessTo('B737_FAMILY') && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  Entrenamiento completo para habilitación de tipo en Boeing 737
                </p>
                {hasAccessTo('B737_FAMILY') ? (
                  <Button className={`w-full ${isMobile ? 'text-xs h-8' : ''}`} variant="outline">Iniciar B737</Button>
                ) : (
                  <Button variant="outline" className={`w-full ${isMobile ? 'text-xs h-8' : ''}`} disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Requiere Suscripción Boeing
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TypeRating;
