import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Edit, Trash2, ListChecks } from "lucide-react";
import reservationService, { type Reservation } from "@/services/reservationService";
import { ReservationForm, type ReservationFormData } from "@/components/Reservations/ReservationForm";
import { useToast } from "@/hooks/use-toast";

export function ReservationsPanel() {
  const { toast } = useToast();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await reservationService.getReservations();
      setItems(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudieron cargar las reservas";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (r: Reservation) => {
    setEditing(r);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: ReservationFormData) => {
    if (!editing) return;
    try {
      const updated = await reservationService.updateReservation(editing.id, {
        locationId: data.locationId,
        vehicleId: data.vehicleId,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setDialogOpen(false);
      toast({ title: "Reserva actualizada" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No fue posible actualizar";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await reservationService.deleteReservation(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "Reserva eliminada" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo eliminar";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Reservas</CardTitle>
          <CardDescription>Listado general de reservas (empleados y administradores)</CardDescription>
        </div>
        <ListChecks className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2 py-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No hay reservas registradas"
            description="Cuando los clientes hagan reservas, aparecerán aquí."
          />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">
                      {r.userName || `Cliente #${r.userId}`}
                      {r.vehiclePlate && (
                        <span className="block text-xs text-muted-foreground">{r.vehiclePlate}</span>
                      )}
                    </TableCell>
                    <TableCell>{r.locationName || `#${r.locationId}`}</TableCell>
                    <TableCell>{new Date(r.startDate).toLocaleString()}</TableCell>
                    <TableCell>{new Date(r.endDate).toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{r.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" onClick={() => openEdit(r)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar reserva</DialogTitle>
          </DialogHeader>
          {editing && (
            <ReservationForm
              initialData={editing}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
