
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
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { ParkingLocationForm } from "./ParkingLocationForm";
import { useToast } from "@/hooks/use-toast";

// Mock data for locations
const initialLocations = [
  { id: 1, name: "Centro Comercial Andino", address: "Carrera 11 #82-71", capacity: 150, latitude: 4.667, longitude: -74.055 },
  { id: 2, name: "Centro Internacional", address: "Carrera 7 #33-49", capacity: 200, latitude: 4.617, longitude: -74.068 },
  { id: 3, name: "Parque de la 93", address: "Calle 93 #13-45", capacity: 120, latitude: 4.676, longitude: -74.046 },
];

export type ParkingLocation = {
  id: number;
  name: string;
  address: string;
  capacity: number;
  latitude: number;
  longitude: number;
};

export function ParkingLocationsPanel() {
  const [locations, setLocations] = useState<ParkingLocation[]>(initialLocations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<ParkingLocation | null>(null);
  const { toast } = useToast();

  const handleAddLocation = (location: Omit<ParkingLocation, "id">) => {
    const newLocation = {
      ...location,
      id: locations.length ? Math.max(...locations.map(loc => loc.id)) + 1 : 1
    };
    
    setLocations([...locations, newLocation]);
    setIsDialogOpen(false);
    
    toast({
      title: "Ubicación creada",
      description: `${location.name} ha sido añadido correctamente.`
    });
  };

  const handleEditLocation = (location: ParkingLocation) => {
    setLocations(locations.map(loc => loc.id === location.id ? location : loc));
    setCurrentLocation(null);
    setIsDialogOpen(false);
    
    toast({
      title: "Ubicación actualizada",
      description: `${location.name} ha sido actualizado correctamente.`
    });
  };

  const handleDeleteLocation = (id: number) => {
    const locationToDelete = locations.find(loc => loc.id === id);
    setLocations(locations.filter(loc => loc.id !== id));
    
    toast({
      title: "Ubicación eliminada",
      description: `${locationToDelete?.name} ha sido eliminado correctamente.`,
      variant: "destructive"
    });
  };

  const openEditDialog = (location: ParkingLocation) => {
    setCurrentLocation(location);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setCurrentLocation(null);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ubicaciones de Parqueaderos</CardTitle>
          <CardDescription>Gestiona las ubicaciones de los parqueaderos disponibles.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Ubicación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {currentLocation ? "Editar Ubicación" : "Añadir Nueva Ubicación"}
              </DialogTitle>
            </DialogHeader>
            <ParkingLocationForm 
              initialData={currentLocation || undefined} 
              onSubmit={currentLocation ? handleEditLocation : handleAddLocation} 
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
                <TableHead>Dirección</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No hay ubicaciones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                locations.map(location => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        {location.address}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{location.capacity} vehículos</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(location)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteLocation(location.id)}>
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
