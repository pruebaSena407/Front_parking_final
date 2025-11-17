import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { listMyReservations, type Reservation } from "@/integrations/supabase/reservations";

export function ReservationHistory() {
  const { user } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useMemo(
    () => items.filter(r => r.status !== "activa").sort((a, b) => (a.start_time < b.start_time ? 1 : -1)),
    [items]
  );

  useEffect(() => {
    const run = async () => {
      if (!user) { setItems([]); setLoading(false); return; }
      setLoading(true);
      try {
        const data = await listMyReservations(user.id);
        setItems(data);
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
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.location_name}</TableCell>
                    <TableCell>{new Date(r.start_time).toLocaleString()}</TableCell>
                    <TableCell>{new Date(r.end_time).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {r.status}
                      </span>
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


