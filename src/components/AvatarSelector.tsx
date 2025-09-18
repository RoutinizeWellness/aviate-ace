import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Check } from "lucide-react";

// Predefined avatar options
const AVATAR_OPTIONS = [
  { id: 'pilot-1', url: '/avatars/pilot-1.svg', name: 'Piloto Clásico' },
  { id: 'pilot-2', url: '/avatars/pilot-2.svg', name: 'Piloto Moderno' },
  { id: 'pilot-3', url: '/avatars/pilot-3.svg', name: 'Comandante' },
  { id: 'pilot-4', url: '/avatars/pilot-4.svg', name: 'Copiloto' },
  { id: 'pilot-5', url: '/avatars/pilot-5.svg', name: 'Instructor' },
  { id: 'pilot-6', url: '/avatars/pilot-6.svg', name: 'Cadete' },
  { id: 'aviator-1', url: '/avatars/aviator-1.svg', name: 'Aviador Vintage' },
  { id: 'aviator-2', url: '/avatars/aviator-2.svg', name: 'Aviador Elite' },
  { id: 'default', url: '', name: 'Avatar por defecto' },
];

interface AvatarSelectorProps {
  currentAvatar?: string | null;
  onAvatarSelect: (avatarUrl: string) => void;
  children: React.ReactNode;
}

export const AvatarSelector = ({ currentAvatar, onAvatarSelect, children }: AvatarSelectorProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    onAvatarSelect(avatarUrl);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 p-4">
          {AVATAR_OPTIONS.map((avatar) => (
            <div
              key={avatar.id}
              className={`relative cursor-pointer rounded-lg border-2 p-2 hover:border-primary transition-colors ${
                selectedAvatar === avatar.url ? 'border-primary bg-primary/10' : 'border-border'
              }`}
              onClick={() => handleAvatarSelect(avatar.url)}
            >
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-16 w-16">
                  {avatar.url ? (
                    <AvatarImage src={avatar.url} alt={avatar.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-xs text-center font-medium">{avatar.name}</span>
              </div>
              {selectedAvatar === avatar.url && (
                <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};