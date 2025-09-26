import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/UserAvatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Target, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Plane,
  ArrowLeft,
  TrendingUp,
  Trophy,
  Clock,
  CheckCircle2,
  Calendar,
  Star,
  Edit,
  Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo } from "react";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";

const Progress = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [weeklyGoal, setWeeklyGoal] = useState(20);
  const [showGoalSettings, setShowGoalSettings] = useState(false);

  // Helper function to validate Convex IDs
  const isValidConvexId = (id: string): boolean => {
    return /^[a-z0-9]{32}$/.test(id);
  };

  // Get real user exam sessions from Convex (this API exists)
  const userExamSessions = useQuery(
    api.exams.getUserExamSessions,
    user && isValidConvexId(user._id) ? { userId: user._id } : "skip"
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user?.fullName || user?.email?.split('@')[0] || t('common.user');

  // Calculate real progress metrics from actual exam data
  const progressMetrics = useMemo(() => {
    if (!userExamSessions) {
      return {
        totalExamsTaken: 0,
        totalCorrectAnswers: 0,
        totalIncorrectAnswers: 0,
        totalTimeSpent: 0,
        overallAccuracy: 0,
        completedLessons: 0,
        totalPoints: 0,
        studyStreak: 0,
        categoryStats: new Map()
      };
    }

    // Calculate exam statistics from real data
    const totalExamsTaken = userExamSessions.length;
    let totalCorrectAnswers = 0;
    let totalIncorrectAnswers = 0;
    let totalTimeSpent = 0;
    let totalPoints = 0;
    const categoryStats = new Map();

    userExamSessions.forEach(session => {
      totalCorrectAnswers += session.correctAnswers;
      totalIncorrectAnswers += (session.questionsCount - session.correctAnswers);
      totalTimeSpent += session.timeSpent;
      totalPoints += session.score >= 75 ? 100 : 50; // Points based on passing
      
      // Category-specific statistics
      const category = session.sessionType || 'General';
      if (!categoryStats.has(category)) {
        categoryStats.set(category, {
          correct: 0,
          total: 0,
          timeSpent: 0,
          attempts: 0
        });
      }
      
      const catStats = categoryStats.get(category);
      catStats.attempts++;
      catStats.total += session.questionsCount;
      catStats.correct += session.correctAnswers;
      catStats.timeSpent += session.timeSpent;
    });

    // Calculate study streak based on completion dates
    const today = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    const recentSessions = userExamSessions
      .sort((a, b) => b.completedAt - a.completedAt);
    
    let studyStreak = 0;
    let checkDate = today;
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hadActivity = recentSessions.some(session => {
        const sessionDate = new Date(session.completedAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });
      
      if (hadActivity) {
        studyStreak++;
      } else if (i > 0) { // Don't break on the first day (today)
        break;
      }
      
      checkDate = new Date(checkDate.getTime() - msInDay);
    }

    const overallAccuracy = totalCorrectAnswers + totalIncorrectAnswers > 0 
      ? Math.round((totalCorrectAnswers / (totalCorrectAnswers + totalIncorrectAnswers)) * 100)
      : 0;

    // Estimate completed lessons based on exam performance
    const completedLessons = Math.floor(totalExamsTaken * 1.5); // Rough estimate

    return {
      totalExamsTaken,
      totalCorrectAnswers,
      totalIncorrectAnswers,
      totalTimeSpent,
      overallAccuracy,
      completedLessons,
      totalPoints,
      studyStreak,
      categoryStats
    };
  }, [userExamSessions]);

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Sidebar */}
      <UnifiedSidebar activePage="progress" />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back')}
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t('progress.title')}</h1>
          <p className="text-muted-foreground">{t('progress.subtitle')}</p>
        </header>

        {/* Overall Progress */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">{t('progress.overall.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="surface-mid border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary">{t('progress.overall.accuracy')}</Badge>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{progressMetrics.overallAccuracy}%</div>
                <p className="text-sm text-muted-foreground mb-4">{t('progress.overall.accuracyDesc')}</p>
                <ProgressBar value={progressMetrics.overallAccuracy} className="h-2" />
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <Badge className="bg-success/10 text-success">{t('progress.overall.lessons')}</Badge>
                </div>
                <div className="text-3xl font-bold text-success mb-2">{progressMetrics.completedLessons}</div>
                <p className="text-sm text-muted-foreground mb-4">{t('progress.overall.lessonsDesc')}</p>
                <div className="text-xs text-muted-foreground">{progressMetrics.totalPoints} {t('progress.overall.points')}</div>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-warning" />
                  </div>
                  <Badge className="bg-warning/10 text-warning">{t('progress.overall.exams')}</Badge>
                </div>
                <div className="text-3xl font-bold text-warning mb-2">{progressMetrics.totalExamsTaken}</div>
                <p className="text-sm text-muted-foreground mb-4">{t('progress.overall.examsDesc')}</p>
                <div className="text-xs text-muted-foreground">{Math.round(progressMetrics.totalTimeSpent / 60)} {t('common.minutes')}</div>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-info" />
                  </div>
                  <Badge className="bg-info/10 text-info">{t('progress.overall.streak')}</Badge>
                </div>
                <div className="text-3xl font-bold text-info mb-2">{progressMetrics.studyStreak}</div>
                <p className="text-sm text-muted-foreground mb-4">{t('progress.overall.streakDesc')}</p>
                <div className="text-xs text-muted-foreground">{t('progress.overall.daysActive')}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Course Progress */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">{t('progress.courseProgress.title')}</h2>
          <div className="space-y-6">
            {progressMetrics.categoryStats.size > 0 ? (
              Array.from(progressMetrics.categoryStats.entries()).map(([category, stats]) => {
                const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                
                return (
                  <Card key={category} className="surface-mid border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Plane className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{category}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {stats.attempts} {t('progress.overall.exams').toLowerCase()}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary">
                          {accuracy}% {t('progress.courseProgress.accuracy')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>{t('progress.courseProgress.accuracy')}:</span>
                          <span className="font-medium">{accuracy}%</span>
                        </div>
                        <ProgressBar value={accuracy} className="h-3" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{stats.correct}</div>
                            <p className="text-xs text-muted-foreground">{t('progress.courseProgress.correct')}</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-warning">{stats.total - stats.correct}</div>
                            <p className="text-xs text-muted-foreground">{t('progress.courseProgress.incorrect')}</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-info">{Math.round(stats.timeSpent / 60)}</div>
                            <p className="text-xs text-muted-foreground">{t('common.minutes')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="surface-mid border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">{t('progress.achievements.noData')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('common.loading')}</p>
                  <Button onClick={() => navigate('/exams')}>{t('nav.exams')}</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">{t('progress.achievements.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="surface-mid border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{t('progress.achievements.firstExam')}</h3>
                <p className="text-sm text-muted-foreground">{t('progress.achievements.firstExamDesc')}</p>
                <Badge variant="outline" className="mt-2">{t('progress.achievements.pending')}</Badge>
              </CardContent>
            </Card>
            
            <Card className="surface-mid border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{t('progress.achievements.studyStreak')}</h3>
                <p className="text-sm text-muted-foreground">{t('progress.achievements.studyStreakDesc')}</p>
                <Badge variant="outline" className="mt-2">{t('progress.achievements.pending')}</Badge>
              </CardContent>
            </Card>
            
            <Card className="surface-mid border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{t('progress.achievements.speedLightning')}</h3>
                <p className="text-sm text-muted-foreground">{t('progress.achievements.speedLightningDesc')}</p>
                <Badge variant="outline" className="mt-2">{t('progress.achievements.pending')}</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Weekly Calendar */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('progress.weeklyActivity.title')}</h2>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {[
                  t('progress.weeklyActivity.mon'), 
                  t('progress.weeklyActivity.tue'), 
                  t('progress.weeklyActivity.wed'), 
                  t('progress.weeklyActivity.thu'), 
                  t('progress.weeklyActivity.fri'), 
                  t('progress.weeklyActivity.sat'), 
                  t('progress.weeklyActivity.sun')
                ].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium mb-2">{day}</div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto ${
                      index < 5 ? 'bg-primary/20 text-primary' : 'bg-muted'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {index < 5 ? '2h' : '0h'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Progress;