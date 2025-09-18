import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useConvexAuth';
import { AchievementService, GameificationStats } from '@/services/achievementService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Flame, Award, TrendingUp, Medal, Crown } from 'lucide-react';

interface GamificationDashboardProps {
  isMobile?: boolean;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ isMobile = false }) => {
  const { user } = useAuth();
  const [gamificationStats, setGamificationStats] = useState<GameificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      loadGamificationStats();
    }
  }, [user?._id]);

  const loadGamificationStats = async () => {
    try {
      setLoading(true);
      const stats = await AchievementService.getGamificationStats(user?._id || 'demo');
      setGamificationStats(stats);
    } catch (error) {
      console.error('Error loading gamification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!gamificationStats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No gamification data available</p>
      </div>
    );
  }

  const { level, totalPoints, achievements, badges, streaks, rankings, milestones } = gamificationStats;

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const inProgressAchievements = achievements.filter(a => !a.unlockedAt && a.progress > 0);
  const upcomingAchievements = achievements.filter(a => !a.unlockedAt && a.progress === 0 && !a.isHidden);

  return (
    <div className="space-y-6">
      {/* Level and Points Overview */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
        <Card className="surface-mid border-border/50">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Level {level.level}</h3>
              <p className="text-sm text-muted-foreground">{level.title}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{level.currentXP} XP</span>
                  <span>{level.xpForNextLevel} XP</span>
                </div>
                <Progress 
                  value={(level.currentXP / level.xpForNextLevel) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-mid border-border/50">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
            <div className="flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{totalPoints.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <div className="flex justify-center gap-1">
                {level.perks.map((perk, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {perk}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-mid border-border/50">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
            <div className="flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{streaks.daily}</h3>
              <p className="text-sm text-muted-foreground">Day Streak</p>
              <div className="text-xs text-muted-foreground">
                Longest: {streaks.longest} days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements and Badges */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="achievements" className={`${isMobile ? 'text-xs' : ''}`}>
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="badges" className={`${isMobile ? 'text-xs' : ''}`}>
            <Medal className="w-4 h-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="progress" className={`${isMobile ? 'text-xs' : ''}`}>
            <Target className="w-4 h-4 mr-2" />
            In Progress
          </TabsTrigger>
          <TabsTrigger value="rankings" className={`${isMobile ? 'text-xs' : ''}`}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Rankings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {milestones.recentUnlocks.length > 0 ? (
                  milestones.recentUnlocks.map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        +{achievement.points}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent achievements. Keep studying to unlock more!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  All Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <div className="text-xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Medal className="w-5 h-5" />
                Badge Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-4'} gap-4`}>
                {badges.map(badge => (
                  <div key={badge.id} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    <Badge variant="outline" className={`mt-2 text-xs
                      ${badge.rarity === 'common' ? 'bg-gray-100 text-gray-800' : ''}
                      ${badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' : ''}
                      ${badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' : ''}
                      ${badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' : ''}
                      ${badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {badge.rarity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Achievements In Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressAchievements.length > 0 ? (
                inProgressAchievements.map(achievement => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline">
                        {Math.round(achievement.progress)}%
                      </Badge>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No achievements in progress</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Start learning to unlock new achievements!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {milestones.nextMilestone && (
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Next Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{milestones.nextMilestone.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{milestones.nextMilestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestones.nextMilestone.description}</p>
                    <div className="mt-2">
                      <Progress value={milestones.nextMilestone.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(milestones.nextMilestone.progress)}% complete
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    +{milestones.nextMilestone.points}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Global Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Overall Rank</span>
                  <Badge variant="secondary">#{rankings.overall}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Weekly Rank</span>
                  <Badge variant="secondary">#{rankings.weekly}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Module Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(rankings.module).map(([module, rank]) => (
                  <div key={module} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">{module}</span>
                    <Badge variant="secondary">#{rank}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="surface-mid border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievement Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{unlockedAchievements.length}</div>
                  <p className="text-sm text-muted-foreground">Unlocked</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{inProgressAchievements.length}</div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">{badges.length}</div>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">{Math.round(milestones.completionRate)}%</div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;