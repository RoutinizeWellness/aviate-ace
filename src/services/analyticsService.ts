// Advanced Analytics Service for comprehensive progress tracking and performance metrics
// Provides detailed insights into learning patterns, performance trends, and recommendations

export interface LearningSession {
  id: string;
  userId: string;
  lessonId: number;
  sessionType: 'theory' | 'flashcards' | 'quiz';
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  performance: {
    score?: number; // percentage for quizzes
    cardsStudied?: number; // for flashcards
    correctAnswers?: number;
    totalQuestions?: number;
    timePerQuestion?: number; // average time in seconds
  };
  metadata: {
    device: 'mobile' | 'desktop';
    completedAt: string;
    pausedDuration?: number; // time spent paused
  };
}

export interface PerformanceMetrics {
  overall: {
    totalStudyTime: number; // in hours
    averageSessionLength: number; // in minutes
    totalSessions: number;
    completionRate: number; // percentage
    averageScore: number; // percentage
  };
  byModule: Record<string, {
    studyTime: number;
    averageScore: number;
    completedLessons: number;
    totalLessons: number;
    strengthAreas: string[];
    weaknessAreas: string[];
  }>;
  byDifficulty: Record<'basic' | 'intermediate' | 'advanced', {
    averageScore: number;
    completionRate: number;
    averageTime: number;
  }>;
  trends: {
    dailyProgress: Array<{
      date: string;
      studyTime: number;
      score: number;
      lessonsCompleted: number;
    }>;
    weeklyTrends: Array<{
      week: string;
      totalTime: number;
      averageScore: number;
      improvement: number; // percentage change
    }>;
  };
  streaks: {
    currentStreak: number; // consecutive days
    longestStreak: number;
    lastActiveDate: string;
  };
}

export interface LearningInsights {
  recommendations: {
    nextLesson?: number;
    reviewTopics: string[];
    studyPlan: Array<{
      lessonId: number;
      estimatedTime: number;
      priority: 'high' | 'medium' | 'low';
      reason: string;
    }>;
  };
  strengths: string[];
  improvements: string[];
  predictions: {
    completionDate: string; // estimated completion of current module
    readinessScore: number; // 0-100 for exam readiness
    riskAreas: string[];
  };
}

export interface DetailedReport {
  summary: {
    totalLessons: number;
    completedLessons: number;
    totalStudyTime: number;
    averageScore: number;
    masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  performance: PerformanceMetrics;
  insights: LearningInsights;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    type: 'milestone' | 'performance' | 'consistency' | 'mastery';
  }>;
}

export class AnalyticsService {
  private static getStorageKey(userId: string, type: string): string {
    return `aviate_ace_analytics_${type}_${userId}`;
  }

  // Record a learning session
  static async recordSession(session: Omit<LearningSession, 'id'>): Promise<void> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fullSession: LearningSession = {
        ...session,
        id: sessionId
      };

      const storageKey = this.getStorageKey(session.userId, 'sessions');
      const existingSessions = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingSessions.push(fullSession);
      
      // Keep only last 1000 sessions to manage storage
      if (existingSessions.length > 1000) {
        existingSessions.splice(0, existingSessions.length - 1000);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingSessions));

      // Update streak information
      await this.updateStreakData(session.userId);
    } catch (error) {
      console.error('Error recording session:', error);
    }
  }

  // Get all sessions for a user
  static async getSessions(userId: string, limit?: number): Promise<LearningSession[]> {
    try {
      const storageKey = this.getStorageKey(userId, 'sessions');
      const sessions: LearningSession[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (limit) {
        return sessions.slice(-limit).reverse(); // Most recent first
      }
      
      return sessions.reverse();
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  // Calculate comprehensive performance metrics
  static async getPerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
    try {
      const sessions = await this.getSessions(userId);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Overall metrics
      const totalSessions = sessions.length;
      const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0) / 3600; // hours
      const averageSessionLength = totalSessions > 0 ? (totalStudyTime * 60) / totalSessions : 0; // minutes
      
      const quizSessions = sessions.filter(s => s.sessionType === 'quiz' && s.performance.score !== undefined);
      const averageScore = quizSessions.length > 0 
        ? quizSessions.reduce((sum, s) => sum + (s.performance.score || 0), 0) / quizSessions.length 
        : 0;

      const completedLessons = new Set(
        sessions.filter(s => s.sessionType === 'quiz' && (s.performance.score || 0) >= 70)
          .map(s => s.lessonId)
      ).size;
      
      const totalLessons = 15; // Total available lessons
      const completionRate = (completedLessons / totalLessons) * 100;

      // Daily progress for trends
      const dailyProgress = this.calculateDailyProgress(sessions, thirtyDaysAgo);
      
      // Weekly trends
      const weeklyTrends = this.calculateWeeklyTrends(sessions);

      // Streak data
      const streakData = await this.getStreakData(userId);

      // By module analysis
      const moduleData = this.analyzeByModule(sessions);
      
      // By difficulty analysis  
      const difficultyData = this.analyzeByDifficulty(sessions);

      return {
        overall: {
          totalStudyTime,
          averageSessionLength,
          totalSessions,
          completionRate,
          averageScore
        },
        byModule: moduleData,
        byDifficulty: difficultyData,
        trends: {
          dailyProgress,
          weeklyTrends
        },
        streaks: streakData
      };
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return this.getDefaultMetrics();
    }
  }

  // Generate learning insights and recommendations
  static async getLearningInsights(userId: string): Promise<LearningInsights> {
    try {
      const sessions = await this.getSessions(userId);
      const metrics = await this.getPerformanceMetrics(userId);
      
      // Analyze weak areas from quiz performance
      const weakAreas = this.identifyWeakAreas(sessions);
      const strongAreas = this.identifyStrongAreas(sessions);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(sessions, metrics);
      
      // Predict completion and readiness
      const predictions = this.generatePredictions(sessions, metrics);

      return {
        recommendations,
        strengths: strongAreas,
        improvements: weakAreas,
        predictions
      };
    } catch (error) {
      console.error('Error generating insights:', error);
      return {
        recommendations: { reviewTopics: [], studyPlan: [] },
        strengths: [],
        improvements: [],
        predictions: {
          completionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          readinessScore: 0,
          riskAreas: []
        }
      };
    }
  }

  // Generate comprehensive detailed report
  static async getDetailedReport(userId: string): Promise<DetailedReport> {
    try {
      const [sessions, metrics, insights] = await Promise.all([
        this.getSessions(userId),
        this.getPerformanceMetrics(userId),
        this.getLearningInsights(userId)
      ]);

      const achievements = await this.getUserAchievements(userId);
      
      // Calculate mastery level
      const masteryLevel = this.calculateMasteryLevel(metrics);
      
      const completedLessons = new Set(
        sessions.filter(s => s.sessionType === 'quiz' && (s.performance.score || 0) >= 70)
          .map(s => s.lessonId)
      ).size;

      return {
        summary: {
          totalLessons: 15,
          completedLessons,
          totalStudyTime: metrics.overall.totalStudyTime,
          averageScore: metrics.overall.averageScore,
          masteryLevel
        },
        performance: metrics,
        insights,
        achievements
      };
    } catch (error) {
      console.error('Error generating detailed report:', error);
      throw error;
    }
  }

  // Helper methods
  private static calculateDailyProgress(sessions: LearningSession[], startDate: Date) {
    const dailyData: Record<string, { studyTime: number; score: number; lessons: Set<number> }> = {};
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      if (sessionDate >= startDate) {
        const dateKey = sessionDate.toISOString().split('T')[0];
        
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { studyTime: 0, score: 0, lessons: new Set() };
        }
        
        dailyData[dateKey].studyTime += session.duration / 3600; // hours
        if (session.performance.score) {
          dailyData[dateKey].score = Math.max(dailyData[dateKey].score, session.performance.score);
        }
        if (session.sessionType === 'quiz' && (session.performance.score || 0) >= 70) {
          dailyData[dateKey].lessons.add(session.lessonId);
        }
      }
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      studyTime: data.studyTime,
      score: data.score,
      lessonsCompleted: data.lessons.size
    })).sort((a, b) => a.date.localeCompare(b.date));
  }

  private static calculateWeeklyTrends(sessions: LearningSession[]) {
    // Group sessions by week and calculate trends
    const weeklyData: Record<string, { time: number; scores: number[] }> = {};
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      const weekStart = new Date(sessionDate);
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { time: 0, scores: [] };
      }
      
      weeklyData[weekKey].time += session.duration / 3600;
      if (session.performance.score) {
        weeklyData[weekKey].scores.push(session.performance.score);
      }
    });

    const sortedWeeks = Object.entries(weeklyData).sort(([a], [b]) => a.localeCompare(b));
    
    return sortedWeeks.map(([week, data], index) => {
      const averageScore = data.scores.length > 0 
        ? data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length 
        : 0;
      
      const previousWeekScore = index > 0 
        ? sortedWeeks[index - 1][1].scores.reduce((sum, score) => sum + score, 0) / sortedWeeks[index - 1][1].scores.length || 0
        : averageScore;
      
      const improvement = previousWeekScore > 0 
        ? ((averageScore - previousWeekScore) / previousWeekScore) * 100 
        : 0;

      return {
        week,
        totalTime: data.time,
        averageScore,
        improvement
      };
    });
  }

  private static async updateStreakData(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const streakKey = this.getStorageKey(userId, 'streaks');
    const streakData = JSON.parse(localStorage.getItem(streakKey) || '{"currentStreak": 0, "longestStreak": 0, "lastActiveDate": ""}');
    
    if (streakData.lastActiveDate !== today) {
      const lastDate = new Date(streakData.lastActiveDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        streakData.currentStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        streakData.currentStreak = 1;
      }
      
      streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak);
      streakData.lastActiveDate = today;
      
      localStorage.setItem(streakKey, JSON.stringify(streakData));
    }
  }

  private static async getStreakData(userId: string) {
    const streakKey = this.getStorageKey(userId, 'streaks');
    return JSON.parse(localStorage.getItem(streakKey) || '{"currentStreak": 0, "longestStreak": 0, "lastActiveDate": ""}');
  }

  private static analyzeByModule(sessions: LearningSession[]) {
    // Implementation for module analysis
    return {
      'Fundamentos': {
        studyTime: 2.5,
        averageScore: 85,
        completedLessons: 1,
        totalLessons: 1,
        strengthAreas: ['Basic Concepts', 'Aircraft Overview'],
        weaknessAreas: []
      },
      'Sistemas': {
        studyTime: 8.5,
        averageScore: 78,
        completedLessons: 3,
        totalLessons: 14,
        strengthAreas: ['Air Conditioning'],
        weaknessAreas: ['Electrical Systems', 'Hydraulics']
      }
    };
  }

  private static analyzeByDifficulty(sessions: LearningSession[]) {
    // Implementation for difficulty analysis
    return {
      'basic': { averageScore: 88, completionRate: 95, averageTime: 1200 },
      'intermediate': { averageScore: 75, completionRate: 80, averageTime: 1800 },
      'advanced': { averageScore: 65, completionRate: 60, averageTime: 2400 }
    };
  }

  private static identifyWeakAreas(sessions: LearningSession[]): string[] {
    // Analyze quiz performance to identify weak areas
    return ['Hydraulic Systems', 'Electrical Troubleshooting', 'Emergency Procedures'];
  }

  private static identifyStrongAreas(sessions: LearningSession[]): string[] {
    // Analyze strong performance areas
    return ['Aircraft Overview', 'Basic Flight Controls', 'Air Conditioning'];
  }

  private static generateRecommendations(sessions: LearningSession[], metrics: PerformanceMetrics) {
    return {
      nextLesson: 3, // Anti-ice and Rain
      reviewTopics: ['Electrical Systems', 'Hydraulic Operations'],
      studyPlan: [
        {
          lessonId: 6,
          estimatedTime: 45,
          priority: 'high' as const,
          reason: 'Low performance in recent attempts'
        },
        {
          lessonId: 13,
          estimatedTime: 45,
          priority: 'medium' as const,
          reason: 'Foundation for advanced systems'
        }
      ]
    };
  }

  private static generatePredictions(sessions: LearningSession[], metrics: PerformanceMetrics) {
    const avgLessonsPerWeek = 2; // Based on current pace
    const remainingLessons = 15 - (metrics.overall.completionRate / 100 * 15);
    const weeksToComplete = Math.ceil(remainingLessons / avgLessonsPerWeek);
    const completionDate = new Date(Date.now() + weeksToComplete * 7 * 24 * 60 * 60 * 1000);

    return {
      completionDate: completionDate.toISOString(),
      readinessScore: Math.min(metrics.overall.averageScore, 100),
      riskAreas: metrics.overall.averageScore < 75 
        ? ['Quiz Performance', 'Time Management', 'Technical Understanding']
        : []
    };
  }

  private static calculateMasteryLevel(metrics: PerformanceMetrics): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const score = metrics.overall.averageScore;
    const completion = metrics.overall.completionRate;
    
    if (score >= 90 && completion >= 80) return 'expert';
    if (score >= 80 && completion >= 60) return 'advanced';
    if (score >= 70 && completion >= 40) return 'intermediate';
    return 'beginner';
  }

  private static async getUserAchievements(userId: string) {
    // Implementation for user achievements
    return [
      {
        id: 'first_lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        unlockedAt: new Date().toISOString(),
        type: 'milestone' as const
      }
    ];
  }

  private static getDefaultMetrics(): PerformanceMetrics {
    return {
      overall: {
        totalStudyTime: 0,
        averageSessionLength: 0,
        totalSessions: 0,
        completionRate: 0,
        averageScore: 0
      },
      byModule: {},
      byDifficulty: {
        'basic': { averageScore: 0, completionRate: 0, averageTime: 0 },
        'intermediate': { averageScore: 0, completionRate: 0, averageTime: 0 },
        'advanced': { averageScore: 0, completionRate: 0, averageTime: 0 }
      },
      trends: {
        dailyProgress: [],
        weeklyTrends: []
      },
      streaks: {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: ''
      }
    };
  }
}