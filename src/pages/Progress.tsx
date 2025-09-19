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
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserStats } from "@/hooks/useStats";
import { useCourses } from "@/hooks/useCourses";
import { useState } from "react";

const Progress = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, userStats } = useUserProfile();
  const { userCourses } = useCourses();
  const { examStats, recentProgress, userAchievements } = useUserStats();
  const [weeklyGoal, setWeeklyGoal] = useState(20); // Default 20 questions per week
  const [showGoalSettings, setShowGoalSettings] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  // Calculate progress metrics
  const totalCourses = userCourses?.length || 0;
  const totalPoints = userStats?.total_points || 0;
  const currentLevel = userStats?.current_level || 1;
  const totalExamsTaken = userStats?.total_exams_taken || 0;
  const totalLessonsCompleted = userStats?.total_lessons_completed || 0;
  const overallProgress = totalCourses > 0 ? Math.min(100, (totalLessonsCompleted / (totalCourses * 10)) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 surface-dark border-r border-border z-40">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">PilotPrepFlightX</h1>
              <p className="text-xs text-muted-foreground">Progreso</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 mb-8 p-3 surface-mid rounded-lg">
            <UserAvatar 
              avatarUrl={profile?.avatar_url} 
              displayName={displayName}
              size="md"
            />
            <div>
              <h2 className="font-medium text-sm">{displayName}</h2>
              <p className="text-xs text-muted-foreground">Nivel {currentLevel} • {totalPoints} puntos</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate('/dashboard')}
            >
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
            <Button variant="default" className="w-full justify-start gap-3 h-12">
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
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
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
      </aside>

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
              Volver al Dashboard
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Progreso de Aprendizaje</h1>
          <p className="text-muted-foreground">Analiza tu rendimiento y progreso en la preparación.</p>
        </header>

        {/* Overall Progress */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Progreso General</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="surface-mid border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary">Total</Badge>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{Math.round(overallProgress)}%</div>
                <p className="text-sm text-muted-foreground mb-4">Progreso Completado</p>
                <ProgressBar value={overallProgress} className="h-2" />
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <Badge className="bg-success/10 text-success">Preguntas</Badge>
                </div>
                <div className="text-3xl font-bold text-success mb-2">{totalLessonsCompleted}</div>
                <p className="text-sm text-muted-foreground mb-4">Lecciones Completadas</p>
                <div className="text-xs text-muted-foreground">De {totalCourses * 10} totales</div>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <Badge className="bg-warning/10 text-warning">Tiempo</Badge>
                </div>
                <div className="text-3xl font-bold text-warning mb-2">{totalExamsTaken}</div>
                <p className="text-sm text-muted-foreground mb-4">Exámenes Realizados</p>
                <div className="text-xs text-muted-foreground">Este mes</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Course Progress */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Progreso por Curso</h2>
          <div className="space-y-6">
            {userCourses && userCourses.length > 0 ? (
              userCourses.map((userCourse) => {
                const course = userCourse.course;
                if (!course) return null;
                
                // Calculate course progress (mock calculation)
                const courseProgress = Math.floor(Math.random() * 100);
                const correctAnswers = Math.floor(courseProgress * 30);
                const incorrectAnswers = Math.floor((100 - courseProgress) * 5);
                const pendingQuestions = Math.max(0, 3000 - correctAnswers - incorrectAnswers);
                const accuracy = correctAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0;
                
                return (
                  <Card key={course._id} className="surface-mid border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Plane className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{course.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {course.aircraftType.replace('_', ' ').toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Badge className={userCourse.completed_at ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}>
                          {userCourse.completed_at ? "Completado" : `${courseProgress}% Completado`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Progreso general:</span>
                          <span className="font-medium">{courseProgress}%</span>
                        </div>
                        <ProgressBar value={courseProgress} className="h-3" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
                            <p className="text-xs text-muted-foreground">Preguntas correctas</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-warning">{incorrectAnswers}</div>
                            <p className="text-xs text-muted-foreground">Preguntas incorrectas</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-info">{pendingQuestions}</div>
                            <p className="text-xs text-muted-foreground">Pendientes</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-success">{accuracy}%</div>
                            <p className="text-xs text-muted-foreground">Precisión</p>
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
                  <h3 className="font-medium mb-2">No hay cursos inscritos</h3>
                  <p className="text-sm text-muted-foreground mb-4">Inscríbete en un curso para ver tu progreso aquí.</p>
                  <Button onClick={() => navigate('/exams')}>Ver Cursos</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Logros Recientes</h2>
          {userAchievements && userAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAchievements.slice(0, 3).map((userAchievement) => {
                const achievement = {
                  id: userAchievement.achievement_id,
                  title: 'Logro Desbloqueado',
                  description: 'Has alcanzado un nuevo hito'
                };
                if (!achievement) return null;
                
                return (
                  <Card key={userAchievement.achievement_id} className="surface-mid border-border/50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <Badge className="mt-2">+100 puntos</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="surface-mid border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Primer Examen</h3>
                  <p className="text-sm text-muted-foreground">Completa tu primer examen para desbloquear este logro</p>
                  <Badge variant="outline" className="mt-2">Pendiente</Badge>
                </CardContent>
              </Card>
              
              <Card className="surface-mid border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Racha de Estudio</h3>
                  <p className="text-sm text-muted-foreground">Estudia 7 días consecutivos</p>
                  <Badge variant="outline" className="mt-2">Pendiente</Badge>
                </CardContent>
              </Card>
              
              <Card className="surface-mid border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Velocidad Lightning</h3>
                  <p className="text-sm text-muted-foreground">Completa 100 preguntas en menos de 30 minutos</p>
                  <Badge variant="outline" className="mt-2">Pendiente</Badge>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Weekly Calendar */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Actividad Semanal</h2>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
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