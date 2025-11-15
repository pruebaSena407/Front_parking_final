
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, CreditCard, Wallet, Receipt, Clock, Info, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const paymentSchema = z.object({
  licensePlate: z.string().min(5, { message: "Ingrese una placa válida" }).max(7),
  amount: z.coerce.number().positive({ message: "El monto debe ser positivo" }),
  paymentMethod: z.enum(["credit_card", "debit_card", "cash", "app"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardName: z.string().optional(),
});

type PaymentHistoryItem = {
  id: string;
  date: Date;
  amount: number;
  paymentMethod: string;
  location: string;
  status: "completed" | "pending" | "failed";
  reference: string;
};

export function PaymentView() {
  const [paymentTab, setPaymentTab] = useState("new");
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  
  const paymentHistory: PaymentHistoryItem[] = [
    {
      id: "1",
      date: new Date(2025, 3, 10, 14, 30),
      amount: 12000,
      paymentMethod: "credit_card",
      location: "Centro Comercial Centro",
      status: "completed",
      reference: "PV-2025041001"
    },
    {
      id: "2",
      date: new Date(2025, 3, 5, 10, 15),
      amount: 8000,
      paymentMethod: "app",
      location: "Chapinero Central",
      status: "completed",
      reference: "PV-2025040501"
    },
    {
      id: "3",
      date: new Date(2025, 3, 1, 17, 45),
      amount: 15000,
      paymentMethod: "debit_card",
      location: "Salitre Plaza",
      status: "completed",
      reference: "PV-2025040101"
    },
    {
      id: "4",
      date: new Date(2025, 2, 28, 9, 20),
      amount: 5000,
      paymentMethod: "cash",
      location: "Centro Comercial Norte",
      status: "pending",
      reference: "PV-2025032801"
    }
  ];
  
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      licensePlate: "",
      amount: 0,
      paymentMethod: "credit_card",
    },
  });
  
  const paymentMethod = form.watch("paymentMethod");
  
  const handleSubmit = (values: z.infer<typeof paymentSchema>) => {
    console.log(values);
    toast({
      title: "Pago procesado",
      description: "El pago ha sido procesado exitosamente.",
    });
    form.reset();
  };
  
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <Wallet className="h-4 w-4" />;
      case 'app':
        return <Receipt className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'debit_card':
        return 'Tarjeta de Débito';
      case 'cash':
        return 'Efectivo';
      case 'app':
        return 'Aplicación';
      default:
        return method;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Completado</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pendiente</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Fallido</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Sistema de Pagos</h1>
        <p className="text-gray-600">
          Realiza pagos de parqueaderos y consulta tu historial de transacciones
        </p>
      </div>

      <Tabs defaultValue={paymentTab} onValueChange={setPaymentTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="new">Nuevo Pago</TabsTrigger>
          <TabsTrigger value="history">Historial de Pagos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Realizar un Pago</CardTitle>
              <CardDescription>
                Complete los detalles para realizar el pago de su servicio de parqueadero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">Placa del Vehículo</Label>
                      <Input
                        id="licensePlate"
                        placeholder="ABC123"
                        {...form.register("licensePlate")}
                      />
                      {form.formState.errors.licensePlate && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.licensePlate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha y Hora</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP HH:mm", { locale: es }) : "Seleccione fecha y hora"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación del Parqueadero</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="centro">Centro Comercial Centro</SelectItem>
                          <SelectItem value="norte">Centro Comercial Norte</SelectItem>
                          <SelectItem value="salitre">Salitre Plaza</SelectItem>
                          <SelectItem value="chapinero">Chapinero Central</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                      
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto a Pagar (COP)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="10000"
                        {...form.register("amount")}
                      />
                      {form.formState.errors.amount && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.amount.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Método de Pago</Label>
                      <RadioGroup 
                        defaultValue={form.getValues("paymentMethod")}
                        onValueChange={(value) => form.setValue("paymentMethod", value as any)}
                        className="gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <Label htmlFor="credit_card" className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Tarjeta de Crédito
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="debit_card" id="debit_card" />
                          <Label htmlFor="debit_card" className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Tarjeta de Débito
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex items-center">
                            <Wallet className="mr-2 h-4 w-4" />
                            Efectivo
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="app" id="app" />
                          <Label htmlFor="app" className="flex items-center">
                            <Receipt className="mr-2 h-4 w-4" />
                            Aplicación ParkVista
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            {...form.register("cardNumber")}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/AA"
                              {...form.register("cardExpiry")}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input
                              id="cardCvc"
                              placeholder="123"
                              {...form.register("cardCvc")}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                          <Input
                            id="cardName"
                            placeholder="JUAN PEREZ"
                            {...form.register("cardName")}
                          />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "cash" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                        <div className="flex">
                          <Info className="h-5 w-5 text-amber-500 mr-2" />
                          <p className="text-sm text-amber-800">
                            El pago en efectivo debe realizarse en la caja del parqueadero. 
                            Presente el código QR que se generará al finalizar.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "app" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                          <Info className="h-5 w-5 text-blue-500 mr-2" />
                          <p className="text-sm text-blue-800">
                            Se enviará una solicitud de pago a la aplicación ParkVista asociada a su cuenta.
                            Debe confirmar el pago desde la aplicación.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Procesar Pago
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-gray-500">
                Todos los pagos son procesados de forma segura
              </p>
              <div className="flex space-x-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <Wallet className="h-5 w-5 text-gray-400" />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Historial de Pagos</CardTitle>
              <CardDescription>
                Consulta los pagos realizados en los últimos 3 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors bg-muted/50">
                        <th className="p-4 text-left font-medium">Fecha</th>
                        <th className="p-4 text-left font-medium">Monto</th>
                        <th className="p-4 text-left font-medium">Método</th>
                        <th className="p-4 text-left font-medium">Ubicación</th>
                        <th className="p-4 text-left font-medium">Referencia</th>
                        <th className="p-4 text-left font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            {format(payment.date, "dd/MM/yyyy HH:mm")}
                          </td>
                          <td className="p-4 align-middle">
                            ${payment.amount.toLocaleString('es-CO')}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                              <span className="ml-2">{getPaymentMethodLabel(payment.paymentMethod)}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{payment.location}</td>
                          <td className="p-4 align-middle">{payment.reference}</td>
                          <td className="p-4 align-middle">
                            {getStatusBadge(payment.status)}
                          </td>
                        </tr>
                      ))}
                      {paymentHistory.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            No hay pagos registrados en los últimos 3 meses
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t pt-6">
              <p className="text-sm text-gray-500 mb-2">
                * Los pagos pueden tardar hasta 24 horas en reflejarse en su historial
              </p>
              <Button variant="outline" size="sm">
                <Receipt className="mr-2 h-4 w-4" />
                Descargar comprobantes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
