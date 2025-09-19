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
  Star,
  Filter,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useExams } from "@/hooks/useExam";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserAvatar } from "@/components/UserAvatar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Exams = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasAccessTo, getCurrentSubscription, isAdmin, getSubscriptionDisplayName } = useSubscription();
  const { exams, isLoadingExams, userExamSessions } = useExams();
  const { profile } = useUserProfile();
  
  // Check access permissions
  const canAccessA320 = hasAccessTo('A320_FAMILY');
  const canAccessBoeing = hasAccessTo('BOEING_737');
  const userSubscription = getCurrentSubscription();
  const adminUser = isAdmin();
  
  // State for category selection - Set default aircraft based on subscription
  const getDefaultAircraft = () => {
    if (adminUser || (canAccessA320 && canAccessBoeing)) {
      return "A320_FAMILY"; // Default to A320 if access to both
    } else if (canAccessA320) {
      return "A320_FAMILY";
    } else if (canAccessBoeing) {
      return "BOEING_737";
    }
    return "A320_FAMILY"; // Fallback
  };
  
  const [showPracticeDialog, setShowPracticeDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedAircraft, setSelectedAircraft] = useState<string>(getDefaultAircraft());
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<string>("20");
  const [selectedReviewQuestionCount, setSelectedReviewQuestionCount] = useState<string>("20");

  // Available aircraft types - Filter based on subscription
  const getAvailableAircraftTypes = () => {
    const allTypes = [
      { value: "A320_FAMILY", label: "Airbus A320 Family", description: "A318, A319, A320, A321" },
      { value: "BOEING_737", label: "Boeing 737", description: "B737-700, B737-800, B737 MAX" },
      { value: "ALL", label: "All Aircraft Types", description: "Mixed questions from all aircraft" }
    ];
    
    if (adminUser) {
      return allTypes; // Admins see everything
    }
    
    const availableTypes = [];
    if (canAccessA320) {
      availableTypes.push(allTypes[0]); // A320
    }
    if (canAccessBoeing) {
      availableTypes.push(allTypes[1]); // Boeing 737
    }
    
    // Add "All" option only if user has access to multiple aircraft types
    if (availableTypes.length > 1) {
      availableTypes.push(allTypes[2]);
    }
    
    return availableTypes;
  };
  
  const aircraftTypes = getAvailableAircraftTypes();

  // Available categories - Official Airbus A320 Categories
  const categories = [
    { value: "aircraft-general", label: "Aircraft General", description: "General aircraft knowledge and limitations" },
    { value: "load-acceleration-limits", label: "Load Acceleration Limits", description: "Aircraft structural and acceleration limitations" },
    { value: "environment-limits", label: "Environment Limits", description: "Environmental operational limitations" },
    { value: "weight-limits", label: "Weight Limits", description: "Maximum weights and balance limitations" },
    { value: "speed-limits", label: "Speed Limits", description: "Aircraft speed limitations and restrictions" },
    { value: "air-bleed-cond-press-vent", label: "Air Bleed/Cond/Press/Vent", description: "Air conditioning, pressurization, and ventilation" },
    { value: "autoflight", label: "Autoflight", description: "Autopilot and flight management systems" },
    { value: "apu", label: "APU", description: "Auxiliary Power Unit operations and limitations" },
    { value: "engines", label: "Engines", description: "Engine operations, limitations, and procedures" },
    { value: "flight-controls", label: "Flight Controls", description: "Primary and secondary flight control systems" },
    { value: "fuel", label: "Fuel", description: "Fuel systems, distribution, and monitoring" },
    { value: "ice-rain-protection", label: "Ice and Rain Protection", description: "Anti-ice and rain protection systems" },
    { value: "landing-gear", label: "Landing Gear", description: "Landing gear operation, brakes, and steering" },
    { value: "oxygen", label: "Oxygen", description: "Oxygen systems and emergency procedures" },
    { value: "gpws", label: "GPWS", description: "Ground Proximity Warning System" },
    { value: "navigation", label: "Navigation", description: "Navigation systems and procedures" }
  ];

  const difficulties = [
    { value: "beginner", label: "Básico", description: "Conceptos fundamentales" },
    { value: "intermediate", label: "Intermedio", description: "Procedimientos estándar" },
    { value: "advanced", label: "Avanzado", description: "Situaciones complejas" }
  ];

  const questionCounts = [
    { value: "10", label: "10 preguntas", description: "Sesión corta - 15 minutos" },
    { value: "20", label: "20 preguntas", description: "Sesión estándar - 30 minutos" },
    { value: "30", label: "30 preguntas", description: "Sesión extendida - 45 minutos" },
    { value: "50", label: "50 preguntas", description: "Sesión intensiva - 75 minutos" },
    { value: "75", label: "75 preguntas", description: "Simulación de examen completo" }
  ];

  const handleStartPractice = () => {
    const params = new URLSearchParams();
    params.set('mode', 'practice');
    if (selectedAircraft && selectedAircraft !== 'ALL') params.set('aircraft', selectedAircraft);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedDifficulty && selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    params.set('questionCount', selectedQuestionCount);
    navigate(`/exam?${params.toString()}`);
  };

  const handleStartReview = () => {
    const params = new URLSearchParams();
    params.set('mode', 'review');
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedDifficulty && selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    params.set('questionCount', selectedReviewQuestionCount);
    navigate(`/exam?${params.toString()}`);
  };

  const handleStartTimedExam = () => {
    const params = new URLSearchParams();
    params.set('mode', 'timed');
    params.set('timeLimit', '60');
    params.set('questionCount', '75');
    navigate(`/exam?${params.toString()}`);
  };

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
            <Dialog open={showPracticeDialog} onOpenChange={setShowPracticeDialog}>
              <DialogTrigger asChild>
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
                      Practice with real exam questions without time limit.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Real questions available:</span>
                        <span className="font-medium">3,000+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Official exam simulation</span>
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                    </div>
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Comenzar Práctica
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurar Práctica</DialogTitle>
                  <DialogDescription>
                    Selecciona la categoría y dificultad para personalizar tu sesión de práctica.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aircraft Type</label>
                    <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft type" />
                      </SelectTrigger>
                      <SelectContent>
                        {aircraftTypes.map((aircraft) => (
                          <SelectItem key={aircraft.value} value={aircraft.value}>
                            <div>
                              <div className="font-medium">{aircraft.label}</div>
                              <div className="text-xs text-muted-foreground">{aircraft.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div>
                              <div className="font-medium">{category.label}</div>
                              <div className="text-xs text-muted-foreground">{category.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dificultad</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las dificultades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las dificultades</SelectItem>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            <div>
                              <div className="font-medium">{difficulty.label}</div>
                              <div className="text-xs text-muted-foreground">{difficulty.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número de Preguntas</label>
                    <Select value={selectedQuestionCount} onValueChange={setSelectedQuestionCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cantidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionCounts.map((count) => (
                          <SelectItem key={count.value} value={count.value}>
                            <div>
                              <div className="font-medium">{count.label}</div>
                              <div className="text-xs text-muted-foreground">{count.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowPracticeDialog(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handleStartPractice} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Comenzar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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
                  Simulates real official exam conditions.
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
                  onClick={handleStartTimedExam}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Iniciar Examen
                </Button>
              </CardContent>
            </Card>

            {/* Review Mode */}
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
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
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Explicaciones detalladas</span>
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        <span>Responde preguntas incorrectamente en el modo práctica para comenzar a repasar.</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Repasar
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurar Repaso</DialogTitle>
                  <DialogDescription>
                    Selecciona la categoría para repasar preguntas específicas que necesitas mejorar.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría a Repasar</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div>
                              <div className="font-medium">{category.label}</div>
                              <div className="text-xs text-muted-foreground">{category.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Número de Preguntas a Repasar</label>
                    <Select value={selectedReviewQuestionCount} onValueChange={setSelectedReviewQuestionCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cantidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionCounts.map((count) => (
                          <SelectItem key={count.value} value={count.value}>
                            <div>
                              <div className="font-medium">{count.label}</div>
                              <div className="text-xs text-muted-foreground">{count.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-info/10 border border-info/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-info">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Modo Repaso Activado</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Solo verás preguntas que has respondido incorrectamente anteriormente.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowReviewDialog(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handleStartReview} className="flex-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Comenzar Repaso
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                <Card key={exam._id} className="surface-mid border-border/50 hover-lift cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Plane className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {exam.aircraftType?.replace('_', ' ').toUpperCase() || 'GENERAL'}
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
                        <span className="font-medium">{exam.questionsCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Duración:</span>
                        <span className="font-medium">{exam.timeLimit} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Puntuación mínima:</span>
                        <span className="font-medium">{exam.passingScore}%</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/exam?examId=${exam._id}`)}
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
                <Card key={session._id} className="surface-mid border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          session.score >= 75 ? 'bg-success/10' : session.score && session.score >= 60 ? 'bg-warning/10' : 'bg-destructive/10'
                        }`}>
                          {session.score >= 75 ? (
                            <CheckCircle2 className="w-6 h-6 text-success" />
                          ) : session.score && session.score >= 60 ? (
                            <Clock className="w-6 h-6 text-warning" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-destructive" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {"Examen"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {session.completedAt ? 
                              `Completado ${new Date(session.completedAt).toLocaleDateString('es-ES', {
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
                          session.score >= 75 ? 'text-success' : session.score && session.score >= 60 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {session.score !== null ? `${session.score}%` : "-"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session.timeSpent ? `${Math.floor(session.timeSpent / 60)} min` : ""}
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