import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, Shield, User } from "lucide-react";

type UserRole = "cliente" | "empleado" | "admin";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export function UserManagementPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for creating new employee
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "empleado" as UserRole,
  });

  const API_BASE = (import.meta as any).env?.VITE_API_URL || "";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      if (!API_BASE) {
        setUsers([
          {
            id: "mock-admin",
            email: "admin@parkvista.test",
            full_name: "Administrador",
            role: "admin",
            created_at: new Date().toISOString(),
          },
          {
            id: "mock-user",
            email: "user@parkvista.test",
            full_name: "Usuario Demo",
            role: "cliente",
            created_at: new Date().toISOString(),
          },
        ]);
        return;
      }

      const response = await fetch(`${API_BASE}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener usuarios desde el backend");
      }

      const usersData = await response.json();
      setUsers(
        usersData.map((item: any) => ({
          id: item.id_usuario,
          email: item.email,
          full_name: item.nombre,
          role: item.id_rol as UserRole,
          created_at: item.created_at,
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);

      if (!API_BASE) {
        const newEmployee: UserProfile = {
          id: `mock-${Date.now()}`,
          email: newUser.email,
          full_name: newUser.fullName,
          role: newUser.role,
          created_at: new Date().toISOString(),
        };

        setUsers(prev => [...prev, newEmployee]);
        setNewUser({ email: "", password: "", fullName: "", role: "empleado" });
        setIsCreateDialogOpen(false);

        toast({
          title: "Empleado creado",
          description: "Empleado creado exitosamente (modo demo)",
        });
        return;
      }

      const response = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newUser.fullName,
          email: newUser.email,
          telefono: "",
          id_rol: newUser.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear usuario");
      }

      await fetchUsers();
      setNewUser({ email: "", password: "", fullName: "", role: "empleado" });
      setIsCreateDialogOpen(false);

      toast({
        title: "Empleado creado",
        description: "El empleado ha sido creado exitosamente",
      });
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el empleado",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setUpdating(userId);

      if (!API_BASE) {
        setUsers(prev =>
          prev.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );

        toast({
          title: "Rol actualizado",
          description: "Rol actualizado exitosamente (modo demo)",
        });
        return;
      }

      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_rol: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar rol");
      }

      await fetchUsers();
      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado",
      });
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el rol",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "empleado":
        return "default";
      case "cliente":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />;
      case "empleado":
        return <User className="h-3 w-3" />;
      case "cliente":
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">Administra empleados y controla accesos al sistema</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Crear Empleado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Crea una cuenta para un nuevo empleado del sistema
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="empleado@parkvista.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empleado">Empleado</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button onClick={createEmployee} disabled={creating}>
                {creating ? "Creando..." : "Crear Empleado"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuarios del Sistema
          </CardTitle>
          <CardDescription>
            Lista de todos los usuarios registrados con sus roles correspondientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando usuarios...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(user.role)}
                        {user.role === "cliente" ? "Cliente" :
                         user.role === "empleado" ? "Empleado" :
                         user.role === "admin" ? "Admin" : user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                        disabled={updating === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cliente">Cliente</SelectItem>
                          <SelectItem value="empleado">Empleado</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}