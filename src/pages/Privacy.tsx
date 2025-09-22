import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
          <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
          <p className="text-muted-foreground mb-8">Última actualización: Diciembre 2024</p>
          
          <div className="space-y-8">
            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>1. Información que Recopilamos</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>Recopilamos la siguiente información:</p>
                <ul>
                  <li><strong>Información de cuenta:</strong> Nombre, email, y credenciales de acceso</li>
                  <li><strong>Datos de progreso:</strong> Resultados de exámenes, tiempo de estudio, y estadísticas de rendimiento</li>
                  <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, y datos de uso de la plataforma</li>
                  <li><strong>Información de pago:</strong> Datos de facturación y transacciones (procesados por Stripe)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>2. Cómo Usamos su Información</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>Utilizamos su información para:</p>
                <ul>
                  <li>Proporcionar y mejorar nuestros servicios de preparación</li>
                  <li>Personalizar su experiencia de aprendizaje</li>
                  <li>Procesar pagos y gestionar su suscripción</li>
                  <li>Comunicarnos con usted sobre actualizaciones y soporte</li>
                  <li>Analizar el uso de la plataforma para mejoras</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>3. Compartir Información</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  No vendemos, intercambiamos o transferimos su información personal a terceros, excepto:
                </p>
                <ul>
                  <li>Con proveedores de servicios de confianza (como procesadores de pago)</li>
                  <li>Cuando sea requerido por ley</li>
                  <li>Para proteger nuestros derechos y seguridad</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>4. Seguridad de Datos</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal 
                  contra acceso no autorizado, alteración, divulgación o destrucción.
                </p>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>5. Sus Derechos</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>Usted tiene derecho a:</p>
                <ul>
                  <li>Acceder a su información personal</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de su cuenta</li>
                  <li>Retirar el consentimiento para el procesamiento</li>
                  <li>Portabilidad de sus datos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>6. Cookies y Tecnologías Similares</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Utilizamos cookies y tecnologías similares para mejorar la funcionalidad de la plataforma, 
                  recordar sus preferencias y analizar el uso del sitio.
                </p>
              </CardContent>
            </Card>

            <Card className="surface-mid border-border/50">
              <CardHeader>
                <CardTitle>7. Contacto</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Para cualquier consulta sobre esta política de privacidad, puede contactarnos en:
                  <br />
                  Email: privacy@pilotprepflightx.com
                  <br />
                  Dirección: [Dirección de la empresa]
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;