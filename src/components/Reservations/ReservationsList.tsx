import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Edit, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import reservationService, { type Reservation } from "@/services/reservationService";
import { ReservationForm, type ReservationFormData } from "./ReservationForm";
import { useToast } from "@/hooks/use-toast";

export function ReservationsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);

  const activeReservations = useMemo(
    () => items.filter((r) => r.status === "confirmed" || r.status === "pending"),
    [items]
  );

  const loadMine = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await reservationService.getReservations();
      // El backend devuelve TODAS las reservas; filtramos las del usuario actual.
      setItems(data.filter((r) => String(r.userId) === String(user.id)));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudieron cargar las reservas";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (r: Reservation) => { setEditing(r); setDialogOpen(true); };

  const handleSubmit = async (data: ReservationFormData) => {
    if (!user) return;
    try {
      if (editing) {
        const updated = await reservationService.updateReservation(editing.id, {
          locationId: data.locationId,
          vehicleId: data.vehicleId,
          startDate: data.startDate,
          endDate: data.endDate,
        });
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        toast({ title: "Reserva actualizada", description: "Los cambios han sido guardados." });
      } else {
        const created = await reservationService.createReservation({
          userId: user.id,
          locationId: data.locationId,
          vehicleId: data.vehicleId,
          startDate: data.startDate,
          endDate: data.endDate,
          spaceCode: data.spaceCode,
          totalPrice: data.totalPrice,
          notes: data.notes,
        });
        setItems((prev) => [created, ...prev]);
        toast({ title: "Reserva creada", description: "Tu reserva ha sido registrada." });
      }
      setDialogOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No fue posible guardar la reserva";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleCancel = async (id: number) => {
    try {
      const updated = await reservationService.cancelReservation(id);
      // Si el backend respondió con la reserva, actualizamos en sitio;
      // si no devolvió cuerpo, simplemente recargamos.
      if (updated && updated.id) {
        setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
      } else {
        await loadMine();
      }
      toast({ title: "Reserva cancelada", description: "La reserva fue cancelada correctamente." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo cancelar la reserva";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Mis Reservas Activas</h3>
          </div>
          <Button onClick={openCreate} className="hidden md:inline-flex">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>
        {loading ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Cargando...</div>
        ) : activeReservations.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">No tienes reservas activas.</div>
        ) : (
          <>
          <div className="rounded-md border overflow-x-auto hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead className="hidden md:table-cell">Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeReservations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.locationName || `#${r.locationId}`}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs sm:text-sm">{new Date(r.startDate).toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap text-sm">{new Date(r.endDate).toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{r.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => openEdit(r)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleCancel(r.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="sm:hidden space-y-3">
            {activeReservations.map((r) => (
              <div key={r.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.locationName || `Ubicación #${r.locationId}`}</div>
                  <div className="text-xs text-muted-foreground capitalize">{r.status}</div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <div>Inicio: {new Date(r.startDate).toLocaleString()}</div>
                  <div>Fin: {new Date(r.endDate).toLocaleString()}</div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Editar</Button>
                  <Button size="sm" variant="outline" onClick={() => handleCancel(r.id)}>Cancelar</Button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar reserva" : "Nueva reserva"}</DialogTitle>
            </DialogHeader>
            <ReservationForm
              initialData={editing || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
      <Button
        className="md:hidden fixed bottom-20 right-5 rounded-full h-12 w-12 shadow-lg"
        onClick={openCreate}
        aria-label="Nueva reserva"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </Card>
  );
}
