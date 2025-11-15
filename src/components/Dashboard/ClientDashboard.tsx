import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, MapPin, CreditCard, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Cliente</h1>
        <p className="text-muted-foreground">Bienvenido, gestiona tus reservas y pagos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ubicaciones Favoritas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Parqueaderos guardados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pago</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25.000</div>
            <p className="text-xs text-muted-foreground">Vence en 5 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48h</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mis Reservas</CardTitle>
            <CardDescription>Gestiona tus reservas de parqueadero</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Parqueadero Centro</p>
                <p className="text-sm text-muted-foreground">Activa - Espacio A-12</p>
              </div>
              <Button size="sm">Ver Detalles</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Parqueadero Norte</p>
                <p className="text-sm text-muted-foreground">Activa - Espacio B-05</p>
              </div>
              <Button size="sm">Ver Detalles</Button>
            </div>
            <Button className="w-full" variant="outline">
              <Car className="mr-2 h-4 w-4" />
              Nueva Reserva
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Últimas transacciones realizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">$25.000</p>
                <p className="text-sm text-muted-foreground">15 Nov 2025 - Mensualidad</p>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Pagado</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">$25.000</p>
                <p className="text-sm text-muted-foreground">15 Oct 2025 - Mensualidad</p>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Pagado</span>
            </div>
            <Button className="w-full" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Ver Todos los Pagos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
