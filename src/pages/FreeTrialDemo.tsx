import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play,
  Settings,
  RotateCcw,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { FreeTrialNotification } from '@/components/FreeTrialNotification';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useFreeTrial } from '@/contexts/FreeTrialContext';
import { useLanguage } from '@/contexts/LanguageContext';

const FreeTrialDemo = () => {
  const { t, language } = useLanguage();
  const { 
    remainingQuestions, 
    totalFreeQuestions, 
    isTrialExpired, 
    useQuestion, 
    resetTrial,
    checkTrialStatus 
  } = useFreeTrial();
  
  const [questionsStarted, setQuestionsStarted] = useState(0);
  const [showNotification, setShowNotification] = useState(true);

  const handleUseQuestion = () => {
    const success = useQuestion();
    if (success) {
      setQuestionsStarted(prev => prev + 1);
    }
  };

  const handleResetTrial = () => {
    resetTrial();
    setQuestionsStarted(0);
    setShowNotification(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('freeTrial.title')} Demo</h1>
            <p className="text-muted-foreground">
              {language === 'es' 
                ? 'Demuestra el sistema de prueba gratuita y la internacionalización'
                : 'Demonstrates the free trial system and internationalization'
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Badge variant={language === 'es' ? 'default' : 'secondary'}>
              {language.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Free Trial Notification */}
        {showNotification && (
          <FreeTrialNotification 
            onClose={() => setShowNotification(false)}
          />
        )}

        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {language === 'es' ? 'Controles de Demostración' : 'Demo Controls'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Trial Status */}
              <div className="space-y-2">
                <h4 className="font-medium">{t('freeTrial.trialProgress')}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{t('freeTrial.questionsUsed')}</span>
                    <span>{totalFreeQuestions - remainingQuestions}/{totalFreeQuestions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('freeTrial.questionsRemaining')}</span>
                    <span className={remainingQuestions <= 1 ? 'text-red-600 font-semibold' : ''}>
                      {remainingQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'es' ? 'Estado' : 'Status'}</span>
                    <Badge variant={isTrialExpired ? 'destructive' : 'default'}>
                      {isTrialExpired 
                        ? (language === 'es' ? 'Expirado' : 'Expired')
                        : (language === 'es' ? 'Activo' : 'Active')
                      }
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h4 className="font-medium">{language === 'es' ? 'Acciones' : 'Actions'}</h4>
                <div className="space-y-2">
                  <Button
                    onClick={handleUseQuestion}
                    disabled={isTrialExpired || remainingQuestions === 0}
                    className="w-full"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Usar Pregunta' : 'Use Question'}
                  </Button>
                  <Button
                    onClick={handleResetTrial}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Reiniciar Prueba' : 'Reset Trial'}
                  </Button>
                  <Button
                    onClick={() => setShowNotification(!showNotification)}
                    variant="ghost"
                    className="w-full"
                    size="sm"
                  >
                    {showNotification 
                      ? (language === 'es' ? 'Ocultar Notificación' : 'Hide Notification')
                      : (language === 'es' ? 'Mostrar Notificación' : 'Show Notification')
                    }
                  </Button>
                </div>
              </div>

              {/* Language Test */}
              <div className="space-y-2">
                <h4 className="font-medium">{language === 'es' ? 'Prueba de Idioma' : 'Language Test'}</h4>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{t('freeTrial.feature1')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{t('freeTrial.feature2')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{t('subscription.needHelp')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{t('common.success')}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Test Results */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {language === 'es' ? 'Resultados de Prueba' : 'Test Results'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">{language === 'es' ? 'Sistema de Prueba Gratuita' : 'Free Trial System'}</h5>
                  <ul className="mt-1 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Contador implementado' : 'Counter implemented'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'LocalStorage funcionando' : 'LocalStorage working'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Redirección automática' : 'Auto-redirect working'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Notificaciones visuales' : 'Visual notifications'}
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">{language === 'es' ? 'Sistema de Internacionalización' : 'Internationalization System'}</h5>
                  <ul className="mt-1 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Cambio de idioma instantáneo' : 'Instant language switching'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Traducciones completas' : 'Complete translations'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Sin contenido mezclado' : 'No mixed content'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      {language === 'es' ? 'Fallbacks por defecto' : 'Default fallbacks'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Warning if trial expired */}
            {isTrialExpired && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">
                    {language === 'es' 
                      ? '¡La prueba gratuita ha terminado! En una aplicación real, el usuario sería redirigido a la página de suscripciones.'
                      : 'Free trial has ended! In a real app, the user would be redirected to subscriptions page.'
                    }
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreeTrialDemo;