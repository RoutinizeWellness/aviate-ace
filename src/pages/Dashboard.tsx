import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Plane,
  Clock,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Star,
  Award,
  Gamepad2,
  Shield,
  Menu,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, isAdmin } from "@/hooks/useConvexAuth";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserAvatar } from "@/components/UserAvatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GamificationDashboard } from "@/components/GamificationDashboard";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";
import { QuestionSuggestionForm } from "@/components/QuestionSuggestionForm";
import { UserQuestionSuggestions } from "@/components/UserQuestionSuggestions";
import { isValidConvexId } from "@/utils/convexHelpers";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";



const MobileNavigation = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full bg-background">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <nav className="space-y-2">
              <Button variant="default" className="w-full justify-start gap-3 h-12">
                <BookOpen className="w-5 h-5" />
                <span>Inicio</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate('/exams')}
              >
                <Target className="w-5 h-5" />
                <span>Exámenes</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate('/type-rating')}
              >
                <Star className="w-5 h-5" />
                <span>Type Rating</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate('/progress')}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Progreso</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate('/profile')}
              >
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-5 h-5" />
                <span>Configuración</span>
              </Button>
              
              {/* Admin Panel - Only show for admins */}
              {isAdmin(user) ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive"
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="w-5 h-5" />
                  <span>Panel Admin</span>
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 h-12 text-muted-foreground"
                  onClick={() => navigate('/admin-setup')}
                >
                  <Shield className="w-5 h-5" />
                  <span>Configurar Admin</span>
                </Button>
              )}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  
  // Add debug logging
  useEffect(() => {
    if (user) {
      console.log('Dashboard user:', user);
      console.log('User ID:', user._id);
      console.log('Is valid Convex ID:', isValidConvexId(user._id));
      console.log('User email:', user.email);
      console.log('User role:', user.role);
      console.log('Is admin check:', isAdmin(user));
    }
  }, [user]);
  
  // Convex queries - will work when Convex is deployed and user ID is valid
  const userProfileQueryParams = user && isValidConvexId(user._id) ? { userId: user._id } : "skip";
  console.log('User profile query params:', userProfileQueryParams);
  
  const userProfile = useQuery(
    api.auth.getUserProfile, 
    userProfileQueryParams
  );
  const userCourses = useQuery(
    api.courses.getUserCourses, 
    user && isValidConvexId(user._id) ? { userId: user._id } : "skip"
  );
  const userStats = useQuery(
    api.auth.getUserStats, 
    user && isValidConvexId(user._id) ? { userId: user._id } : "skip"
  );
  
  // Mock data for development (remove when Convex is deployed)
  const mockExamStats = {
    passedExams: 8,
    totalExams: 12,
    passRate: 67,
    averageScore: 78
  };
  
  const mockRecentProgress = [
    {
      id: '1',
      activity_type: 'lesson_completed',
      created_at: new Date().toISOString(),
      points_earned: 50,
      lessons: { title: 'A320 Systems Overview' }
    },
    {
      id: '2', 
      activity_type: 'exam_taken',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      points_earned: 100,
      exams: { title: 'Navigation Systems' }
    },
    {
      id: '3',
      activity_type: 'course_completed',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      points_earned: 200,
      courses: { title: 'A320 Type Rating' }
    }
  ];

  const mockUserCourses = [
    {
      id: '1',
      title: 'A320 Type Rating',
      description: 'Curso completo de preparación para A320',
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      aircraftType: 'A320_FAMILY',
      subscriptionRequired: true
    },
    {
      id: '2',
      title: 'B737 Type Rating',
      description: 'Curso completo de preparación para B737',
      progress: 45,
      totalLessons: 18,
      completedLessons: 8,
      aircraftType: 'BOEING_737',
      subscriptionRequired: true
    },
    {
      id: '3',
      title: 'General Aviation Knowledge',
      description: 'Fundamentos de aviación general',
      progress: 90,
      totalLessons: 12,
      completedLessons: 11,
      aircraftType: 'GENERAL',
      subscriptionRequired: false
    }
  ];

  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Calculate overall progress
  const totalCourses = userCourses?.length || 0;
  const totalPoints = userStats?.totalPoints || 0;
  const currentLevel = userStats?.currentLevel || 1;
  const totalExamsTaken = userStats?.totalExamsTaken || 0;
  const totalLessonsCompleted = userStats?.totalLessonsCompleted || 0;
  
  // Mock overall progress calculation
  const overallProgress = totalCourses > 0 ? Math.min(100, (totalLessonsCompleted / (totalCourses * 10)) * 100) : 0;
  
  // Extract user display name from profile or fallback
  const displayName = userProfile?.profile?.displayName || 
                     userProfile?.user?.displayName ||
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  // Use mock data when Convex data is not available
  const examStats = mockExamStats;
  const recentProgress = mockRecentProgress;
  const userCoursesData = userCourses || mockUserCourses;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Unified Sidebar */}
        <UnifiedSidebar activePage="dashboard" />
        
        {/* Main Content */}
        <main className={`${isMobile ? 'p-4' : 'ml-64 p-8'} flex-1`}>
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6 bg-background/95 backdrop-blur sticky top-0 z-30 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">{t('dashboard.title')}</h1>
                  <p className="text-xs text-muted-foreground">{t('dashboard.summaryOfProgress')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <UserAvatar 
                  avatarUrl={userProfile?.profile?.avatarUrl} 
                  displayName={displayName}
                  size="sm"
                />
              </div>
            </div>
          )}
          
          {/* Desktop header */}
          <header className="hidden md:flex items-center justify-between p-6 border-b">
            <div>
              <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
              <p className="text-muted-foreground">{t('dashboard.subtitle')}, {user?.displayName || user?.email?.split('@')[0] || t('dashboard.pilot')}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <UserAvatar 
                avatarUrl={user?.avatarUrl}
                displayName={user?.displayName || user?.email?.split('@')[0]}
              />
              <div>
                <div className="font-medium">{user?.displayName || user?.email?.split('@')[0] || 'User'}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {t('nav.logout')}
              </Button>
            </div>
          </header>
          
          {/* Main content area */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-4'}`}>
                <TabsTrigger value="overview" className={`${isMobile ? 'text-xs' : ''}`}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('dashboard.overview')}
                </TabsTrigger>
                <TabsTrigger value="gamification" className={`${isMobile ? 'text-xs' : ''}`}>
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  {t('dashboard.achievements')}
                </TabsTrigger>
                <TabsTrigger value="suggestions" className={`${isMobile ? 'text-xs' : ''}`}>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {t('dashboard.suggestions')}
                </TabsTrigger>
                {!isMobile && (
                  <TabsTrigger value="analytics">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {t('dashboard.analytics')}
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="space-y-8">

        {/* Progress Overview */}
        <section className={`${isMobile ? 'mb-6' : 'mb-10'}`}>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold ${isMobile ? 'mb-4' : 'mb-6'}`}>{t('dashboard.overallProgress')}</h2>
          <Card className="surface-mid border-border/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center mb-4'}`}>
                <div>
                  <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>{t('dashboard.overallProgress')}</h3>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {totalCourses} {t('dashboard.activeCourses')} • {totalLessonsCompleted} {t('dashboard.lessonsCompleted')}
                  </p>
                </div>
                <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>
                    {Math.round(overallProgress)}%
                  </div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {t('dashboard.completed')}
                  </p>
                </div>
              </div>
              <Progress value={overallProgress} className={`h-3 ${isMobile ? 'mb-3' : 'mb-4'}`} />
              <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                <CheckCircle2 className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-success`} />
                <span>
                  {overallProgress > 75 ? t('dashboard.excellentProgress') : 
                   overallProgress > 50 ? t('dashboard.goodProgress') : 
                   t('dashboard.keepGoing')} {t('dashboard.level')} {currentLevel}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* My Courses */}
        {/* Fixed isLoadingUserCourses reference */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">{t('dashboard.myCourses')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userCoursesData === undefined ? (
              <div className="col-span-2 text-center py-8">
                <div className="text-muted-foreground">{t('dashboard.loadingCourses')}</div>
              </div>
            ) : userCoursesData && userCoursesData.length > 0 ? (
              userCoursesData.map((course) => {
                // Calculate course progress (mock calculation)
                const courseProgress = Math.floor(Math.random() * 100); // Replace with real calculation
                
                return (
                  <Card key={course.id} className="surface-mid border-border/50 hover-lift group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Plane className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.aircraftType?.replace('_', ' ')?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary">
                          {t('dashboard.active')}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>{t('dashboard.progress')}</span>
                          <span className="font-medium">{courseProgress}%</span>
                        </div>
                        <Progress value={courseProgress} className="h-2" />
                        <div className="text-sm text-muted-foreground">
                          {course.description || t('dashboard.fullPreparationCourse')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-2">
                <Card className="surface-mid border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-2">{t('dashboard.noCourses')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('dashboard.noCoursesDesc')}</p>
                    <Button onClick={() => navigate('/exams')}>{t('dashboard.viewAvailableCourses')}</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Quick Access Modules */}
          <section>
            <h2 className="text-2xl font-bold mb-6">{t('dashboard.quickAccess')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className="surface-mid border-border/50 hover-lift cursor-pointer group"
                onClick={() => navigate('/exam')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{t('dashboard.practiceMode')}</h3>
                  <p className="text-xs text-muted-foreground">{t('dashboard.randomQuestions')}</p>
                </CardContent>
              </Card>

              <Card 
                className="surface-mid border-border/50 hover-lift cursor-pointer group"
                onClick={() => navigate('/exam')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{t('dashboard.quickExam')}</h3>
                  <p className="text-xs text-muted-foreground">{t('dashboard.timedExam')}</p>
                </CardContent>
              </Card>

              <Card 
                className="surface-mid border-border/50 hover-lift cursor-pointer group"
                onClick={() => navigate('/progress')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{t('dashboard.achievements')}</h3>
                  <p className="text-xs text-muted-foreground">{t('dashboard.viewProgress')}</p>
                </CardContent>
              </Card>

              <Card 
                className="surface-mid border-border/50 hover-lift cursor-pointer group"
                onClick={() => navigate('/progress')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-info" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{t('dashboard.statistics')}</h3>
                  <p className="text-xs text-muted-foreground">{t('dashboard.detailedAnalysis')}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Performance Stats */}
          <section>
            <h2 className="text-2xl font-bold mb-6">{t('dashboard.performance')}</h2>
            <div className="space-y-4">
              <Card className="surface-mid border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t('dashboard.passedExams')}</p>
                        <p className="text-xs text-muted-foreground">
                          {examStats?.passedExams || 0} {t('common.of')} {examStats?.totalExams || 0}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">{examStats?.passRate || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t('dashboard.overallAverage')}</p>
                        <p className="text-xs text-muted-foreground">{t('dashboard.lastExams')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{examStats?.averageScore || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t('dashboard.totalTime')}</p>
                        <p className="text-xs text-muted-foreground">{t('dashboard.thisWeek')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-warning">12h 30m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6">{t('dashboard.recentActivity')}</h2>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              {recentProgress && recentProgress.length > 0 ? (
                <div className="space-y-4">
                  {recentProgress.slice(0, 3).map((activity, index) => (
                    <div key={activity.id} className={`flex items-center gap-4 py-3 ${index < recentProgress.length - 1 ? 'border-b border-border/50' : ''}`}>
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.activity_type === 'exam_taken' && activity.exams ? 
                            `${t('dashboard.completedExam')} "${activity.exams.title}"` :
                          activity.activity_type === 'lesson_completed' && activity.lessons ?
                            `${t('dashboard.completedLesson')} "${activity.lessons.title}"` :
                          activity.activity_type === 'course_completed' && activity.courses ?
                            `${t('dashboard.completedCourse')} "${activity.courses.title}"` :
                            `${t('dashboard.activity')} ${activity.activity_type.replace('_', ' ')}`
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {activity.points_earned && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          +{activity.points_earned} {t('dashboard.pts')}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">{t('dashboard.noRecentActivity')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('dashboard.noActivityDesc')}</p>
                  <Button onClick={() => navigate('/exam')}>{t('dashboard.startPractice')}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
              </TabsContent>

              <TabsContent value="gamification" className="space-y-6">
                <GamificationDashboard isMobile={isMobile} />
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <QuestionSuggestionForm />
                  <UserQuestionSuggestions />
                </div>
              </TabsContent>

              {!isMobile && (
                <TabsContent value="analytics" className="space-y-6">
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('dashboard.advancedAnalytics')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('dashboard.advancedAnalyticsDesc')}
                    </p>
                    <Button onClick={() => navigate('/analytics')}>
                      {t('dashboard.viewFullAnalytics')}
                    </Button>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;