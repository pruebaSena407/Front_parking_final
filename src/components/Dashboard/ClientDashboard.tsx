import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, CreditCard, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ReservationsList } from "@/components/Reservations/ReservationsList";
import { ReservationHistory } from "@/components/Reservations/ReservationHistory";
import reservationService, { type Reservation } from "@/services/reservationService";
import frequentUserService, { type FrequentStatus } from "@/services/frequentUserService";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export const ClientDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [frequent, setFrequent] = useState<FrequentStatus | null>(null);

  useEffect(() => {
    frequentUserService.getMe().then(setFrequent).catch(() => setFrequent(null));
  }, [user]);

  useEffect(() => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }
    let mounted = true;
    const run = async () => {
      try {
        const all = await reservationService.getReservations();
        if (!mounted) return;
        setReservations(all.filter((r) => String(r.userId) === String(user.id)));
      } catch {
        // Las listas de reservas ya muestran sus propios errores
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [user]);

  const kpis = useMemo(() => {
    const active = reservations.filter(
      (r) => r.status === "pending" || r.status === "confirmed"
    );
    const activeCount = active.length;

    const uniqueLocations = new Set(reservations.map((r) => r.locationId)).size;

    const nextPending = active
      .filter((r) => r.totalPrice != null)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
    const nextPayment = nextPending?.totalPrice ?? 0;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedThisMonth = reservations.filter(
      (r) => r.status === "completed" && new Date(r.startDate) >= monthStart
    );
    const totalHours = completedThisMonth.reduce((acc, r) => {
      const ms = new Date(r.endDate).getTime() - new Date(r.startDate).getTime();
      return acc + Math.max(0, ms / 3_600_000);
    }, 0);

    return { activeCount, uniqueLocations, nextPayment, totalHours: Math.round(totalHours) };
  }, [reservations]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">Panel de Cliente</h1>
          {frequent?.isFrequent && (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Star className="h-3 w-3 mr-1" /> Cliente frecuente · {frequent.discount}% dto.
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">Bienvenido, gestiona tus reservas y pagos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : kpis.activeCount}
            </div>
            <p className="text-xs text-muted-foreground">Pendientes o confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones Usadas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : kpis.uniqueLocations}
            </div>
            <p className="text-xs text-muted-foreground">Parqueaderos distintos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pago</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : kpis.nextPayment > 0 ? formatCurrency(kpis.nextPayment) : "—"}
            </div>
            <p className="text-xs text-muted-foreground">Reserva pendiente más próxima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : `${kpis.totalHours}h`}
            </div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="reservas">
          <ReservationsList />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Reservas</CardTitle>
            <CardDescription>Reservas anteriores y canceladas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReservationHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
