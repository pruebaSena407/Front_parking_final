import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CreditCard, Wallet, Receipt, Clock, Info, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import paymentService, { type Payment } from "@/services/paymentService";
import reservationService, { type Reservation } from "@/services/reservationService";
import { useAuth } from "@/contexts/AuthContext";

const paymentSchema = z.object({
  reservationId: z.coerce.number().positive({ message: "Selecciona una reserva" }),
  amount: z.coerce.number().positive({ message: "El monto debe ser positivo" }),
  paymentMethod: z.enum(["credit_card", "debit_card", "cash", "app"]),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardName: z.string().optional(),
});

type FormValues = z.infer<typeof paymentSchema>;

const METHOD_LABELS: Record<string, string> = {
  credit_card: "Tarjeta de Crédito",
  debit_card: "Tarjeta de Débito",
  cash: "Efectivo",
  app: "Aplicación",
};

function methodIcon(method: string) {
  if (method === "cash") return <Wallet className="h-4 w-4" />;
  if (method === "app") return <Receipt className="h-4 w-4" />;
  return <CreditCard className="h-4 w-4" />;
}

function statusBadge(status: string) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle2 className="w-3 h-3 mr-1" /> Completado
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" /> Pendiente
      </span>
    );
  }
  if (status === "refunded") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Reembolsado
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Fallido
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {status}
    </span>
  );
}

export function PaymentView() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tab, setTab] = useState("new");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      reservationId: 0,
      amount: 0,
      paymentMethod: "credit_card",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const loadAll = async () => {
    setLoadingPayments(true);
    try {
      const [allPayments, allReservations] = await Promise.all([
        paymentService.getPayments(),
        reservationService.getReservations(),
      ]);
      setPayments(allPayments);
      // Solo reservas del usuario actual y que aún no estén completadas/canceladas.
      const mine = user
        ? allReservations.filter((r) => String(r.userId) === String(user.id))
        : allReservations;
      setReservations(mine);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo cargar la información de pagos";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cuando el usuario selecciona una reserva, autocompletamos el monto si lo trae.
  const selectedReservationId = form.watch("reservationId");
  const selectedReservation = useMemo(
    () => reservations.find((r) => r.id === Number(selectedReservationId)) || null,
    [reservations, selectedReservationId]
  );

  useEffect(() => {
    if (selectedReservation && selectedReservation.totalPrice) {
      form.setValue("amount", selectedReservation.totalPrice);
    }
  }, [selectedReservation, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      await paymentService.createPayment({
        reservationId: values.reservationId,
        amount: values.amount,
        method: values.paymentMethod,
      });
      toast({ title: "Pago procesado", description: "El pago ha sido registrado correctamente." });
      form.reset({ reservationId: 0, amount: 0, paymentMethod: "credit_card" });
      await loadAll();
      setTab("history");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo procesar el pago";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const myPayments = useMemo(() => {
    if (!user) return payments;
    const myReservationIds = new Set(reservations.map((r) => r.id));
    return payments.filter((p) => myReservationIds.has(p.reservationId));
  }, [payments, reservations, user]);

  const pendingReservations = useMemo(
    () => reservations.filter((r) => r.status === "pending" || r.status === "confirmed"),
    [reservations]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Sistema de Pagos</h1>
        <p className="text-gray-600">Realiza pagos de tus reservas y consulta tu historial de transacciones.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="new">Nuevo Pago</TabsTrigger>
          <TabsTrigger value="history">Historial de Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Realizar un Pago</CardTitle>
              <CardDescription>
                Selecciona una de tus reservas pendientes y procesa el pago.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reservation">Reserva a pagar</Label>
                      <Select
                        value={String(form.watch("reservationId") || "")}
                        onValueChange={(v) => form.setValue("reservationId", Number(v))}
                      >
                        <SelectTrigger id="reservation">
                          <SelectValue placeholder="Selecciona una reserva" />
                        </SelectTrigger>
                        <SelectContent>
                          {pendingReservations.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No tienes reservas pendientes
                            </SelectItem>
                          ) : (
                            pendingReservations.map((r) => (
                              <SelectItem key={r.id} value={String(r.id)}>
                                Reserva #{r.id} — {new Date(r.startDate).toLocaleString()}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.reservationId && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.reservationId.message}
                        </p>
                      )}
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
                        onValueChange={(value) => form.setValue("paymentMethod", value as FormValues["paymentMethod"])}
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
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" {...form.register("cardNumber")} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                            <Input id="cardExpiry" placeholder="MM/AA" {...form.register("cardExpiry")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input id="cardCvc" placeholder="123" {...form.register("cardCvc")} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                          <Input id="cardName" placeholder="JUAN PEREZ" {...form.register("cardName")} />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "cash" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                        <div className="flex">
                          <Info className="h-5 w-5 text-amber-500 mr-2" />
                          <p className="text-sm text-amber-800">
                            El pago en efectivo debe realizarse en la caja del parqueadero. Presente el código QR que se generará al finalizar.
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "app" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                          <Info className="h-5 w-5 text-blue-500 mr-2" />
                          <p className="text-sm text-blue-800">
                            Se enviará una solicitud de pago a la aplicación ParkVista asociada a su cuenta. Debe confirmar el pago desde la aplicación.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden md:flex justify-end">
                  <Button type="submit" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Procesar Pago
                  </Button>
                </div>
              </form>
            </CardContent>
            <div
              className="md:hidden sticky bottom-0 bg-white border-t p-3 flex justify-end"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
            >
              <Button type="submit" size="lg" form="payment-form" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Procesar Pago
              </Button>
            </div>
            <CardFooter className="flex justify-between border-t pt-6">
              <p className="text-sm text-gray-500">Todos los pagos son procesados de forma segura</p>
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
              <CardDescription>Pagos registrados en el sistema asociados a tus reservas.</CardDescription>
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
                        <th className="p-4 text-left font-medium hidden md:table-cell">Reserva</th>
                        <th className="p-4 text-left font-medium hidden lg:table-cell">Referencia</th>
                        <th className="p-4 text-left font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {loadingPayments ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            Cargando pagos...
                          </td>
                        </tr>
                      ) : myPayments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-gray-500">
                            No hay pagos registrados.
                          </td>
                        </tr>
                      ) : (
                        myPayments.map((payment) => (
                          <tr key={payment.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">
                              {payment.createdAt ? format(new Date(payment.createdAt), "dd/MM/yyyy HH:mm") : "-"}
                            </td>
                            <td className="p-4 align-middle">
                              ${payment.amount.toLocaleString("es-CO")}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center">
                                {methodIcon(payment.method)}
                                <span className="ml-2 hidden xs:inline">
                                  {METHOD_LABELS[payment.method] ?? payment.method}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">#{payment.reservationId}</td>
                            <td className="p-4 align-middle hidden lg:table-cell">{payment.transactionId}</td>
                            <td className="p-4 align-middle">{statusBadge(payment.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t pt-6">
              <p className="text-sm text-gray-500 mb-2">
                * Los pagos pueden tardar hasta 24 horas en reflejarse en su historial.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
