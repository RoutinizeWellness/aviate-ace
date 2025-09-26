import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = (checked: boolean) => {
    setLanguage(checked ? 'en' : 'es');
  };

  return (
    <div className="flex items-center gap-3">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <Label htmlFor="language-toggle" className="text-sm font-medium text-muted-foreground">
          ES
        </Label>
        <Switch
          id="language-toggle"
          checked={language === 'en'}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="language-toggle" className="text-sm font-medium text-muted-foreground">
          EN
        </Label>
      </div>
    </div>
  );
};