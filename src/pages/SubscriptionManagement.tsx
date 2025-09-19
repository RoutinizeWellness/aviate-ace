import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { 
  ArrowLeft,
  Crown,
  TrendingUp,
  Target,
  BarChart3,
  Award,
  CheckCircle2,
  Star,
  Plane,
  BookOpen,
  Clock
} from 'lucide-react';

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock category progress data
  const categoryProgress = [
    {
      name: 'Aircraft Systems',
      progress: 85,
      questionsAnswered: 42,
      totalQuestions: 50,
      correctRate: 88,
      avgScore: 85,
      timeSpent: '12h 30m'
    },
    {
      name: 'Flight Protection',
      progress: 92,
      questionsAnswered: 46,
      totalQuestions: 50,
      correctRate: 94,
      avgScore: 91,
      timeSpent: '8h 45m'
    },
    {
      name: 'Emergency Procedures',
      progress: 78,
      questionsAnswered: 39,
      totalQuestions: 50,
      correctRate: 82,
      avgScore: 79,
      timeSpent: '15h 20m'
    },
    {
      name: 'Navigation Systems',
      progress: 95,
      questionsAnswered: 48,
      totalQuestions: 50,
      correctRate: 96,
      avgScore: 93,
      timeSpent: '7h 15m'
    },
    {
      name: 'Approach Procedures',
      progress: 67,
      questionsAnswered: 34,
      totalQuestions: 50,
      correctRate: 75,
      avgScore: 72,
      timeSpent: '10h 05m'
    },
    {
      name: 'Meteorology',
      progress: 88,
      questionsAnswered: 44,
      totalQuestions: 50,
      correctRate: 90,
      avgScore: 87,
      timeSpent: '6h 30m'
    },
    {
      name: 'Regulations',
      progress: 73,
      questionsAnswered: 37,
      totalQuestions: 50,
      correctRate: 79,
      avgScore: 76,
      timeSpent: '9h 45m'
    },
    {
      name: 'Performance',
      progress: 81,
      questionsAnswered: 41,
      totalQuestions: 50,
      correctRate: 85,
      avgScore: 82,
      timeSpent: '11h 20m'
    }
  ];

  // Overall statistics
  const overallStats = {
    totalQuestionsAnswered: categoryProgress.reduce((sum, cat) => sum + cat.questionsAnswered, 0),
    totalQuestions: categoryProgress.reduce((sum, cat) => sum + cat.totalQuestions, 0),
    overallCorrectRate: Math.round(categoryProgress.reduce((sum, cat) => sum + cat.correctRate, 0) / categoryProgress.length),
    averageScore: Math.round(categoryProgress.reduce((sum, cat) => sum + cat.avgScore, 0) / categoryProgress.length),
    totalTimeSpent: '81h 30m',
    completedCategories: categoryProgress.filter(cat => cat.progress >= 90).length,
    weakestCategory: categoryProgress.reduce((min, cat) => cat.progress < min.progress ? cat : min),
    strongestCategory: categoryProgress.reduce((max, cat) => cat.progress > max.progress ? cat : max)
  };

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
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Progress & Statistics</h1>
              <p className="text-sm text-muted-foreground">Detailed analysis of your performance</p>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Current Subscription</h3>
                  <p className="text-muted-foreground">A320 Type Rating Premium Access</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Overall Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                  <p className="text-2xl font-bold">{overallStats.totalQuestionsAnswered}</p>
                  <p className="text-xs text-muted-foreground">of {overallStats.totalQuestions} total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Correct Rate</p>
                  <p className="text-2xl font-bold">{overallStats.overallCorrectRate}%</p>
                  <p className="text-xs text-green-600">Excellent performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{overallStats.averageScore}%</p>
                  <p className="text-xs text-muted-foreground">Across all categories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                  <p className="text-2xl font-bold">{overallStats.totalTimeSpent}</p>
                  <p className="text-xs text-muted-foreground">Total time invested</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Progress Analysis */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="progress">Category Progress</TabsTrigger>
            <TabsTrigger value="insights">Performance Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Progress by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoryProgress.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {category.questionsAnswered}/{category.totalQuestions} questions • {category.correctRate}% correct rate
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{category.progress}%</p>
                          <p className="text-xs text-muted-foreground">{category.timeSpent}</p>
                        </div>
                      </div>
                      <Progress value={category.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Avg Score: {category.avgScore}%</span>
                        <span>
                          {category.progress >= 90 ? '🎯 Mastered' :
                           category.progress >= 75 ? '📈 Good Progress' :
                           category.progress >= 50 ? '⚠️ Needs Work' : '🔴 Requires Focus'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    Strongest Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">{overallStats.strongestCategory.name}</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={overallStats.strongestCategory.progress} className="flex-1 h-2" />
                      <span className="font-semibold">{overallStats.strongestCategory.progress}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Correct Rate</p>
                        <p className="font-medium">{overallStats.strongestCategory.correctRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Score</p>
                        <p className="font-medium">{overallStats.strongestCategory.avgScore}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <Target className="w-5 h-5" />
                    Focus Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">{overallStats.weakestCategory.name}</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={overallStats.weakestCategory.progress} className="flex-1 h-2" />
                      <span className="font-semibold">{overallStats.weakestCategory.progress}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Correct Rate</p>
                        <p className="font-medium">{overallStats.weakestCategory.correctRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Score</p>
                        <p className="font-medium">{overallStats.weakestCategory.avgScore}%</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => navigate(`/exam?category=${encodeURIComponent(overallStats.weakestCategory.name.toLowerCase().replace(/\s+/g, '-'))}`)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Practice This Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements & Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold">{overallStats.completedCategories} Categories</h4>
                    <p className="text-sm text-muted-foreground">Mastered (≥90%)</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/5 rounded-lg">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-green-500" />
                    </div>
                    <h4 className="font-semibold">{overallStats.totalQuestionsAnswered}</h4>
                    <p className="text-sm text-muted-foreground">Questions Completed</p>
                  </div>
                  <div className="text-center p-4 bg-orange-500/5 rounded-lg">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <h4 className="font-semibold">{overallStats.totalTimeSpent}</h4>
                    <p className="text-sm text-muted-foreground">Study Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubscriptionManagement;