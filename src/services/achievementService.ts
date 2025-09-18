// Achievements and Gamification System
// Comprehensive system for badges, milestones, rewards, and user engagement

import { AnalyticsService } from './analyticsService';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'performance' | 'consistency' | 'mastery' | 'special';
  type: 'milestone' | 'progression' | 'challenge' | 'rare';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: string;
  points: number;
  requirements: {
    type: 'lesson_completion' | 'quiz_score' | 'study_time' | 'streak' | 'speed' | 'perfect_score' | 'module_completion';
    target: number;
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all_time';
    conditions?: Record<string, any>;
  };
  rewards: {
    points: number;
    badges?: string[];
    unlocks?: string[];
    title?: string;
  };
  isHidden: boolean; // Secret achievements
  unlockedAt?: string;
  progress: number; // 0-100 percentage
}

export interface UserLevel {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  totalXP: number;
  title: string;
  perks: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}

export interface GameificationStats {
  level: UserLevel;
  totalPoints: number;
  achievements: Achievement[];
  badges: Badge[];
  streaks: {
    daily: number;
    weekly: number;
    monthly: number;
    longest: number;
  };
  rankings: {
    overall: number;
    module: Record<string, number>;
    weekly: number;
  };
  milestones: {
    nextMilestone: Achievement | null;
    recentUnlocks: Achievement[];
    completionRate: number;
  };
}

export class AchievementService {
  private static achievements: Achievement[] = [
    // Learning Milestones
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first lesson',
      category: 'learning',
      type: 'milestone',
      difficulty: 'bronze',
      icon: '🎯',
      points: 50,
      requirements: {
        type: 'lesson_completion',
        target: 1
      },
      rewards: {
        points: 50,
        badges: ['beginner'],
        title: 'Student Pilot'
      },
      isHidden: false,
      progress: 0
    },
    {
      id: 'theory_master',
      title: 'Theory Master',
      description: 'Complete theory sections for 5 lessons',
      category: 'learning',
      type: 'progression',
      difficulty: 'silver',
      icon: '📚',
      points: 150,
      requirements: {
        type: 'lesson_completion',
        target: 5,
        conditions: { section: 'theory' }
      },
      rewards: {
        points: 150,
        badges: ['scholar'],
        unlocks: ['advanced_analytics']
      },
      isHidden: false,
      progress: 0
    },
    {
      id: 'fundamentals_complete',
      title: 'Solid Foundation',
      description: 'Complete the Fundamentos module',
      category: 'mastery',
      type: 'milestone',
      difficulty: 'gold',
      icon: '🏗️',
      points: 300,
      requirements: {
        type: 'module_completion',
        target: 1,
        conditions: { module: 'Fundamentos' }
      },
      rewards: {
        points: 300,
        badges: ['foundation_master'],
        unlocks: ['sistemas_module'],
        title: 'Foundation Expert'
      },
      isHidden: false,
      progress: 0
    },

    // Performance Achievements
    {
      id: 'perfect_score',
      title: 'Perfectionist',
      description: 'Score 100% on a quiz',
      category: 'performance',
      type: 'challenge',
      difficulty: 'gold',
      icon: '💯',
      points: 200,
      requirements: {
        type: 'quiz_score',
        target: 100
      },
      rewards: {
        points: 200,
        badges: ['perfectionist']
      },
      isHidden: false,
      progress: 0
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete a quiz in under 10 minutes with 90%+ score',
      category: 'performance',
      type: 'challenge',
      difficulty: 'platinum',
      icon: '⚡',
      points: 400,
      requirements: {
        type: 'speed',
        target: 600, // 10 minutes in seconds
        conditions: { minScore: 90 }
      },
      rewards: {
        points: 400,
        badges: ['speed_master'],
        title: 'Lightning Learner'
      },
      isHidden: false,
      progress: 0
    },
    {
      id: 'high_achiever',
      title: 'High Achiever',
      description: 'Maintain 85%+ average across 10 quizzes',
      category: 'performance',
      type: 'progression',
      difficulty: 'platinum',
      icon: '🏆',
      points: 500,
      requirements: {
        type: 'quiz_score',
        target: 85,
        conditions: { consecutive: 10, type: 'average' }
      },
      rewards: {
        points: 500,
        badges: ['elite_performer'],
        title: 'Elite Performer'
      },
      isHidden: false,
      progress: 0
    },

    // Consistency Achievements
    {
      id: 'weekly_warrior',
      title: 'Weekly Warrior',
      description: 'Study for 7 consecutive days',
      category: 'consistency',
      type: 'challenge',
      difficulty: 'silver',
      icon: '🔥',
      points: 200,
      requirements: {
        type: 'streak',
        target: 7,
        timeframe: 'daily'
      },
      rewards: {
        points: 200,
        badges: ['consistent_learner']
      },
      isHidden: false,
      progress: 0
    },
    {
      id: 'dedication_award',
      title: 'Dedication Award',
      description: 'Study for 30 consecutive days',
      category: 'consistency',
      type: 'challenge',
      difficulty: 'diamond',
      icon: '💎',
      points: 1000,
      requirements: {
        type: 'streak',
        target: 30,
        timeframe: 'daily'
      },
      rewards: {
        points: 1000,
        badges: ['dedicated_learner'],
        title: 'Dedicated Scholar'
      },
      isHidden: false,
      progress: 0
    },

    // Special/Hidden Achievements
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Complete 5 lessons between 10 PM and 6 AM',
      category: 'special',
      type: 'challenge',
      difficulty: 'gold',
      icon: '🦉',
      points: 250,
      requirements: {
        type: 'lesson_completion',
        target: 5,
        conditions: { timeRange: [22, 6] }
      },
      rewards: {
        points: 250,
        badges: ['night_scholar']
      },
      isHidden: true,
      progress: 0
    },
    {
      id: 'systems_expert',
      title: 'Systems Expert',
      description: 'Complete all Sistemas module lessons with 90%+ average',
      category: 'mastery',
      type: 'milestone',
      difficulty: 'diamond',
      icon: '⚙️',
      points: 1500,
      requirements: {
        type: 'module_completion',
        target: 1,
        conditions: { module: 'Sistemas', minAverage: 90 }
      },
      rewards: {
        points: 1500,
        badges: ['systems_master'],
        title: 'Systems Master'
      },
      isHidden: false,
      progress: 0
    }
  ];

  private static badges: Badge[] = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Started the learning journey',
      icon: '🌱',
      rarity: 'common'
    },
    {
      id: 'scholar',
      name: 'Scholar',
      description: 'Dedicated to theoretical learning',
      icon: '📖',
      rarity: 'uncommon'
    },
    {
      id: 'foundation_master',
      name: 'Foundation Master',
      description: 'Mastered the fundamentals',
      icon: '🏗️',
      rarity: 'rare'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieved perfect scores',
      icon: '💯',
      rarity: 'rare'
    },
    {
      id: 'speed_master',
      name: 'Speed Master',
      description: 'Lightning fast learning',
      icon: '⚡',
      rarity: 'epic'
    },
    {
      id: 'elite_performer',
      name: 'Elite Performer',
      description: 'Consistently excellent performance',
      icon: '🏆',
      rarity: 'epic'
    },
    {
      id: 'consistent_learner',
      name: 'Consistent Learner',
      description: 'Regular study habits',
      icon: '📅',
      rarity: 'uncommon'
    },
    {
      id: 'dedicated_learner',
      name: 'Dedicated Learner',
      description: 'Exceptional dedication to learning',
      icon: '💎',
      rarity: 'legendary'
    },
    {
      id: 'night_scholar',
      name: 'Night Scholar',
      description: 'Burns the midnight oil',
      icon: '🦉',
      rarity: 'rare'
    },
    {
      id: 'systems_master',
      name: 'Systems Master',
      description: 'Expert in aircraft systems',
      icon: '⚙️',
      rarity: 'legendary'
    }
  ];

  private static getStorageKey(userId: string, type: string): string {
    return `aviate_ace_gamification_${type}_${userId}`;
  }

  // Get user's current achievements
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const storageKey = this.getStorageKey(userId, 'achievements');
      const userAchievements = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Merge with master list and update progress
      return this.achievements.map(achievement => {
        const userAchievement = userAchievements.find((ua: Achievement) => ua.id === achievement.id);
        return {
          ...achievement,
          ...userAchievement,
          progress: userAchievement?.progress || 0,
          unlockedAt: userAchievement?.unlockedAt
        };
      });
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return this.achievements;
    }
  }

  // Update achievement progress and check for unlocks
  static async updateAchievementProgress(userId: string, actionType: string, data: any): Promise<Achievement[]> {
    try {
      const userAchievements = await this.getUserAchievements(userId);
      const newlyUnlocked: Achievement[] = [];

      for (const achievement of userAchievements) {
        if (achievement.unlockedAt) continue; // Already unlocked

        let shouldUpdate = false;
        let newProgress = achievement.progress;

        // Check if this action type matches the achievement requirements
        switch (achievement.requirements.type) {
          case 'lesson_completion':
            if (actionType === 'lesson_completed') {
              shouldUpdate = true;
              newProgress = Math.min(100, ((data.completedLessons || 0) / achievement.requirements.target) * 100);
            }
            break;

          case 'quiz_score':
            if (actionType === 'quiz_completed') {
              shouldUpdate = true;
              if (achievement.requirements.conditions?.type === 'average') {
                // Handle average score requirements
                newProgress = data.averageScore >= achievement.requirements.target ? 100 : 0;
              } else {
                newProgress = data.score >= achievement.requirements.target ? 100 : 0;
              }
            }
            break;

          case 'study_time':
            if (actionType === 'study_session') {
              shouldUpdate = true;
              newProgress = Math.min(100, ((data.totalStudyTime || 0) / achievement.requirements.target) * 100);
            }
            break;

          case 'streak':
            if (actionType === 'streak_updated') {
              shouldUpdate = true;
              const streakValue = data.streaks?.[achievement.requirements.timeframe || 'daily'] || 0;
              newProgress = Math.min(100, (streakValue / achievement.requirements.target) * 100);
            }
            break;

          case 'module_completion':
            if (actionType === 'module_completed') {
              shouldUpdate = true;
              newProgress = data.module === achievement.requirements.conditions?.module ? 100 : 0;
            }
            break;
        }

        if (shouldUpdate) {
          achievement.progress = newProgress;

          // Check if achievement should be unlocked
          if (newProgress >= 100 && !achievement.unlockedAt) {
            achievement.unlockedAt = new Date().toISOString();
            newlyUnlocked.push(achievement);
            
            // Award points and badges
            await this.awardAchievement(userId, achievement);
          }
        }
      }

      // Save updated achievements
      await this.saveUserAchievements(userId, userAchievements);

      return newlyUnlocked;
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      return [];
    }
  }

  // Get user's level and XP information
  static async getUserLevel(userId: string): Promise<UserLevel> {
    try {
      const storageKey = this.getStorageKey(userId, 'level');
      const levelData = JSON.parse(localStorage.getItem(storageKey) || '{"totalXP": 0}');
      
      return this.calculateLevel(levelData.totalXP);
    } catch (error) {
      console.error('Error getting user level:', error);
      return this.calculateLevel(0);
    }
  }

  // Award points to user
  static async awardPoints(userId: string, points: number, reason: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(userId, 'level');
      const levelData = JSON.parse(localStorage.getItem(storageKey) || '{"totalXP": 0}');
      
      levelData.totalXP += points;
      
      // Log the point award
      const pointsLogKey = this.getStorageKey(userId, 'points_log');
      const pointsLog = JSON.parse(localStorage.getItem(pointsLogKey) || '[]');
      pointsLog.push({
        points,
        reason,
        timestamp: new Date().toISOString(),
        totalXP: levelData.totalXP
      });
      
      // Keep only last 100 entries
      if (pointsLog.length > 100) {
        pointsLog.splice(0, pointsLog.length - 100);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(levelData));
      localStorage.setItem(pointsLogKey, JSON.stringify(pointsLog));
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  }

  // Get user's badges
  static async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      const storageKey = this.getStorageKey(userId, 'badges');
      const userBadgeIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      return this.badges.filter(badge => userBadgeIds.includes(badge.id))
        .map(badge => ({
          ...badge,
          earnedAt: new Date().toISOString() // In real implementation, store actual earned date
        }));
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  }

  // Get comprehensive gamification stats
  static async getGamificationStats(userId: string): Promise<GameificationStats> {
    try {
      const [achievements, level, badges, analytics] = await Promise.all([
        this.getUserAchievements(userId),
        this.getUserLevel(userId),
        this.getUserBadges(userId),
        AnalyticsService.getPerformanceMetrics(userId)
      ]);

      const unlockedAchievements = achievements.filter(a => a.unlockedAt);
      const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
      
      const recentUnlocks = unlockedAchievements
        .filter(a => {
          const unlockedDate = new Date(a.unlockedAt!);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return unlockedDate > weekAgo;
        })
        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
        .slice(0, 5);

      const nextMilestone = achievements
        .filter(a => !a.unlockedAt && !a.isHidden)
        .sort((a, b) => b.progress - a.progress)[0] || null;

      const completionRate = (unlockedAchievements.length / achievements.filter(a => !a.isHidden).length) * 100;

      return {
        level,
        totalPoints,
        achievements,
        badges,
        streaks: {
          daily: analytics.streaks.currentStreak,
          weekly: Math.floor(analytics.streaks.currentStreak / 7),
          monthly: Math.floor(analytics.streaks.currentStreak / 30),
          longest: analytics.streaks.longestStreak
        },
        rankings: {
          overall: 1, // Mock ranking - would be calculated from leaderboard
          module: { 'Fundamentos': 1, 'Sistemas': 5 },
          weekly: 3
        },
        milestones: {
          nextMilestone,
          recentUnlocks,
          completionRate
        }
      };
    } catch (error) {
      console.error('Error getting gamification stats:', error);
      throw error;
    }
  }

  // Check for achievements when user performs actions
  static async checkAchievements(userId: string, actionType: string, data: any): Promise<Achievement[]> {
    return await this.updateAchievementProgress(userId, actionType, data);
  }

  // Private helper methods
  private static async awardAchievement(userId: string, achievement: Achievement): Promise<void> {
    // Award points
    await this.awardPoints(userId, achievement.rewards.points, `Achievement: ${achievement.title}`);
    
    // Award badges
    if (achievement.rewards.badges) {
      const storageKey = this.getStorageKey(userId, 'badges');
      const userBadges = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      for (const badgeId of achievement.rewards.badges) {
        if (!userBadges.includes(badgeId)) {
          userBadges.push(badgeId);
        }
      }
      
      localStorage.setItem(storageKey, JSON.stringify(userBadges));
    }
  }

  private static async saveUserAchievements(userId: string, achievements: Achievement[]): Promise<void> {
    const storageKey = this.getStorageKey(userId, 'achievements');
    const userData = achievements.map(a => ({
      id: a.id,
      progress: a.progress,
      unlockedAt: a.unlockedAt
    }));
    localStorage.setItem(storageKey, JSON.stringify(userData));
  }

  private static calculateLevel(totalXP: number): UserLevel {
    // XP formula: level n requires n*100 + (n-1)*50 total XP
    let level = 1;
    let xpNeeded = 100;
    let currentLevelXP = 0;
    
    while (totalXP >= xpNeeded) {
      currentLevelXP = xpNeeded;
      level++;
      xpNeeded += level * 100 + (level - 1) * 50;
    }
    
    const currentXP = totalXP - currentLevelXP;
    const xpForNextLevel = xpNeeded - currentLevelXP;
    
    // Define titles and perks based on level
    const titles = [
      'Novice Pilot', 'Student Pilot', 'Private Pilot', 'Commercial Pilot',
      'Airline Transport Pilot', 'Senior Captain', 'Flight Instructor',
      'Chief Pilot', 'Aviation Expert', 'Aviation Master'
    ];
    
    const title = titles[Math.min(Math.floor(level / 10), titles.length - 1)];
    
    const perks = [];
    if (level >= 5) perks.push('Advanced Analytics');
    if (level >= 10) perks.push('Custom Study Plans');
    if (level >= 15) perks.push('Priority Support');
    if (level >= 20) perks.push('Exclusive Content');
    
    return {
      level,
      currentXP,
      xpForNextLevel,
      totalXP,
      title,
      perks
    };
  }
}