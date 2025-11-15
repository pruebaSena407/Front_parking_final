
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParkingRate } from "./ParkingRatesPanel";

const parkingRateSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  hourlyRate: z.coerce.number().positive({ message: "La tarifa por hora debe ser positiva" }),
  dailyRate: z.coerce.number().positive({ message: "La tarifa diaria debe ser positiva" }),
  vehicleType: z.enum(["car", "motorcycle", "bicycle", "truck"]),
});

type FormValues = z.infer<typeof parkingRateSchema>;

interface ParkingRateFormProps {
  initialData?: ParkingRate;
  onSubmit: (data: ParkingRate) => void;
  onCancel: () => void;
}

export function ParkingRateForm({ initialData, onSubmit, onCancel }: ParkingRateFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(parkingRateSchema),
    defaultValues: initialData || {
      name: "",
      hourlyRate: 5000,
      dailyRate: 25000,
      vehicleType: "car",
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (initialData) {
      onSubmit({
        id: initialData.id,
        name: values.name,
        hourlyRate: values.hourlyRate,
        dailyRate: values.dailyRate,
        vehicleType: values.vehicleType
      });
    } else {
      // For new rates, pass the values directly
      onSubmit(values as unknown as ParkingRate);
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
              <FormLabel>Nombre de la Tarifa</FormLabel>
              <FormControl>
                <Input placeholder="Tarifa Estándar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Vehículo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de vehículo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="car">Automóvil</SelectItem>
                  <SelectItem value="motorcycle">Motocicleta</SelectItem>
                  <SelectItem value="bicycle">Bicicleta</SelectItem>
                  <SelectItem value="truck">Camión</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarifa por Hora (COP)</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dailyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarifa Diaria (COP)</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Actualizar" : "Crear"} Tarifa
          </Button>
        </div>
      </form>
    </Form>
  );
}
