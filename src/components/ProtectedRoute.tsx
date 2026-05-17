// =====================================================================
// COMPONENTE PROTECTEDROUTE (ProtectedRoute.tsx)
// ---------------------------------------------------------------------
// Componente envoltorio para proteger rutas que solo se pueden ver
// estando logueado. Si no hay sesión, redirige automáticamente a /auth.
//
// Uso típico en App.tsx:
//   <Route path="/dashboard" element={
//     <ProtectedRoute>
//       <DashboardPage />
//     </ProtectedRoute>
//   } />
//
// Mientras carga (verificando token), muestra un esqueleto / spinner
// para evitar el "parpadeo" entre el login y la página protegida.
// =====================================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Lista opcional de roles permitidos. Si se define y el usuario NO
   * tiene un rol permitido, igual se le redirige.
   */
  allowedRoles?: Array<"cliente" | "empleado" | "admin">;
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();

  // Mientras verificamos la sesión mostramos un esqueleto para no parpadear
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Sin usuario → al login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Si la ruta requiere roles específicos y el usuario no los tiene
  if (allowedRoles && userRole && !allowedRoles.includes(userRole as "cliente" | "empleado" | "admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  // Todo bien: renderizamos la página protegida
  return <>{children}</>;
};

export default ProtectedRoute;
