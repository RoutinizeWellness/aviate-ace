import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trophy,
  Clock,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";
import { useUserStats } from "@/hooks/useStats";
import { useState, useEffect } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { AvatarSelector } from "@/components/AvatarSelector";
import { UnifiedSidebar } from "@/components/UnifiedSidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, userStats, updateProfile, updateAvatar, isUpdatingProfile } = useSupabaseProfile();
  const { examStats, userAchievements } = useUserStats();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    experience_level: 'beginner' as any,
    current_aircraft: 'airbus_a320' as any
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        experience_level: profile.experience_level || 'beginner',
        current_aircraft: profile.current_aircraft || 'airbus_a320'
      });
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    try {
      // Save to localStorage for immediate persistence
      localStorage.setItem('userAvatarSelection', JSON.stringify({
        url: avatarUrl,
        timestamp: Date.now()
      }));
      
      // Try to update profile via backend
      if (updateAvatar) {
        await updateAvatar(avatarUrl);
      }
      
      console.log('Avatar updated successfully:', avatarUrl);
    } catch (error) {
      console.error('Error updating avatar:', error);
      // Avatar is still saved in localStorage as fallback
    }
  };

  const handleSave = () => {
    updateProfile(formData);  
    setIsEditing(false);
  };

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     t('common.user') || 'Usuario';

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Sidebar */}
      <UnifiedSidebar activePage="profile" />
      
      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header with Language Toggle */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('common.back') || 'Volver al Dashboard'}
            </Button>
            <LanguageToggle />
          </div>
          <h1 className="text-4xl font-bold mb-2">{t('nav.profile') || 'Mi Perfil'}</h1>
          <p className="text-muted-foreground">
            {t('profile.subtitle') || 'Gestiona tu información personal y preferencias de cuenta.'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('profile.personalInfo') || 'Información Personal'}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? (t('common.cancel') || 'Cancelar') : (t('common.edit') || 'Editar')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <AvatarSelector 
                      currentAvatar={profile?.avatar_url}
                      onAvatarSelect={handleAvatarSelect}
                    >
                      <UserAvatar 
                        avatarUrl={profile?.avatar_url} 
                        displayName={displayName}
                        size="lg"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </AvatarSelector>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{displayName}</h3>
                    <p className="text-muted-foreground">
                      {profile?.experience_level ? 
                        profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1) + " Pilot" :
                        (t('profile.pilotInTraining') || 'Piloto en formación')
                      }
                    </p>
                    <AvatarSelector 
                      currentAvatar={profile?.avatar_url}
                      onAvatarSelect={handleAvatarSelect}
                    >
                      <Button variant="link" className="p-0 h-auto text-sm">
                        {t('profile.changePhoto') || 'Cambiar foto de perfil'}
                      </Button>
                    </AvatarSelector>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">{t('profile.fullName') || 'Nombre completo'}</Label>
                    {isEditing ? (
                      <Input 
                        id="displayName" 
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                      />
                    ) : (
                      <Input id="displayName" value={profile?.display_name || displayName} readOnly />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('profile.email') || 'Email'}</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Input id="email" value={user?.email || ''} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">{t('profile.currentLevel') || 'Nivel actual'}</Label>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <Input id="level" value={`${t('profile.level') || 'Nivel'} ${userStats?.current_level || 1} (${userStats?.total_points || 0} ${t('profile.points') || 'puntos'})`} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">{t('profile.joinDate') || 'Fecha de registro'}</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="joinDate" 
                        value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : (t('profile.notAvailable') || 'No disponible')} 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      {t('common.cancel') || 'Cancelar'}
                    </Button>
                    <Button onClick={handleSave} disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (t('profile.saving') || 'Guardando...') : (t('common.save') || 'Guardar cambios')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aviation Background */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>{t('profile.aviationBackground') || 'Antecedentes de Aviación'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">{t('profile.experienceLevel') || 'Nivel de experiencia'}</Label>
                    {isEditing ? (
                      <select 
                        className="w-full p-2 border rounded"
                        value={formData.experience_level}
                        onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                      >
                        <option value="beginner">{t('profile.beginner') || 'Principiante'}</option>
                        <option value="intermediate">{t('profile.intermediate') || 'Intermedio'}</option>
                        <option value="advanced">{t('profile.advanced') || 'Avanzado'}</option>
                      </select>
                    ) : (
                      <Input 
                        id="experience" 
                        value={profile?.experience_level ? 
                          profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1) :
                          (t('profile.beginner') || 'Principiante')
                        } 
                        readOnly 
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aircraft">{t('profile.currentAircraft') || 'Aeronave actual'}</Label>
                    {isEditing ? (
                      <select 
                        className="w-full p-2 border rounded"
                        value={formData.current_aircraft}
                        onChange={(e) => setFormData({...formData, current_aircraft: e.target.value as any})}
                      >
                        <option value="airbus_a320">Airbus A320</option>
                        <option value="airbus_a330">Airbus A330</option>
                        <option value="airbus_a350">Airbus A350</option>
                        <option value="boeing_737">Boeing 737</option>
                        <option value="boeing_777">Boeing 777</option>
                        <option value="boeing_787">Boeing 787</option>
                      </select>
                    ) : (
                      <Input 
                        id="aircraft" 
                        value={profile?.current_aircraft ? 
                          profile.current_aircraft.replace('_', ' ').toUpperCase() :
                          (t('profile.notSelected') || 'No seleccionado')
                        } 
                        readOnly 
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planType">{t('profile.planType') || 'Tipo de plan'}</Label>
                    <Input 
                      id="planType" 
                      value={profile?.plan_type === 'premium' ? 
                        (t('profile.premium') || 'Premium') : 
                        (t('profile.free') || 'Gratuito')
                      } 
                      readOnly 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalExams">{t('profile.completedExams') || 'Exámenes completados'}</Label>
                    <Input id="totalExams" value={userStats?.total_exams_taken || 0} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>{t('profile.quickStats') || 'Estadísticas Rápidas'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm">{t('profile.achievements') || 'Logros'}</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary">{userAchievements?.length || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-success" />
                    <span className="text-sm">{t('profile.completedExams') || 'Exámenes completados'}</span>
                  </div>
                  <Badge className="bg-success/10 text-success">{userStats?.total_exams_taken || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm">{t('profile.completedLessons') || 'Lecciones completadas'}</span>
                  </div>
                  <Badge className="bg-warning/10 text-warning">{userStats?.total_lessons_completed || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>{t('profile.accountActions') || 'Acciones de Cuenta'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/subscription-management')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('profile.manageSubscription') || 'Gestionar Suscripción'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/progress')}>
                  <Trophy className="w-4 h-4 mr-2" />
                  {t('profile.viewProgress') || 'Ver Progreso'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive" 
                  onClick={handleSignOut}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('nav.logout') || 'Cerrar Sesión'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;