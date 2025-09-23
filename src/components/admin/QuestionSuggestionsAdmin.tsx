import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock,
  MessageSquare,
  User
} from 'lucide-react';

interface QuestionSuggestionsAdminProps {
  className?: string;
}

export const QuestionSuggestionsAdmin = ({ className }: QuestionSuggestionsAdminProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const suggestions = useQuery(
    api.questionSuggestions.getAllQuestionSuggestions,
    user ? { adminUserId: user._id, status: selectedStatus === 'all' ? undefined : selectedStatus } : "skip"
  );

  const updateStatus = useMutation(api.questionSuggestions.updateQuestionSuggestionStatus);
  const approveAndCreate = useMutation(api.questionSuggestions.approveAndCreateQuestion);

  const handleStatusUpdate = async (suggestionId: string, status: string, notes?: string) => {
    if (!user) return;

    try {
      await updateStatus({
        adminUserId: user._id,
        suggestionId: suggestionId as any,
        status,
        adminNotes: notes
      });

      toast({
        title: "Estado actualizado",
        description: "La sugerencia ha sido actualizada exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado.",
        variant: "destructive",
      });
    }
  };

  const handleApproveAndCreate = async (suggestionId: string, notes?: string) => {
    if (!user) return;

    try {
      await approveAndCreate({
        adminUserId: user._id,
        suggestionId: suggestionId as any,
        adminNotes: notes
      });

      toast({
        title: "Pregunta aprobada",
        description: "La pregunta ha sido aprobada y añadida al banco de preguntas.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo aprobar la pregunta.",
        variant: "destructive",
      });
    }
  };

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
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!suggestions) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Cargando sugerencias...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Sugerencias de Preguntas ({suggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Status Filter */}
        <div className="mb-4">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected', 'needs_review'].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status === 'all' ? 'Todas' : 
                 status === 'pending' ? 'Pendientes' :
                 status === 'approved' ? 'Aprobadas' :
                 status === 'rejected' ? 'Rechazadas' : 'Necesita Revisión'}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion._id} className="border border-border/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(suggestion.status)}
                  <div>
                    <span className="font-medium text-sm">
                      {suggestion.aircraftType.replace('_', ' ')} - {suggestion.category}
                    </span>
                    {suggestion.user && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {suggestion.user.displayName || suggestion.user.email}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={
                  suggestion.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                  suggestion.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                  suggestion.status === 'needs_review' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                }>
                  {suggestion.status === 'pending' ? 'Pendiente' :
                   suggestion.status === 'approved' ? 'Aprobada' :
                   suggestion.status === 'rejected' ? 'Rechazada' : 'Necesita Revisión'}
                </Badge>
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Pregunta:</p>
                <p className="text-sm text-muted-foreground">
                  {suggestion.question}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Opciones:</p>
                <div className="space-y-1">
                  {suggestion.options.map((option, index) => (
                    <div key={index} className={`text-sm p-2 rounded ${
                      index === suggestion.correctAnswer 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                      {String.fromCharCode(65 + index)}. {option}
                      {index === suggestion.correctAnswer && (
                        <span className="ml-2 text-xs font-medium">(Correcta)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {suggestion.explanation && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Explicación:</p>
                  <p className="text-sm text-muted-foreground">{suggestion.explanation}</p>
                </div>
              )}

              {suggestion.adminNotes && (
                <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Notas del administrador:</p>
                  <p className="text-sm text-muted-foreground">{suggestion.adminNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              {suggestion.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleApproveAndCreate(suggestion._id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Aprobar y Crear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(suggestion._id, 'needs_review')}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Necesita Revisión
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusUpdate(suggestion._id, 'rejected')}
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Rechazar
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t">
                <span>Enviada: {new Date(suggestion.createdAt).toLocaleDateString('es-ES')}</span>
                {suggestion.reviewedAt && (
                  <span>Revisada: {new Date(suggestion.reviewedAt).toLocaleDateString('es-ES')}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {suggestions.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No hay sugerencias</h3>
            <p className="text-sm text-muted-foreground">
              {selectedStatus === 'all' 
                ? 'No se han recibido sugerencias de preguntas aún.'
                : `No hay sugerencias con estado "${selectedStatus}".`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};