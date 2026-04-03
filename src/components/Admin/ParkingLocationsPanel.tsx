
import { useState, useEffect } from "react";
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
import locationService, { type Location as ParkingLocation } from "@/services/locationService";

export function ParkingLocationsPanel() {
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<ParkingLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const data = await locationService.getLocations();
      setLocations(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al cargar ubicaciones";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = async (location: Omit<ParkingLocation, "id">) => {
    try {
      const newLocation = await locationService.createLocation({
        name: location.name,
        address: location.address,
        capacity: location.capacity,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      setLocations([...locations, newLocation]);
      setIsDialogOpen(false);
      
      toast({
        title: "Ubicación creada",
        description: `${location.name} ha sido añadido correctamente.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear ubicación";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleEditLocation = async (location: ParkingLocation) => {
    try {
      const updated = await locationService.updateLocation(location.id, {
        name: location.name,
        address: location.address,
        capacity: location.capacity,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      setLocations(locations.map(loc => loc.id === location.id ? updated : loc));
      setCurrentLocation(null);
      setIsDialogOpen(false);
      
      toast({
        title: "Ubicación actualizada",
        description: `${location.name} ha sido actualizado correctamente.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar ubicación";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDeleteLocation = async (id: number) => {
    try {
      const locationToDelete = locations.find(loc => loc.id === id);
      await locationService.deleteLocation(id);
      setLocations(locations.filter(loc => loc.id !== id));
      
      toast({
        title: "Ubicación eliminada",
        description: `${locationToDelete?.name} ha sido eliminado correctamente.`,
        variant: "destructive"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar ubicación";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
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
        {isLoading ? (
          <div className="flex justify-center py-6">
            <p className="text-muted-foreground">Cargando ubicaciones...</p>
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
