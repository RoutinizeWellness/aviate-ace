import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  Filter,
  AlertCircle
} from 'lucide-react';

const AdvancedAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch real analytics data from localhost:8081/analytics
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8081/analytics?userId=${user._id}&timeRange=${timeRange}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAnalyticsData(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setError('Failed to load analytics data');
        // Fallback to mock data if API is not available
        setAnalyticsData(getMockData());
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [user, timeRange]);
  
  // Fallback mock data function
  const getMockData = () => ({
    performanceData: {
      overallScore: 87,
      rank: 'Top 15%',
      studyStreak: 12,
      hoursStudied: 24.5,
      modulesCompleted: 18,
      totalModules: 24
    },
    categoryPerformance: [
      { name: 'Aircraft Systems', score: 92, progress: 92, color: 'bg-blue-500' },
      { name: 'Flight Operations', score: 85, progress: 85, color: 'bg-green-500' },
      { name: 'Navigation', score: 78, progress: 78, color: 'bg-yellow-500' },
      { name: 'Meteorology', score: 95, progress: 95, color: 'bg-purple-500' },
      { name: 'Regulations', score: 80, progress: 80, color: 'bg-red-500' }
    ],
    weeklyProgress: [
      { day: 'Mon', score: 85 },
      { day: 'Tue', score: 88 },
      { day: 'Wed', score: 90 },
      { day: 'Thu', score: 82 },
      { day: 'Fri', score: 92 },
      { day: 'Sat', score: 89 },
      { day: 'Sun', score: 91 }
    ],
    achievements: [
      { id: 1, title: 'Quick Learner', description: 'Complete 5 modules in one day', earned: true },
      { id: 2, title: 'Perfect Score', description: 'Score 100% on a quiz', earned: true },
      { id: 3, title: 'Streak Master', description: 'Maintain a 7-day study streak', earned: false },
      { id: 4, title: 'Subject Expert', description: 'Score 95%+ in all Systems modules', earned: true }
    ]
  });
  
  const data = analyticsData || getMockData();
  const { performanceData, categoryPerformance, weeklyProgress, achievements } = data;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('dashboard.backToDashboard') || 'Back to Dashboard'}
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('dashboard.advancedAnalytics') || 'Advanced Analytics'}</h1>
              <p className="text-sm text-muted-foreground">{t('dashboard.advancedAnalyticsDesc') || 'Detailed insights into your learning progress'}</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">{t('common.loading') || 'Loading...'}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t('analytics.timeRange') || 'Time Range:'}:</span>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.overallScore}%</div>
              <p className="text-xs text-muted-foreground">{performanceData.rank}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.studyStreak} days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Studied</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceData.hoursStudied}h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performanceData.modulesCompleted}/{performanceData.totalModules}
              </div>
              <p className="text-xs text-muted-foreground">Modules completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Category */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('analytics.performanceByCategory') || 'Performance by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryPerformance.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm font-medium">{category.score}%</span>
                  </div>
                  <Progress value={category.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('analytics.weeklyProgress') || 'Weekly Progress'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-40 gap-2">
                {weeklyProgress.map((day) => (
                  <div key={day.day} className="flex flex-col items-center flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                    <div 
                      className="w-full bg-primary rounded-t transition-all duration-300"
                      style={{ height: `${day.score}%` }}
                    />
                    <div className="text-xs mt-1">{day.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t('analytics.achievements') || 'Achievements'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.earned 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-muted/50 border border-dashed'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Award className={`w-5 h-5 ${
                        achievement.earned ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant={achievement.earned ? 'default' : 'secondary'}>
                      {achievement.earned ? (t('analytics.earned') || 'Earned') : (t('analytics.locked') || 'Locked')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;