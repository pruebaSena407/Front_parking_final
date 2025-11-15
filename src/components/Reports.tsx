import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Calendar, ChartBar, FileText, Filter, Users } from "lucide-react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

const Reports = () => {
  const [timeFilter, setTimeFilter] = useState("weekly");
  const isMobile = useIsMobile();

  // Datos de muestra - En una aplicación real, estos datos vendrían de una API
  const vehicleData = [
    { name: "Lun", entradas: 45, salidas: 40 },
    { name: "Mar", entradas: 52, salidas: 48 },
    { name: "Mié", entradas: 49, salidas: 51 },
    { name: "Jue", entradas: 63, salidas: 59 },
    { name: "Vie", entradas: 75, salidas: 72 },
    { name: "Sáb", entradas: 84, salidas: 80 },
    { name: "Dom", entradas: 62, salidas: 65 },
  ];

  const revenueData = [
    { name: "Lun", ingresos: 250000 },
    { name: "Mar", ingresos: 320000 },
    { name: "Mié", ingresos: 300000 },
    { name: "Jue", ingresos: 450000 },
    { name: "Vie", ingresos: 520000 },
    { name: "Sáb", ingresos: 650000 },
    { name: "Dom", ingresos: 420000 },
  ];

  const clientTypeData = [
    { name: "Regulares", value: 65 },
    { name: "Ocasionales", value: 25 },
    { name: "Empresas", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  const TABLE_DATA = [
    { 
      fecha: "2024-04-01", 
      entradas: 152, 
      salidas: 145, 
      ingresos: "$1,230,000", 
      tiempoPromedio: "3h 22m" 
    },
    { 
      fecha: "2024-04-02", 
      entradas: 168, 
      salidas: 170, 
      ingresos: "$1,345,000", 
      tiempoPromedio: "2h 45m" 
    },
    { 
      fecha: "2024-04-03", 
      entradas: 145, 
      salidas: 142, 
      ingresos: "$1,180,000", 
      tiempoPromedio: "3h 05m" 
    },
    { 
      fecha: "2024-04-04", 
      entradas: 175, 
      salidas: 168, 
      ingresos: "$1,420,000", 
      tiempoPromedio: "2h 58m" 
    },
    { 
      fecha: "2024-04-05", 
      entradas: 195, 
      salidas: 192, 
      ingresos: "$1,580,000", 
      tiempoPromedio: "3h 15m" 
    }
  ];

  return (
    <section id="reports" className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 sm:text-4xl mb-2 md:mb-4">
            Panel de Informes
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Visualiza estadísticas detalladas sobre la operación de tu parqueadero con filtros temporales
          </p>
        </div>

        <div className="flex justify-end mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px] md:w-[180px]">
                <SelectValue placeholder="Seleccionar filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <TabsList className={`grid ${isMobile ? "grid-cols-2 gap-1" : "grid-cols-4"} max-w-lg mx-auto`}>
            <TabsTrigger value="overview" className="flex gap-1 md:gap-1.5 items-center text-xs md:text-sm">
              <ChartBar className="h-3 w-3 md:h-4 md:w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex gap-1 md:gap-1.5 items-center text-xs md:text-sm">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span>Vehículos</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex gap-1 md:gap-1.5 items-center text-xs md:text-sm">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span>Ingresos</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex gap-1 md:gap-1.5 items-center text-xs md:text-sm">
              <Users className="h-3 w-3 md:h-4 md:w-4" />
              <span>Clientes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Vehículos</CardTitle>
                  <CardDescription>Semana actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">430</div>
                  <p className="text-sm text-green-600">+12% vs. semana anterior</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ingresos Totales</CardTitle>
                  <CardDescription>Semana actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,910,000</div>
                  <p className="text-sm text-green-600">+8% vs. semana anterior</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tiempo Promedio</CardTitle>
                  <CardDescription>Estancia por vehículo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2h 53min</div>
                  <p className="text-sm text-red-600">-5% vs. semana anterior</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Clientes Nuevos</CardTitle>
                  <CardDescription>Semana actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">38</div>
                  <p className="text-sm text-green-600">+15% vs. semana anterior</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Entradas vs. Salidas</CardTitle>
                </CardHeader>
                <CardContent className={`${isMobile ? "h-[250px]" : "h-[400px]"} px-1 md:px-4`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vehicleData} margin={{ 
                      top: 5, 
                      right: isMobile ? 10 : 30, 
                      left: isMobile ? 0 : 20, 
                      bottom: 5 
                    }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 30 : 40} />
                      <Tooltip 
                        formatter={(value, name) => [value, name === "entradas" ? "Entradas" : "Salidas"]}
                        labelFormatter={(label) => `Día: ${label}`}
                      />
                      <Legend wrapperStyle={isMobile ? {fontSize: "10px"} : {}} />
                      <Bar dataKey="entradas" fill="#0ea5e9" name="Entradas" />
                      <Bar dataKey="salidas" fill="#10b981" name="Salidas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Ingresos Diarios</CardTitle>
                </CardHeader>
                <CardContent className={`${isMobile ? "h-[250px]" : "h-[400px]"} px-1 md:px-4`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ 
                      top: 5, 
                      right: isMobile ? 10 : 30, 
                      left: isMobile ? 0 : 20, 
                      bottom: 5 
                    }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 40 : 50} />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ingresos"]} />
                      <Legend wrapperStyle={isMobile ? {fontSize: "10px"} : {}} />
                      <Line type="monotone" dataKey="ingresos" stroke="#0ea5e9" strokeWidth={2} name="Ingresos" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Datos Detallados</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableCaption>Datos de los últimos 5 días</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Fecha</TableHead>
                      <TableHead className="text-xs md:text-sm">Entradas</TableHead>
                      <TableHead className="text-xs md:text-sm">Salidas</TableHead>
                      <TableHead className="text-xs md:text-sm">Ingresos</TableHead>
                      <TableHead className="text-xs md:text-sm">Tiempo Promedio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TABLE_DATA.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs md:text-sm">{row.fecha}</TableCell>
                        <TableCell className="text-xs md:text-sm">{row.entradas}</TableCell>
                        <TableCell className="text-xs md:text-sm">{row.salidas}</TableCell>
                        <TableCell className="text-xs md:text-sm">{row.ingresos}</TableCell>
                        <TableCell className="text-xs md:text-sm">{row.tiempoPromedio}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Flujo de Vehículos</CardTitle>
                <CardDescription className="text-xs md:text-sm">Entradas y salidas en el periodo seleccionado</CardDescription>
              </CardHeader>
              <CardContent className={`${isMobile ? "h-[300px]" : "h-[500px]"} px-1 md:px-4`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleData} margin={{ 
                    top: 5, 
                    right: isMobile ? 10 : 30, 
                    left: isMobile ? 0 : 20, 
                    bottom: 5 
                  }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 30 : 40} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === "entradas" ? "Entradas" : "Salidas"]}
                      labelFormatter={(label) => `Día: ${label}`}
                    />
                    <Legend wrapperStyle={isMobile ? {fontSize: "10px"} : {}} />
                    <Bar dataKey="entradas" fill="#0ea5e9" name="Entradas" />
                    <Bar dataKey="salidas" fill="#10b981" name="Salidas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Ingresos</CardTitle>
                <CardDescription className="text-xs md:text-sm">Ingresos en el periodo seleccionado</CardDescription>
              </CardHeader>
              <CardContent className={`${isMobile ? "h-[300px]" : "h-[500px]"} px-1 md:px-4`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ 
                    top: 5, 
                    right: isMobile ? 10 : 30, 
                    left: isMobile ? 0 : 20, 
                    bottom: 5 
                  }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 40 : 50} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ingresos"]} />
                    <Legend wrapperStyle={isMobile ? {fontSize: "10px"} : {}} />
                    <Line type="monotone" dataKey="ingresos" stroke="#0ea5e9" strokeWidth={2} name="Ingresos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Tipos de Clientes</CardTitle>
                <CardDescription className="text-xs md:text-sm">Distribución por tipo de cliente</CardDescription>
              </CardHeader>
              <CardContent className={`${isMobile ? "h-[300px]" : "h-[500px]"} px-1 md:px-4`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ 
                    top: 5, 
                    right: isMobile ? 10 : 30, 
                    left: isMobile ? 0 : 20, 
                    bottom: 5 
                  }}>
                    <Pie
                      data={clientTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => isMobile ? 
                        `${(percent * 100).toFixed(0)}%` : 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={isMobile ? 80 : 150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                    <Legend wrapperStyle={isMobile ? {fontSize: "10px"} : {}} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Reports;
