import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Star,
  Target,
  Award,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

interface GamificationDashboardProps {
  isMobile?: boolean;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ isMobile = false }) => {
  // Mock gamification data
  const stats = {
    level: 12,
    experience: 2450,
    experienceToNext: 550,
    totalExperience: 3000,
    streak: 7,
    achievements: 15,
    rank: 'Captain'
  };

  const recentAchievements = [
    { id: 1, title: 'Quick Learner', description: 'Complete 5 lessons in one day', earned: true, date: '2023-05-15' },
    { id: 2, title: 'Perfect Score', description: 'Score 100% on Systems Quiz', earned: true, date: '2023-05-12' },
    { id: 3, title: 'Streak Master', description: 'Maintain a 7-day study streak', earned: false, date: '' },
  ];

  const skillProgress = [
    { name: 'Aircraft Systems', level: 8, progress: 75, nextMilestone: 'Expert' },
    { name: 'Navigation', level: 6, progress: 60, nextMilestone: 'Advanced' },
    { name: 'Meteorology', level: 7, progress: 70, nextMilestone: 'Expert' },
    { name: 'Regulations', level: 5, progress: 50, nextMilestone: 'Intermediate' },
  ];

  return (
    <div className="space-y-6">
      {/* Level and Stats */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-4 gap-4'}`}>
        <Card>
          <CardContent className={`p-${isMobile ? '3' : '4'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>Level</p>
                <p className={`text-${isMobile ? 'lg' : 'xl'} font-bold`}>{stats.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`p-${isMobile ? '3' : '4'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>Rank</p>
                <p className={`text-${isMobile ? 'lg' : 'xl'} font-bold`}>{stats.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`p-${isMobile ? '3' : '4'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>Streak</p>
                <p className={`text-${isMobile ? 'lg' : 'xl'} font-bold`}>{stats.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`p-${isMobile ? '3' : '4'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>Achievements</p>
                <p className={`text-${isMobile ? 'lg' : 'xl'} font-bold`}>{stats.achievements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experience Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Experience Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`flex justify-between text-${isMobile ? 'xs' : 'sm'}`}>
              <span>Level {stats.level}</span>
              <span>Level {stats.level + 1}</span>
            </div>
            <Progress 
              value={(stats.experience / stats.totalExperience) * 100} 
              className="h-3" 
            />
            <div className={`flex justify-between text-${isMobile ? 'xs' : 'sm'}`}>
              <span>{stats.experience} XP</span>
              <span>{stats.experienceToNext} XP to next level</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Skill Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillProgress.map((skill) => (
              <div key={skill.name}>
                <div className={`flex justify-between mb-1 text-${isMobile ? 'xs' : 'sm'}`}>
                  <span className="font-medium">{skill.name}</span>
                  <span className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>
                    Level {skill.level} • {skill.nextMilestone}
                  </span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-center gap-3 p-${isMobile ? '2' : '3'} rounded-lg ${
                  achievement.earned 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/50 border border-dashed'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Trophy className={`w-5 h-5 ${
                    achievement.earned ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-${isMobile ? 'xs' : 'sm'}`}>{achievement.title}</h3>
                  <p className={`text-${isMobile ? 'xs' : 'xs'} text-muted-foreground`}>{achievement.description}</p>
                </div>
                {achievement.earned ? (
                  <Badge variant="default" className={isMobile ? 'text-xs' : ''}>Earned</Badge>
                ) : (
                  <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>Locked</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationDashboard;