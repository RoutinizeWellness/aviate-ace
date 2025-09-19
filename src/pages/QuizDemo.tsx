import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TypeRatingQuiz } from '@/components/TypeRatingQuiz';
import { 
  ArrowLeft,
  BookOpen,
  Target,
  Plane,
  Gift
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuizDemo = () => {
  const navigate = useNavigate();
  const [selectedAircraft, setSelectedAircraft] = useState<'A320' | 'BOEING_737' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const aircraftTypes = [
    {
      type: 'A320' as const,
      name: 'Airbus A320',
      description: 'Prueba gratuita del sistema A320',
      color: 'bg-blue-500',
      categories: ['Engines', 'Flight Controls', 'Hydraulics', 'Electrical']
    },
    {
      type: 'BOEING_737' as const,
      name: 'Boeing 737',
      description: 'Prueba gratuita del sistema Boeing 737',
      color: 'bg-green-500',
      categories: ['Engines', 'Flight Controls', 'Hydraulics', 'Electrical']
    }
  ];

  const handleStartQuiz = (aircraft: 'A320' | 'BOEING_737', category: string) => {
    setSelectedAircraft(aircraft);
    setSelectedCategory(category);
    setShowQuiz(true);
  };

  const handleBackToSelection = () => {
    setShowQuiz(false);
    setSelectedAircraft(null);
    setSelectedCategory(null);
  };

  if (showQuiz && selectedAircraft && selectedCategory) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToSelection}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Selección
            </Button>
          </div>
          
          <TypeRatingQuiz
            aircraftType={selectedAircraft}
            category={selectedCategory}
            questionCount={5}
            onComplete={(score, total) => {
              console.log(`Quiz completed: ${score}/${total}`);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            🎯 Sistema de Pruebas Gratuitas
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Prueba nuestro contenido antes de suscribirte
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <Gift className="w-4 h-4" />
            <span>5 preguntas gratuitas por categoría</span>
          </div>
        </div>

        {/* Aircraft Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {aircraftTypes.map((aircraft) => (
            <Card key={aircraft.type} className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${aircraft.color} rounded-lg flex items-center justify-center`}>
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{aircraft.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{aircraft.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">
                      Categorías de Prueba Disponibles
                    </span>
                  </div>
                  
                  {aircraft.categories.map((category) => (
                    <div 
                      key={category}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium">{category}</div>
                          <div className="text-xs text-muted-foreground">
                            5 preguntas de muestra • Gratis
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleStartQuiz(aircraft.type, category)}
                        className="flex items-center gap-2"
                      >
                        <Gift className="w-3 h-3" />
                        Probar Gratis
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    💡 <strong>Después de la prueba:</strong> Verás cuántas preguntas adicionales 
                    están disponibles con una suscripción (200+ por categoría).
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-center mb-6">
              📚 Lo que incluye el sistema completo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Preguntas por categoría</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">16</div>
                <div className="text-sm text-muted-foreground">Categorías oficiales</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3,200+</div>
                <div className="text-sm text-muted-foreground">Preguntas totales</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Tasa de aprobación</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            ¿Listo para desbloquear todo el contenido?
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Ver Planes de Suscripción
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizDemo;