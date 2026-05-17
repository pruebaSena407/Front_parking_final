// =====================================================================
// COMPONENTE RAÍZ DE LA APLICACIÓN (App.tsx)
// ---------------------------------------------------------------------
// Este es el componente "envoltorio" de toda la app. Aquí:
//   - Configuramos los "Providers" (proveedores de contexto global)
//   - Definimos el sistema de rutas (qué componente se ve en cada URL)
//
// Los Providers son como cajas que envuelven a toda la app y le dan
// acceso a cosas globales (autenticación, tooltips, notificaciones, etc).
// =====================================================================

import { Toaster } from "@/components/ui/toaster";          // Notificaciones (toasts) estilo 1
import { Toaster as Sonner } from "@/components/ui/sonner"; // Notificaciones estilo 2 (sonner)
import { TooltipProvider } from "@/components/ui/tooltip";  // Activa los tooltips en toda la app
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Manejo de peticiones / cache
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Sistema de rutas (URLs)
import { HelmetProvider } from "react-helmet-async";        // Para cambiar el <title> y meta de cada página
import { AuthProvider } from "@/contexts/AuthContext";      // Contexto de autenticación (usuario logueado)
import { AccessibilityProvider } from "@/contexts/AccessibilityContext"; // Accesibilidad (modos visuales)
import ProtectedRoute from "@/components/ProtectedRoute";   // Envoltorio que protege rutas privadas

// Importamos cada una de las páginas
import Index from "./pages/Index";
import ReportsPage from "./pages/ReportsPage";
import AdminPage from "./pages/AdminPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentsPage from "./pages/PaymentsPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

// Cliente de React Query (maneja cache, refetch, etc.)
const queryClient = new QueryClient();

// El componente App es solo JSX (un árbol de etiquetas) y NO recibe props.
const App = () => (
  // QueryClientProvider habilita useQuery/useMutation en toda la app
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        {/* Los dos Toaster permiten mostrar mensajitos flotantes */}
        <Toaster />
        <Sonner />

        {/* BrowserRouter activa el routing del lado del cliente */}
        <BrowserRouter>
          {/* AccessibilityProvider envuelve los modos de accesibilidad */}
          <AccessibilityProvider>
            {/* AuthProvider hace que cualquier componente pueda saber si
                hay un usuario logueado y acceder a sus datos */}
            <AuthProvider>
              {/* Routes define qué componente se renderiza según la URL */}
              <Routes>
                {/* Rutas públicas: cualquier persona puede entrar */}
                <Route path="/" element={<Index />} />              {/* Página principal / landing */}
                <Route path="/auth" element={<AuthPage />} />        {/* Login + Registro */}

                {/* Rutas protegidas: requieren sesión activa.
                    ProtectedRoute revisa el contexto de auth y redirige
                    a /auth si no hay usuario. Para /admin además se exige rol admin. */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedRoute>
                      <RegisterPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute>
                      <PaymentsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Esta ruta "*" es el comodín: si ninguna otra coincide,
                    muestra la página de "no encontrado" (404). DEBE ir al final. */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </AccessibilityProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
