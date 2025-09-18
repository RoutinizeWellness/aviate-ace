import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Trophy,
  TrendingUp,
  FileText,
  Zap,
  Calendar,
  CheckCircle2
} from "lucide-react";

const Dashboard = () => {
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
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 mb-8 p-3 surface-mid rounded-lg">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-sm">Alex Rodríguez</h2>
              <p className="text-xs text-muted-foreground">Piloto en formación</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Button variant="default" className="w-full justify-start gap-3 h-12">
              <BookOpen className="w-5 h-5" />
              <span>Inicio</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <Target className="w-5 h-5" />
              <span>Exámenes</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <BarChart3 className="w-5 h-5" />
              <span>Progreso</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
              <Settings className="w-5 h-5" />
              <span>Configuración</span>
            </Button>
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button variant="outline" className="w-full justify-start gap-3 h-12">
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
          <h1 className="text-4xl font-bold mb-2">Panel de Control</h1>
          <p className="text-muted-foreground">Bienvenido de vuelta, Alex. Continúa tu preparación para la certificación.</p>
        </header>

        {/* Progress Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Progreso General</h2>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Progreso Total</h3>
                  <p className="text-sm text-muted-foreground">A320 & B737 Combined</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">75%</div>
                  <p className="text-sm text-muted-foreground">Completado</p>
                </div>
              </div>
              <Progress value={75} className="h-3 mb-4" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>¡Excelente progreso! Estás en camino al éxito.</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Aircraft Selection */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Mis Cursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* A320 Course */}
            <Card className="surface-mid border-border/50 hover-lift group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Airbus A320</h3>
                      <p className="text-sm text-muted-foreground">Preparación Completa</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Activo</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progreso:</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>2,150 preguntas completadas</span>
                    <span>850 restantes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* B737 Course */}
            <Card className="surface-mid border-border/50 hover-lift group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Boeing B737</h3>
                      <p className="text-sm text-muted-foreground">Preparación Completa</p>
                    </div>
                  </div>
                  <Badge variant="outline">Próximamente</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progreso:</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>750 preguntas completadas</span>
                    <span>2,250 restantes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upcoming Sessions */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Próximas Sesiones</h2>
            <div className="space-y-4">
              <Card className="surface-mid border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Simulacro A320 - Sistemas</h3>
                      <p className="text-sm text-muted-foreground">Programado para mañana, 10:00 AM</p>
                    </div>
                    <Button size="sm" variant="outline">Ver</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-info" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Examen Final B737</h3>
                      <p className="text-sm text-muted-foreground">Disponible en 3 días</p>
                    </div>
                    <Button size="sm" variant="outline">Preparar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Access Modules */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Acceso Rápido</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">Modo Práctica</h3>
                  <p className="text-xs text-muted-foreground">Preguntas aleatorias</p>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">Examen Rápido</h3>
                  <p className="text-xs text-muted-foreground">30 min cronometrado</p>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">Logros</h3>
                  <p className="text-xs text-muted-foreground">Ver progreso</p>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-info" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">Estadísticas</h3>
                  <p className="text-xs text-muted-foreground">Análisis detallado</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Actividad Reciente</h2>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 py-3 border-b border-border/50">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completaste el módulo "Sistemas Hidráulicos A320"</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">95%</Badge>
                </div>

                <div className="flex items-center gap-4 py-3 border-b border-border/50">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo récord personal en simulacro cronometrado</p>
                    <p className="text-xs text-muted-foreground">Ayer</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">18:32</Badge>
                </div>

                <div className="flex items-center gap-4 py-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Iniciaste el curso Boeing B737</p>
                    <p className="text-xs text-muted-foreground">Hace 3 días</p>
                  </div>
                  <Badge variant="outline">Nuevo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;