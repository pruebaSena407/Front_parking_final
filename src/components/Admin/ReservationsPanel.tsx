import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, ListChecks } from "lucide-react";
import { listAllReservations, updateReservation, deleteReservation, type Reservation } from "@/integrations/supabase/reservations";
import { ReservationForm } from "@/components/Reservations/ReservationForm";
import { useToast } from "@/hooks/use-toast";

export function ReservationsPanel() {
  const { toast } = useToast();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await listAllReservations();
        setItems(data);
      } catch (e: any) {
        toast({ title: "Error", description: e.message || "No se pudieron cargar las reservas", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [toast]);

  const openEdit = (r: Reservation) => { setEditing(r); setDialogOpen(true); };

  const handleSubmit = async (data: {
    location_name: string;
    space_code?: string | null;
    start_time: string;
    end_time: string;
    amount?: number | null;
    notes?: string | null;
  }) => {
    if (!editing) return;
    try {
      const updated = await updateReservation(editing.id, {
        location_name: data.location_name,
        space_code: data.space_code ?? null,
        start_time: data.start_time,
        end_time: data.end_time,
        amount: data.amount ?? null,
        notes: data.notes ?? null,
      });
      setItems(prev => prev.map(x => x.id === updated.id ? updated : x));
      setDialogOpen(false);
      toast({ title: "Reserva actualizada" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No fue posible actualizar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReservation(id);
      setItems(prev => prev.filter(x => x.id !== id));
      toast({ title: "Reserva eliminada" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo eliminar", variant: "destructive" });
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
          <div className="text-sm text-muted-foreground py-8 text-center">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">No hay reservas registradas.</div>
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
                {items.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.user_id}</TableCell>
                    <TableCell>{r.location_name}</TableCell>
                    <TableCell>{new Date(r.start_time).toLocaleString()}</TableCell>
                    <TableCell>{new Date(r.end_time).toLocaleString()}</TableCell>
                    <TableCell>{r.status}</TableCell>
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


