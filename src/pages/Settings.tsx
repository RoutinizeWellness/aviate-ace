import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { 
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Settings as SettingsIcon
} from 'lucide-react';
import { UnifiedSidebar } from '@/components/UnifiedSidebar'; // Added import for UnifiedSidebar

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  
  const [settings, setSettings] = useState({
    // Profile settings
    fullName: user?.fullName || '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    
    // Notification settings
    emailNotifications: true,
    practiceReminders: true,
    achievementNotifications: true,
    weeklyProgress: false,
    
    // Privacy settings
    profileVisibility: true,
    shareProgress: false,
    analyticsTracking: true,
    
    // Appearance settings
    theme: 'system',
    language: 'es',
    compactMode: false,
    
    // Study settings
    autoAdvance: true,
    showHints: true,
    immediateResults: false,
    difficultyAdaptation: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwitchChange = (field: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update profile data
      await updateProfile({
        fullName: settings.fullName,
        displayName: settings.displayName,
      });
      
      // Save other settings to localStorage for now
      localStorage.setItem(`user_settings_${user?._id}`, JSON.stringify(settings));
      
      // Show success message (you could add a toast here)
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Unified Sidebar */}
      <UnifiedSidebar activePage="settings" />
      
      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="How others see your name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={settings.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Practice Reminders</p>
                    <p className="text-sm text-muted-foreground">Daily study reminders</p>
                  </div>
                  <Switch
                    checked={settings.practiceReminders}
                    onCheckedChange={(checked) => handleSwitchChange('practiceReminders', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Achievement Notifications</p>
                    <p className="text-sm text-muted-foreground">Celebrate your milestones</p>
                  </div>
                  <Switch
                    checked={settings.achievementNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('achievementNotifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Progress Report</p>
                    <p className="text-sm text-muted-foreground">Summary of your weekly performance</p>
                  </div>
                  <Switch
                    checked={settings.weeklyProgress}
                    onCheckedChange={(checked) => handleSwitchChange('weeklyProgress', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Study Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Study Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-advance Questions</p>
                    <p className="text-sm text-muted-foreground">Automatically move to next question</p>
                  </div>
                  <Switch
                    checked={settings.autoAdvance}
                    onCheckedChange={(checked) => handleSwitchChange('autoAdvance', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Hints</p>
                    <p className="text-sm text-muted-foreground">Display helpful hints during practice</p>
                  </div>
                  <Switch
                    checked={settings.showHints}
                    onCheckedChange={(checked) => handleSwitchChange('showHints', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Immediate Results</p>
                    <p className="text-sm text-muted-foreground">Show results immediately after answering</p>
                  </div>
                  <Switch
                    checked={settings.immediateResults}
                    onCheckedChange={(checked) => handleSwitchChange('immediateResults', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Difficulty Adaptation</p>
                    <p className="text-sm text-muted-foreground">Adjust question difficulty based on performance</p>
                  </div>
                  <Switch
                    checked={settings.difficultyAdaptation}
                    onCheckedChange={(checked) => handleSwitchChange('difficultyAdaptation', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Profile Visibility</p>
                    <p className="text-xs text-muted-foreground">Show your profile to others</p>
                  </div>
                  <Switch
                    checked={settings.profileVisibility}
                    onCheckedChange={(checked) => handleSwitchChange('profileVisibility', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Share Progress</p>
                    <p className="text-xs text-muted-foreground">Allow others to see your progress</p>
                  </div>
                  <Switch
                    checked={settings.shareProgress}
                    onCheckedChange={(checked) => handleSwitchChange('shareProgress', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Analytics Tracking</p>
                    <p className="text-xs text-muted-foreground">Help improve the platform</p>
                  </div>
                  <Switch
                    checked={settings.analyticsTracking}
                    onCheckedChange={(checked) => handleSwitchChange('analyticsTracking', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={settings.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={settings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Compact Mode</p>
                    <p className="text-xs text-muted-foreground">Use less space</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSwitchChange('compactMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;