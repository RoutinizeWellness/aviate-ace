import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@/hooks/useConvexAuth';
import { QuestionSuggestion, QuestionSuggestionStats } from '@/types/questionSuggestions';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye,
  ThumbsUp,
  FileText,
  User,
  Calendar
} from 'lucide-react';

interface ReviewFormData {
  status: string;
  adminNotes: string;
}

export const QuestionSuggestionsAdmin = React.memo(() => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSuggestion, setSelectedSuggestion] = useState<QuestionSuggestion | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    status: '',
    adminNotes: ''
  });

  // Queries
  const suggestions = useQuery(
    api.questionSuggestions.getAllQuestionSuggestions,
    user ? { 
      adminUserId: user._id,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      limit: 100
    } : "skip"
  ) as QuestionSuggestion[] | undefined;

  const suggestionStats = useQuery(
    api.questionSuggestions.getSuggestionStats,
    user ? { adminUserId: user._id } : "skip"
  ) as QuestionSuggestionStats | undefined;

  // Mutations
  const updateSuggestionStatus = useMutation(api.questionSuggestions.updateQuestionSuggestionStatus);
  const approveAndCreate = useMutation(api.questionSuggestions.approveAndCreateQuestion);

  const getStatusIcon = useCallback((status: string) => {
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
  }, []);

  const getStatusBadge = useCallback((status: string) => {
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
  }, []);

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const handleReviewSuggestion = useCallback((suggestion: QuestionSuggestion) => {
    setSelectedSuggestion(suggestion);
    setReviewForm({
      status: suggestion.status,
      adminNotes: suggestion.adminNotes || ''
    });
    setShowReviewDialog(true);
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedSuggestion || !user) return;

    try {
      await updateSuggestionStatus({
        adminUserId: user._id,
        suggestionId: selectedSuggestion._id,
        status: reviewForm.status,
        adminNotes: reviewForm.adminNotes
      });

      toast({
        title: "Estado actualizado",
        description: "El estado de la sugerencia ha sido actualizado exitosamente.",
      });

      setShowReviewDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleApproveAndCreate = async () => {
    if (!selectedSuggestion || !user) return;

    try {
      await approveAndCreate({
        adminUserId: user._id,
        suggestionId: selectedSuggestion._id,
        adminNotes: reviewForm.adminNotes
      });

      toast({
        title: "Pregunta aprobada y creada",
        description: "La sugerencia ha sido aprobada y añadida a la base de datos de preguntas.",
      });

      setShowReviewDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo aprobar la sugerencia",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  // Memoize filtered suggestions to avoid recalculation
  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    return selectedStatus === 'all' 
      ? suggestions 
      : suggestions.filter((s: QuestionSuggestion) => s.status === selectedStatus);
  }, [suggestions, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {suggestionStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="surface-mid border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{suggestionStats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{suggestionStats.pending}</div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{suggestionStats.approved}</div>
                <div className="text-xs text-muted-foreground">Aprobadas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{suggestionStats.rejected}</div>
                <div className="text-xs text-muted-foreground">Rechazadas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-mid border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{suggestionStats.needsReview}</div>
                <div className="text-xs text-muted-foreground">Revisión</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label htmlFor="statusFilter">Filtrar por estado:</Label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="approved">Aprobadas</SelectItem>
            <SelectItem value="rejected">Rechazadas</SelectItem>
            <SelectItem value="needs_review">Necesita Revisión</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suggestions Table */}
      <Card className="surface-mid border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Pregunta</TableHead>
                  <TableHead>Aeronave/Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuggestions.map((suggestion: QuestionSuggestion) => (
                  <TableRow key={suggestion._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{suggestion.user?.displayName || 'Usuario'}</p>
                          <p className="text-xs text-muted-foreground">{suggestion.user?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm font-medium">{suggestion.question.length > 100 ? suggestion.question.substring(0, 100) + '...' : suggestion.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Respuesta: {String.fromCharCode(65 + suggestion.correctAnswer)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{suggestion.aircraftType.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {suggestion.difficulty}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(suggestion.status)}
                        {getStatusBadge(suggestion.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(suggestion.createdAt)}</p>
                        {suggestion.reviewedAt && (
                          <p className="text-xs text-muted-foreground">
                            Rev: {formatDate(suggestion.reviewedAt)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewSuggestion(suggestion)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredSuggestions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisar Sugerencia de Pregunta</DialogTitle>
            <DialogDescription>
              Revisa y actualiza el estado de esta sugerencia de pregunta.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSuggestion && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="w-5 h-5" />
                <div>
                  <p className="font-medium">{selectedSuggestion.user?.displayName || 'Usuario'}</p>
                  <p className="text-sm text-muted-foreground">{selectedSuggestion.user?.email}</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {formatDate(selectedSuggestion.createdAt)}
                </div>
              </div>

              {/* Question Details */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Tipo de Aeronave y Categoría</Label>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{selectedSuggestion.aircraftType.replace('_', ' ')}</Badge>
                    <Badge variant="outline">{selectedSuggestion.category}</Badge>
                    <Badge variant="outline">{selectedSuggestion.difficulty}</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Pregunta</Label>
                  <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedSuggestion.question}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Opciones de Respuesta</Label>
                  <div className="mt-1 space-y-2">
                    {selectedSuggestion.options.map((option: string, index: number) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-3 p-2 rounded-lg ${
                          index === selectedSuggestion.correctAnswer 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-muted/30'
                        }`}
                      >
                        <span className="font-medium text-sm">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-sm">{option}</span>
                        {index === selectedSuggestion.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Explicación</Label>
                  <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedSuggestion.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select 
                    value={reviewForm.status} 
                    onValueChange={(value) => setReviewForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="approved">Aprobada</SelectItem>
                      <SelectItem value="rejected">Rechazada</SelectItem>
                      <SelectItem value="needs_review">Necesita Revisión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adminNotes">Notas del Administrador</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Añade comentarios o razones para la decisión..."
                    value={reviewForm.adminNotes}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="outline" onClick={handleUpdateStatus}>
                  Actualizar Estado
                </Button>
                {reviewForm.status !== 'approved' && (
                  <Button 
                    onClick={handleApproveAndCreate}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Aprobar y Crear Pregunta
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

QuestionSuggestionsAdmin.displayName = 'QuestionSuggestionsAdmin';