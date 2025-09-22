import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

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
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
          <p className="text-muted-foreground mb-8">Última actualización: Diciembre 2024</p>
          
          <div className="space-y-8">
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>1. Aceptación de Términos</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Al acceder y utilizar PilotPrepFlightX, usted acepta estar sujeto a estos términos y condiciones de uso. 
                  Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                </p>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>2. Descripción del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  PilotPrepFlightX es una plataforma de preparación para exámenes de habilitación de tipo (Type Rating) 
                  para aeronaves A320 y B737. Ofrecemos cursos, simulacros de examen y material de estudio especializado.
                </p>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>3. Uso Aceptable</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>Usted se compromete a:</p>
                <ul>
                  <li>Utilizar la plataforma únicamente para fines de preparación académica</li>
                  <li>No compartir su cuenta o credenciales con terceros</li>
                  <li>No reproducir, distribuir o modificar el contenido sin autorización</li>
                  <li>No utilizar la plataforma para actividades ilegales o no autorizadas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>4. Suscripciones y Pagos</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Las suscripciones se cobran por adelantado según el plan seleccionado. Los precios pueden cambiar 
                  con previo aviso de 30 días. Las cancelaciones son efectivas al final del período de facturación actual.
                </p>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>5. Propiedad Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Todo el contenido de la plataforma, incluyendo textos, imágenes, videos y materiales de estudio, 
                  está protegido por derechos de autor y es propiedad de PilotPrepFlightX o sus licenciantes.
                </p>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>6. Limitación de Responsabilidad</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  PilotPrepFlightX no garantiza el éxito en los exámenes oficiales. Nuestro servicio es una herramienta 
                  de preparación y el resultado final depende del esfuerzo y dedicación individual del usuario.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;