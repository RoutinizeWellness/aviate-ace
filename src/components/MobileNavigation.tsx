import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  BookOpen, 
  Target, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Plane,
  Star,
  Menu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserAvatar } from "@/components/UserAvatar";

interface MobileNavigationProps {
  currentPage?: string;
  pageTitle?: string;
}

export const MobileNavigation = ({ currentPage = "", pageTitle = "Dashboard" }: MobileNavigationProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, userStats } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  const navigationItems = [
    { id: 'dashboard', icon: BookOpen, label: 'Inicio', path: '/dashboard' },
    { id: 'exams', icon: Target, label: 'Exámenes', path: '/exams' },
    { id: 'type-rating', icon: Star, label: 'Type Rating', path: '/type-rating' },
    { id: 'progress', icon: BarChart3, label: 'Progreso', path: '/progress' },
    { id: 'profile', icon: User, label: 'Perfil', path: '/profile' },
    { id: 'settings', icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">PilotPrepFlightX</h1>
              <p className="text-xs text-muted-foreground">{pageTitle}</p>
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
                Nivel {userStats?.current_level || 1} • {userStats?.total_points || 0} puntos
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button 
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => navigate(item.path)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-8">
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

export default MobileNavigation;