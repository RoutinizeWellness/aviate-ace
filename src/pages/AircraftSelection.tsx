import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  Clock, 
  BookOpen, 
  Target, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Star
} from 'lucide-react';
import { FreeTrialManager } from '@/services/FreeTrialManager';

const AircraftSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedAircraft, setSelectedAircraft] = useState<'A320' | 'B737' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already selected an aircraft
  const hasSelectedAircraft = FreeTrialManager.hasSelectedAircraft(user?._id);
  const existingAircraft = FreeTrialManager.getSelectedAircraft(user?._id);

  // If already selected, redirect to appropriate page
  React.useEffect(() => {
    if (hasSelectedAircraft && existingAircraft) {
      const trialState = FreeTrialManager.getFreeTrialState(user?._id);
      if (trialState.completedExam) {
        navigate('/subscription-management');
      } else {
        navigate(`/exam?mode=practice&trial=true&aircraft=${existingAircraft}`);
      }
    }
  }, [hasSelectedAircraft, existingAircraft, navigate, user?._id]);

  const handleAircraftSelect = (aircraft: 'A320' | 'B737') => {
    setSelectedAircraft(aircraft);
  };

  const handleStartExam = async () => {
    if (!selectedAircraft) return;

    setIsLoading(true);
    try {
      const success = FreeTrialManager.selectAircraft(selectedAircraft, user?._id);
      
      if (success) {
        toast({
          title: t('aircraftSelection.excellent'),
          description: t('aircraftSelection.examStarting').replace('{aircraft}', selectedAircraft),
          duration: 3000,
        });
        
        // Navigate to exam with selected aircraft
        navigate(`/exam?mode=practice&trial=true&aircraft=${selectedAircraft}`);
      } else {
        toast({
          title: t('common.error'),
          description: t('aircraftSelection.error'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      toast({
        title: t('common.error'),
        description: t('aircraftSelection.problemError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const aircraftData = {
    A320: {
      name: t('aircraftSelection.a320.name'),
      description: t('aircraftSelection.a320.description'),
      features: [
        t('aircraftSelection.a320.feature1'),
        t('aircraftSelection.a320.feature2'),
        t('aircraftSelection.a320.feature3'),
        t('aircraftSelection.a320.feature4')
      ],
      subjects: [
        t('aircraftSelection.subjects.electrical'),
        t('aircraftSelection.subjects.hydraulic'),
        t('aircraftSelection.subjects.performance'),
        t('aircraftSelection.subjects.systems'),
        t('aircraftSelection.subjects.procedures')
      ],
      color: 'blue'
    },
    B737: {
      name: t('aircraftSelection.b737.name'),
      description: t('aircraftSelection.b737.description'),
      features: [
        t('aircraftSelection.b737.feature1'),
        t('aircraftSelection.b737.feature2'),
        t('aircraftSelection.b737.feature3'),
        t('aircraftSelection.b737.feature4')
      ],
      subjects: [
        t('aircraftSelection.subjects.electrical'),
        t('aircraftSelection.subjects.hydraulic'),
        t('aircraftSelection.subjects.performance'),
        t('aircraftSelection.subjects.systems'),
        t('aircraftSelection.subjects.procedures')
      ],
      color: 'emerald'
    }
  };

  if (hasSelectedAircraft) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">{t('aircraftSelection.redirecting')}</h2>
          <p className="text-muted-foreground">{t('aircraftSelection.preparingExam').replace('{aircraft}', existingAircraft || '')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('aircraftSelection.backToHome')}
              </Button>
              
              <div className="flex items-center gap-3">
                <Plane className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="font-bold">{t('aircraftSelection.title')}</h1>
                  <p className="text-xs text-muted-foreground">{t('aircraftSelection.freeTrial')}</p>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Star className="w-3 h-3 mr-1" />
              {t('aircraftSelection.free')}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t('aircraftSelection.pageTitle')}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {t('aircraftSelection.subtitle')}
          </p>
          <p className="text-sm text-amber-600 font-medium">
            {t('aircraftSelection.warning')}
          </p>
        </div>

        {/* Aircraft Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {Object.entries(aircraftData).map(([key, aircraft]) => (
            <Card 
              key={key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedAircraft === key 
                  ? `border-${aircraft.color}-500 bg-${aircraft.color}-50 ring-2 ring-${aircraft.color}-200` 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleAircraftSelect(key as 'A320' | 'B737')}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      aircraft.color === 'blue' ? 'bg-blue-100' : 'bg-emerald-100'
                    }`}>
                      <Plane className={`w-6 h-6 ${
                        aircraft.color === 'blue' ? 'text-blue-600' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{aircraft.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{aircraft.description}</p>
                    </div>
                  </div>
                  
                  {selectedAircraft === key && (
                    <CheckCircle2 className={`w-6 h-6 ${
                      aircraft.color === 'blue' ? 'text-blue-600' : 'text-emerald-600'
                    }`} />
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Exam Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span>{t('aircraftSelection.examDetails.questions')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-warning" />
                      <span>{t('aircraftSelection.examDetails.timeLimit')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-success" />
                      <span>{t('aircraftSelection.examDetails.subjects')}</span>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">{t('aircraftSelection.subjectsTitle')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {aircraft.subjects.map((subject, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">{t('aircraftSelection.featuresTitle')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {aircraft.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          {selectedAircraft ? (
            <div className="space-y-4">
              <p className="text-lg font-medium">
                {t('aircraftSelection.selectedText')} <span className="text-primary">{aircraftData[selectedAircraft].name}</span>
              </p>
              <Button 
                onClick={handleStartExam}
                disabled={isLoading}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  t('aircraftSelection.startingExam')
                ) : (
                  <>
                    {t('aircraftSelection.startExam')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('aircraftSelection.permanentNote')}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t('aircraftSelection.selectPrompt')}
            </p>
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">{t('aircraftSelection.whyOnlyOne.title')}</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {t('aircraftSelection.whyOnlyOne.text')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AircraftSelection;