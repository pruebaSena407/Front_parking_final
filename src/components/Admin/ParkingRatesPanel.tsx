
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { ParkingRateForm } from "./ParkingRateForm";
import { useToast } from "@/hooks/use-toast";

// Properly type the vehicleType
type VehicleType = "car" | "motorcycle" | "bicycle" | "truck";

// Mock data for rates with proper typing
const initialRates = [
  { id: 1, name: "Tarifa Estándar", hourlyRate: 5000, dailyRate: 25000, vehicleType: "car" as VehicleType },
  { id: 2, name: "Tarifa Motocicleta", hourlyRate: 3000, dailyRate: 15000, vehicleType: "motorcycle" as VehicleType },
  { id: 3, name: "Tarifa Premium", hourlyRate: 8000, dailyRate: 40000, vehicleType: "car" as VehicleType },
];

export type ParkingRate = {
  id: number;
  name: string;
  hourlyRate: number;
  dailyRate: number;
  vehicleType: VehicleType;
};

export function ParkingRatesPanel() {
  const [rates, setRates] = useState<ParkingRate[]>(initialRates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRate, setCurrentRate] = useState<ParkingRate | null>(null);
  const { toast } = useToast();

  const handleAddRate = (rate: Omit<ParkingRate, "id">) => {
    const newRate = {
      ...rate,
      id: rates.length ? Math.max(...rates.map(r => r.id)) + 1 : 1
    };
    
    setRates([...rates, newRate]);
    setIsDialogOpen(false);
    
    toast({
      title: "Tarifa creada",
      description: `${rate.name} ha sido añadida correctamente.`
    });
  };

  const handleEditRate = (rate: ParkingRate) => {
    setRates(rates.map(r => r.id === rate.id ? rate : r));
    setCurrentRate(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Tarifa actualizada",
      description: `${rate.name} ha sido actualizada correctamente.`
    });
  };

  const handleDeleteRate = (id: number) => {
    const rateToDelete = rates.find(r => r.id === id);
    setRates(rates.filter(r => r.id !== id));
    
    toast({
      title: "Tarifa eliminada",
      description: `${rateToDelete?.name} ha sido eliminada correctamente.`,
      variant: "destructive"
    });
  };

  const openEditDialog = (rate: ParkingRate) => {
    setCurrentRate(rate);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setCurrentRate(null);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getVehicleTypeLabel = (type: VehicleType) => {
    const types: Record<VehicleType, string> = {
      car: "Automóvil",
      motorcycle: "Motocicleta",
      bicycle: "Bicicleta",
      truck: "Camión"
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
              <DialogTitle>
                {currentRate ? "Editar Tarifa" : "Añadir Nueva Tarifa"}
              </DialogTitle>
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
              {rates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No hay tarifas registradas.
                  </TableCell>
                </TableRow>
              ) : (
                rates.map(rate => (
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
