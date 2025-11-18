import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Edit, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cancelReservation, createReservation, listMyReservations, updateReservation, type Reservation } from "@/integrations/supabase/reservations";
import { ReservationForm } from "./ReservationForm";
import { useToast } from "@/hooks/use-toast";

export function ReservationsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);

  const activeReservations = useMemo(
    () => items.filter(r => r.status === "activa"),
    [items]
  );

  useEffect(() => {
    const run = async () => {
      if (!user) { setItems([]); setLoading(false); return; }
      setLoading(true);
      try {
        const data = await listMyReservations(user.id);
        setItems(data);
      } catch (e: any) {
        toast({ title: "Error", description: e.message || "No se pudieron cargar las reservas", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user, toast]);

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (r: Reservation) => { setEditing(r); setDialogOpen(true); };

  const handleSubmit = async (data: {
    location_name: string;
    space_code?: string | null;
    start_time: string;
    end_time: string;
    amount?: number | null;
    notes?: string | null;
  }) => {
    if (!user) return;
    try {
      if (editing) {
        const updated = await updateReservation(editing.id, {
          location_name: data.location_name,
          space_code: data.space_code ?? null,
          start_time: data.start_time,
          end_time: data.end_time,
          amount: data.amount ?? null,
          notes: data.notes ?? null,
        });
        setItems(prev => prev.map(x => x.id === updated.id ? updated : x));
        toast({ title: "Reserva actualizada", description: "Los cambios han sido guardados." });
      } else {
        const created = await createReservation({
          user_id: user.id,
          location_name: data.location_name,
          space_code: data.space_code ?? null,
          start_time: data.start_time,
          end_time: data.end_time,
          amount: data.amount ?? null,
          notes: data.notes ?? null,
        });
        setItems(prev => [created, ...prev]);
        toast({ title: "Reserva creada", description: "Tu reserva ha sido registrada." });
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No fue posible guardar la reserva", variant: "destructive" });
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const updated = await cancelReservation(id);
      setItems(prev => prev.map(x => x.id === id ? updated : x));
      toast({ title: "Reserva cancelada", description: "La reserva fue cancelada correctamente." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo cancelar la reserva", variant: "destructive" });
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
          <div className="rounded-md border overflow-x-auto hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="hidden sm:table-cell">Espacio</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead className="hidden md:table-cell">Fin</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeReservations.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.location_name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{r.space_code ?? "-"}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs sm:text-sm">{new Date(r.start_time).toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap text-sm">{new Date(r.end_time).toLocaleString()}</TableCell>
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
          /* Card view en móvil */
          <div className="sm:hidden space-y-3">
            {activeReservations.map(r => (
              <div key={r.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.location_name}</div>
                  <div className="text-xs text-muted-foreground">{r.space_code ?? "-"}</div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <div>Inicio: {new Date(r.start_time).toLocaleString()}</div>
                  <div>Fin: {new Date(r.end_time).toLocaleString()}</div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Editar</Button>
                  <Button size="sm" variant="outline" onClick={() => handleCancel(r.id)}>Cancelar</Button>
                </div>
              </div>
            ))}
          </div>
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
      {/* FAB móvil para crear reserva */}
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


