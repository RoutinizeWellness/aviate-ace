import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Target,
  BookOpen,
  Star,
  Award,
  Calendar,
  Zap,
  Brain,
  ChevronRight,
  Download,
  ArrowLeft,
  Activity,
  PieChart,
  LineChart
} from "lucide-react";
import { useAuth } from "@/hooks/useConvexAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserAvatar } from "@/components/UserAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnalyticsService, PerformanceMetrics, LearningInsights } from "@/services/analyticsService";
import { AchievementService, GameificationStats } from "@/services/achievementService";

const AdvancedAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();
  
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [insights, setInsights] = useState<LearningInsights | null>(null);
  const [gamificationStats, setGamificationStats] = useState<GameificationStats | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('month');

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  useEffect(() => {
    const loadAnalytics = async () => {
      if (user?._id) {
        setIsLoading(true);
        try {
          const [metricsData, insightsData, gamificationData] = await Promise.all([
            AnalyticsService.getPerformanceMetrics(user._id),
            AnalyticsService.getLearningInsights(user._id),
            AchievementService.getGamificationStats(user._id)
          ]);
          
          setMetrics(metricsData);
          setInsights(insightsData);
          setGamificationStats(gamificationData);
        } catch (error) {
          console.error('Error loading analytics:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadAnalytics();
  }, [user?._id]);

  const generateReport = async () => {
    if (user?._id) {
      try {
        const report = await AnalyticsService.getDetailedReport(user._id);
        
        // Create downloadable report
        const reportData = {
          generatedAt: new Date().toISOString(),
          user: displayName,
          ...report
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aviate-ace-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating report:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className={`${isMobile ? 'p-4 border-b' : 'p-8 border-b'} bg-background/95 backdrop-blur sticky top-0 z-30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-3xl'}`}>Advanced Analytics</h1>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                Comprehensive learning insights and performance metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={generateReport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <UserAvatar 
              avatarUrl={profile?.avatar_url} 
              displayName={displayName}
              size="sm"
            />
          </div>
        </div>
      </header>

      <main className={`${isMobile ? 'p-4' : 'p-8'}`}>
        {/* Quick Stats Overview */}
        <div className={`grid grid-cols-2 ${isMobile ? 'gap-3 mb-6' : 'md:grid-cols-4 gap-6 mb-8'}`}>
          <Card className="surface-mid border-border/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-primary`}>
                {Math.round(metrics?.overall.averageScore || 0)}%
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Average Score</p>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              <div className={`w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-success`}>
                {Math.round(metrics?.overall.totalStudyTime || 0)}h
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Study Time</p>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              <div className={`w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-warning`}>
                {metrics?.streaks.currentStreak || 0}
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Day Streak</p>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
              <div className={`w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <Award className="w-6 h-6 text-info" />
              </div>
              <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-info`}>
                {gamificationStats?.achievements.filter(a => a.unlockedAt).length || 0}
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <TabsTrigger value="performance" className={`${isMobile ? 'text-xs' : ''}`}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="progress" className={`${isMobile ? 'text-xs' : ''}`}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className={`${isMobile ? 'text-xs' : ''}`}>
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="insights" className={`${isMobile ? 'text-xs' : ''}`}>
              <Brain className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {/* Performance by Module */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Performance by Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(metrics?.byModule || {}).map(([module, data]) => (
                  <div key={module} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{module}</span>
                      <span className="text-sm text-muted-foreground">
                        {data.completedLessons}/{data.totalLessons} lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={(data.completedLessons / data.totalLessons) * 100} className="flex-1" />
                      <span className="font-medium text-primary">{Math.round(data.averageScore)}%</span>
                    </div>
                    <div className="flex gap-2">
                      {data.strengthAreas.map(area => (
                        <Badge key={area} variant="outline" className="bg-success/10 text-success text-xs">
                          {area}
                        </Badge>
                      ))}
                      {data.weaknessAreas.map(area => (
                        <Badge key={area} variant="outline" className="bg-destructive/10 text-destructive text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance by Difficulty */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>Performance by Difficulty Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(metrics?.byDifficulty || {}).map(([difficulty, data]) => (
                  <div key={difficulty} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">{difficulty}</h4>
                      <p className="text-sm text-muted-foreground">
                        Avg. time: {Math.round(data.averageTime / 60)}min
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{Math.round(data.averageScore)}%</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(data.completionRate)}% completion
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Study Time Trends */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Study Time Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics?.trends.weeklyTrends.slice(-4).map((week, index) => (
                    <div key={week.week} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Week {index + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(week.week).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{Math.round(week.totalTime)}h</div>
                        <div className={`text-sm flex items-center gap-1 ${
                          week.improvement >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          {week.improvement >= 0 ? '+' : ''}{Math.round(week.improvement)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Activity */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Daily Activity (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {metrics?.trends.dailyProgress.slice(-7).map((day, index) => (
                    <div key={day.date} className="text-center p-3 border rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </div>
                      <div className="font-bold text-sm">{Math.round(day.studyTime * 10) / 10}h</div>
                      {day.lessonsCompleted > 0 && (
                        <div className="w-2 h-2 bg-success rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Recent Achievements */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gamificationStats?.milestones.recentUnlocks.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className={`
                        ${achievement.difficulty === 'bronze' ? 'bg-orange-100 text-orange-800' : ''}
                        ${achievement.difficulty === 'silver' ? 'bg-gray-100 text-gray-800' : ''}
                        ${achievement.difficulty === 'gold' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${achievement.difficulty === 'platinum' ? 'bg-purple-100 text-purple-800' : ''}
                        ${achievement.difficulty === 'diamond' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {achievement.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievement Progress */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gamificationStats?.achievements.filter(a => !a.unlockedAt && !a.isHidden).slice(0, 5).map(achievement => (
                    <div key={achievement.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{achievement.icon}</span>
                          <span className="font-medium">{achievement.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} />
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {/* Recommendations */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights?.recommendations.studyPlan.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        plan.priority === 'high' ? 'bg-destructive' :
                        plan.priority === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}></div>
                      <div>
                        <h4 className="font-medium">Lesson {plan.lessonId}</h4>
                        <p className="text-sm text-muted-foreground">{plan.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{plan.estimatedTime}min</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/lesson/${plan.lessonId}`)}
                      >
                        Start <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="surface-mid border-border/50">
                <CardHeader>
                  <CardTitle className="text-success">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights?.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-success" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50">
                <CardHeader>
                  <CardTitle className="text-warning">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insights?.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-warning" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Predictions */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>Learning Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {new Date(insights?.predictions.completionDate || '').toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimated Completion</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {insights?.predictions.readinessScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">Exam Readiness</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-warning">
                      {insights?.predictions.riskAreas.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Risk Areas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdvancedAnalytics;