import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Plane, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (err: any) {
      setError('Error al enviar el correo de recuperación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PilotPrepFlightX</h1>
                <p className="text-xs text-muted-foreground">Professional Training</p>
              </div>
            </div>
          </div>

          <Card className="surface-mid border-border/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Correo Enviado</h2>
              <p className="text-muted-foreground mb-6">
                Hemos enviado las instrucciones de recuperación de contraseña a <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Link to="/login">
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio de Sesión
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PilotPrepFlightX</h1>
              <p className="text-xs text-muted-foreground">Professional Training</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Recuperar Contraseña</h2>
          <p className="text-muted-foreground">
            Ingresa tu correo electrónico para recibir instrucciones
          </p>
        </div>

        <Card className="surface-mid border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Restablecer Contraseña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 surface-light border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar Instrucciones"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{" "}
              <Link to="/login" className="text-primary hover:text-primary-bright font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 surface-light rounded-lg border border-warning/20 bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Funcionalidad Demo</p>
              <p className="text-muted-foreground">
                Esta es una funcionalidad de demostración. En un entorno de producción, 
                se enviaría un correo real con instrucciones de recuperación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;