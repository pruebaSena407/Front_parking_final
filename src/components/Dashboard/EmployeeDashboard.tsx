import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Car, DollarSign, TrendingUp, MapPin, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ParkingLocationsPanel } from "@/components/Admin/ParkingLocationsPanel";
import { ParkingRatesPanel } from "@/components/Admin/ParkingRatesPanel";

export const EmployeeDashboard = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {isAdmin ? "Panel de Administración" : "Panel de Empleado"}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin ? "Gestiona todo el sistema de parqueaderos" : "Gestiona clientes y operaciones diarias"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espacios Ocupados</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87/120</div>
            <p className="text-xs text-muted-foreground">73% de ocupación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3.5M</div>
            <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Activas en la ciudad</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          {isAdmin && <TabsTrigger value="locations">Ubicaciones</TabsTrigger>}
          {isAdmin && <TabsTrigger value="rates">Tarifas</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas operaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Car className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Nueva reserva</p>
                      <p className="text-xs text-muted-foreground">Juan Pérez - Espacio A-12</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 5 min</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Pago recibido</p>
                      <p className="text-xs text-muted-foreground">María García - $25.000</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 12 min</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Nuevo cliente</p>
                      <p className="text-xs text-muted-foreground">Carlos Rodríguez registrado</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Hace 1 hora</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Espacios por Ubicación</CardTitle>
                <CardDescription>Estado de ocupación actual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Parqueadero Centro</span>
                    <span className="text-muted-foreground">28/35</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Parqueadero Norte</span>
                    <span className="text-muted-foreground">19/30</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "63%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Parqueadero Sur</span>
                    <span className="text-muted-foreground">22/25</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "88%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Parqueadero Este</span>
                    <span className="text-muted-foreground">18/30</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Clientes</CardTitle>
              <CardDescription>Lista completa de clientes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="flex h-10 w-full sm:w-auto sm:flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <Button>Nuevo Cliente</Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-sm">
                        <th className="p-3">Nombre</th>
                        <th className="p-3 hidden sm:table-cell">Email</th>
                        <th className="p-3 hidden md:table-cell">Teléfono</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-t">
                        <td className="p-3">Juan Pérez</td>
                        <td className="p-3 hidden sm:table-cell">juan@email.com</td>
                        <td className="p-3 hidden md:table-cell">300-123-4567</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Activo</span>
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">Ver</Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">María García</td>
                        <td className="p-3 hidden sm:table-cell">maria@email.com</td>
                        <td className="p-3 hidden md:table-cell">300-234-5678</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Activo</span>
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">Ver</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="locations">
            <ParkingLocationsPanel />
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="rates">
            <ParkingRatesPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
