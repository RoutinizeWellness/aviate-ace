import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { QuestionSuggestionsAdmin } from '@/components/QuestionSuggestionsAdmin';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Users, 
  Settings, 
  Shield, 
  Trash2, 
  Edit,
  ArrowLeft,
  AlertTriangle,
  Crown,
  User,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plane,
  BookOpen,
  List,
  Plus,
  Save,
  Lightbulb
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Check if user is admin
  const adminCheck = useQuery(api.auth.isUserAdmin, user ? { userId: user._id } : "skip");
  const allUsers = useQuery(api.auth.getAllUsers, 
    user && adminCheck?.isAdmin 
      ? { adminUserId: user._id }
      : "skip"
  );
  
  // Mutations
  const updateUserRole = useMutation(api.auth.updateUserRole);
  const deleteUser = useMutation(api.auth.deleteUser);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false); // New state for question dialog
  const [editForm, setEditForm] = useState({
    role: '',
    accountType: '',
    isActive: true,
    permissions: []
  });
  
  // New state for question form
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    aircraftType: 'A320_FAMILY',
    category: 'aircraft-general',
    difficulty: 'intermediate'
  });
  
  // Aircraft families and categories data
  const aircraftFamilies = [
    { 
      id: "A320_FAMILY", 
      name: "Airbus A320 Family", 
      description: "A318, A319, A320, A321",
      categories: [
        { value: "aircraft-general", label: t('admin.categories.aircraftGeneral') || "Aircraft General", description: t('admin.categories.aircraftGeneralDesc') || "General aircraft knowledge and limitations" },
        { value: "load-acceleration-limits", label: t('admin.categories.loadAccelerationLimits') || "Load Acceleration Limits", description: t('admin.categories.loadAccelerationLimitsDesc') || "Aircraft structural and acceleration limitations" },
        { value: "environment-limits", label: t('admin.categories.environmentLimits') || "Environment Limits", description: t('admin.categories.environmentLimitsDesc') || "Environmental operational limitations" },
        { value: "weight-limits", label: t('admin.categories.weightLimits') || "Weight Limits", description: t('admin.categories.weightLimitsDesc') || "Maximum weights and balance limitations" },
        { value: "speed-limits", label: t('admin.categories.speedLimits') || "Speed Limits", description: t('admin.categories.speedLimitsDesc') || "Aircraft speed limitations and restrictions" },
        { value: "air-bleed-cond-press-vent", label: t('admin.categories.airBleedCondPressVent') || "Air Bleed/Cond/Press/Vent", description: t('admin.categories.airBleedCondPressVentDesc') || "Air conditioning, pressurization, and ventilation" },
        { value: "autoflight", label: t('admin.categories.autoflight') || "Autoflight", description: t('admin.categories.autoflightDesc') || "Autopilot and flight management systems" },
        { value: "apu", label: t('admin.categories.apu') || "APU", description: t('admin.categories.apuDesc') || "Auxiliary Power Unit operations and limitations" },
        { value: "engines", label: t('admin.categories.engines') || "Engines", description: t('admin.categories.enginesDesc') || "Engine operations, limitations, and procedures" },
        { value: "flight-controls", label: t('admin.categories.flightControls') || "Flight Controls", description: t('admin.categories.flightControlsDesc') || "Primary and secondary flight control systems" },
        { value: "fuel", label: t('admin.categories.fuel') || "Fuel", description: t('admin.categories.fuelDesc') || "Fuel systems, distribution, and monitoring" },
        { value: "ice-rain-protection", label: t('admin.categories.iceRainProtection') || "Ice and Rain Protection", description: t('admin.categories.iceRainProtectionDesc') || "Anti-ice and rain protection systems" },
        { value: "landing-gear", label: t('admin.categories.landingGear') || "Landing Gear", description: t('admin.categories.landingGearDesc') || "Landing gear operation, brakes, and steering" },
        { value: "oxygen", label: t('admin.categories.oxygen') || "Oxygen", description: t('admin.categories.oxygenDesc') || "Oxygen systems and emergency procedures" },
        { value: "gpws", label: t('admin.categories.gpws') || "GPWS", description: t('admin.categories.gpwsDesc') || "Ground Proximity Warning System" },
        { value: "navigation", label: t('admin.categories.navigation') || "Navigation", description: t('admin.categories.navigationDesc') || "Navigation systems and procedures" },
        // Additional A320-specific categories to match the generated questions
        { value: "approach-procedures", label: t('admin.categories.approachProcedures') || "Approach Procedures", description: t('admin.categories.approachProceduresDesc') || "Instrument approach procedures and landing" },
        { value: "electrical", label: t('admin.categories.electrical') || "Electrical", description: t('admin.categories.electricalDesc') || "Electrical power generation and distribution" },
        { value: "emergency-procedures", label: t('admin.categories.emergencyProcedures') || "Emergency Procedures", description: t('admin.categories.emergencyProceduresDesc') || "Emergency and abnormal procedures" },
        { value: "fire-protection", label: t('admin.categories.fireProtection') || "Fire Protection", description: t('admin.categories.fireProtectionDesc') || "Fire detection and suppression systems" },
        { value: "flight-protection", label: t('admin.categories.flightProtection') || "Flight Protection", description: t('admin.categories.flightProtectionDesc') || "Flight envelope protection systems" },
        { value: "hydraulics", label: t('admin.categories.hydraulics') || "Hydraulics", description: t('admin.categories.hydraulicsDesc') || "Hydraulic power systems and components" },
        { value: "meteorologia", label: t('admin.categories.meteorologia') || "Meteorología", description: t('admin.categories.meteorologiaDesc') || "Weather conditions and meteorological information" },
        { value: "motor-y-apu", label: t('admin.categories.motorYApu') || "Motor y APU", description: t('admin.categories.motorYApuDesc') || "Engine and auxiliary power unit systems" },
        { value: "navegacion", label: t('admin.categories.navegacion') || "Navegación", description: t('admin.categories.navegacionDesc') || "Navigation procedures and systems" },
        { value: "performance", label: t('admin.categories.performance') || "Performance", description: t('admin.categories.performanceDesc') || "Aircraft performance calculations and limitations" },
        { value: "procedimientos-de-despegue", label: t('admin.categories.procedimientosDespegue') || "Procedimientos de Despegue", description: t('admin.categories.procedimientosDespegueDesc') || "Takeoff procedures and limitations" },
        { value: "reglamentacion", label: t('admin.categories.reglamentacion') || "Reglamentación", description: t('admin.categories.reglamentacionDesc') || "Aviation regulations and requirements" },
        { value: "sistema-electrico", label: t('admin.categories.sistemaElectrico') || "Sistema Eléctrico", description: t('admin.categories.sistemaElectricoDesc') || "Electrical systems in Spanish" },
        { value: "sistema-hidraulico", label: t('admin.categories.sistemaHidraulico') || "Sistema Hidráulico", description: t('admin.categories.sistemaHidraulicoDesc') || "Hydraulic systems in Spanish" }
      ]
    },
    { 
      id: "B737_FAMILY", 
      name: "Boeing 737", 
      description: "B737-700, B737-800, B737 MAX",
      categories: [
        { value: "airplane-general", label: t('admin.categories.airplaneGeneral') || "AIRPLANE GENERAL", description: t('admin.categories.airplaneGeneralDesc') || "General aircraft information and limitations" },
        { value: "air-systems", label: t('admin.categories.airSystems') || "AIR SYSTEMS", description: t('admin.categories.airSystemsDesc') || "Pneumatic, pressurization, and air conditioning systems" },
        { value: "anti-ice-rain", label: t('admin.categories.antiIceRain') || "ANTI-ICE AND RAIN", description: t('admin.categories.antiIceRainDesc') || "Ice and rain protection systems" },
        { value: "automatic-flight", label: t('admin.categories.automaticFlight') || "AUTOMATIC FLIGHT", description: t('admin.categories.automaticFlightDesc') || "Autopilot and flight management systems" },
        { value: "communication", label: t('admin.categories.communication') || "COMMUNICATION", description: t('admin.categories.communicationDesc') || "Radio and communication systems" },
        { value: "electrical", label: t('admin.categories.electrical') || "ELECTRICAL", description: t('admin.categories.electricalDesc') || "Electrical power systems" },
        { value: "engines-apu", label: t('admin.categories.enginesApu') || "ENGINES AND APU", description: t('admin.categories.enginesApuDesc') || "Engine and auxiliary power unit systems" },
        { value: "fire-protection", label: t('admin.categories.fireProtection') || "FIRE PROTECTION", description: t('admin.categories.fireProtectionDesc') || "Fire detection and suppression systems" },
        { value: "flight-controls", label: t('admin.categories.flightControls') || "FLIGHT CONTROLS", description: t('admin.categories.flightControlsDesc') || "Primary and secondary flight control systems" },
        { value: "flight-instruments", label: t('admin.categories.flightInstruments') || "FLIGHT INSTRUMENTS AND DISPLAYS", description: t('admin.categories.flightInstrumentsDesc') || "Flight instruments and display systems" },
        { value: "flight-management", label: t('admin.categories.flightManagement') || "FLIGHT MANAGEMENT AND NAVIGATION", description: t('admin.categories.flightManagementDesc') || "Flight management and navigation systems" },
        { value: "fuel", label: t('admin.categories.fuel') || "FUEL", description: t('admin.categories.fuelDesc') || "Fuel storage, distribution, and indication systems" },
        { value: "hydraulics", label: t('admin.categories.hydraulics') || "HYDRAULICS", description: t('admin.categories.hydraulicsDesc') || "Hydraulic power systems" },
        { value: "landing-gear", label: t('admin.categories.landingGear') || "LANDING GEAR", description: t('admin.categories.landingGearDesc') || "Landing gear extension, retraction, and indication" },
        { value: "warning-systems", label: t('admin.categories.warningSystems') || "WARNING SYSTEMS", description: t('admin.categories.warningSystemsDesc') || "Master warning, master caution, and alerting systems" }
      ]
    }
  ];

  // Redirect if not admin
  useEffect(() => {
    // Only redirect if we have a definitive answer that the user is not admin
    if (adminCheck && !adminCheck.isAdmin) {
      toast({
        title: t('admin.accessDenied') || "Acceso Denegado",
        description: t('admin.noPermissions') || "No tienes permisos de administrador.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [adminCheck, navigate, toast]);

  // Show loading state while checking admin status
  if (!user || adminCheck === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not admin (after we have a definitive answer)
  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="surface-mid border-border/50 p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
          <p className="text-muted-foreground mb-4">
            Esta página requiere permisos de administrador.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role || 'user',
      accountType: user.accountType || 'free',
      isActive: user.isActive !== false,
      permissions: user.permissions || []
    });
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser || !user) return;
    
    try {
      await updateUserRole({
        adminUserId: user._id,
        targetUserId: selectedUser._id,
        role: editForm.role,
        accountType: editForm.accountType,
        isActive: editForm.isActive,
        permissions: editForm.permissions,
      });
      
      toast({
        title: "Usuario actualizado",
        description: "Los cambios se han guardado exitosamente.",
      });
      
      setShowEditDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !user) return;
    
    try {
      await deleteUser({
        adminUserId: user._id,
        targetUserId: selectedUser._id,
      });
      
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
      
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccountTypeBadgeColor = (accountType: string) => {
    switch (accountType) {
      case 'enterprise': return 'bg-gold-100 text-gold-800 border-gold-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const availablePermissions = [
    'manage_users',
    'view_analytics', 
    'manage_content',
    'system_admin',
    'export_data',
    'user_support'
  ];

  const difficulties = [
    { value: 'beginner', label: 'Básico' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
  ];

  // Handle question form changes
  const handleQuestionFormChange = (field: string, value: any) => {
    setQuestionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  // Save question (placeholder for now)
  const handleSaveQuestion = () => {
    // In a real implementation, this would call a Convex mutation to save the question
    console.log('Saving question:', questionForm);
    toast({
      title: "Pregunta guardada",
      description: "La pregunta se ha guardado exitosamente.",
    });
    setShowQuestionDialog(false);
    // Reset form
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      aircraftType: 'A320_FAMILY',
      category: 'aircraft-general',
      difficulty: 'intermediate'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-surface-dark">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">Gestión de usuarios y permisos</p>
              </div>
            </div>
          </div>
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Crown className="w-3 h-3 mr-1" />
            Administrador
          </Badge>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold">{allUsers?.length || 0}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold">
                    {allUsers?.filter(u => u.role === 'admin').length || 0}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-500 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios Premium</p>
                  <p className="text-2xl font-bold">
                    {allUsers?.filter(u => u.accountType === 'premium').length || 0}
                  </p>
                </div>
                <Crown className="w-8 h-8 text-purple-500 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
                  <p className="text-2xl font-bold">
                    {allUsers?.filter(u => u.isActive !== false).length || 0}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="surface-mid border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Tipo de Cuenta</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{user.displayName || user.fullName}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role || 'user')}>
                          {user.role === 'admin' ? 'Administrador' : 
                           user.role === 'premium' ? 'Premium' : 'Usuario'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccountTypeBadgeColor(user.accountType || 'free')}>
                          {user.accountType === 'enterprise' ? 'Empresarial' :
                           user.accountType === 'premium' ? 'Premium' : 'Gratuito'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive !== false ? 'default' : 'secondary'}>
                          {user.isActive !== false ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Nivel: {user.stats?.currentLevel || 1}</p>
                          <p>Puntos: {user.stats?.totalPoints || 0}</p>
                          <p>Exámenes: {user.stats?.totalExamsTaken || 0}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteDialog(true);
                            }}
                            disabled={['tiniboti@gmail.com'].includes(user.email)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Aircraft Families and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Aircraft Families */}
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Familias de Aeronaves
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aircraftFamilies.map((family) => (
                  <div key={family.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{family.name}</h3>
                      <Badge variant="outline">{family.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{family.description}</p>
                    <div className="text-xs">
                      <span className="font-medium">Categorías: </span>
                      <span>{family.categories.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categories by Aircraft Family */}
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5" />
                Categorías por Familia de Aeronave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aircraftFamilies.map((family) => (
                  <div key={family.id} className="border border-border/50 rounded-lg">
                    <div className="bg-surface-mid p-3 border-b border-border/50">
                      <h3 className="font-medium flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        {family.name}
                      </h3>
                    </div>
                    <div className="p-3 max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-2">
                        {family.categories.map((category) => (
                          <div key={category.value} className="text-sm p-2 rounded border border-border/30">
                            <div className="font-medium">{category.label}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Suggestions Management */}
        <Card className="surface-mid border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Sugerencias de Preguntas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionSuggestionsAdmin />
          </CardContent>
        </Card>

        {/* Question Management */}
        <Card className="surface-mid border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Gestión de Preguntas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Agrega y edita preguntas para los exámenes de certificación de piloto.
              </p>
              <Button 
                className="w-fit"
                onClick={() => setShowQuestionDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nueva Pregunta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Statistics */}
        <Card className="surface-mid border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Estadísticas de Preguntas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">7,500+</div>
                <div className="text-sm text-muted-foreground">Preguntas totales</div>
              </div>
              <div className="border border-border/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-500">500</div>
                <div className="text-sm text-muted-foreground">Preguntas por categoría B737</div>
              </div>
              <div className="border border-border/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-500">16</div>
                <div className="text-sm text-muted-foreground">Categorías A320</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>• Todas las categorías de Boeing 737 tienen exactamente 500 preguntas cada una</p>
              <p>• Las categorías de Airbus A320 tienen preguntas distribuidas según los estándares de certificación</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica el rol y permisos de {selectedUser?.displayName || selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rol</label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Cuenta</label>
                <Select value={editForm.accountType} onValueChange={(value) => setEditForm(prev => ({ ...prev, accountType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive" className="text-sm font-medium">Usuario Activo</label>
              </div>

              {selectedUser?.email && ['tiniboti@gmail.com'].includes(selectedUser.email) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Esta es una cuenta de súper administrador protegida.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Eliminar Usuario</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar a {selectedUser?.displayName || selectedUser?.email}?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Se eliminarán todos los datos del usuario incluyendo progreso, estadísticas y perfil.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Eliminar Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Question Dialog */}
        <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Pregunta</DialogTitle>
              <DialogDescription>
                Crea una nueva pregunta para los exámenes de certificación.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Pregunta</Label>
                <Textarea
                  id="question"
                  value={questionForm.question}
                  onChange={(e) => handleQuestionFormChange('question', e.target.value)}
                  placeholder="Escribe la pregunta aquí..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Opciones de Respuesta</Label>
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`correct-${index}`}
                        name="correctAnswer"
                        checked={questionForm.correctAnswer === index}
                        onChange={() => handleQuestionFormChange('correctAnswer', index)}
                        className="mr-2"
                      />
                      <Label htmlFor={`correct-${index}`} className="sr-only">Correcta</Label>
                    </div>
                    <Input
                      value={questionForm.options[index]}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Opción ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aircraftType">Tipo de Aeronave</Label>
                  <Select 
                    value={questionForm.aircraftType} 
                    onValueChange={(value) => handleQuestionFormChange('aircraftType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A320_FAMILY">Airbus A320 Family</SelectItem>
                      <SelectItem value="B737_FAMILY">Boeing 737</SelectItem>
                      <SelectItem value="GENERAL">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select 
                    value={questionForm.category} 
                    onValueChange={(value) => handleQuestionFormChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aircraftFamilies
                        .find(family => family.id === questionForm.aircraftType)
                        ?.categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        )) || (
                          <SelectItem value="general">General</SelectItem>
                        )
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificultad</Label>
                  <Select 
                    value={questionForm.difficulty} 
                    onValueChange={(value) => handleQuestionFormChange('difficulty', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correctAnswerDisplay">Respuesta Correcta</Label>
                  <Input
                    id="correctAnswerDisplay"
                    value={questionForm.options[questionForm.correctAnswer]}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Explicación</Label>
                <Textarea
                  id="explanation"
                  value={questionForm.explanation}
                  onChange={(e) => handleQuestionFormChange('explanation', e.target.value)}
                  placeholder="Explicación detallada de la respuesta correcta..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveQuestion} disabled={!questionForm.question || questionForm.options.some(opt => !opt)}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Pregunta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;