import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, Shield, User, Ban, RotateCcw } from "lucide-react";
import userService, { type User as UserProfile, type UserRole } from "@/services/userService";

export function UserManagementPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "empleado" as UserRole,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudieron cargar los usuarios";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      await userService.createEmployee({
        email: newUser.email,
        password: newUser.password,
        fullName: newUser.fullName,
        role: newUser.role,
      });
      await fetchUsers();
      setNewUser({ email: "", password: "", fullName: "", role: "empleado" });
      setIsCreateDialogOpen(false);
      toast({ title: "Empleado creado", description: "El empleado ha sido creado exitosamente" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo crear el empleado";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setUpdating(userId);
      await userService.updateUserRole(userId, newRole);
      await fetchUsers();
      toast({ title: "Rol actualizado", description: "El rol del usuario ha sido actualizado" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo actualizar el rol";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const toggleActive = async (u: UserProfile) => {
    try {
      setUpdating(u.id);
      await userService.setUserActive(u.id, !u.active);
      await fetchUsers();
      toast({
        title: u.active ? "Usuario desactivado" : "Usuario reactivado",
        description: u.active
          ? "El usuario ya no podrá iniciar sesión."
          : "El usuario puede iniciar sesión nuevamente.",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo actualizar el estado";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    if (role === "admin") return "destructive" as const;
    if (role === "empleado") return "default" as const;
    return "secondary" as const;
  };

  const getRoleIcon = (role: UserRole) => {
    if (role === "admin") return <Shield className="h-3 w-3" />;
    return <User className="h-3 w-3" />;
  };

  const formatRole = (role: string) => {
    if (role === "cliente") return "Cliente";
    if (role === "empleado") return "Empleado";
    if (role === "admin") return "Admin";
    return role;
  };

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
              <DialogDescription>Crea una cuenta para un nuevo empleado del sistema</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="empleado@parkvista.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser((prev) => ({ ...prev, role: value }))}
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
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={creating}>
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
          <CardDescription>Lista de todos los usuarios registrados con sus roles correspondientes</CardDescription>
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
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className={u.active ? "" : "opacity-60"}>
                    <TableCell className="font-medium">{`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(u.role)} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(u.role)}
                        {formatRole(u.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-fit">Activo</Badge>
                      ) : (
                        <Badge variant="secondary" className="w-fit">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("es-ES") : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={u.role}
                          onValueChange={(value: UserRole) => updateUserRole(u.id, value)}
                          disabled={updating === u.id}
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
                        {u.active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(u)}
                            disabled={updating === u.id}
                            title="Desactivar usuario"
                          >
                            <Ban className="h-4 w-4 mr-1 text-destructive" />
                            Desactivar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(u)}
                            disabled={updating === u.id}
                            title="Reactivar usuario"
                          >
                            <RotateCcw className="h-4 w-4 mr-1 text-primary" />
                            Reactivar
                          </Button>
                        )}
                      </div>
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
