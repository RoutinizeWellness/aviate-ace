import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import FlashcardContent from '@/components/lesson/FlashcardContent';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  BookMarked,
  Target,
  Play
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTypeRatingProgress } from '@/hooks/useTypeRatingProgress';
import { useLanguage } from '@/contexts/LanguageContext';
import { LessonContentService } from '@/services/lessonContentService';

const LessonDetail = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const aircraftParam = (searchParams.get('aircraft') as 'A320_FAMILY' | 'B737_FAMILY' | null) || 'A320_FAMILY';
  const { mark } = useTypeRatingProgress(aircraftParam);
  const { t } = useLanguage();
  
  // Modal state
  const [showTheoryContent, setShowTheoryContent] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);

  // Helper: validate Convex IDs (32-char lowercase/digits)
  const isValidConvexId = (id: string): boolean => /^[a-z0-9]{32}$/.test(id);

  // Convex queries and mutations (guarded)
  const canUseConvex = !!(user && lessonId && isValidConvexId(lessonId));
  const progress = useQuery(
    api.lessons.getUserLessonProgress,
    canUseConvex ? { 
      userId: user!._id as Id<"users">, 
      lessonId: lessonId as Id<"lessons"> 
    } : "skip"
  );
  
  const updateProgress = useMutation(api.lessons.updateLessonProgress);
  const resetProgressMutation = useMutation(api.lessons.resetLessonProgress);

  // Enhanced lesson data from content service
  const getLessonData = () => {
    const lessonNumber = parseInt(lessonId || '1');
    
    // Try to get enhanced lesson content first
    const enhancedContent = LessonContentService.getLessonContent(lessonNumber);
    if (enhancedContent) {
      return {
        id: lessonId || '1',
        title: enhancedContent.title,
        description: enhancedContent.description,
        category: enhancedContent.module,
        aircraft: enhancedContent.aircraft,
        duration: enhancedContent.duration,
        difficulty: enhancedContent.difficulty,
        content: enhancedContent.theory.sections.map(section => `
          <h3>${section.title}</h3>
          <div>${section.content.replace(/\n/g, '<br>')}</div>
          ${section.keyPoints ? `
            <h4>Key Points:</h4>
            <ul>${section.keyPoints.map(point => `<li>${point}</li>`).join('')}</ul>
          ` : ''}
          ${section.technicalSpecs ? `
            <h4>Technical Specifications:</h4>
            <table>
              ${Object.entries(section.technicalSpecs).map(([key, value]) => 
                `<tr><td><strong>${key}:</strong></td><td>${value}</td></tr>`
              ).join('')}
            </table>
          ` : ''}
        `).join(''),
        objectives: enhancedContent.learningObjectives
      };
    }
    
    if (aircraftParam === 'B737_FAMILY') {
      // Boeing 737 specific content
      const b737Lessons: Record<number, any> = {
        1: {
          id: lessonId || '1',
          title: "Boeing 737 Aircraft General Knowledge",
          description: "Comprehensive overview of Boeing 737 family: variants (700/800/900), dimensions, weights, and basic specifications per EASA/FAA standards.",
          category: "Fundamentals",
          aircraft: "Boeing 737",
          duration: "75 minutes",
          difficulty: "Basic",
          content: `
            <h2>Boeing 737 Aircraft General Knowledge</h2>
            
            <h3>Overview</h3>
            <p>The Boeing 737 is a narrow-body commercial airliner family. Learn about its variants, specifications, and operational characteristics.</p>
            
            <h3>Aircraft Variants</h3>
            <ul>
              <li><strong>Boeing 737-700</strong> - Shorter variant with reduced capacity</li>
              <li><strong>Boeing 737-800</strong> - Most common variant in current operation</li>
              <li><strong>Boeing 737-900</strong> - Extended variant with increased passenger capacity</li>
              <li><strong>Boeing 737 MAX</strong> - Latest generation with new engines</li>
            </ul>
            
            <h3>Key Specifications</h3>
            <p>Maximum takeoff weight varies by variant. The 737-800 has an MTOW of approximately 79,000 kg.</p>
            
            <h3>Certification Standards</h3>
            <p>Boeing 737 is certified under FAA Part 25 and EASA CS-25 regulations for commercial transport aircraft.</p>
          `,
          objectives: [
            "Identify Boeing 737 aircraft variants and their differences",
            "Understand basic aircraft dimensions and weight limitations", 
            "Know certification standards applicable to Boeing 737",
            "Recognize key operational characteristics"
          ]
        },
        4: {
          id: lessonId || '4',
          title: "Boeing 737 Air Conditioning & Pressurization Systems",
          description: "Boeing 737 environmental control systems: cabin pressurization, air conditioning packs, bleed air systems, and emergency procedures per Boeing QRH.",
          category: "Systems",
          aircraft: "Boeing 737",
          duration: "90 minutes",
          difficulty: "Advanced",
          content: `
            <h2>Boeing 737 Air Conditioning & Pressurization Systems</h2>
            
            <h3>Overview</h3>
            <p>The Boeing 737 air conditioning and pressurization system maintains a comfortable and safe environment for passengers and crew.</p>
            
            <h3>Key Components</h3>
            <ul>
              <li><strong>Air Conditioning Packs (PACKs)</strong> - Two packs provide conditioned air</li>
              <li><strong>Cabin Pressure Controller (CPC)</strong> - Automatic pressure control</li>
              <li><strong>Outflow Valves</strong> - Control cabin pressure by regulating air outflow</li>
              <li><strong>Mixing Manifold</strong> - Combines conditioned and recirculated air</li>
            </ul>
            
            <h3>Emergency Procedures</h3>
            <p>In case of system failure, follow Boeing QRH procedures and consider diverting if pressurization cannot be maintained.</p>
          `,
          objectives: [
            "Understand Boeing 737 air conditioning system components",
            "Explain Boeing 737 pressurization system operation", 
            "Identify key system controls and indicators on Boeing 737",
            "Know emergency procedures for Boeing 737 system failures"
          ]
        }
      };
      return b737Lessons[lessonNumber] || b737Lessons[1];
    } else {
      // Airbus A320 specific content
      const a320Lessons: Record<number, any> = {
        1: {
          id: lessonId || '1',
          title: "Airbus A320 Airplane General",
          description: "Visión general A320: arquitectura, variantes y filosofía Airbus.",
          category: "Fundamentos",
          aircraft: "Airbus A320",
          duration: "45 minutes",
          difficulty: "Basic",
          content: `
            <h2>Airbus A320 Airplane General</h2>
            
            <h3>Overview</h3>
            <p>The Airbus A320 family is a series of narrow-body airliners. Learn about Airbus design philosophy and aircraft characteristics.</p>
            
            <h3>Aircraft Variants</h3>
            <ul>
              <li><strong>Airbus A318</strong> - Shortest variant of the A320 family</li>
              <li><strong>Airbus A319</strong> - Shortened fuselage variant</li>
              <li><strong>Airbus A320</strong> - Original and most common variant</li>
              <li><strong>Airbus A321</strong> - Stretched variant with increased capacity</li>
            </ul>
            
            <h3>Airbus Philosophy</h3>
            <p>Airbus emphasizes fly-by-wire technology and flight envelope protection systems.</p>
            
            <h3>Key Features</h3>
            <p>The A320 features side-stick controls, ECAM system, and comprehensive automation.</p>
          `,
          objectives: [
            "Understand Airbus A320 family variants and differences",
            "Learn about Airbus design philosophy and approach", 
            "Identify key A320 systems and controls",
            "Recognize A320 operational characteristics"
          ]
        },
        2: {
          id: lessonId || '2',
          title: "Airbus A320 Air Conditioning & Pressurization",
          description: "Control de la temperatura, la presión y la calidad del aire en cabina, garantizando confort y seguridad para tripulación y pasajeros",
          category: "Sistemas",
          aircraft: "Airbus A320",
          duration: "60 minutes",
          difficulty: "Advanced",
          content: `
            <h2>Airbus A320 Air Conditioning & Pressurization</h2>
            
            <h3>Overview</h3>
            <p>The Airbus A320 environmental control system manages cabin temperature, pressure, and air quality.</p>
            
            <h3>Key Components</h3>
            <ul>
              <li><strong>Air Conditioning Units</strong> - Two independent units for redundancy</li>
              <li><strong>Cabin Pressure Controller</strong> - Automatic pressure management</li>
              <li><strong>Outflow Valves</strong> - Regulate cabin pressure automatically</li>
              <li><strong>Pack Flow Control</strong> - Manages air distribution</li>
            </ul>
            
            <h3>ECAM Integration</h3>
            <p>The A320 ECAM system provides comprehensive monitoring and alerts for environmental systems.</p>
          `,
          objectives: [
            "Understand Airbus A320 air conditioning components",
            "Explain A320 pressurization system operation", 
            "Learn ECAM indications for environmental systems",
            "Know A320-specific emergency procedures"
          ]
        }
      };
      return a320Lessons[lessonNumber] || a320Lessons[1];
    }
  };
  
  const lessonData = getLessonData();

  // Aircraft-specific flashcards data
  const getFlashcardsData = () => {
    if (aircraftParam === 'B737_FAMILY') {
      return [
        {
          id: 1,
          front: "Boeing 737 PACK (Pneumatic Air Cycle Kit)",
          back: "Air conditioning unit that cools and conditions bleed air from the engines or APU for cabin use in Boeing 737.",
          category: "Air Conditioning"
        },
        {
          id: 2,
          front: "Boeing 737 Cabin Pressure Controller (CPC)",
          back: "Automatic system in Boeing 737 that maintains cabin pressure by controlling outflow valves.",
          category: "Pressurization"
        },
        {
          id: 3,
          front: "Boeing 737 Outflow Valve",
          back: "Valve in Boeing 737 that controls the rate of air leaving the cabin to maintain proper pressurization.",
          category: "Pressurization"
        },
        {
          id: 4,
          front: "Boeing 737 Bleed Air",
          back: "Hot, high-pressure air taken from the Boeing 737 engine compressor stages, used for cabin air conditioning and pressurization.",
          category: "Air Source"
        },
        {
          id: 5,
          front: "Boeing 737 Mixing Manifold",
          back: "Component in Boeing 737 that combines conditioned air from PACKs with recirculated cabin air.",
          category: "Air Distribution"
        }
      ];
    } else {
      return [
        {
          id: 1,
          front: "Airbus A320 Air Conditioning Unit",
          back: "Independent air conditioning system in A320 that provides conditioned air for cabin comfort.",
          category: "Air Conditioning"
        },
        {
          id: 2,
          front: "Airbus A320 Cabin Pressure Controller",
          back: "Automatic system in A320 that maintains cabin pressure with ECAM integration.",
          category: "Pressurization"
        },
        {
          id: 3,
          front: "Airbus A320 ECAM",
          back: "Electronic Centralized Aircraft Monitoring system that provides comprehensive aircraft systems monitoring in A320.",
          category: "Systems Monitoring"
        },
        {
          id: 4,
          front: "Airbus A320 Pack Flow Control",
          back: "System in A320 that manages air distribution and flow control throughout the cabin.",
          category: "Air Distribution"
        },
        {
          id: 5,
          front: "Airbus A320 Side-stick",
          back: "Primary flight control input device in A320, replacing conventional control yoke.",
          category: "Flight Controls"
        }
      ];
    }
  };
  
  const flashcards = getFlashcardsData();

  // Event handlers
  const handleTheoryComplete = async () => {
    if (user && lessonId && canUseConvex) {
      await updateProgress({
        userId: user._id as Id<"users">,
        lessonId: lessonId as Id<"lessons">,
        theoryCompleted: true
      });
      // Also mark Type Rating step in Convex (if lessonId is numeric)
      const numericId = Number(lessonId);
      if (!Number.isNaN(numericId)) {
        try { await mark(numericId, 'theory'); } catch {}
      }
      setShowTheoryContent(false);
    }
  };

  const handleFlashcardsComplete = async () => {
    if (user && lessonId && canUseConvex) {
      await updateProgress({
        userId: user._id as Id<"users">,
        lessonId: lessonId as Id<"lessons">,
        flashcardsCompleted: true
      });
      const numericId = Number(lessonId);
      if (!Number.isNaN(numericId)) {
        try { await mark(numericId, 'flashcards'); } catch {}
      }
      setShowFlashcards(false);
    }
  };

  const handleQuizComplete = async () => {
    if (user && lessonId && canUseConvex) {
      await updateProgress({
        userId: user._id as Id<"users">,
        lessonId: lessonId as Id<"lessons">,
        quizCompleted: true
      });
      const numericId = Number(lessonId);
      if (!Number.isNaN(numericId)) {
        try { await mark(numericId, 'quiz'); } catch {}
      }
      alert("Quiz completed! In a real implementation, this would show quiz questions.");
    }
  };

  const handleResetProgress = async () => {
    if (user && lessonId && canUseConvex) {
      await resetProgressMutation({
        userId: user._id as Id<"users">,
        lessonId: lessonId as Id<"lessons">
      });
    }
  };

  // Loading state (only when using Convex)
  if (canUseConvex && progress === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('lesson.loadingLesson')}</p>
        </div>
      </div>
    );
  }

  // Provide a safe progress object when Convex is skipped
  const safeProgress = (progress as any) || {
    theoryCompleted: false,
    flashcardsCompleted: false,
    quizCompleted: false,
    overallProgress: 0,
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(aircraftParam === 'B737_FAMILY' ? '/b737-type-rating' : '/type-rating')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('lesson.backToCourse')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetProgress}
            className="flex items-center gap-2"
          >
            {t('lesson.resetProgress')}
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('lesson.details')}</h1>
              <p className="text-sm text-muted-foreground">{t('lesson.completeAllActivities')}</p>
            </div>
          </div>
        </div>

        {/* Lesson Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{lessonData.aircraft}</Badge>
                  <Badge variant="outline">{lessonData.category}</Badge>
                  <Badge variant="outline">{lessonData.difficulty}</Badge>
                </div>
                <CardTitle className="text-2xl mb-2">{lessonData.title}</CardTitle>
                <p className="text-muted-foreground">{lessonData.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lessonData.duration}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('lesson.progress')}</span>
                <span className="text-sm font-medium">{safeProgress.overallProgress}%</span>
              </div>
              <Progress value={safeProgress.overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Learning Activities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Theory */}
          <Card className={`border-2 ${safeProgress.theoryCompleted ? 'border-green-500' : 'border-border'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                {t('lesson.theory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('lesson.startTheory')}
              </p>
              <Button 
                className="w-full" 
                onClick={() => setShowTheoryContent(true)}
              >
                {safeProgress.theoryCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t('common.completed')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {t('lesson.startTheory')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Flashcards */}
          <Card className={`border-2 ${safeProgress.flashcardsCompleted ? 'border-green-500' : 'border-border'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookMarked className="w-5 h-5" />
                {t('lesson.flashcards')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review key terms and concepts with interactive flashcards.
              </p>
              <Button 
                className="w-full"
                variant={safeProgress.theoryCompleted ? "default" : "secondary"}
                onClick={() => setShowFlashcards(true)}
                disabled={!safeProgress.theoryCompleted}
              >
                {safeProgress.flashcardsCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t('common.completed')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {safeProgress.theoryCompleted ? t('lesson.startFlashcards') : t('lesson.completeTheoryFirst')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quiz */}
          <Card className={`border-2 ${safeProgress.quizCompleted ? 'border-green-500' : 'border-border'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                {t('lesson.quiz')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test your knowledge with a comprehensive quiz.
              </p>
              <Button 
                className="w-full"
                variant={safeProgress.flashcardsCompleted ? "default" : "secondary"}
                onClick={handleQuizComplete}
                disabled={!safeProgress.flashcardsCompleted}
              >
                {safeProgress.quizCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t('common.completed')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {safeProgress.flashcardsCompleted ? t('lesson.startQuiz') : t('lesson.completeFlashcardsFirst')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Learning Objectives */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('lesson.objectives')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lessonData.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Theory Content Modal */}
        {showTheoryContent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Theory: {lessonData.title}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowTheoryContent(false)}>
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: lessonData.content }} 
                />
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowTheoryContent(false)}>
                    {t('lesson.close')}
                  </Button>
                  <Button onClick={handleTheoryComplete}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t('lesson.markAsComplete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Flashcards Modal */}
        {showFlashcards && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {t('lesson.keyTerms')}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowFlashcards(false)}>
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FlashcardContent 
                  flashcards={flashcards}
                  onComplete={handleFlashcardsComplete}
                  onClose={() => setShowFlashcards(false)}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;