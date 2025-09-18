import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Target, 
  BarChart3, 
  User, 
  Settings as SettingsIcon, 
  LogOut,
  Plane,
  ArrowLeft,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  AlertTriangle,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserAvatar } from "@/components/UserAvatar";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, userStats } = useUserProfile();
  const { toast } = useToast();

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      studyReminders: true,
      newContent: true,
      achievements: true,
      examReminders: false
    },
    learning: {
      sessionDuration: "30",
      difficulty: "adaptive",
      autoNightMode: false,
      appSounds: true
    },
    appearance: {
      theme: "dark",
      language: "es"
    },
    privacy: {
      anonymousStats: true,
      timezone: "America/Mexico_City"
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
    
    toast({
      title: "Configuración actualizada",
      description: "Tus preferencias han sido guardadas.",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Cambio de contraseña",
      description: "Se ha enviado un enlace de restablecimiento a tu email.",
    });
  };

  const handleDataExport = () => {
    toast({
      title: "Exportación iniciada",
      description: "Recibirás un email con tus datos en breve.",
    });
  };

  const handleAccountDeletion = () => {
    if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      toast({
        title: "Cuenta programada para eliminación",
        description: "Tu cuenta será eliminada en 30 días. Puedes cancelar este proceso desde tu email.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.display_name || 
                     user?.user_metadata?.full_name || 
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
              <p className="text-xs text-muted-foreground">Configuración</p>
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
            <Button variant="default" className="w-full justify-start gap-3 h-12">
              <SettingsIcon className="w-5 h-5" />
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
          <h1 className="text-4xl font-bold mb-2">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia de aprendizaje y gestiona tu cuenta.</p>
        </header>

        <div className="space-y-8">
          {/* Notifications */}
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notificaciones</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Recordatorios de estudio</Label>
                  <p className="text-sm text-muted-foreground">Recibe notificaciones para mantener tu rutina de estudio</p>
                </div>
                <Switch 
                  checked={settings.notifications.studyReminders}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'studyReminders', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Nuevos contenidos</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones cuando se añadan nuevas preguntas o cursos</p>
                </div>
                <Switch 
                  checked={settings.notifications.newContent}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'newContent', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Logros y progreso</Label>
                  <p className="text-sm text-muted-foreground">Celebra tus logros y hitos de aprendizaje</p>
                </div>
                <Switch 
                  checked={settings.notifications.achievements}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'achievements', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Recordatorios de examen</Label>
                  <p className="text-sm text-muted-foreground">Alertas para exámenes programados y fechas límite</p>
                </div>
                <Switch 
                  checked={settings.notifications.examReminders}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'examReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle>Preferencias de Aprendizaje</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTime">Duración de sesión por defecto</Label>
                  <Select 
                    value={settings.learning.sessionDuration} 
                    onValueChange={(value) => handleSettingChange('learning', 'sessionDuration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Nivel de dificultad preferido</Label>
                  <Select 
                    value={settings.learning.difficulty} 
                    onValueChange={(value) => handleSettingChange('learning', 'difficulty', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                      <SelectItem value="adaptive">Adaptativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Modo oscuro automático</Label>
                  <p className="text-sm text-muted-foreground">Cambiar automáticamente basado en la hora del día</p>
                </div>
                <Switch 
                  checked={settings.learning.autoNightMode}
                  onCheckedChange={(checked) => handleSettingChange('learning', 'autoNightMode', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Sonidos de la aplicación</Label>
                  <p className="text-sm text-muted-foreground">Reproducir sonidos para respuestas correctas e incorrectas</p>
                </div>
                <Switch 
                  checked={settings.learning.appSounds}
                  onCheckedChange={(checked) => handleSettingChange('learning', 'appSounds', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Apariencia</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select 
                    value={settings.appearance.theme} 
                    onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    value={settings.appearance.language} 
                    onValueChange={(value) => handleSettingChange('appearance', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Privacidad y Seguridad</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={handlePasswordChange}>
                  Cambiar contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configurar autenticación de dos factores
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleDataExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar mis datos
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Estadísticas anónimas</Label>
                  <p className="text-sm text-muted-foreground">Ayúdanos a mejorar compartiendo datos de uso anónimos</p>
                </div>
                <Switch 
                  checked={settings.privacy.anonymousStats}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'anonymousStats', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="surface-mid border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Gestión de Cuenta</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Plan {profile?.plan_type === 'premium' ? 'Premium' : 'Gratuito'}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {profile?.plan_type === 'premium' ? 
                      'Acceso completo a todos los cursos y funciones avanzadas' :
                      'Acceso limitado a contenido básico'
                    }
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {profile?.plan_type === 'premium' ? 
                        'Próxima facturación: 15 Oct 2024' :
                        'Actualiza para acceder a más contenido'
                      }
                    </span>
                    <Button variant={profile?.plan_type === 'premium' ? "outline" : "default"} size="sm">
                      {profile?.plan_type === 'premium' ? 'Gestionar' : 'Actualizar'}
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Select 
                    value={settings.privacy.timezone} 
                    onValueChange={(value) => handleSettingChange('privacy', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="surface-mid border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-medium mb-2 text-destructive">Eliminar cuenta</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
                  Esta acción no se puede deshacer.
                </p>
                <Button variant="destructive" size="sm" onClick={handleAccountDeletion}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar cuenta
                </Button>
              </div>
              
              <div className="p-4 border border-warning/20 rounded-lg bg-warning/5">
                <h4 className="font-medium mb-2 text-warning">Restablecer configuración</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Volver a los valores predeterminados de todas las configuraciones.
                </p>
                <Button variant="outline" size="sm" onClick={() => {
                  setSettings({
                    notifications: {
                      studyReminders: true,
                      newContent: true,
                      achievements: true,
                      examReminders: false
                    },
                    learning: {
                      sessionDuration: "30",
                      difficulty: "adaptive",
                      autoNightMode: false,
                      appSounds: true
                    },
                    appearance: {
                      theme: "dark",
                      language: "es"
                    },
                    privacy: {
                      anonymousStats: true,
                      timezone: "America/Mexico_City"
                    }
                  });
                  toast({
                    title: "Configuración restablecida",
                    description: "Todas las configuraciones han vuelto a los valores predeterminados.",
                  });
                }}>
                  Restablecer configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;