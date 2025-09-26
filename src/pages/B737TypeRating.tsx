import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Lock,
  Play,
  Clock,
  CheckCircle2,
  Star,
  Lightbulb,
  Target, // Added missing import
  BookOpen, // Added missing import
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { UserAvatar } from "@/components/UserAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";
import { useB737Progress } from "@/hooks/useAircraftProgress";
import { useTypeRatingProgress } from "@/hooks/useTypeRatingProgress";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const B737TypeRating = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasAccessTo, getCurrentSubscription, isAdmin, getSubscriptionDisplayName } = useSubscription();
  
  // Check if user has access to Boeing 737 content
  const hasBoeingAccess = hasAccessTo('B737_FAMILY'); // Changed from 'BOEING_737' to 'B737_FAMILY'
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
  const { t } = useLanguage();
  
  // Show language toggle in header for 737 page

  // Convex type rating progress (B737)
  const { progressByLesson: trProgressByLesson } = useTypeRatingProgress('B737_FAMILY');
  
  const [isLoading, setIsLoading] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<any[]>([]);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  
  // Aircraft toggle functionality
  const toggleAircraft = () => {
    navigate('/type-rating'); // Navigate back to A320
  };

  // Load progress data when component mounts - using localStorage for now
  useEffect(() => {
    const loadProgressData = async () => {
      if (user?._id) {
        setIsLoading(false); // Removed loading state since we're using mock data
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
      } else {
        setIsLoading(false);
      }
    };
    
    loadProgressData();
  }, [user?._id]);

  const displayName = userProfile?.user?.displayName || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  // Use the B737 progress hook
  const { progress: b737Progress, categoryProgress, isLoading: isProgressLoading } = useB737Progress();
  
  const HeaderActions = () => (
    <div className="flex items-center gap-3">
      <LanguageToggle />
    </div>
  );
  
  // Helper functions for lesson progress
  const getLessonProgressById = (lessonId: number) => {
    const convex = trProgressByLesson.get(lessonId);
    if (convex) return {
      lessonId,
      isCompleted: convex.theoryCompleted && convex.flashcardsCompleted && convex.quizCompleted,
      theoryCompleted: convex.theoryCompleted,
      flashcardsCompleted: convex.flashcardsCompleted,
      quizCompleted: convex.quizCompleted,
    } as any;
    return lessonProgress.find(lp => lp.lessonId === lessonId);
  };
  
  const getModuleProgressById = (moduleId: string) => {
    return moduleProgress.find(mp => mp.moduleId === moduleId);
  };
  
  const isLessonUnlocked = (lessonId: number) => {
    // For now, all lessons are unlocked
    return true;
  };
  
  const isLessonCompleted = (lessonId: number) => {
    try {
      const progress = getLessonProgressById(lessonId);
      return progress?.isCompleted || false;
    } catch (error) {
      console.warn(`Error checking lesson ${lessonId} completion:`, error);
      return false;
    }
  };
  
  // Helper function to allow marking theory as completed
  const markTheoryCompleted = async (lessonId: number) => {
    try {
      // For now, use localStorage until Convex is deployed
      const userId = user?._id;
      if (!userId) return;
      
      const progress = getLessonProgressById(lessonId) || {
        lessonId,
        isCompleted: false,
        theoryCompleted: false,
        flashcardsCompleted: false,
        quizCompleted: false
      };
      
      progress.theoryCompleted = true;
      
      // Update localStorage
      const key = `lesson_progress_${userId}`;
      const allProgress = JSON.parse(localStorage.getItem(key) || '[]');
      const existingIndex = allProgress.findIndex((p: any) => p.lessonId === lessonId);
      
      if (existingIndex >= 0) {
        allProgress[existingIndex] = progress;
      } else {
        allProgress.push(progress);
      }
      
      localStorage.setItem(key, JSON.stringify(allProgress));
      setLessonProgress(allProgress);
      
    } catch (error) {
      console.error('Error marking theory completed:', error);
    }
  };
  
  // Helper function to complete entire course
  const completeCourse = async () => {
    try {
      const userId = user?._id;
      if (!userId) return;
      
      // Mark all B737 lessons as completed
      const allLessons = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      const allProgress = allLessons.map(lessonId => ({
        lessonId,
        isCompleted: true,
        theoryCompleted: true,
        flashcardsCompleted: true,
        quizCompleted: true
      }));
      
      localStorage.setItem(`lesson_progress_${userId}`, JSON.stringify(allProgress));
      setLessonProgress(allProgress);
      
      // Mark course as completed
      localStorage.setItem(`course_completed_B737_${userId}`, 'true');
      
      alert(t('typerating.courseComplete'));
    } catch (error) {
      console.error('Error completing course:', error);
      alert(t('errors.courseCompletionError'));
    }
  };
  
  // Check if course is completed
  const isCourseCompleted = () => {
    const userId = user?._id;
    if (!userId) return false;
    return localStorage.getItem(`course_completed_B737_${userId}`) === 'true';
  };

  // Module data structure with dynamic progress - BOEING 737 SPECIFIC
  const getModulesWithProgress = () => {
    const fundamentosProgress = getModuleProgressById('fundamentos');
    const sistemasProgress = getModuleProgressById('sistemas');
    const proceduresProgress = getModuleProgressById('procedures');
    const performanceProgress = getModuleProgressById('performance');
    
    return [
      {
        id: 1,
        title: "Boeing 737 Fundamentals & Aircraft General",
        description: "Essential Boeing 737 knowledge including aircraft variants, specifications, and general systems overview",
        progress: fundamentosProgress ? Math.round((fundamentosProgress.completedLessons / fundamentosProgress.totalLessons) * 100) : 0,
        totalLessons: 3,
        completedLessons: fundamentosProgress?.completedLessons || 0,
        isUnlocked: fundamentosProgress?.isUnlocked || true,
        category: "foundation",
        estimatedTime: "3.5 hours",
        difficulty: "Basic",
        lessons: [
          {
            id: 1,
            title: "Boeing 737 Aircraft General Knowledge",
            description: "Comprehensive overview of Boeing 737 family: variants (700/800/900), dimensions, weights, and basic specifications per EASA/FAA standards.",
            duration: "75m",
            isCompleted: isLessonCompleted(1),
            isUnlocked: true,
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Basic",
            topics: ["Aircraft Variants", "Dimensions & Weights", "Performance Specifications", "Certification Standards"]
          },
          {
            id: 2,
            title: "Boeing 737 Cockpit Layout & Systems Overview",
            description: "Detailed cockpit familiarization including primary flight displays, engine indications, and system panels layout.",
            duration: "60m",
            isCompleted: isLessonCompleted(2),
            isUnlocked: true,
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Basic",
            topics: ["Cockpit Layout", "Primary Displays", "System Panels", "Control Interfaces"]
          },
          {
            id: 3,
            title: "Boeing 737 Limitations & Operating Envelopes",
            description: "Critical operating limitations including speed limits, altitude restrictions, weight limitations, and environmental constraints.",
            duration: "45m",
            isCompleted: isLessonCompleted(3),
            isUnlocked: true,
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Intermediate",
            topics: ["Speed Limitations", "Weight Limits", "Altitude Restrictions", "Environmental Limits"]
          }
        ]
      },
      {
        id: 2,
        title: "Boeing 737 Aircraft Systems",
        description: "Comprehensive study of all Boeing 737 aircraft systems including normal operations, abnormal procedures, and emergency configurations",
        progress: sistemasProgress ? Math.round((sistemasProgress.completedLessons / sistemasProgress.totalLessons) * 100) : 0,
        totalLessons: 12,
        completedLessons: sistemasProgress?.completedLessons || 0,
        isUnlocked: sistemasProgress?.isUnlocked || true,
        category: "systems",
        estimatedTime: "18 hours",
        difficulty: "Advanced",
        lessons: [
          {
            id: 4,
            title: "Air Systems - Pressurization & Air Conditioning",
            description: "Boeing 737 environmental control systems: cabin pressurization, air conditioning packs, bleed air systems, and emergency procedures per Boeing QRH.",
            duration: "90m",
            isCompleted: isLessonCompleted(4),
            isUnlocked: isLessonUnlocked(4),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["Cabin Pressure Control", "Air Conditioning Packs", "Bleed Air Systems", "Emergency Procedures"],
            reference: "Boeing 737 FCOM 21-31"
          },
          {
            id: 5,
            title: "Anti-Ice & Rain Protection Systems",
            description: "Comprehensive ice protection systems including engine anti-ice, wing anti-ice, pitot heat, and windshield rain repellent systems.",
            duration: "75m",
            isCompleted: isLessonCompleted(5),
            isUnlocked: isLessonUnlocked(5),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["Engine Anti-Ice", "Wing Anti-Ice", "Pitot Static Heat", "Rain Protection"],
            reference: "Boeing 737 FCOM 30"
          },
          {
            id: 6,
            title: "Automatic Flight - Autopilot & Flight Management",
            description: "Advanced autopilot systems, Flight Management Computer (FMC) operation, autothrottle, and flight director modes per Boeing standards.",
            duration: "120m",
            isCompleted: isLessonCompleted(6),
            isUnlocked: isLessonUnlocked(6),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["Autopilot Modes", "FMC Programming", "Autothrottle", "VNAV/LNAV Operations"],
            reference: "Boeing 737 FCOM 04"
          },
          {
            id: 7,
            title: "Communication & Navigation Systems",
            description: "VHF/HF radio systems, transponder, TCAS, GPS/IRS navigation, and communication procedures per ICAO standards.",
            duration: "60m",
            isCompleted: isLessonCompleted(7),
            isUnlocked: isLessonUnlocked(7),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Intermediate",
            topics: ["Radio Systems", "Transponder", "TCAS", "Navigation Systems"],
            reference: "Boeing 737 FCOM 23-34"
          },
          {
            id: 8,
            title: "Electrical Power Systems",
            description: "AC/DC electrical systems, generators, batteries, external power, and emergency electrical procedures per Boeing specifications.",
            duration: "75m",
            isCompleted: isLessonCompleted(8),
            isUnlocked: isLessonUnlocked(8),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["AC Power Generation", "DC Systems", "Battery Operations", "Emergency Electrical"],
            reference: "Boeing 737 FCOM 24"
          },
          {
            id: 9,
            title: "Engines & APU Systems",
            description: "CFM56-7B engine systems, APU operations, engine indications, thrust management, and powerplant emergency procedures.",
            duration: "105m",
            isCompleted: isLessonCompleted(9),
            isUnlocked: isLessonUnlocked(9),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["CFM56-7B Systems", "APU Operations", "Engine Indications", "Thrust Management"],
            reference: "Boeing 737 FCOM 70-49"
          },
          {
            id: 10,
            title: "Fire Protection Systems",
            description: "Engine fire detection and suppression, APU fire protection, cargo compartment fire systems, and emergency procedures per Boeing QRH.",
            duration: "60m",
            isCompleted: isLessonCompleted(10),
            isUnlocked: isLessonUnlocked(10),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["Engine Fire Detection", "Fire Suppression", "Cargo Fire Systems", "Emergency Procedures"],
            reference: "Boeing 737 FCOM 26"
          },
          {
            id: 11,
            title: "Flight Controls & Hydraulics",
            description: "Primary and secondary flight controls, hydraulic systems A & B, manual reversion, and flight control emergency procedures.",
            duration: "90m",
            isCompleted: isLessonCompleted(11),
            isUnlocked: isLessonUnlocked(11),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["Primary Controls", "Secondary Controls", "Hydraulic Systems", "Manual Reversion"],
            reference: "Boeing 737 FCOM 27-29"
          },
          {
            id: 12,
            title: "Flight Instruments & Displays",
            description: "Primary Flight Display (PFD), Navigation Display (ND), Engine Indication and Crew Alerting System (EICAS), and display management.",
            duration: "75m",
            isCompleted: isLessonCompleted(12),
            isUnlocked: isLessonUnlocked(12),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Intermediate",
            topics: ["Primary Flight Display", "Navigation Display", "EICAS", "Display Management"],
            reference: "Boeing 737 FCOM 10-11"
          },
          {
            id: 13,
            title: "Fuel Systems",
            description: "Fuel storage, distribution, fuel management, center tank operations, fuel jettison, and fuel system malfunctions per Boeing procedures.",
            duration: "75m",
            isCompleted: isLessonCompleted(13),
            isUnlocked: isLessonUnlocked(13),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["Fuel Storage", "Fuel Distribution", "Center Tank Operations", "Fuel Management"],
            reference: "Boeing 737 FCOM 28"
          },
          {
            id: 14,
            title: "Landing Gear & Brakes",
            description: "Landing gear systems, wheel and brake systems, anti-skid, autobrakes, and landing gear emergency procedures.",
            duration: "60m",
            isCompleted: isLessonCompleted(14),
            isUnlocked: isLessonUnlocked(14),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Intermediate",
            topics: ["Landing Gear Systems", "Brake Systems", "Anti-Skid", "Emergency Procedures"],
            reference: "Boeing 737 FCOM 32"
          },
          {
            id: 15,
            title: "Warning Systems & EICAS",
            description: "Master warning/caution systems, EICAS messages, crew alerting philosophy, and abnormal/emergency checklists integration.",
            duration: "60m",
            isCompleted: isLessonCompleted(15),
            isUnlocked: isLessonUnlocked(15),
            hasTheory: true,
            hasFlashcards: true,
            hasQuiz: true,
            difficulty: "Advanced",
            topics: ["Warning Systems", "EICAS Messages", "Crew Alerting", "Emergency Checklists"],
            reference: "Boeing 737 FCOM 05"
          }
        ]
      }
    ];
  };

  const computeModules = () => {
    const base = getModulesWithProgress();
    return base.map((m) => {
      const completed = m.lessons.filter((l: any) => {
        const p = trProgressByLesson.get(l.id);
        return p?.theoryCompleted && p?.flashcardsCompleted && p?.quizCompleted;
      }).length;
      const total = m.lessons.length;
      return {
        ...m,
        completedLessons: completed,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  };
  const modules = computeModules();

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
    // Navigate to lesson content with aircraft context for Convex progress tracking
    navigate(`/lesson/${lesson.id}?aircraft=B737_FAMILY`);
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
                <p className="text-xs text-muted-foreground">B737 Training</p>
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
              {!hasBoeingAccess && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  <Lock className="w-3 h-3 mr-1" />
                  Contenido Restringido
                </Badge>
              )}
            </div>
            
            {/* Aircraft Toggle Button */}
            <div className="mb-6 flex items-center gap-4">
              <Button
                variant="outline"
                onClick={toggleAircraft}
                className="flex items-center gap-2 hover:bg-muted"
              >
                <ToggleRight className="w-4 h-4" />
                <span>Cambiar a Airbus A320</span>
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">B737 Type Rating</h1>
                <p className="text-muted-foreground">Entrenamiento completo para habilitación de tipo en Boeing 737. Aprende la teoría y practica con exámenes.</p>
              </div>
              <div className="flex items-center gap-4">
                <LanguageToggle />
                <div className="text-right">
                  <Badge className="bg-primary/10 text-primary">
                    {getSubscriptionDisplayName()}
                  </Badge>
                  {!hasBoeingAccess && (
                    <p className="text-xs text-warning mt-2">Necesitas suscripción Boeing 737</p>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Header - Mobile */}
        {isMobile && (
          <header className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold">B737 Type Rating</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAircraft}
                  className="flex items-center gap-1"
                >
                  <ToggleRight className="w-3 h-3" />
                  <span className="text-xs">A320</span>
                </Button>
                <LanguageToggle />
                <Badge className="bg-primary/10 text-primary text-xs">
                  {getSubscriptionDisplayName()}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Entrenamiento completo para habilitación de tipo en Boeing 737.</p>
            {!hasBoeingAccess && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Contenido Restringido - Necesitas suscripción Boeing 737
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
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>
                    {modules.length > 0 ? Math.round(
                      (modules.reduce((acc, module) => acc + module.completedLessons, 0) / 
                       modules.reduce((acc, module) => acc + module.totalLessons, 0)) * 100
                    ) : 0}%
                  </div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Completado</p>
                </div>
              </div>
              <Progress 
                value={modules.length > 0 ? 
                  (modules.reduce((acc, module) => acc + module.completedLessons, 0) / 
                   modules.reduce((acc, module) => acc + module.totalLessons, 0)) * 100 
                  : 0
                } 
                className={`h-3 ${isMobile ? 'mb-3' : 'mb-4'}`} 
              />
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
                        : 'border-muted bg-muted/20 cursor-pointer' // Changed to cursor-pointer to allow clicking
                    }`}
                    onClick={() => handleLessonClick(lesson)}
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!lesson.isCompleted && lesson.hasTheory) {
                                markTheoryCompleted(lesson.id);
                              }
                            }}
                          >
                            {lesson.isCompleted ? 'Revisar' : 'Abrir'}
                          </Button>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!lesson.isCompleted && lesson.hasTheory) {
                                markTheoryCompleted(lesson.id);
                              }
                            }}
                          >
                            {lesson.isCompleted ? 'Revisar' : 'Abrir'}
                          </Button>
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
<h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${isMobile ? 'mb-4' : 'mb-6'}`}>{t('typerating.quickActions')}</h2>
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
            <Card className="surface-mid border-border/50 hover-lift cursor-pointer" onClick={() => navigate('/exam?mode=practice&aircraft=B737_FAMILY&categories=aircraft-general,air-systems,engines,flight-controls&questionCount=20')}>
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-primary/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Target className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary`} />
                </div>
<h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>{t('typerating.practiceExam')}</h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>Practica con preguntas del examen oficial B737</p>
<Button className={`w-full ${isMobile ? 'text-xs h-8' : ''}`}>{t('typerating.startPractice')}</Button>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-warning/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Lightbulb className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-warning`} />
                </div>
<h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>{t('typerating.flashcards')}</h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>Study key concepts with advanced interactive flashcards</p>
                <Button className={`w-full ${isMobile ? 'text-xs h-8' : ''}`} onClick={() => navigate('/flashcards/b737')}>
                  <Lightbulb className="w-4 h-4 mr-2" />
{t('typerating.startFlashcards')}
                </Button>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-success/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <CheckCircle2 className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-success`} />
                </div>
<h3 className={`font-semibold ${isMobile ? 'text-sm mb-1' : 'mb-2'}`}>{t('typerating.examSimulator')}</h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>Examen completo con límite de tiempo</p>
                <Button className={`w-full ${isMobile ? 'text-xs h-8' : ''}`} onClick={() => navigate('/exam?mode=timed&aircraft=B737_FAMILY&timeLimit=60&questionCount=50')}>
{t('typerating.startExam')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Aircraft Selection */}
        <section className={isMobile ? 'mt-6' : 'mt-10'}>
<h2 className={`font-bold ${isMobile ? 'text-xl mb-4' : 'text-2xl mb-6'}`}>{t('typerating.selectAircraft')}</h2>
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
            <Card 
              className={`surface-mid border-border/50 ${
                hasAccessTo('A320_FAMILY') ? 'hover-lift cursor-pointer' : 'opacity-60'
              }`} 
              onClick={() => hasAccessTo('A320_FAMILY') && navigate('/type-rating')}
            >
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-primary/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Star className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary`} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>Airbus A320</h3>
                  {!hasAccessTo('A320_FAMILY') && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  Entrenamiento completo para habilitación de tipo en Airbus A320
                </p>
                {hasAccessTo('A320_FAMILY') ? (
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
                hasBoeingAccess ? 'hover-lift cursor-pointer' : 'opacity-60'
              }`} 
              onClick={() => hasBoeingAccess && navigate('/b737-type-rating')}
            >
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <Star className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-blue-500`} />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>Boeing 737</h3>
                  {!hasBoeingAccess && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  Entrenamiento completo para habilitación de tipo en Boeing 737
                </p>
                {hasBoeingAccess ? (
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

export default B737TypeRating;