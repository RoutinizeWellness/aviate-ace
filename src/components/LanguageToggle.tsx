import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isChanging, setIsChanging] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsChanging(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      setLanguage(checked ? 'en' : 'es');
      setTimeout(() => setIsChanging(false), 150);
    }, 100);
  };

  return (
    <div className={cn(
      "flex items-center gap-3 transition-opacity duration-200",
      isChanging && "opacity-70"
    )}>
      <Globe className={cn(
        "w-4 h-4 text-muted-foreground transition-all duration-200",
        isChanging && "scale-110 text-primary"
      )} />
      <div className="flex items-center gap-2">
        <Label 
          htmlFor="language-toggle" 
          className={cn(
            "text-sm font-medium transition-all duration-200",
            language === 'es' ? "text-primary" : "text-muted-foreground"
          )}
        >
          ES
        </Label>
        <Switch
          id="language-toggle"
          checked={language === 'en'}
          onCheckedChange={handleToggle}
          disabled={isChanging}
          className={cn(
            "data-[state=checked]:bg-primary transition-all duration-300",
            isChanging && "scale-105"
          )}
        />
        <Label 
          htmlFor="language-toggle" 
          className={cn(
            "text-sm font-medium transition-all duration-200",
            language === 'en' ? "text-primary" : "text-muted-foreground"
          )}
        >
          EN
        </Label>
      </div>
    </div>
  );
};