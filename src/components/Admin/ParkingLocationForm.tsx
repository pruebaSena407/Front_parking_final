
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ParkingLocation } from "./ParkingLocationsPanel";

const parkingLocationSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  capacity: z.coerce.number().int().positive({ message: "La capacidad debe ser un número positivo" }),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

type FormValues = z.infer<typeof parkingLocationSchema>;

interface ParkingLocationFormProps {
  initialData?: ParkingLocation;
  onSubmit: (data: ParkingLocation) => void;
  onCancel: () => void;
}

export function ParkingLocationForm({ initialData, onSubmit, onCancel }: ParkingLocationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(parkingLocationSchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      capacity: 100,
      latitude: 4.6097, // Bogotá default latitude
      longitude: -74.0817, // Bogotá default longitude
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (initialData) {
      // Using the non-null assertion operator to ensure all required fields are present
      onSubmit({
        id: initialData.id,
        name: values.name,
        address: values.address,
        capacity: values.capacity,
        latitude: values.latitude,
        longitude: values.longitude
      });
    } else {
      // For new locations, pass the values directly as they're fully defined from the form
      onSubmit(values as unknown as ParkingLocation);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Parqueadero</FormLabel>
              <FormControl>
                <Input placeholder="Centro Comercial Andino" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Carrera 11 #82-71" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad (vehículos)</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitud</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Actualizar" : "Crear"} Ubicación
          </Button>
        </div>
      </form>
    </Form>
  );
}
