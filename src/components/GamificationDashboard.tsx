import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
  
  // Mock gamification data
  const stats = {
    level: 12,
    experience: 2450,
    experienceToNext: 550,
    totalExperience: 3000,
    streak: 7,
    achievements: 15,
    rank: t('achievements.currentLevel') === 'English' ? 'Captain' : 'Capitán'
  };

  const recentAchievements = [
    { 
      id: 1, 
      title: t('achievements.quickLearner') || 'Quick Learner', 
      description: t('achievements.quickLearner.desc') || 'Complete 5 lessons in one day', 
      earned: true, 
      date: '2023-05-15' 
    },
    { 
      id: 2, 
      title: t('achievements.perfectScore') || 'Perfect Score', 
      description: t('achievements.perfectScore.desc') || 'Score 100% on Systems Quiz', 
      earned: true, 
      date: '2023-05-12' 
    },
    { 
      id: 3, 
      title: t('achievements.streakMaster') || 'Streak Master', 
      description: t('achievements.streakMaster.desc') || 'Maintain a 7-day study streak', 
      earned: false, 
      date: '' 
    },
  ];

  const skillProgress = [
    { name: t('achievements.aircraftSystems') || 'Aircraft Systems', level: 8, progress: 75, nextMilestone: t('achievements.expert') || 'Expert' },
    { name: t('achievements.navigation') || 'Navigation', level: 6, progress: 60, nextMilestone: t('achievements.advanced') || 'Advanced' },
    { name: t('achievements.meteorology') || 'Meteorology', level: 7, progress: 70, nextMilestone: t('achievements.expert') || 'Expert' },
    { name: t('achievements.regulations') || 'Regulations', level: 5, progress: 50, nextMilestone: t('achievements.intermediate') || 'Intermediate' },
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
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>{t('achievements.level')}</p>
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
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>{t('achievements.rank') || 'Rank'}</p>
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
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>{t('analytics.studyStreak') || 'Streak'}</p>
                <p className={`text-${isMobile ? 'lg' : 'xl'} font-bold`}>{stats.streak} {t('analytics.days') || 'days'}</p>
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
                <p className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>{t('achievements.achievements') || 'Achievements'}</p>
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
            {t('achievements.experience') || 'Experience Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`flex justify-between text-${isMobile ? 'xs' : 'sm'}`}>
              <span>{t('achievements.level')} {stats.level}</span>
              <span>{t('achievements.level')} {stats.level + 1}</span>
            </div>
            <Progress 
              value={(stats.experience / stats.totalExperience) * 100} 
              className="h-3" 
            />
            <div className={`flex justify-between text-${isMobile ? 'xs' : 'sm'}`}>
              <span>{stats.experience} XP</span>
              <span>{stats.experienceToNext} XP {t('achievements.nextLevel') || 'to next level'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t('achievements.progress') || 'Skill Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillProgress.map((skill) => (
              <div key={skill.name}>
                <div className={`flex justify-between mb-1 text-${isMobile ? 'xs' : 'sm'}`}>
                  <span className="font-medium">{skill.name}</span>
                  <span className={`text-${isMobile ? 'xs' : 'sm'} text-muted-foreground`}>
                    {t('achievements.level')} {skill.level} • {skill.nextMilestone}
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
            {t('achievements.recentAchievements') || 'Recent Achievements'}
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
                  <Badge variant="default" className={isMobile ? 'text-xs' : ''}>{t('achievements.earned') || 'Earned'}</Badge>
                ) : (
                  <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>{t('achievements.locked') || 'Locked'}</Badge>
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