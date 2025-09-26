import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/LanguageToggle";
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
  ChevronDown,
  Plus,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useExams } from "@/hooks/useExam";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";
import { UserAvatar } from "@/components/UserAvatar";
import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { FreeTrialNotification } from "@/components/FreeTrialNotification";
import { useFreeTrial } from "@/contexts/FreeTrialContext";

const Exams = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasAccessTo, getCurrentSubscription, isAdmin, getSubscriptionDisplayName } = useSubscription();
  const { checkTrialStatus, isTrialExpired } = useFreeTrial();
  const { exams, isLoadingExams, userExamSessions } = useExams();
  const { profile } = useSupabaseProfile();
  const { t } = useLanguage();
  
  // Check access permissions
  const canAccessA320 = hasAccessTo('A320_FAMILY');
  const canAccessBoeing = hasAccessTo('B737_FAMILY');
  const userSubscription = getCurrentSubscription();
  const adminUser = isAdmin();
  
  // State for category selection
  const getDefaultAircraft = () => {
    if (adminUser || (canAccessA320 && canAccessBoeing)) {
      return "A320_FAMILY";
    } else if (canAccessA320) {
      return "A320_FAMILY";
    } else if (canAccessBoeing) {
      return "B737_FAMILY";
    }
    return "A320_FAMILY";
  };
  
  const [showPracticeDialog, setShowPracticeDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedAircraft, setSelectedAircraft] = useState<string>(getDefaultAircraft());
  const [reviewSelectedAircraft, setReviewSelectedAircraft] = useState<string>(getDefaultAircraft());
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<string>("20");
  const [selectedReviewQuestionCount, setSelectedReviewQuestionCount] = useState<string>("20");

  // Available aircraft types
  const getAvailableAircraftTypes = () => {
    const allTypes = [
      { value: "A320_FAMILY", label: t('exams.airbusA320Family'), description: t('exams.airbusA320FamilyDesc') },
      { value: "B737_FAMILY", label: t('exams.boeing737'), description: t('exams.boeing737Desc') },
      { value: "ALL", label: t('exams.allTypes'), description: t('exams.allTypesDesc') }
    ];
    
    if (adminUser) {
      return allTypes;
    }
    
    const availableTypes = [];
    if (canAccessA320) {
      availableTypes.push(allTypes[0]);
    }
    if (canAccessBoeing) {
      availableTypes.push(allTypes[1]);
    }
    
    if (availableTypes.length > 1) {
      availableTypes.push(allTypes[2]);
    }
    
    return availableTypes;
  };
  
  const aircraftTypes = getAvailableAircraftTypes();

  // Available categories
  const getAvailableCategoriesFor = (aircraft: string) => {
    const a320Categories = [
      { value: "aircraft-general", label: t('exams.aircraftGeneral'), description: t('exams.aircraftGeneralDesc') },
      { value: "electrical", label: t('exams.electrical'), description: t('exams.electricalDesc') },
      { value: "hydraulics", label: t('exams.hydraulics'), description: t('exams.hydraulicsDesc') },
      { value: "performance", label: t('exams.performance'), description: t('exams.performanceDesc') },
      { value: "air-bleed-cond-press-vent", label: t('exams.airCondPressVent'), description: t('exams.airCondPressVentDesc') },
      { value: "autoflight", label: t('exams.autoflight'), description: t('exams.autoflightDesc') },
      { value: "engines", label: t('exams.engines'), description: t('exams.enginesDesc') },
      { value: "flight-controls", label: t('exams.flightControls'), description: t('exams.flightControlsDesc') },
      { value: "fuel", label: t('exams.fuel'), description: t('exams.fuelDesc') },
      { value: "landing-gear", label: t('exams.landingGear'), description: t('exams.landingGearDesc') }
    ];
    
    const b737Categories = [
      { value: "airplane-general", label: t('exams.aircraftGeneral'), description: t('exams.aircraftGeneralDesc') },
      { value: "air-systems", label: t('exams.airSystems'), description: t('exams.airSystemsDesc') },
      { value: "electrical", label: t('exams.electrical'), description: t('exams.electricalDesc') },
      { value: "engines-apu", label: t('exams.enginesApu'), description: t('exams.enginesApuDesc') },
      { value: "flight-controls", label: t('exams.flightControls'), description: t('exams.flightControlsDesc') },
      { value: "fuel", label: t('exams.fuel'), description: t('exams.fuelDesc') },
      { value: "hydraulics", label: t('exams.hydraulics'), description: t('exams.hydraulicsDesc') },
      { value: "landing-gear", label: t('exams.landingGear'), description: t('exams.landingGearDesc') }
    ];
    
    const allCategories = [...a320Categories, ...b737Categories.filter(cat => !a320Categories.some(a320Cat => a320Cat.value === cat.value))];
    
    switch (aircraft) {
      case "A320_FAMILY":
        return a320Categories;
      case "B737_FAMILY":
        return b737Categories;
      case "ALL":
        return allCategories;
      default:
        return a320Categories;
    }
  };
  
  const categories = getAvailableCategoriesFor(selectedAircraft);
  const reviewCategories = getAvailableCategoriesFor(reviewSelectedAircraft);

  const toggleCategory = (categoryValue: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryValue)) {
        return prev.filter(cat => cat !== categoryValue);
      } else {
        return [...prev, categoryValue];
      }
    });
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  const difficulties = [
    { value: "beginner", label: t('exams.basicLevel'), description: t('exams.fundamentalConcepts') },
    { value: "intermediate", label: t('exams.intermediateLevel'), description: t('exams.standardProcedures') },
    { value: "advanced", label: t('exams.advancedLevel'), description: t('exams.complexSituations') }
  ];

  const questionCounts = [
    { value: "10", label: `10 ${t('exams.questions')}`, description: `${t('exams.shortSession')} - 15 ${t('exams.minutes')}` },
    { value: "20", label: `20 ${t('exams.questions')}`, description: `${t('exams.standardSession')} - 30 ${t('exams.minutes')}` },
    { value: "30", label: `30 ${t('exams.questions')}`, description: `${t('exams.extendedSession')} - 45 ${t('exams.minutes')}` },
    { value: "50", label: `50 ${t('exams.questions')}`, description: `${t('exams.intensiveSession')} - 75 ${t('exams.minutes')}` },
    { value: "75", label: `75 ${t('exams.questions')}`, description: t('exams.fullExamSimulation') }
  ];

  const handleStartPractice = () => {
    const params = new URLSearchParams();
    params.set('mode', 'practice');
    if (selectedAircraft && selectedAircraft !== 'ALL') params.set('aircraft', selectedAircraft);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedDifficulty && selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    params.set('questionCount', selectedQuestionCount);
    navigate(`/exam?${params.toString()}`);
  };

  const handleStartReview = () => {
    const params = new URLSearchParams();
    params.set('mode', 'review');
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedDifficulty && selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    params.set('questionCount', selectedReviewQuestionCount);
    params.set('aircraft', reviewSelectedAircraft);
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
      <UnifiedSidebar activePage="exams" />

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
              {t('common.back')}
            </Button>
            <LanguageToggle />
          </div>
          <h1 className="text-4xl font-bold mb-2">{t('exams.title')}</h1>
          <p className="text-muted-foreground">Practica y toma exámenes para tu certificación de piloto.</p>
        </header>

        {/* Exam Categories */}
        <section className="mb-10">
          {/* Free Trial Notification for non-premium users */}
          {!adminUser && !hasAccessTo('A320_FAMILY') && !hasAccessTo('B737_FAMILY') && (
            <div className="mb-6">
              <FreeTrialNotification />
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-6">{t('exams.categories')}</h2>
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
<Badge className="bg-primary/10 text-primary">{t('exams.recommended')}</Badge>
                    </div>
<CardTitle className="text-lg">{t('exams.practiceMode')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Practica con preguntas reales de examen sin límite de tiempo.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Preguntas reales disponibles:</span>
                        <span className="font-medium">3,000+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Simulación de examen oficial</span>
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
<DialogTitle>{t('exams.configurePractice')}</DialogTitle>
                  <DialogDescription>
                    Selecciona las categorías y dificultad para personalizar tu sesión de práctica.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
<label className="text-sm font-medium">{t('exams.selectAircraftType')}</label>
                    <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de aeronave" />
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
                    <div className="flex justify-between items-center">
<label className="text-sm font-medium">{t('exams.categoriesLabel')}</label>
                      {selectedCategories.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearAllCategories}
                          className="text-xs h-6 px-2"
                        >
                          <X className="w-3 h-3 mr-1" />
{t('exams.clearAll')}
                        </Button>
                      )}
                    </div>
                    
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {categories.map((category) => (
                        <div 
                          key={category.value} 
                          className="flex items-center space-x-2 py-2"
                        >
                          <Checkbox
                            id={category.value}
                            checked={selectedCategories.includes(category.value)}
                            onCheckedChange={() => toggleCategory(category.value)}
                          />
                          <label
                            htmlFor={category.value}
                            className="flex-1 text-sm cursor-pointer"
                          >
                            <div className="font-medium">{category.label}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {selectedCategories.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedCategories.length} categoría(s) seleccionada(s)
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
<label className="text-sm font-medium">{t('exams.difficulty')}</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div>
<div className="font-medium">{t('exams.allDifficulties')}</div>
                            <div className="text-xs text-muted-foreground">Preguntas de todos los niveles</div>
                          </div>
                        </SelectItem>
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
                    <label className="text-sm font-medium">Tipo de Aeronave</label>
                    <Select value={reviewSelectedAircraft} onValueChange={setReviewSelectedAircraft}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de aeronave" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableAircraftTypes().map((air) => (
                          <SelectItem key={air.value} value={air.value}>
                            <div>
                              <div className="font-medium">{air.label}</div>
                              <div className="text-xs text-muted-foreground">{air.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categorías</label>
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
                    <Button onClick={handleStartPractice} className="flex-1" disabled={selectedCategories.length === 0}>
                      <Play className="w-4 h-4 mr-2" />
{t('exams.startPractice')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Timed Mode */}
            <Card className="surface-mid border-border/50 hover-lift cursor-pointer group" onClick={handleStartTimedExam}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                  <Badge className="bg-warning/10 text-warning">Cronometrado</Badge>
                </div>
<CardTitle className="text-lg">{t('exams.timedMode')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Simulacro de examen real con tiempo limitado y condiciones oficiales.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Tiempo límite:</span>
                    <span className="font-medium">60 minutos</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Preguntas:</span>
                    <span className="font-medium">75</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Puntuación mínima:</span>
                    <span className="font-medium">75%</span>
                  </div>
                </div>
                <Button className="w-full bg-warning text-warning-foreground hover:bg-warning/90">
                  <Clock className="w-4 h-4 mr-2" />
{t('exams.startTimed')}
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
                      <Badge className="bg-info/10 text-info">Repaso</Badge>
                    </div>
<CardTitle className="text-lg">{t('exams.reviewMode')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Repasa preguntas que has respondido incorrectamente para mejorar tu conocimiento.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Preguntas incorrectas guardadas:</span>
                        <span className="font-medium">143</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Progreso de mejora:</span>
                        <span className="font-medium">68%</span>
                      </div>
                    </div>
                    <Button className="w-full bg-info text-info-foreground hover:bg-info/90">
                      <BookOpen className="w-4 h-4 mr-2" />
{t('exams.startReview')}
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurar Repaso</DialogTitle>
                  <DialogDescription>
                    Selecciona las categorías que quieres repasar. Solo verás preguntas que has respondido incorrectamente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Categorías</label>
                      {selectedCategories.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearAllCategories}
                          className="text-xs h-6 px-2"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Limpiar todo
                        </Button>
                      )}
                    </div>
                    
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {reviewCategories.map((category) => (
                        <div 
                          key={category.value} 
                          className="flex items-center space-x-2 py-2"
                        >
                          <Checkbox
                            id={`review-${category.value}`}
                            checked={selectedCategories.includes(category.value)}
                            onCheckedChange={() => toggleCategory(category.value)}
                          />
                          <label
                            htmlFor={`review-${category.value}`}
                            className="flex-1 text-sm cursor-pointer"
                          >
                            <div className="font-medium">{category.label}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {selectedCategories.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedCategories.length} categoría(s) seleccionada(s)
                      </div>
                    )}
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
                    <Button onClick={handleStartReview} className="flex-1" disabled={selectedCategories.length === 0}>
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
        <section>
          <h2 className="text-2xl font-bold mb-6">Exámenes Disponibles</h2>
          
          {!canAccessA320 && !canAccessBoeing && (
            <div className="mb-6 p-4 border border-warning/20 bg-warning/5 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-warning">Acceso Limitado</p>
                  <p className="text-sm text-muted-foreground">
                    Necesitas una suscripción activa para acceder a los exámenes completos. 
                    <Button variant="link" className="h-auto p-0 ml-1" onClick={() => navigate('/dashboard')}>
                      Ver planes disponibles
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Airbus A320 Exam */}
            {(canAccessA320 || adminUser) && (
              <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-primary" />
                    </div>
                    <Badge className="bg-primary/10 text-primary">AIRBUS A320</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Examen de Habilitación A320</h3>
                  <p className="text-muted-foreground mb-4">
                    Examen completo de habilitación de tipo para aeronave Airbus A320 cubriendo todos los sistemas y procedimientos
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Preguntas:</span>
                      <span className="font-medium">50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duración:</span>
                      <span className="font-medium">60 min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Puntuación mínima:</span>
                      <span className="font-medium">75%</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/exam?mode=timed&timeLimit=60&questionCount=50&aircraft=A320_FAMILY')}
                  >
                    Iniciar Examen
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Boeing 737 Exam */}
            {(canAccessBoeing || adminUser) && (
              <Card className="surface-mid border-border/50 hover-lift cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-blue-500" />
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-500">BOEING 737</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Examen de Habilitación B737</h3>
                  <p className="text-muted-foreground mb-4">
                    Examen completo de habilitación de tipo para aeronave Boeing 737 cubriendo todos los sistemas y procedimientos
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Preguntas:</span>
                      <span className="font-medium">50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duración:</span>
                      <span className="font-medium">60 min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Puntuación mínima:</span>
                      <span className="font-medium">75%</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/exam?mode=timed&timeLimit=60&questionCount=50&aircraft=B737_FAMILY')}
                  >
                    Iniciar Examen
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Exams;