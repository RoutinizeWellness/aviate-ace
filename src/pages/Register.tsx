import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plane, Mail, Lock, User, Phone, MapPin, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useConvexAuth";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    experience: "",
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    setIsLoading(true);
    
    try {
      const user = await signUp(formData.email, formData.password, `${formData.firstName} ${formData.lastName}`);
      
      if (user) {
        // Registration successful
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error al crear la cuenta. Inténtalo de nuevo.');
    }
    
    setIsLoading(false);
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

      <div className="relative w-full max-w-2xl">
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
          <h2 className="text-3xl font-bold mb-2">Únete a PilotPrepFlightX</h2>
          <p className="text-muted-foreground">
            Crea tu cuenta y comienza tu preparación para la certificación de piloto
          </p>
        </div>

        {/* Registration Form */}
        <Card className="surface-mid border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Crear Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Información Personal</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      Nombre *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10 surface-light border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Apellido *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Tu apellido"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10 surface-light border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 surface-light border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Teléfono
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+34 612 345 678"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 surface-light border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      País *
                    </Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => handleInputChange('country', value)}
                      required
                    >
                      <SelectTrigger className="surface-light border-border/50 focus:border-primary">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder="Selecciona tu país" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ES">España</SelectItem>
                        <SelectItem value="US">Estados Unidos</SelectItem>
                        <SelectItem value="MX">México</SelectItem>
                        <SelectItem value="AR">Argentina</SelectItem>
                        <SelectItem value="CO">Colombia</SelectItem>
                        <SelectItem value="PE">Perú</SelectItem>
                        <SelectItem value="CL">Chile</SelectItem>
                        <SelectItem value="VE">Venezuela</SelectItem>
                        <SelectItem value="EC">Ecuador</SelectItem>
                        <SelectItem value="UY">Uruguay</SelectItem>
                        <SelectItem value="PY">Paraguay</SelectItem>
                        <SelectItem value="BO">Bolivia</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Aviation Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Experiencia en Aviación</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium">
                    Nivel de Experiencia *
                  </Label>
                  <Select 
                    value={formData.experience} 
                    onValueChange={(value) => handleInputChange('experience', value)}
                    required
                  >
                    <SelectTrigger className="surface-light border-border/50 focus:border-primary">
                      <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante - Sin experiencia previa</SelectItem>
                      <SelectItem value="student">Estudiante de piloto privado (PPL)</SelectItem>
                      <SelectItem value="private">Piloto privado certificado</SelectItem>
                      <SelectItem value="commercial">Piloto comercial</SelectItem>
                      <SelectItem value="instructor">Instructor de vuelo</SelectItem>
                      <SelectItem value="airline">Piloto de línea aérea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Seguridad</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 surface-light border-border/50 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 surface-light border-border/50 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    className="mt-1"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    Acepto los{" "}
                    <a href="#" className="text-primary hover:text-primary-bright underline">
                      Términos y Condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="#" className="text-primary hover:text-primary-bright underline">
                      Política de Privacidad
                    </a>
                    . *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="newsletter" className="text-sm leading-relaxed cursor-pointer">
                    Quiero recibir actualizaciones y noticias sobre nuevos cursos y características
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading || authLoading}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="relative">
              <Separator className="my-6" />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface-mid px-2 text-xs text-muted-foreground">
                O regístrate con
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button 
                onClick={() => navigate('/login')}
                className="text-primary hover:text-primary-bright font-medium"
              >
                Inicia sesión aquí
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;