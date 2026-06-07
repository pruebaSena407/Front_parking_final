import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Car, DollarSign, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ParkingLocationsPanel } from "@/components/Admin/ParkingLocationsPanel";
import { ParkingRatesPanel } from "@/components/Admin/ParkingRatesPanel";
import { ReservationsPanel } from "@/components/Admin/ReservationsPanel";
import { UserManagementPanel } from "@/components/Admin/UserManagementPanel";
import { OperationPanel } from "@/components/Operation/OperationPanel";
import statsService, {
  type OverviewStats,
  type OccupancyEntry,
} from "@/services/statsService";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: n >= 1_000_000 ? "compact" : "standard",
  }).format(n);

export const EmployeeDashboard = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyEntry[]>([]);
  const [averageRate, setAverageRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const [ov, occ] = await Promise.all([
          statsService.getOverview(),
          statsService.getOccupancy(),
        ]);
        if (!mounted) return;
        setOverview(ov);
        setOccupancy(occ.occupancy);
        setAverageRate(occ.averageRate);
      } catch (e) {
        console.error("Error cargando stats:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

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
            <div className="text-2xl font-bold">
              {loading ? "—" : overview?.activeClients ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de usuarios: {overview?.totalUsers ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : overview?.activeReservations ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ocupación promedio: {averageRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : formatCurrency(overview?.monthlyRevenue ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Pagos completados este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : overview?.locationCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Activas en la ciudad</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="operation">Operación</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Usuarios</TabsTrigger>}
          {isAdmin && <TabsTrigger value="locations">Ubicaciones</TabsTrigger>}
          {isAdmin && <TabsTrigger value="rates">Tarifas</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Espacios por Ubicación</CardTitle>
              <CardDescription>Estado de ocupación actual basado en reservas activas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  Cargando datos de ocupación...
                </div>
              ) : occupancy.length === 0 ? (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  No hay ubicaciones registradas todavía.
                </div>
              ) : (
                occupancy.map((entry) => (
                  <div key={entry.locationId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{entry.locationName}</span>
                      <span className="text-muted-foreground">
                        {entry.occupied}/{entry.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min(entry.rate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operation">
          <OperationPanel />
        </TabsContent>

        <TabsContent value="reservations">
          <ReservationsPanel />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users">
            <UserManagementPanel />
          </TabsContent>
        )}

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
