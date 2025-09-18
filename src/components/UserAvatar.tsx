import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface UserAvatarProps {
  avatarUrl?: string | null;
  displayName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeVariants = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
};

const iconSizeVariants = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(({ 
  avatarUrl, 
  displayName, 
  size = 'md', 
  className 
}, ref) => {
  const fallbackText = displayName 
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <Avatar ref={ref} className={cn(sizeVariants[size], className)}>
      {avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={displayName || 'Avatar del usuario'} 
          className="object-cover"
        />
      ) : null}
      <AvatarFallback className="bg-primary/20 text-primary font-medium">
        {avatarUrl ? (
          fallbackText
        ) : (
          <User className={iconSizeVariants[size]} />
        )}
      </AvatarFallback>
    </Avatar>
  );
});

UserAvatar.displayName = "UserAvatar";