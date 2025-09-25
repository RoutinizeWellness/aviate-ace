import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { 
  BookOpen, 
  Target, 
  BarChart3, 
  User, 
  LogOut,
  Shield,
  Menu
} from "lucide-react";
import logo from '@/assets/logo.svg';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from "react-router-dom";
import { useAuth, isAdmin } from "@/hooks/useConvexAuth";
import { useSupabaseProfile } from "@/hooks/useSupabaseProfile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnifiedSidebarProps {
  activePage: 'dashboard' | 'exams' | 'type-rating' | 'progress' | 'profile' | 'settings' | 'admin';
}

export const UnifiedSidebar = ({ activePage }: UnifiedSidebarProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useSupabaseProfile();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  const currentLevel = profile?.experience_level || '1';
  const totalPoints = profile?.points || 0;

  const renderNavigationItems = () => (
    <nav className="space-y-2">
      <Button 
        variant={activePage === 'dashboard' ? "default" : "ghost"} 
        className="w-full justify-start gap-3 h-12"
        onClick={() => navigate('/dashboard')}
      >
        <BookOpen className="w-5 h-5" />
        <span>{t('nav.dashboard')}</span>
      </Button>
      <Button 
        variant={activePage === 'exams' ? "default" : "ghost"} 
        className="w-full justify-start gap-3 h-12"
        onClick={() => navigate('/exams')}
      >
        <Target className="w-5 h-5" />
        <span>{t('nav.exams')}</span>
      </Button>
      <Button 
        variant={activePage === 'type-rating' ? "default" : "ghost"} 
        className="w-full justify-start gap-3 h-12"
        onClick={() => navigate('/type-rating')}
      >
        <img src={logo} alt="Logo" className="w-5 h-5" />
        <span>Type Rating</span>
      </Button>
      <Button 
        variant={activePage === 'progress' ? "default" : "ghost"} 
        className="w-full justify-start gap-3 h-12"
        onClick={() => navigate('/progress')}
      >
        <BarChart3 className="w-5 h-5" />
        <span>{t('nav.progress')}</span>
      </Button>
      <Button 
        variant={activePage === 'profile' ? "default" : "ghost"} 
        className="w-full justify-start gap-3 h-12"
        onClick={() => navigate('/profile')}
      >
        <User className="w-5 h-5" />
        <span>{t('nav.profile')}</span>
      </Button>
      
      {/* Admin Panel - Only show for admins */}
      {isAdmin(user) ? (
        <Button 
          variant={activePage === 'admin' ? "default" : "ghost"} 
          className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => navigate('/admin')}
        >
          <Shield className="w-5 h-5" />
          <span>{t('nav.admin')}</span>
        </Button>
      ) : null}
    </nav>
  );

  const renderDesktopSidebar = () => (
    <aside className="fixed left-0 top-0 h-full w-64 surface-dark border-r border-border z-40">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="PilotPrepFlightX" className="w-12 h-12" />
          <div>
            <h1 className="font-bold text-lg">PilotPrepFlightX</h1>
            <p className="text-xs text-muted-foreground">Aprendizaje</p>
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
        {renderNavigationItems()}

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-12"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </Button>
        </div>
      </div>
    </aside>
  );

  const renderMobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full bg-background">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <img src={logo} alt="PilotPrepFlightX" className="w-10 h-10" />
              <div>
                <h2 className="font-bold">PilotPrepFlightX</h2>
                <p className="text-xs text-muted-foreground">Aprendizaje</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {/* User Profile */}
            <div className="flex items-center gap-3 mb-6 p-3 surface-mid rounded-lg">
              <UserAvatar 
                avatarUrl={profile?.avatar_url} 
                displayName={displayName}
                size="sm"
              />
              <div>
                <h2 className="font-medium text-sm">{displayName}</h2>
                <p className="text-xs text-muted-foreground">Nivel {currentLevel}</p>
              </div>
            </div>
            
            {renderNavigationItems()}
          </div>
          <div className="p-4 border-t">
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

  return (
    <>
      {isMobile ? renderMobileSidebar() : renderDesktopSidebar()}
    </>
  );
};