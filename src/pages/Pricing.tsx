import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Plane, 
  Star, 
  Zap, 
  Shield, 
  BarChart3,
  Clock,
  Target,
  Trophy,
  Users,
  ArrowRight
} from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PilotPrepFlightX</h1>
              <p className="text-xs text-muted-foreground">Professional Training</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Inicio</a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Características</a>
            <a href="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Volver</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-4 h-4 mr-2" />
            Precio Especial de Lanzamiento
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Elige el Plan que{" "}
            <span className="text-primary">Garantice tu Éxito</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Preparación profesional para A320 y B737. Más de 1,200 pilotos ya han obtenido 
            su certificación con nosotros. ¿Cuál será tu historia de éxito?
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-sm text-muted-foreground">Mensual</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" id="pricing-toggle" />
              <label htmlFor="pricing-toggle" className="flex items-center cursor-pointer">
                <div className="w-12 h-6 bg-surface-light rounded-full relative">
                  <div className="w-5 h-5 bg-primary rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </div>
              </label>
            </div>
            <span className="text-sm text-muted-foreground">
              Anual <Badge className="ml-2 bg-primary/10 text-primary text-xs">-30%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Free Plan */}
            <Card className="surface-mid border-border/50 relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Plan Gratuito</CardTitle>
                <p className="text-muted-foreground text-sm mb-6">
                  Perfecto para explorar la plataforma
                </p>
                <div className="text-5xl font-bold mb-2">
                  €0
                  <span className="text-lg text-muted-foreground font-normal">/mes</span>
                </div>
                <p className="text-sm text-muted-foreground">Para siempre</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {freeFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" size="lg">
                  Comenzar Gratis
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  No se requiere tarjeta de crédito
                </p>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="surface-mid border-primary/50 relative scale-105 ring-2 ring-primary/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-6 py-1">
                  <Star className="w-4 h-4 mr-1" />
                  Más Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">Plan Premium</CardTitle>
                <p className="text-muted-foreground text-sm mb-6">
                  La elección de los profesionales
                </p>
                <div className="text-5xl font-bold mb-2">
                  €29
                  <span className="text-lg text-muted-foreground font-normal">/mes</span>
                </div>
                <p className="text-sm text-muted-foreground">Facturación mensual</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {premiumFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" variant="premium">
                  <Trophy className="w-4 h-4 mr-2" />
                  Obtener Premium
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Garantía de reembolso de 30 días
                </p>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="surface-mid border-border/50 relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Plan Empresarial</CardTitle>
                <p className="text-muted-foreground text-sm mb-6">
                  Para escuelas de aviación
                </p>
                <div className="text-5xl font-bold mb-2">
                  €99
                  <span className="text-lg text-muted-foreground font-normal">/mes</span>
                </div>
                <p className="text-sm text-muted-foreground">Hasta 50 usuarios</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {enterpriseFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  Contactar Ventas
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Implementación personalizada
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 surface-mid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir{" "}
              <span className="text-primary">Premium?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Comparación detallada de características
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {comparisonFeatures.map((feature, index) => (
              <Card key={index} className="surface-light border-border/50 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Gratuito:</span>
                      <span className="text-muted-foreground">{feature.free}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Premium:</span>
                      <span className="text-primary font-medium">{feature.premium}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que Dicen Nuestros{" "}
              <span className="text-primary">Usuarios Premium</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumTestimonials.map((testimonial, index) => (
              <Card key={index} className="surface-mid border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">"{testimonial.quote}"</p>
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

      {/* Final CTA */}
      <section className="py-20 surface-mid">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Garantizar tu{" "}
            <span className="text-primary">Aprobación?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Únete a más de 1,200 pilotos certificados. Comienza tu preparación hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="premium" className="px-8">
              <Trophy className="w-5 h-5 mr-2" />
              Comenzar Premium Ahora
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Probar Gratis Primero
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 surface-dark border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold">PilotPrepFlightX</h1>
                <p className="text-xs text-muted-foreground">Professional Training</p>
              </div>
            </div>
            
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Términos</a>
              <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
              <a href="#" className="hover:text-primary transition-colors">Contacto</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PilotPrepFlightX. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature arrays
const freeFeatures = [
  "100 preguntas de muestra",
  "1 simulacro básico por día",
  "Acceso limitado A320 o B737",
  "Estadísticas básicas",
  "Soporte por email",
];

const premiumFeatures = [
  "5,000+ preguntas completas",
  "Simulacros ilimitados",
  "Acceso completo A320 y B737",
  "Estadísticas avanzadas y análisis",
  "Identificación de puntos débiles",
  "Modo examen cronometrado",
  "Actualizaciones mensuales",
  "Soporte prioritario 24/7",
  "Garantía de aprobación",
  "Certificados de finalización",
];

const enterpriseFeatures = [
  "Todo lo incluido en Premium",
  "Hasta 50 usuarios",
  "Panel de administración",
  "Reportes de progreso grupal",
  "Integración con LMS",
  "Onboarding personalizado",
  "Soporte dedicado",
  "Facturación centralizada",
];

const comparisonFeatures = [
  {
    icon: Target,
    title: "Banco de Preguntas",
    description: "Preguntas disponibles",
    free: "100 limitadas",
    premium: "5,000+ completas"
  },
  {
    icon: Clock,
    title: "Simulacros",
    description: "Exámenes de práctica",
    free: "1 por día",
    premium: "Ilimitados"
  },
  {
    icon: BarChart3,
    title: "Estadísticas",
    description: "Análisis de rendimiento",
    free: "Básicas",
    premium: "Avanzadas + IA"
  },
  {
    icon: Shield,
    title: "Soporte",
    description: "Ayuda técnica",
    free: "Email básico",
    premium: "24/7 Prioritario"
  }
];

const premiumTestimonials = [
  {
    quote: "El análisis de debilidades del plan Premium me ayudó a enfocarme exactamente donde necesitaba. Aprobé mi A320 con 96%.",
    name: "Laura Martín",
    role: "Piloto A320 - Air Europa"
  },
  {
    quote: "Los simulacros ilimitados fueron clave. Pude practicar hasta sentirme 100% confiado para el examen real del B737.",
    name: "Diego Ruiz",
    role: "Primera Oficial B737 - Norwegian"
  },
  {
    quote: "La garantía de aprobación me dio tranquilidad. El contenido es tan bueno que no la necesité, pero es genial tenerla.",
    name: "Carmen López",
    role: "Instructora A320 - Iberia"
  }
];

export default Pricing;