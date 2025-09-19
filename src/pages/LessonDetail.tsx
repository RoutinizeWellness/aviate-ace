import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { 
  ArrowLeft,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Lightbulb,
  FileText,
  BookMarked,
  Target
} from 'lucide-react';

const LessonDetail = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();
  
  // Mock lesson data - in a real app this would come from an API
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
      <p>The Boeing 737 air conditioning and pressurization system maintains a comfortable and safe environment for passengers and crew. The system provides:</p>
      <ul>
        <li>Temperature control</li>
        <li>Cabin pressurization</li>
        <li>Air quality management</li>
        <li>Smoke detection and removal</li>
      </ul>
      
      <h3>Air Conditioning System Components</h3>
      <p>The Boeing 737 air conditioning system consists of:</p>
      <ol>
        <li><strong>Air Conditioning Packs (PACKs)</strong> - Two packs provide conditioned air to the cabin</li>
        <li><strong>Mixing Manifold</strong> - Combines conditioned air with recirculated air</li>
        <li><strong>Distribution Ducts</strong> - Distribute air throughout the cabin</li>
        <li><strong>Recirculation System</strong> - Recirculates filtered cabin air to reduce engine bleed air demand</li>
        <li><strong>Temperature Control System</strong> - Maintains desired cabin temperature</li>
      </ol>
      
      <h3>Pressurization System</h3>
      <p>The pressurization system maintains cabin pressure at a comfortable level:</p>
      <ul>
        <li><strong>Cabin Pressure Controller (CPC)</strong> - Automatic control of cabin pressure</li>
        <li><strong>Outflow Valves</strong> - Control cabin pressure by regulating air outflow</li>
        <li><strong>Safety Valves</strong> - Provide overpressure and negative pressure protection</li>
        <li><strong>Pressure Relief Valves</strong> - Emergency pressure relief</li>
      </ul>
      
      <h3>Key Operating Principles</h3>
      <p>Understanding the system operation is crucial for pilots:</p>
      <ul>
        <li>Air is typically supplied from engine bleed air or APU</li>
        <li>PACKs cool and condition the bleed air</li>
        <li>Pressurization is maintained by controlling outflow</li>
        <li>Automatic systems can be overridden manually if needed</li>
      </ul>
      
      <h3>Emergency Procedures</h3>
      <p>In case of system failure:</p>
      <ol>
        <li>Identify the failed component</li>
        <li>Follow QRH procedures for the specific failure</li>
        <li>Consider diverting if pressurization cannot be maintained</li>
        <li>Monitor cabin altitude and rate of change</li>
      </ol>
    `,
    objectives: [
      "Understand air conditioning system components",
      "Explain pressurization system operation",
      "Identify key system controls and indicators",
      "Know emergency procedures for system failures"
    ],
    prerequisites: [
      "Basic aircraft systems knowledge",
      "Understanding of pneumatic systems"
    ]
  };

  const [progress, setProgress] = useState({
    theoryCompleted: false,
    flashcardsCompleted: false,
    quizCompleted: false,
    overallProgress: 0
  });

  // Load progress from localStorage
  useEffect(() => {
    if (user?._id && lessonId) {
      const storedProgress = localStorage.getItem(`lesson_progress_${user._id}_${lessonId}`);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
    }
  }, [user?._id, lessonId]);

  // Save progress to localStorage
  const saveProgress = (newProgress: any) => {
    if (user?._id && lessonId) {
      localStorage.setItem(`lesson_progress_${user._id}_${lessonId}`, JSON.stringify(newProgress));
      setProgress(newProgress);
    }
  };

  const markTheoryComplete = () => {
    const newProgress = {
      ...progress,
      theoryCompleted: true,
      overallProgress: progress.flashcardsCompleted && progress.quizCompleted ? 100 : 
                      progress.flashcardsCompleted || progress.quizCompleted ? 66 : 33
    };
    saveProgress(newProgress);
  };

  const markFlashcardsComplete = () => {
    const newProgress = {
      ...progress,
      flashcardsCompleted: true,
      overallProgress: progress.theoryCompleted && progress.quizCompleted ? 100 : 
                      progress.theoryCompleted || progress.quizCompleted ? 66 : 33
    };
    saveProgress(newProgress);
  };

  const markQuizComplete = () => {
    const newProgress = {
      ...progress,
      quizCompleted: true,
      overallProgress: progress.theoryCompleted && progress.flashcardsCompleted ? 100 : 
                      progress.theoryCompleted || progress.flashcardsCompleted ? 66 : 33
    };
    saveProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/type-rating')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
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
                onClick={markTheoryComplete}
                disabled={progress.theoryCompleted}
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
                onClick={markFlashcardsComplete}
                disabled={!progress.theoryCompleted || progress.flashcardsCompleted}
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
                onClick={() => {
                  markQuizComplete();
                  navigate(`/exam?mode=quiz&lessonId=${lessonId}`);
                }}
                disabled={!progress.flashcardsCompleted || progress.quizCompleted}
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

        {/* Lesson Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Lesson Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: lessonData.content }} 
            />
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lessonData.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{prereq}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
