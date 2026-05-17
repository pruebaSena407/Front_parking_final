// =====================================================================
// PÁGINA DEL DASHBOARD (DashboardPage.tsx)
// ---------------------------------------------------------------------
// Esta página es el "panel de control" del usuario después de logearse.
// Muestra cosas distintas dependiendo del rol:
//   - cliente → su dashboard de reservas
//   - empleado/admin → dashboard administrativo
//
// Si no hay sesión, redirige al login automáticamente.
// =====================================================================

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";  // permite cambiar el <title> de la página
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientDashboard } from "@/components/Dashboard/ClientDashboard";
import { EmployeeDashboard } from "@/components/Dashboard/EmployeeDashboard";
import { Skeleton } from "@/components/ui/skeleton";  // "esqueleto" gris de carga
import { MobileBottomNav } from "@/components/MobileBottomNav";

const DashboardPage = () => {
  // Sacamos los datos del usuario y el estado de carga del contexto
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  // useEffect: si ya terminó de cargar y NO hay usuario, redirige al login.
  // Esto protege la ruta: nadie puede ver el dashboard sin estar logueado.
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Mientras esperamos verificar la sesión, mostramos un esqueleto.
  // Esto evita "parpadeo" entre el login y el dashboard.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto py-8 px-4">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  // Si por alguna razón no hay usuario después de cargar, no renderizamos
  // nada (el useEffect ya está redirigiendo).
  if (!user) return null;

  // Renderizado normal: navbar, contenido según el rol y footer.
  return (
    <div className="min-h-screen flex flex-col">
      {/* Helmet inyecta etiquetas en el <head> de la página (título, meta) */}
      <Helmet>
        <title>Dashboard | ParkVista</title>
        <meta name="description" content="Panel de control de ParkVista" />
      </Helmet>

      <Navbar />

      <div className="flex-grow">
        {/* Renderizado condicional: cada rol ve un dashboard diferente */}
        {userRole === "cliente" && <ClientDashboard />}
        {(userRole === "empleado" || userRole === "admin") && <EmployeeDashboard />}
      </div>

      <Footer />
      {/* Barra inferior visible solo en móviles */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardPage;
