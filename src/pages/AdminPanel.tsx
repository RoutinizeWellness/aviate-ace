import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useConvexAuth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  Users, 
  Settings, 
  Shield, 
  Trash2, 
  Edit,
  ArrowLeft,
  AlertTriangle,
  Crown,
  User,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if user is admin
  const adminCheck = useQuery(api.auth.isUserAdmin, user ? { userId: user._id } : "skip");
  const allUsers = useQuery(api.auth.getAllUsers, 
    user && adminCheck?.isAdmin 
      ? { adminUserId: user._id }
      : "skip"
  );
  
  // Mutations
  const updateUserRole = useMutation(api.auth.updateUserRole);
  const deleteUser = useMutation(api.auth.deleteUser);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    role: '',
    accountType: '',
    isActive: true,
    permissions: []
  });

  // Redirect if not admin
  useEffect(() => {
    // Only redirect if we have a definitive answer that the user is not admin
    if (adminCheck && !adminCheck.isAdmin) {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos de administrador.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [adminCheck, navigate, toast]);

  // Show loading state while checking admin status
  if (!user || adminCheck === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not admin (after we have a definitive answer)
  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="surface-mid border-border/50 p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
          <p className="text-muted-foreground mb-4">
            Esta página requiere permisos de administrador.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      role: user.role || 'user',
      accountType: user.accountType || 'free',
      isActive: user.isActive !== false,
      permissions: user.permissions || []
    });
    setShowEditDialog(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser || !user) return;
    
    try {
      await updateUserRole({
        adminUserId: user._id,
        targetUserId: selectedUser._id,
        role: editForm.role,
        accountType: editForm.accountType,
        isActive: editForm.isActive,
        permissions: editForm.permissions,
      });
      
      toast({
        title: "Usuario actualizado",
        description: "Los cambios se han guardado exitosamente.",
      });
      
      setShowEditDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !user) return;
    
    try {
      await deleteUser({
        adminUserId: user._id,
        targetUserId: selectedUser._id,
      });
      
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
      
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccountTypeBadgeColor = (accountType: string) => {
    switch (accountType) {
      case 'enterprise': return 'bg-gold-100 text-gold-800 border-gold-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const availablePermissions = [
    'manage_users',
    'view_analytics', 
    'manage_content',
    'system_admin',
    'export_data',
    'user_support'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-surface-dark">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
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
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground">Gestión de usuarios y permisos</p>
              </div>
            </div>
          </div>
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Crown className="w-3 h-3 mr-1" />
            Administrador
          </Badge>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold">{allUsers?.length || 0}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold">
                    {allUsers?.filter(u => u.role === 'admin').length || 0}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-500 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios Premium</p>
                  <p className="text-2xl font-bold">
                    {allUsers?.filter(u => u.accountType === 'premium').length || 0}
                  </p>
                </div>
                <Crown className="w-8 h-8 text-purple-500 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-mid border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
                  <p className="text-2xl font-bold">
                    {allUsers?.filter(u => u.isActive !== false).length || 0}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="surface-mid border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Tipo de Cuenta</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{user.displayName || user.fullName}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role || 'user')}>
                          {user.role === 'admin' ? 'Administrador' : 
                           user.role === 'premium' ? 'Premium' : 'Usuario'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccountTypeBadgeColor(user.accountType || 'free')}>
                          {user.accountType === 'enterprise' ? 'Empresarial' :
                           user.accountType === 'premium' ? 'Premium' : 'Gratuito'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive !== false ? 'default' : 'secondary'}>
                          {user.isActive !== false ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Nivel: {user.stats?.currentLevel || 1}</p>
                          <p>Puntos: {user.stats?.totalPoints || 0}</p>
                          <p>Exámenes: {user.stats?.totalExamsTaken || 0}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteDialog(true);
                            }}
                            disabled={['tiniboti@gmail.com'].includes(user.email)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica el rol y permisos de {selectedUser?.displayName || selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rol</label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Cuenta</label>
                <Select value={editForm.accountType} onValueChange={(value) => setEditForm(prev => ({ ...prev, accountType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive" className="text-sm font-medium">Usuario Activo</label>
              </div>

              {selectedUser?.email && ['tiniboti@gmail.com'].includes(selectedUser.email) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Esta es una cuenta de súper administrador protegida.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser}>
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Eliminar Usuario</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar a {selectedUser?.displayName || selectedUser?.email}?
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Se eliminarán todos los datos del usuario incluyendo progreso, estadísticas y perfil.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Eliminar Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;