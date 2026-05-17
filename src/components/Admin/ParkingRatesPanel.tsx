import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ParkingRateForm } from "./ParkingRateForm";
import { useToast } from "@/hooks/use-toast";
import rateService, { type Rate, type VehicleType } from "@/services/rateService";

// Re-exportamos el tipo "ParkingRate" que usaba el formulario para no romper imports.
export type ParkingRate = {
  id: number;
  name: string;
  hourlyRate: number;
  dailyRate: number;
  vehicleType: VehicleType;
};

export function ParkingRatesPanel() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRate, setCurrentRate] = useState<ParkingRate | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await rateService.getRates();
      setRates(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al cargar tarifas";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddRate = async (rate: Omit<ParkingRate, "id">) => {
    try {
      const created = await rateService.createRate({
        name: rate.name,
        hourlyRate: rate.hourlyRate,
        dailyRate: rate.dailyRate,
        vehicleType: rate.vehicleType,
      });
      setRates((prev) => [...prev, created]);
      setIsDialogOpen(false);
      toast({ title: "Tarifa creada", description: `${rate.name} ha sido añadida correctamente.` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo crear la tarifa";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleEditRate = async (rate: ParkingRate) => {
    try {
      const updated = await rateService.updateRate(rate.id, {
        name: rate.name,
        hourlyRate: rate.hourlyRate,
        dailyRate: rate.dailyRate,
        vehicleType: rate.vehicleType,
      });
      setRates((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setCurrentRate(null);
      setIsDialogOpen(false);
      toast({ title: "Tarifa actualizada", description: `${rate.name} ha sido actualizada correctamente.` });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo actualizar la tarifa";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const handleDeleteRate = async (id: number) => {
    const rateToDelete = rates.find((r) => r.id === id);
    try {
      await rateService.deleteRate(id);
      setRates((prev) => prev.filter((r) => r.id !== id));
      toast({
        title: "Tarifa eliminada",
        description: `${rateToDelete?.name} ha sido eliminada correctamente.`,
        variant: "destructive",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo eliminar la tarifa";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const openEditDialog = (rate: Rate) => {
    setCurrentRate({
      id: rate.id,
      name: rate.name,
      hourlyRate: rate.hourlyRate,
      dailyRate: rate.dailyRate,
      vehicleType: rate.vehicleType,
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setCurrentRate(null);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const getVehicleTypeLabel = (type: VehicleType) => {
    const types: Record<VehicleType, string> = {
      car: "Automóvil",
      motorcycle: "Motocicleta",
      bicycle: "Bicicleta",
      truck: "Camión",
    };
    return types[type];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tarifas de Parqueadero</CardTitle>
          <CardDescription>Gestiona las tarifas para diferentes tipos de vehículos.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Tarifa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{currentRate ? "Editar Tarifa" : "Añadir Nueva Tarifa"}</DialogTitle>
            </DialogHeader>
            <ParkingRateForm
              initialData={currentRate || undefined}
              onSubmit={currentRate ? handleEditRate : handleAddRate}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo de Vehículo</TableHead>
                <TableHead className="text-right">Tarifa por Hora</TableHead>
                <TableHead className="text-right">Tarifa Diaria</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Cargando tarifas...
                  </TableCell>
                </TableRow>
              ) : rates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No hay tarifas registradas.
                  </TableCell>
                </TableRow>
              ) : (
                rates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell className="font-medium">{rate.name}</TableCell>
                    <TableCell>{getVehicleTypeLabel(rate.vehicleType)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(rate.hourlyRate)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(rate.dailyRate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(rate)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteRate(rate.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
