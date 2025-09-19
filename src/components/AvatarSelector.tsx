import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Smile, Plane, Award, Star, Heart } from 'lucide-react';

const avatarOptions = [
  { id: 'default', name: 'Default', icon: User },
  { id: 'pilot', name: 'Pilot', icon: Plane },
  { id: 'smile', name: 'Smile', icon: Smile },
  { id: 'award', name: 'Award', icon: Award },
  { id: 'star', name: 'Star', icon: Star },
  { id: 'heart', name: 'Heart', icon: Heart },
];

const colorOptions = [
  { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
  { id: 'green', name: 'Green', class: 'bg-green-500' },
  { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
  { id: 'red', name: 'Red', class: 'bg-red-500' },
  { id: 'yellow', name: 'Yellow', class: 'bg-yellow-500' },
  { id: 'indigo', name: 'Indigo', class: 'bg-indigo-500' },
];

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarSelect?: (avatarUrl: string) => void;
  children?: React.ReactNode;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  currentAvatar = 'default',
  onAvatarSelect,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [selectedColor, setSelectedColor] = useState('blue');

  const handleSave = () => {
    // Create a simple avatar URL based on selection
    const avatarUrl = `${selectedAvatar}-${selectedColor}`;
    if (onAvatarSelect) {
      onAvatarSelect(avatarUrl);
    }
    setIsOpen(false);
  };

  const SelectedIcon = avatarOptions.find(opt => opt.id === selectedAvatar)?.icon || User;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Change Avatar</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Avatar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Preview */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className={`${colorOptions.find(c => c.id === selectedColor)?.class || 'bg-blue-500'} text-white`}>
                <SelectedIcon className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">Avatar Preview</p>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Avatar Style</label>
            <div className="grid grid-cols-3 gap-2">
              {avatarOptions.map((avatar) => {
                const IconComponent = avatar.icon;
                return (
                  <Button
                    key={avatar.id}
                    variant={selectedAvatar === avatar.id ? "default" : "outline"}
                    className="h-16 flex flex-col gap-1"
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs">{avatar.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Avatar Color</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector;