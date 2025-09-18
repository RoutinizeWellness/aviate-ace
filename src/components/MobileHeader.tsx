import { UserAvatar } from "@/components/UserAvatar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/hooks/useConvexAuth";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  currentPage?: string;
}

export const MobileHeader = ({ title, subtitle, currentPage }: MobileHeaderProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const displayName = profile?.display_name || 
                     user?.fullName || 
                     user?.email?.split('@')[0] || 
                     'Usuario';

  return (
    <div className="flex items-center justify-between mb-6 bg-background/95 backdrop-blur sticky top-0 z-30 py-4 border-b">
      <div className="flex items-center gap-3">
        <MobileNavigation currentPage={currentPage} pageTitle={title} />
        <div>
          <h1 className="font-bold text-lg">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <UserAvatar 
        avatarUrl={profile?.avatar_url} 
        displayName={displayName}
        size="sm"
      />
    </div>
  );
};

export default MobileHeader;