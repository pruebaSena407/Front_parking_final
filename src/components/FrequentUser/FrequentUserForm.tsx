
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CreditCard, Car, Clock } from "lucide-react";

const frequentUserSchema = z.object({
  fullName: z.string().min(5, { message: "El nombre completo debe tener al menos 5 caracteres" }),
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
  phone: z.string().min(10, { message: "Ingresa un número de teléfono válido" }),
  documentType: z.enum(["cedula", "pasaporte", "extranjeria"]),
  documentNumber: z.string().min(5, { message: "Ingresa un número de documento válido" }),
  vehicleType: z.enum(["car", "motorcycle", "bicycle", "truck"]),
  licensePlate: z.string().min(5, { message: "Ingresa una placa válida" }).max(7),
  vehicleBrand: z.string().min(2, { message: "Ingresa la marca del vehículo" }),
  vehicleModel: z.string().min(2, { message: "Ingresa el modelo del vehículo" }),
  address: z.string().min(10, { message: "Ingresa una dirección completa" }),
  preferredLocation: z.string(),
  tosAccepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos y condiciones para continuar" }),
  }),
});

type FormValues = z.infer<typeof frequentUserSchema>;

export function FrequentUserForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(frequentUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      documentType: "cedula",
      documentNumber: "",
      vehicleType: "car",
      licensePlate: "",
      vehicleBrand: "",
      vehicleModel: "",
      address: "",
      preferredLocation: "",
      tosAccepted: false as any, // This fixes the TypeScript error by using type assertion
    },
  });

  const { toast } = useToast();

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast({
      title: "Registro exitoso",
      description: "Tu solicitud ha sido enviada. Te contactaremos pronto.",
    });
    form.reset();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Registro de Usuario Frecuente</h1>
        <p className="text-gray-600">
          Completa el siguiente formulario para registrarte como usuario frecuente y
          obtener beneficios exclusivos, tarifas preferenciales y acceso rápido a nuestros parqueaderos.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Información Personal y Vehicular</CardTitle>
          <CardDescription>
            Ingresa tus datos personales y los detalles de tu vehículo para completar el registro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Información Personal
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez González" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="juan@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="3001234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo Documento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cedula">Cédula</SelectItem>
                              <SelectItem value="pasaporte">Pasaporte</SelectItem>
                              <SelectItem value="extranjeria">Extranjería</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="documentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="1020304050" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Calle 123 #45-67, Bogotá" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Información del vehículo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    Información del Vehículo
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Vehículo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
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
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vehicleBrand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Input placeholder="Chevrolet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vehicleModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <FormControl>
                            <Input placeholder="Spark GT 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="preferredLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sede Preferida</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una sede" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="centro">Centro Comercial Centro</SelectItem>
                            <SelectItem value="norte">Centro Comercial Norte</SelectItem>
                            <SelectItem value="salitre">Salitre Plaza</SelectItem>
                            <SelectItem value="chapinero">Chapinero Central</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Beneficios de Usuario Frecuente
                    </h3>
                    <ul className="list-disc pl-5 pt-2 text-sm text-gray-600">
                      <li>Tarifas con hasta 30% de descuento</li>
                      <li>Acceso rápido sin hacer fila</li>
                      <li>Facturación mensual consolidada</li>
                      <li>Reserva de espacios preferentes</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="tosAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Acepto los <a href="#" className="text-primary underline">términos y condiciones</a> y la <a href="#" className="text-primary underline">política de privacidad</a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" size="lg">
                  Registrarme como Usuario Frecuente
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500">
            La información proporcionada será usada únicamente para los fines del servicio 
            de parqueadero y se manejará de acuerdo a nuestra política de privacidad.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
