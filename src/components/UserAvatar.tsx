import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface UserAvatarProps {
  avatarUrl?: string;
  displayName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  avatarUrl,
  displayName,
  size = 'md',
  className = ''
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Get initial from display name or default to 'U'
  const getInitial = () => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      <AvatarImage src={avatarUrl} alt={displayName || 'User avatar'} />
      <AvatarFallback className="bg-primary/10 text-primary">
        {getInitial()}
        {!displayName && <User className="w-4 h-4" />}
      </AvatarFallback>
    </Avatar>
  );
};

export { UserAvatar };
export default UserAvatar;