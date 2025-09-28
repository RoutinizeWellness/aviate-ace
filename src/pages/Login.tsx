import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plane, Mail, Lock, AlertCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { DeviceFingerprintService } from "@/services/DeviceFingerprintService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      // For this app, we only need the email to sign in
      // The password field is kept for UI consistency but not used in the actual login
      const user = await signIn(email);
      if (user) {
        // Register device fingerprint after successful login
        try {
          await DeviceFingerprintService.registerDevice(user._id);
          console.log('Device registered successfully');
        } catch (deviceError) {
          console.warn('Device registration failed:', deviceError);
          // Don't block login for device registration failure
        }

        // Check if there's a return URL in the state or query parameters
        const searchParams = new URLSearchParams(location.search);
        const returnUrl = searchParams.get('returnUrl') || '/dashboard';
        navigate(returnUrl);
      } else {
        setError("Invalid email or user not found");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
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
          <h2 className="text-3xl font-bold mb-2">{t('login.welcomeBack') || 'Bienvenido de Vuelta'}</h2>
          <p className="text-muted-foreground">
            {t('login.subtitle') || 'Inicia sesión para continuar tu preparación'}
          </p>
        </div>

        {/* Login Form */}
        <Card className="surface-mid border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{t('login.title') || 'Iniciar Sesión'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 surface-light border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <span className="text-muted-foreground">Recordarme</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:text-primary-bright">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </Button>
            </form>


            <div className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-primary hover:text-primary-bright font-medium">
                Regístrate aquí
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Login;