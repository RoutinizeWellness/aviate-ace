import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { UnifiedSidebar } from "@/components/UnifiedSidebar"; // Added import for UnifiedSidebar

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, userStats, updateProfile, updateAvatar, isUpdatingProfile } = useSupabaseProfile();
  const { examStats, userAchievements } = useUserStats();
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

  const handleAvatarSelect = (avatarUrl: string) => {
    updateAvatar(avatarUrl);
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Sidebar */}
      <UnifiedSidebar activePage="profile" />
      
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
          <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y preferencias de cuenta.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Información Personal</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancelar" : "Editar"}
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
                        "Piloto en formación"
                      }
                    </p>
                    <AvatarSelector 
                      currentAvatar={profile?.avatar_url}
                      onAvatarSelect={handleAvatarSelect}
                    >
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Cambiar foto de perfil
                      </Button>
                    </AvatarSelector>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nombre completo</Label>
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
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Input id="email" value={user?.email || ''} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel actual</Label>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <Input id="level" value={`Nivel ${userStats?.current_level || 1} (${userStats?.total_points || 0} puntos)`} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Fecha de registro</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="joinDate" 
                        value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'No disponible'} 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aviation Background */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>Antecedentes de Aviación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Nivel de experiencia</Label>
                    {isEditing ? (
                      <select 
                        className="w-full p-2 border rounded"
                        value={formData.experience_level}
                        onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                      >
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </select>
                    ) : (
                      <Input 
                        id="experience" 
                        value={profile?.experience_level ? 
                          profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1) :
                          'Principiante'
                        } 
                        readOnly 
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aircraft">Aeronave actual</Label>
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
                          'No seleccionado'
                        } 
                        readOnly 
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planType">Tipo de plan</Label>
                    <Input 
                      id="planType" 
                      value={profile?.plan_type === 'premium' ? 'Premium' : 'Gratuito'} 
                      readOnly 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalExams">Exámenes completados</Label>
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
                <CardTitle>Estadísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm">Logros</span>
                  </div>
                  <Badge className="bg-primary/10 text-primary">{userAchievements?.length || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-success" />
                    <span className="text-sm">Exámenes completados</span>
                  </div>
                  <Badge className="bg-success/10 text-success">{userStats?.total_exams_taken || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm">Lecciones completadas</span>
                  </div>
                  <Badge className="bg-warning/10 text-warning">{userStats?.total_lessons_completed || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-info" />
                    <span className="text-sm">Puntos totales</span>
                  </div>
                  <Badge className="bg-info/10 text-info">{userStats?.total_points || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>Logros Recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userAchievements && userAchievements.length > 0 ? (
                  userAchievements.slice(0, 3).map((userAchievement) => {
                    return (
                      <div key={userAchievement.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Logro #{userAchievement.achievement_id}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(userAchievement.unlocked_at).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No hay logros aún</p>
                    <p className="text-xs text-muted-foreground">Completa exámenes para desbloquear logros</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>Estado de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Plan actual</span>
                  <Badge className="bg-primary/10 text-primary">Premium</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Próxima facturación</span>
                  <span className="text-sm text-muted-foreground">15 Oct 2024</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Open subscription management
                    window.open('/subscription-management', '_blank') || 
                    navigate('/settings'); // Fallback to settings
                  }}
                >
                  Gestionar suscripción
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