import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Plane,
  Clock,
  ArrowLeft,
  Play,
  CheckCircle2,
  AlertCircle,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useExams } from "@/hooks/useExam";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserAvatar } from "@/components/UserAvatar";

const Exams = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { exams, isLoadingExams, userExamSessions } = useExams();
  const { profile } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

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
              <p className="text-xs text-muted-foreground">Exámenes</p>
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
              <p className="text-xs text-muted-foreground">
                {profile?.experience_level ? 
                  profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1) + " Pilot" :
                  "Piloto en formación"
                }
              </p>
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
          <h1 className="text-4xl font-bold mb-2">Exámenes</h1>
          <p className="text-muted-foreground">Practica y toma exámenes para tu certificación de piloto.</p>
        </header>

        {/* Exam Categories */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Categorías de Examen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Practice Mode */}
            <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary">Recomendado</Badge>
                </div>
                <CardTitle className="text-lg">Modo Práctica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Practica con preguntas aleatorias sin límite de tiempo.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Preguntas disponibles:</span>
                    <span className="font-medium">3,000+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sin límite de tiempo</span>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/exam')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Comenzar Práctica
                </Button>
              </CardContent>
            </Card>

            {/* Timed Exam */}
            <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <Badge variant="outline">Desafío</Badge>
                </div>
                <CardTitle className="text-lg">Examen Cronometrado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Simula las condiciones reales del examen oficial.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Duración:</span>
                    <span className="font-medium">60 minutos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Preguntas:</span>
                    <span className="font-medium">75</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/exam')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Iniciar Examen
                </Button>
              </CardContent>
            </Card>

            {/* Review Mode */}
            <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-info" />
                  </div>
                  <Badge variant="outline">Repaso</Badge>
                </div>
                <CardTitle className="text-lg">Modo Repaso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Repasa preguntas que has respondido incorrectamente.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Preguntas pendientes:</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Explicaciones detalladas</span>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/exam')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Repasar
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Available Exams */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Exámenes Disponibles</h2>
          {isLoadingExams ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Cargando exámenes...</div>
            </div>
          ) : exams && exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <Card key={exam.id} className="surface-mid border-border/50 hover-lift cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Plane className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {exam.aircraft_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exam.description || "Examen de preparación para certificación"}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Preguntas:</span>
                        <span className="font-medium">{exam.total_questions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Duración:</span>
                        <span className="font-medium">{exam.duration_minutes} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Puntuación mínima:</span>
                        <span className="font-medium">{exam.passing_score}%</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/exam?examId=${exam.id}`)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Examen
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="surface-mid border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">No hay exámenes disponibles</h3>
                <p className="text-sm text-muted-foreground">Los exámenes estarán disponibles próximamente.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Recent Exam Sessions */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Historial de Exámenes</h2>
          {userExamSessions && userExamSessions.length > 0 ? (
            <div className="space-y-4">
              {userExamSessions.slice(0, 5).map((session) => (
                <Card key={session.id} className="surface-mid border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          session.passed ? 'bg-success/10' : session.score && session.score >= 60 ? 'bg-warning/10' : 'bg-destructive/10'
                        }`}>
                          {session.passed ? (
                            <CheckCircle2 className="w-6 h-6 text-success" />
                          ) : session.score && session.score >= 60 ? (
                            <Clock className="w-6 h-6 text-warning" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-destructive" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {session.exams?.title || "Examen"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {session.completed_at ? 
                              `Completado ${new Date(session.completed_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}` :
                              "En progreso"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          session.passed ? 'text-success' : session.score && session.score >= 60 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {session.score !== null ? `${session.score}%` : "-"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session.time_taken_minutes ? `${session.time_taken_minutes} min` : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="surface-mid border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Sin historial de exámenes</h3>
                <p className="text-sm text-muted-foreground mb-4">Realiza tu primer examen para comenzar tu historial.</p>
                <Button onClick={() => navigate('/exam')}>Comenzar Práctica</Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Exams;