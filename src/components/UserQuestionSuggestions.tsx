import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@/hooks/useConvexAuth';
import { Clock, CheckCircle2, XCircle, AlertTriangle, FileText } from 'lucide-react';

export const UserQuestionSuggestions = () => {
  const { user } = useAuth();
  const suggestions = useQuery(
    api.questionSuggestions.getUserQuestionSuggestions,
    user ? { userId: user._id } : "skip"
  );

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'needs_review':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rechazada</Badge>;
      case 'needs_review':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Necesita Revisión</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (suggestions === undefined) {
    return (
      <Card className="surface-mid border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Cargando sugerencias...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="surface-mid border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Mis Sugerencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No has enviado sugerencias</h3>
            <p className="text-sm text-muted-foreground">
              Cuando envíes sugerencias de preguntas, aparecerán aquí con su estado de revisión.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="surface-mid border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Mis Sugerencias ({suggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion._id} className="border border-border/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(suggestion.status)}
                  <span className="font-medium text-sm">
                    {suggestion.aircraftType.replace('_', ' ')} - {suggestion.category}
                  </span>
                </div>
                {getStatusBadge(suggestion.status)}
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Pregunta:</p>
                <p className="text-sm text-muted-foreground">
                  {suggestion.question.length > 150 ? suggestion.question.substring(0, 150) + '...' : suggestion.question}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Respuesta correcta:</p>
                <p className="text-sm text-muted-foreground">
                  {String.fromCharCode(65 + suggestion.correctAnswer)}. {suggestion.options[suggestion.correctAnswer]}
                </p>
              </div>

              {suggestion.adminNotes && (
                <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Notas del administrador:</p>
                  <p className="text-sm text-muted-foreground">{suggestion.adminNotes}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Enviada: {formatDate(suggestion.createdAt)}</span>
                {suggestion.reviewedAt && (
                  <span>Revisada: {formatDate(suggestion.reviewedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};