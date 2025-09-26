import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Crown, 
  ArrowRight, 
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFreeTrial } from '@/contexts/FreeTrialContext';
import { useNavigate } from 'react-router-dom';

interface FreeTrialNotificationProps {
  showInline?: boolean;
  onClose?: () => void;
}

export const FreeTrialNotification: React.FC<FreeTrialNotificationProps> = ({ 
  showInline = false, 
  onClose 
}) => {
  const { t } = useLanguage();
  const { remainingQuestions, totalFreeQuestions, isTrialExpired } = useFreeTrial();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/subscription-management');
  };

  const questionsUsed = totalFreeQuestions - remainingQuestions;
  const progressPercentage = (questionsUsed / totalFreeQuestions) * 100;

  if (isTrialExpired) {
    return (
      <Card className="border-orange-200 bg-orange-50 mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-orange-800">
                {t('freeTrial.expired')}
              </CardTitle>
              <p className="text-sm text-orange-600">
                {t('freeTrial.expiredMessage')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <Crown className="w-4 h-4" />
              <AlertDescription className="text-orange-800">
                {t('freeTrial.subscribeMessage')}
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleSubscribe}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              {t('freeTrial.viewPlans')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {onClose && (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                {t('common.close')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show progress for remaining questions
  return (
    <Card className="border-blue-200 bg-blue-50 mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-800">
                {t('freeTrial.title')}
              </CardTitle>
              <p className="text-sm text-blue-600">
                {t('freeTrial.subtitle')}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {t('common.free')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700 font-medium">
                {t('freeTrial.questionsRemaining')}
              </span>
              <span className="text-blue-600">
                {remainingQuestions} {t('freeTrial.of')} {totalFreeQuestions}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-blue-100"
            />
          </div>

          {/* Warning when getting low */}
          {remainingQuestions <= 2 && remainingQuestions > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <Clock className="w-4 h-4" />
              <AlertDescription className="text-amber-800">
                {remainingQuestions === 1 
                  ? t('freeTrial.lastQuestion')
                  : t('freeTrial.fewQuestionsLeft').replace('{count}', remainingQuestions.toString())
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Features preview */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {t('freeTrial.unlockFeatures')}
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• {t('freeTrial.feature1')}</li>
              <li>• {t('freeTrial.feature2')}</li>
              <li>• {t('freeTrial.feature3')}</li>
              <li>• {t('freeTrial.feature4')}</li>
            </ul>
          </div>

          <Button 
            onClick={handleSubscribe}
            variant="outline"
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Crown className="w-4 h-4 mr-2" />
            {t('freeTrial.upgradeToPremium')}
          </Button>
          
          {onClose && (
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full text-blue-600 hover:bg-blue-50"
              size="sm"
            >
              {t('freeTrial.continueWithTrial')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};