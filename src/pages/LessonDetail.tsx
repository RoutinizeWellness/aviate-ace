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

const LessonDetail = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();
  
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

  // Mock lesson data
  const lessonData = {
    id: lessonId || '1',
    title: "Boeing 737 Air Conditioning & Pressurization Systems",
    description: "Learn about the Boeing 737 cabin air conditioning, pressurization, and environmental control systems.",
    category: "Systems",
    aircraft: "Boeing 737",
    duration: "60 minutes",
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
      <p>In case of system failure, follow QRH procedures and consider diverting if pressurization cannot be maintained.</p>
    `,
    objectives: [
      "Understand air conditioning system components",
      "Explain pressurization system operation", 
      "Identify key system controls and indicators",
      "Know emergency procedures for system failures"
    ]
  };

  // Flashcards data
  const flashcards = [
    {
      id: 1,
      front: "PACK (Pneumatic Air Cycle Kit)",
      back: "Air conditioning unit that cools and conditions bleed air from the engines or APU for cabin use.",
      category: "Air Conditioning"
    },
    {
      id: 2,
      front: "Cabin Pressure Controller (CPC)",
      back: "Automatic system that maintains cabin pressure by controlling outflow valves.",
      category: "Pressurization"
    },
    {
      id: 3,
      front: "Outflow Valve",
      back: "Valve that controls the rate of air leaving the cabin to maintain proper pressurization.",
      category: "Pressurization"
    },
    {
      id: 4,
      front: "Bleed Air",
      back: "Hot, high-pressure air taken from the engine compressor stages, used for cabin air conditioning and pressurization.",
      category: "Air Source"
    },
    {
      id: 5,
      front: "Mixing Manifold",
      back: "Component that combines conditioned air from PACKs with recirculated cabin air.",
      category: "Air Distribution"
    }
  ];

  // Event handlers
  const handleTheoryComplete = async () => {
    if (user && lessonId && canUseConvex) {
      await updateProgress({
        userId: user._id as Id<"users">,
        lessonId: lessonId as Id<"lessons">,
        theoryCompleted: true
      });
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
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/b737-type-rating')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetProgress}
            className="flex items-center gap-2"
          >
            Reset Progress
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lesson Details</h1>
              <p className="text-sm text-muted-foreground">Complete all activities to finish this lesson</p>
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
                <span className="text-sm font-medium">Lesson Progress</span>
                <span className="text-sm font-medium">{progress.overallProgress}%</span>
              </div>
              <Progress value={progress.overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Learning Activities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Theory */}
          <Card className={`border-2 ${progress.theoryCompleted ? 'border-green-500' : 'border-border'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" />
                Theory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Study the theoretical concepts and principles of this lesson.
              </p>
              <Button 
                className="w-full" 
                onClick={() => setShowTheoryContent(true)}
              >
                {progress.theoryCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Theory
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Flashcards */}
          <Card className={`border-2 ${progress.flashcardsCompleted ? 'border-green-500' : 'border-border'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookMarked className="w-5 h-5" />
                Flashcards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review key terms and concepts with interactive flashcards.
              </p>
              <Button 
                className="w-full"
                variant={progress.theoryCompleted ? "default" : "secondary"}
                onClick={() => setShowFlashcards(true)}
                disabled={!progress.theoryCompleted}
              >
                {progress.flashcardsCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {progress.theoryCompleted ? 'Start Flashcards' : 'Complete Theory First'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quiz */}
          <Card className={`border-2 ${progress.quizCompleted ? 'border-green-500' : 'border-border'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5" />
                Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test your knowledge with a comprehensive quiz.
              </p>
              <Button 
                className="w-full"
                variant={progress.flashcardsCompleted ? "default" : "secondary"}
                onClick={handleQuizComplete}
                disabled={!progress.flashcardsCompleted}
              >
                {progress.quizCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {progress.flashcardsCompleted ? 'Start Quiz' : 'Complete Flashcards First'}
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
              Learning Objectives
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
                    Close
                  </Button>
                  <Button onClick={handleTheoryComplete}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete
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
                    Flashcards: Key Terms
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