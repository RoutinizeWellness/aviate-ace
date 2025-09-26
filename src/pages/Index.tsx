import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { FreeTrialManager } from "@/services/FreeTrialManager";
import { toast } from "@/hooks/use-toast";
import { 
  Target, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Star,
  Users,
  Trophy,
  Zap,
  Shield,
  BookOpen,
  TrendingUp,
  Plane
} from "lucide-react";
import { PRICING_PLANS, getTranslatedPlans } from "@/config/pricing";
import heroCockpit from "@/assets/new-hero-cockpit.jpg";
import logo from "@/assets/logo.svg";

interface PricingPlan {
  name: string;
  price: string;
  featured: boolean;
  bestValue?: boolean;
  description?: string;
  features: string[];
  cta: string;
}

// Data arrays
const features = [
  {
    icon: Target,
    title: "Simulacros Reales",
    description: "Exámenes idénticos al formato oficial con tiempo limitado y condiciones reales de evaluación."
  },
  {
    icon: BarChart3,
    title: "Estadísticas Avanzadas",
    description: "Análisis detallado de tu rendimiento por categorías, identificando tus fortalezas y debilidades."
  },
  {
    icon: BookOpen,
    title: "Banco Exclusivo",
    description: "5,000+ preguntas actualizadas mensualmente, organizadas por sistemas A320 y B737."
  },
  {
    icon: Clock,
    title: "Práctica Cronometrada",
    description: "Entrenamientos con tiempo real para desarrollar velocidad y precisión bajo presión."
  },
  {
    icon: Shield,
    title: "Contenido Certificado",
    description: "Material validado por pilotos activos con experiencia en A320 y B737."
  },
  {
    icon: TrendingUp,
    title: "Progreso Inteligente",
    description: "Sistema adaptativo que ajusta la dificultad según tu nivel de conocimiento."
  }
];

const testimonials = [
  {
    quote: "I passed my A320 exam on the first try. The questions were identical to the real exam. Amazing platform.",
    name: "Carlos Mendoza",
    role: "Piloto A320 - Iberia"
  },
  {
    quote: "The statistics helped me focus on my weak points. In 3 weeks I was ready for the B737.",
    name: "Ana García",
    role: "Primera Oficial B737 - Ryanair"
  },
  {
    quote: "After failing with other methods, this platform gave me the confidence and knowledge I needed.",
    name: "Miguel Torres",
    role: "Piloto B737"
  }
];

const Index = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Handler for "Comenzar ahora" button
  const handleStartNow = async () => {
    try {
      await FreeTrialManager.handleStartNow(
        user?._id,
        navigate,
        (message: string, type: 'info' | 'warning') => {
          toast({
            title: type === 'warning' ? "Prueba Terminada" : "Prueba Gratuita",
            description: message,
            variant: type === 'warning' ? "destructive" : "default",
            duration: 4000,
          });
        }
      );
    } catch (error) {
      console.error('Error handling start now:', error);
      // Fallback to dashboard
      navigate('/dashboard');
    }
  };

  // Define pricing plans with translations
  const pricingPlans = [
    {
      name: t('plans.free.name'),
      price: "€0",
      featured: false,
      bestValue: false,
      description: t('plans.free.description'),
      features: [
        t('features.free.1'),
        t('features.free.2'), 
        t('features.free.3'),
        t('features.free.4')
      ],
      cta: t('pricing.startFree'),
      id: 'pilotprepflightx_gratuito'
    },
    ...getTranslatedPlans(PRICING_PLANS.filter(plan => plan.durationMonths > 0), t).map(plan => ({
      name: plan.name,
      price: `€${plan.price.toFixed(0)}`,
      featured: plan.popular || false,
      bestValue: plan.bestValue || false,
      description: plan.description,
      features: plan.features,
      cta: t('pricing.selectPlan'),
      id: plan.id
    }))
  ];

  const handlePlanSelect = (planData: { id?: string; name: string } | string) => {
    try {
      // Persist chosen plan id for subscription-management
      let planId: string;
      if (typeof planData === 'string') {
        planId = planData;
        const match = PRICING_PLANS.find(p => p.name.includes(planData) || planData === p.name);
        if (match) localStorage.setItem('selectedPlan', JSON.stringify(match.id));
      } else {
        planId = planData.id || planData.name;
        const match = PRICING_PLANS.find(p => p.id === planId || p.name.includes(planData.name));
        if (match) localStorage.setItem('selectedPlan', JSON.stringify(match.id));
      }
    } catch {}

    if (user) {
      window.location.href = '/subscription-management';
    } else {
      window.location.href = `/login?returnUrl=/subscription-management`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Header without navigation links */}
      <header role="banner" className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50 safe-top">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="PilotPrepFlightX" className="w-10 h-10" width={40} height={40} decoding="async" />
              <div>
                <h1 className="text-xl font-bold">PilotPrepFlightX</h1>
                <p className="text-xs text-muted-foreground">Professional Training</p>
              </div>
            </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="outline" size="sm">
              <a href="/login" className="no-underline">Iniciar Sesión</a>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary-dark">
              <a href="/dashboard" className="no-underline text-inherit">Prueba Gratis</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(13, 26, 19, 0.95) 0%, rgba(13, 26, 19, 0.7) 50%, rgba(13, 26, 19, 0.95) 100%), url(${heroCockpit})`
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-4 h-4 mr-2" />
            {t('home.platformBadge')}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            {t('home.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-6"
              onClick={handleStartNow}
            >
              <Target className="w-5 h-5 mr-2" />
              {t('home.cta')}
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={handleStartNow}>
              <BookOpen className="w-5 h-5 mr-2" />
              {t('home.demo')}
            </Button>
          </div>

          {/* Stats intentionally removed until verified data is available */}
        </div>
      </section>

      {/* Aircraft Selection */}
      <section className="py-12 surface-light border-t border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.aircraftSelection.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('home.aircraftSelection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="surface-mid border-border/50 hover-lift cursor-pointer" onClick={handleStartNow}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('home.aircraftSelection.a320.title')}</h3>
                <p className="text-muted-foreground mb-6">{t('home.aircraftSelection.a320.description')}</p>
                <Button className="w-full max-w-xs mx-auto">{t('home.aircraftSelection.a320.cta')}</Button>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50 hover-lift cursor-pointer" onClick={handleStartNow}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('home.aircraftSelection.b737.title')}</h3>
                <p className="text-muted-foreground mb-6">{t('home.aircraftSelection.b737.description')}</p>
                <Button variant="outline" className="w-full max-w-xs mx-auto">{t('home.aircraftSelection.b737.cta')}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Different from ChatGPT */}
      <section className="py-20 surface-mid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('home.comparison.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('home.comparison.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-error">{t('home.comparison.generic.title')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t('home.comparison.generic.feature1')}</li>
                    <li>• {t('home.comparison.generic.feature2')}</li>
                    <li>• {t('home.comparison.generic.feature3')}</li>
                    <li>• {t('home.comparison.generic.feature4')}</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-success">{t('home.comparison.platform.title')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t('home.comparison.platform.feature1')}</li>
                    <li>• {t('home.comparison.platform.feature2')}</li>
                    <li>• {t('home.comparison.platform.feature3')}</li>
                    <li>• {t('home.comparison.platform.feature4')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <Card className="surface-light border-border/50">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{t('home.comparison.certified.title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('home.comparison.certified.subtitle')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{t('home.comparison.analysis.title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('home.comparison.analysis.subtitle')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">{t('home.comparison.guarantee.title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('home.comparison.guarantee.subtitle')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 surface-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">Sobre nosotros</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ayudamos a pilotos a prepararse para sus type ratings con una plataforma moderna,
              práctica y enfocada en resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <Card className="surface-mid border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Misión</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Proveer una preparación efectiva y realista que acelere el camino al éxito en evaluaciones oficiales.
                  </p>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Visión</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser el estándar en preparación digital de pilotos para aeronaves Airbus y Boeing.
                  </p>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Valores</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Precisión, mejora continua y experiencia de aprendizaje centrada en el piloto.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="surface-mid border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-primary">Nuestra historia</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Nacimos de la necesidad de una preparación práctica y actualizada, inspirada por
                    experiencias reales en cabina y evaluaciones técnicas.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Con feedback de pilotos activos, construimos un sistema de estudio
                    enfocado en categorías clave, simulación de examen y análisis de
                    rendimiento.
                  </p>
                </CardContent>
              </Card>

              <Card className="surface-mid border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-primary">Qué nos diferencia</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Contenido específico por aeronave, práctica orientada a objetivos y una
                    experiencia pulida para maximizar tu tiempo de estudio.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        A320 - B737
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        Simulación real
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                        Análisis por categorías
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-info/10 text-info border-info/30">
                        Enfoque práctico
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Características que Garantizan tu{" "}
              <span className="text-primary">Aprobación</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="surface-light border-border/50 hover-lift">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 surface-mid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pricing.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`surface-light border-border/50 ${plan.featured ? 'ring-2 ring-primary scale-105' : ''}`}>
                <CardContent className="p-8">
                  {plan.featured && (
                    <Badge className="mb-4 bg-primary text-primary-foreground">
                      Popular
                    </Badge>
                  )}
                  {plan.bestValue && (
                    <Badge className="mb-4 bg-success text-success-foreground">
                      Mejor valor
                    </Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-4">
                    {plan.price}
                    {plan.price !== "Gratis" && plan.price !== "€250" && <span className="text-lg text-muted-foreground">/mes</span>}
                    {plan.price === "€250" && <span className="text-lg text-muted-foreground">/año</span>}
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  )}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.featured || plan.bestValue ? 'bg-primary hover:bg-primary-dark' : ''}`}
                    variant={plan.featured || plan.bestValue ? 'default' : 'outline'}
                    onClick={() => handlePlanSelect({ id: plan.id, name: plan.name })}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que Dicen Nuestros{" "}
              <span className="text-primary">Pilotos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="surface-light border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 surface-mid">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Aprobar tu{" "}
            <span className="text-primary">Habilitación?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Únete a más de 1,200 pilotos que ya han obtenido su certificación A320 y B737 con nuestra plataforma.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-dark text-lg px-12 py-6"
            onClick={handleStartNow}
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            {t('home.cta')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  <Plane className="w-5 h-5" />
                </div>
                <h1 className="font-bold text-white">PilotPrepFlightX</h1>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                La plataforma líder para la preparación de type ratings de aeronaves comerciales.
              </p>
            </div>

            {/* Producto Section */}
            <div>
              <h3 className="font-semibold text-white mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/type-rating" className="hover:text-teal-400 transition-colors">Cursos</a></li>
                <li><a href="/exams" className="hover:text-teal-400 transition-colors">Exámenes</a></li>
                <li><a href="/aircraft-selection" className="hover:text-teal-400 transition-colors">Prueba gratis</a></li>
              </ul>
            </div>

            {/* Soporte Section */}
            <div>
              <h3 className="font-semibold text-white mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="mailto:pilotprepflightx@outlook.es" className="hover:text-teal-400 transition-colors">Centro de ayuda</a></li>
                <li><a href="mailto:pilotprepflightx@outlook.es" className="hover:text-teal-400 transition-colors">Contacto</a></li>
                <li><a href="/subscription-management" className="hover:text-teal-400 transition-colors">Estado del servicio</a></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/terms" className="hover:text-teal-400 transition-colors">Términos</a></li>
                <li><a href="/privacy" className="hover:text-teal-400 transition-colors">Privacidad</a></li>
                <li><a href="/terms" className="hover:text-teal-400 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <p>&copy; 2024 PilotPrepFlightX. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;