import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import reservationService, { type Reservation } from "@/services/reservationService";

export function ReservationHistory() {
  const { user } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useMemo(
    () =>
      items
        .filter((r) => r.status === "completed" || r.status === "cancelled")
        .sort((a, b) => (a.startDate < b.startDate ? 1 : -1)),
    [items]
  );

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await reservationService.getReservations();
        setItems(data.filter((r) => String(r.userId) === String(user.id)));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Historial de Reservas</h3>
        {loading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Cargando...</div>
        ) : history.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">No hay historial de reservas.</div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead className="hidden md:table-cell">Fin</TableHead>
                  <TableHead className="hidden sm:table-cell">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.locationName || `#${r.locationId}`}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs sm:text-sm">{new Date(r.startDate).toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap text-sm">{new Date(r.endDate).toLocaleString()}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{r.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
