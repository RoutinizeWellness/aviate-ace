import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Target,
  BookOpen,
  Users,
  Trophy
} from "lucide-react";

interface SubscriptionCTAProps {
  trialScore?: number;
  totalTrialQuestions?: number;
  category?: string;
  aircraftType?: 'A320' | 'BOEING_737';
  onSubscribe?: () => void;
  onContinueTrial?: () => void;
}

export const SubscriptionCTA: React.FC<SubscriptionCTAProps> = ({
  trialScore = 0,
  totalTrialQuestions = 5,
  category = '',
  aircraftType = 'A320',
  onSubscribe,
  onContinueTrial
}) => {
  const percentage = Math.round((trialScore / totalTrialQuestions) * 100);
  
  const plans = [
    {
      name: 'A320 Family',
      price: '$29.99',
      period: '/mes',
      aircraftType: 'A320' as const,
      description: 'Acceso completo a todo el contenido del Airbus A320',
      features: [
        '200+ preguntas por categoría',
        '16 categorías oficiales EASA',
        'Simulaciones de examen',
        'Explicaciones detalladas',
        'Progreso personalizado',
        'Certificados de completado'
      ],
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Boeing 737',
      price: '$29.99',
      period: '/mes',
      aircraftType: 'BOEING_737' as const,
      description: 'Acceso completo a todo el contenido del Boeing 737',
      features: [
        '200+ preguntas por categoría',
        '14 categorías principales',
        'Simulaciones de examen',
        'Explicaciones detalladas',
        'Progreso personalizado',
        'Certificados de completado'
      ],
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Premium All Access',
      price: '$49.99',
      period: '/mes',
      aircraftType: 'ALL' as const,
      description: 'Acceso ilimitado a todo el contenido disponible',
      features: [
        'Acceso a A320 + Boeing 737',
        '400+ preguntas por categoría',
        'Todas las categorías',
        'Simulaciones avanzadas',
        'Análisis de rendimiento',
        'Soporte prioritario',
        'Contenido futuro incluido'
      ],
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      popular: true
    }
  ];

  const handleSubscribeClick = (planType: string) => {
    // Here you would integrate with your payment system
    console.log(`Subscribing to ${planType} plan`);
    if (onSubscribe) {
      onSubscribe();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Trial Results Header */}
      <Card className="mb-8 border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-yellow-800">
              ¡Prueba Completada!
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-yellow-600">{trialScore}/{totalTrialQuestions}</div>
              <div className="text-sm text-gray-600">Respuestas Correctas</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-yellow-600">{percentage}%</div>
              <div className="text-sm text-gray-600">Puntuación</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-yellow-600">{category}</div>
              <div className="text-sm text-gray-600">{aircraftType}</div>
            </div>
          </div>
          
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <p className="text-yellow-800 font-medium mb-2">
              🎯 Has completado tu prueba gratuita de {category}
            </p>
            <p className="text-yellow-700 text-sm">
              Para acceder a las {aircraftType === 'A320' ? '195' : '195'} preguntas restantes y todas las funciones premium, 
              necesitas una suscripción.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          🚀 Desbloquea Todo tu Potencial
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Accede a más de 3,200 preguntas y domina tu Type Rating
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>Más de 10,000 pilotos confían en nosotros</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name}
            className={`relative ${plan.popular ? 'border-2 border-purple-500 shadow-lg scale-105' : 'border border-gray-200'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className={plan.popular ? 'bg-purple-50' : ''}>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${plan.bgColor} mb-4`}>
                  <Crown className={`w-6 h-6 ${plan.textColor}`} />
                </div>
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="text-3xl font-bold mb-1">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${plan.popular ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                size="lg"
                onClick={() => handleSubscribeClick(plan.aircraftType)}
              >
                {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                Suscribirse Ahora
              </Button>
              
              {plan.popular && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  💳 Garantía de devolución de 30 días
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Benefits */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-center mb-6">
            ¿Por qué elegir PilotPrepFlightX?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <h4 className="font-semibold mb-2">Contenido Oficial</h4>
              <p className="text-sm text-gray-600">
                Basado en manuales oficiales EASA y FAA
              </p>
            </div>
            <div>
              <Target className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h4 className="font-semibold mb-2">Exámenes Reales</h4>
              <p className="text-sm text-gray-600">
                Simulaciones exactas de exámenes oficiales
              </p>
            </div>
            <div>
              <Zap className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <h4 className="font-semibold mb-2">Progreso Rápido</h4>
              <p className="text-sm text-gray-600">
                Metodología probada para aprobar a la primera
              </p>
            </div>
            <div>
              <Users className="w-12 h-12 mx-auto mb-3 text-purple-500" />
              <h4 className="font-semibold mb-2">Comunidad</h4>
              <p className="text-sm text-gray-600">
                Únete a miles de pilotos exitosos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="bg-purple-500 hover:bg-purple-600 text-white px-8"
          onClick={() => handleSubscribeClick('PREMIUM')}
        >
          <Crown className="w-5 h-5 mr-2" />
          Comenzar Suscripción Premium
        </Button>
        
        {onContinueTrial && (
          <Button 
            variant="outline" 
            size="lg"
            onClick={onContinueTrial}
          >
            Probar Otra Categoría Gratis
          </Button>
        )}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          ✅ Sin compromisos • ✅ Cancela en cualquier momento • ✅ Soporte 24/7
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCTA;