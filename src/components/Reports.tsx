import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  ResponsiveContainer,
} from "recharts";
import { Calendar, ChartBar, FileText, Filter, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import reportService, {
  type ReportPeriod,
  type VehicleFlowEntry,
  type RevenueEntry,
  type ClientTypeEntry,
  type DailySummaryEntry,
} from "@/services/reportService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const formatMoney = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const Reports = () => {
  const [timeFilter, setTimeFilter] = useState<ReportPeriod>("weekly");
  const [vehicleData, setVehicleData] = useState<VehicleFlowEntry[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueEntry[]>([]);
  const [clientTypeData, setClientTypeData] = useState<ClientTypeEntry[]>([]);
  const [tableData, setTableData] = useState<DailySummaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      try {
        const [flow, revenue, clientTypes, summary] = await Promise.all([
          reportService.getVehicleFlow(timeFilter),
          reportService.getRevenue(timeFilter),
          reportService.getClientTypes(),
          reportService.getDailySummary(timeFilter),
        ]);
        if (!mounted) return;
        setVehicleData(flow);
        setRevenueData(revenue);
        setClientTypeData(clientTypes);
        setTableData(summary);
      } catch (e) {
        console.error("Error cargando reportes:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [timeFilter]);

  const totals = useMemo(() => {
    const totalEntries = vehicleData.reduce((acc, d) => acc + d.entradas, 0);
    const totalRevenue = revenueData.reduce((acc, d) => acc + d.ingresos, 0);
    const totalClients = clientTypeData.reduce((acc, d) => acc + d.value, 0);
    return { totalEntries, totalRevenue, totalClients };
  }, [vehicleData, revenueData, clientTypeData]);

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
            <Select value={timeFilter} onValueChange={(v: ReportPeriod) => setTimeFilter(v)}>
              <SelectTrigger className="w-[140px] md:w-[180px]">
                <SelectValue placeholder="Seleccionar filtro" />
              </SelectTrigger>
              <SelectContent>
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
                  <CardTitle className="text-lg">Total Entradas</CardTitle>
                  <CardDescription>Periodo seleccionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "—" : totals.totalEntries}</div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ingresos Totales</CardTitle>
                  <CardDescription>Periodo seleccionado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "—" : formatMoney(totals.totalRevenue)}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Días con datos</CardTitle>
                  <CardDescription>Resumen diario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "—" : tableData.length}</div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Clientes registrados</CardTitle>
                  <CardDescription>Total en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "—" : totals.totalClients}</div>
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
                    <BarChart data={vehicleData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 30 : 40} />
                      <Tooltip
                        formatter={(value, name) => [value, name === "entradas" ? "Entradas" : "Salidas"]}
                        labelFormatter={(label) => `Día: ${label}`}
                      />
                      <Legend wrapperStyle={isMobile ? { fontSize: "10px" } : {}} />
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
                    <LineChart data={revenueData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                      <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 40 : 50} />
                      <Tooltip formatter={(value) => [formatMoney(Number(value)), "Ingresos"]} />
                      <Legend wrapperStyle={isMobile ? { fontSize: "10px" } : {}} />
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
                  <TableCaption>Resumen del periodo: {timeFilter}</TableCaption>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Cargando...
                        </TableCell>
                      </TableRow>
                    ) : tableData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No hay registros para el periodo seleccionado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableData.map((row) => (
                        <TableRow key={row.fecha}>
                          <TableCell className="text-xs md:text-sm">{row.fecha}</TableCell>
                          <TableCell className="text-xs md:text-sm">{row.entradas}</TableCell>
                          <TableCell className="text-xs md:text-sm">{row.salidas}</TableCell>
                          <TableCell className="text-xs md:text-sm">{formatMoney(row.ingresos)}</TableCell>
                          <TableCell className="text-xs md:text-sm">{row.tiempoPromedio}</TableCell>
                        </TableRow>
                      ))
                    )}
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
                  <BarChart data={vehicleData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 30 : 40} />
                    <Tooltip
                      formatter={(value, name) => [value, name === "entradas" ? "Entradas" : "Salidas"]}
                      labelFormatter={(label) => `Día: ${label}`}
                    />
                    <Legend wrapperStyle={isMobile ? { fontSize: "10px" } : {}} />
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
                  <LineChart data={revenueData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} width={isMobile ? 40 : 50} />
                    <Tooltip formatter={(value) => [formatMoney(Number(value)), "Ingresos"]} />
                    <Legend wrapperStyle={isMobile ? { fontSize: "10px" } : {}} />
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
                <CardDescription className="text-xs md:text-sm">Distribución por rol</CardDescription>
              </CardHeader>
              <CardContent className={`${isMobile ? "h-[300px]" : "h-[500px]"} px-1 md:px-4`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}>
                    <Pie
                      data={clientTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        isMobile
                          ? `${(percent * 100).toFixed(0)}%`
                          : `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={isMobile ? 80 : 150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, "Cantidad"]} />
                    <Legend wrapperStyle={isMobile ? { fontSize: "10px" } : {}} />
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
