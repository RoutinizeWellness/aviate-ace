import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@/hooks/useConvexAuth';
import { validateQuestion, sanitizeText } from '@/utils/validation';
import { Lightbulb, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QuestionSuggestionFormProps {
  onSuccess?: () => void;
}

export const QuestionSuggestionForm = ({ onSuccess }: QuestionSuggestionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const submitSuggestion = useMutation(api.questionSuggestions.submitQuestionSuggestion);

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    aircraftType: 'A320_FAMILY',
    category: 'aircraft-general',
    difficulty: 'intermediate'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const aircraftTypes = [
    { value: 'A320_FAMILY', label: 'Airbus A320 Family' },
    { value: 'BOEING_737', label: 'Boeing 737' },
  ];

  const categories = {
    A320_FAMILY: [
      { value: 'aircraft-general', label: 'Aircraft General' },
      { value: 'air-bleed-cond-press-vent', label: 'Air Bleed/Cond/Press/Vent' },
      { value: 'autoflight', label: 'Autoflight' },
      { value: 'apu', label: 'APU' },
      { value: 'engines', label: 'Engines' },
      { value: 'flight-controls', label: 'Flight Controls' },
      { value: 'fuel', label: 'Fuel' },
      { value: 'hydraulics', label: 'Hydraulics' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'landing-gear', label: 'Landing Gear' },
      { value: 'navigation', label: 'Navigation' },
      { value: 'emergency-procedures', label: 'Emergency Procedures' },
    ],
    BOEING_737: [
      { value: 'airplane-general', label: 'Airplane General' },
      { value: 'air-systems', label: 'Air Systems' },
      { value: 'anti-ice-rain', label: 'Anti-Ice and Rain' },
      { value: 'automatic-flight', label: 'Automatic Flight' },
      { value: 'communication', label: 'Communication' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'engines-apu', label: 'Engines and APU' },
      { value: 'fire-protection', label: 'Fire Protection' },
      { value: 'flight-controls', label: 'Flight Controls' },
      { value: 'fuel', label: 'Fuel' },
      { value: 'hydraulics', label: 'Hydraulics' },
      { value: 'landing-gear', label: 'Landing Gear' },
    ]
  };

  const difficulties = [
    { value: 'beginner', label: 'Básico' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
  ];

  const validateForm = () => {
    const validation = validateQuestion({
      question: formData.question,
      options: formData.options,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      aircraftType: formData.aircraftType,
      category: formData.category,
      difficulty: formData.difficulty,
    });

    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      
      validation.errors.forEach(error => {
        if (error.includes('Question text')) {
          newErrors.question = error;
        } else if (error.includes('Explanation')) {
          newErrors.explanation = error;
        } else if (error.includes('Option')) {
          const optionMatch = error.match(/Option (\d+)/);
          if (optionMatch) {
            const optionIndex = parseInt(optionMatch[1]) - 1;
            newErrors[`option${optionIndex}`] = error;
          }
        } else if (error.includes('Correct answer')) {
          newErrors.correctAnswer = error;
        } else {
          newErrors.general = error;
        }
      });
      
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para enviar sugerencias",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize input data before submission
      const sanitizedData = {
        userId: user._id,
        question: sanitizeText(formData.question),
        options: formData.options.map(option => sanitizeText(option)),
        correctAnswer: formData.correctAnswer,
        explanation: sanitizeText(formData.explanation),
        aircraftType: formData.aircraftType,
        category: formData.category,
        difficulty: formData.difficulty,
      };

      await submitSuggestion(sanitizedData);

      toast({
        title: "¡Sugerencia enviada!",
        description: "Tu pregunta ha sido enviada para revisión. Te notificaremos cuando sea aprobada.",
      });

      // Reset form
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        aircraftType: 'A320_FAMILY',
        category: 'aircraft-general',
        difficulty: 'intermediate'
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la sugerencia",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
    
    // Clear error for this option
    if (errors[`option${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`option${index}`];
        return newErrors;
      });
    }
  };

  const currentCategories = categories[formData.aircraftType as keyof typeof categories] || [];

  return (
    <Card className="surface-mid border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Sugerir Nueva Pregunta
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ayuda a mejorar la plataforma sugiriendo nuevas preguntas de examen. 
          Todas las sugerencias serán revisadas por nuestro equipo antes de ser incluidas.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Aircraft Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="aircraftType">Tipo de Aeronave</Label>
              <Select 
                value={formData.aircraftType} 
                onValueChange={(value) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    aircraftType: value,
                    category: categories[value as keyof typeof categories]?.[0]?.value || 'aircraft-general'
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aircraftTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <Label htmlFor="difficulty">Dificultad</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question */}
          <div>
            <Label htmlFor="question">Pregunta *</Label>
            <Textarea
              id="question"
              placeholder="Escribe tu pregunta aquí..."
              value={formData.question}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, question: e.target.value }));
                if (errors.question) {
                  setErrors(prev => ({ ...prev, question: '' }));
                }
              }}
              className={errors.question ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.question && (
              <p className="text-sm text-red-500 mt-1">{errors.question}</p>
            )}
          </div>

          {/* Options */}
          <div>
            <Label>Opciones de Respuesta *</Label>
            <div className="space-y-3 mt-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={formData.correctAnswer === index}
                      onChange={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                      className="text-primary"
                    />
                    <span className="text-sm font-medium">{String.fromCharCode(65 + index)}.</span>
                  </div>
                  <Input
                    placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className={errors[`option${index}`] ? 'border-red-500' : ''}
                  />
                  {errors[`option${index}`] && (
                    <p className="text-sm text-red-500">{errors[`option${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Selecciona la opción correcta marcando el círculo correspondiente
            </p>
          </div>

          {/* Explanation */}
          <div>
            <Label htmlFor="explanation">Explicación *</Label>
            <Textarea
              id="explanation"
              placeholder="Explica por qué la respuesta seleccionada es correcta..."
              value={formData.explanation}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, explanation: e.target.value }));
                if (errors.explanation) {
                  setErrors(prev => ({ ...prev, explanation: '' }));
                }
              }}
              className={errors.explanation ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.explanation && (
              <p className="text-sm text-red-500 mt-1">{errors.explanation}</p>
            )}
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tu sugerencia será revisada por nuestro equipo de expertos antes de ser incluida en los exámenes. 
              Esto puede tomar entre 1-3 días hábiles.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Sugerencia
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};