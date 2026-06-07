import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { LogIn, LogOut, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import registroService, { type Registro } from "@/services/registroService";
import locationService, { type Location } from "@/services/locationService";

/**
 * Operación del parqueadero automatizado: registrar ENTRADA (check-in) y
 * SALIDA (check-out) de vehículos. Disponible para empleados y administradores.
 */
export function OperationPanel() {
  const { toast } = useToast();
  const [active, setActive] = useState<Registro[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [locationId, setLocationId] = useState<string>("");

  const load = async () => {
    setLoading(true);
    try {
      const [act, locs] = await Promise.all([
        registroService.listActive(),
        locationService.getLocations(),
      ]);
      setActive(act);
      setLocations(locs);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo cargar la operación";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !plate.trim()) return;
    setSubmitting(true);
    try {
      await registroService.checkin({
        plate: plate.trim().toUpperCase(),
        vehicleType,
        locationId: locationId ? Number(locationId) : undefined,
      });
      toast({ title: "Entrada registrada", description: `Vehículo ${plate.toUpperCase()} ingresó.` });
      setPlate("");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo registrar la entrada";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      const res = await registroService.checkout(id);
      const mins = res.durationMinutes;
      toast({
        title: "Salida registrada",
        description: mins != null ? `Duración: ${Math.floor(mins / 60)}h ${mins % 60}m` : "Vehículo retirado.",
      });
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo registrar la salida";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-primary" /> Registrar entrada
          </CardTitle>
          <CardDescription>Ingresa la placa del vehículo para registrar su entrada.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckin} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="plate">Placa</Label>
              <Input id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Tipo</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger id="vehicleType"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Carro</SelectItem>
                  <SelectItem value="motorcycle">Moto</SelectItem>
                  <SelectItem value="bicycle">Bicicleta</SelectItem>
                  <SelectItem value="truck">Camión</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger id="location"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={submitting || !plate.trim()}>
              <LogIn className="h-4 w-4 mr-2" />
              {submitting ? "Registrando..." : "Entrada"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" /> Vehículos dentro
          </CardTitle>
          <CardDescription>Vehículos actualmente en el parqueadero (sin salida registrada).</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : active.length === 0 ? (
            <EmptyState icon={Car} title="No hay vehículos dentro" description="Registra una entrada para verla aquí." />
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {active.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.plate || `#${r.vehicleId}`}</TableCell>
                      <TableCell>{r.locationName || (r.locationId ? `#${r.locationId}` : "-")}</TableCell>
                      <TableCell>{r.checkIn ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleCheckout(r.id)}>
                          <LogOut className="h-4 w-4 mr-2" /> Salida
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default OperationPanel;
