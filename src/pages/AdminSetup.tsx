import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Crown
} from 'lucide-react';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const forceGrantAdminAccess = useMutation(api.auth.forceGrantAdminAccess);

  const handleGrantAdminAccess = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await forceGrantAdminAccess({});
      setResult(response);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Error al otorgar permisos de administrador'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configuración de Administrador</h1>
              <p className="text-sm text-muted-foreground">Otorgar permisos de administrador</p>
            </div>
          </div>
        </div>

        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-orange-500" />
              Otorgar Permisos de Administrador
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Esta función otorga permisos completos de administrador a <strong>tiniboti@gmail.com</strong>.
                Solo debe usarse si el usuario no tiene permisos de administrador actualmente.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">¿Qué hace esta función?</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Otorga rol de "admin" a tiniboti@gmail.com</li>
                <li>• Asigna tipo de cuenta "enterprise"</li>
                <li>• Proporciona acceso a todos los tipos de aeronaves (ALL)</li>
                <li>• Concede todos los permisos del sistema</li>
              </ul>
            </div>

            {result && (
              <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleGrantAdminAccess}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isLoading ? 'Otorgando...' : 'Otorgar Permisos de Admin'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Esta página se puede acceder en: <code>/admin-setup</code></p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;