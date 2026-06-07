// =====================================================================
// CONTEXTO DE AUTENTICACIÓN (AuthContext.tsx)
// ---------------------------------------------------------------------
// Un "Context" en React es una forma de compartir datos entre muchos
// componentes SIN tener que pasar props uno por uno.
//
// En este archivo creamos un contexto para la sesión del usuario:
//   - quién está logueado (user)
//   - qué rol tiene (userRole)
//   - funciones para iniciar / cerrar sesión
//
// Cualquier componente que use `useAuth()` puede leer/usar todo eso.
// =====================================================================

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "@/services/authService";

// Tipos posibles de rol. El null se usa cuando NO hay sesión.
type UserRole = "cliente" | "empleado" | "admin" | null;

// Interfaz que define cómo luce un usuario autenticado
interface AuthUser {
  id: string;
  email: string;
  role?: UserRole;
}

// Interfaz que define todo lo que el contexto va a exponer
interface AuthContextType {
  user: AuthUser | null;
  userRole: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loginWithMock: (data: { email: string; role: UserRole }) => void;
}

// Creamos el contexto con valores por defecto (cuando aún no hay Provider)
const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  login: async () => {},
  signOut: async () => {},
  loginWithMock: () => {},
});

// Hook personalizado para usar el contexto fácilmente.
// En lugar de hacer useContext(AuthContext) en cada componente, hacemos useAuth().
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Si alguien usa useAuth sin estar dentro del AuthProvider, error claro.
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// AuthProvider: el componente que envuelve la app y provee el contexto
// ---------------------------------------------------------------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado: usuario actualmente logueado (null si no hay sesión)
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  // loading = true mientras estamos verificando si el usuario sigue logueado
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // ---- "MOCK AUTH" -------------------------------------------------
  // Se usa para pruebas SIN backend (modo demo). Si en localStorage
  // hay un dato "mockAuth", simulamos la sesión a partir de ahí.
  const applyMockAuthIfPresent = (): boolean => {
    const raw = localStorage.getItem("mockAuth");
    if (!raw) return false;
    try {
      const mock = JSON.parse(raw) as { email: string; role: UserRole };
      setUser({ id: "mock-user", email: mock.email, role: mock.role });
      setUserRole(mock.role);
      setLoading(false);
      return true;
    } catch {
      // Si el JSON estaba corrupto, ignoramos.
      return false;
    }
  };

  // ---- VALIDACIÓN DEL TOKEN ---------------------------------------
  // Llama al backend a /api/auth/validate para revisar si el token
  // guardado en localStorage sigue siendo válido (no expirado).
  // Cuando lo es, REPUEBLA `user` y `userRole` con los datos que el
  // backend devuelve (necesario para que la sesión sobreviva a un F5).
  const validateToken = async () => {
    const profile = await authService.validateToken();
    if (profile === null) {
      // El servidor RECHAZÓ el token (401): cerramos sesión.
      localStorage.removeItem("token");
      localStorage.removeItem("mockAuth");
      setUser(null);
      setUserRole(null);
    } else if (profile) {
      // Token válido: repoblamos la sesión.
      const role = (profile.id_rol as UserRole) || "cliente";
      setUser({
        id: profile.id || String(profile.id_usuario ?? ""),
        email: profile.correo,
        role,
      });
      setUserRole(role);
    }
    // profile === undefined → fallo transitorio: NO tocamos la sesión actual.
    setLoading(false);
  };

  // Escucha el evento global "auth:unauthorized" (lo emite api.ts cuando un
  // endpoint responde 401). Limpia la sesión y redirige con navegación SPA,
  // sin recargar la página (así no se pierden los logs de la consola).
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setUserRole(null);
      if (!window.location.pathname.startsWith("/auth")) {
        navigate("/auth");
      }
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, [navigate]);

  // useEffect: se ejecuta automáticamente cuando cambia el pathname (la URL).
  // Sirve para revalidar la sesión al navegar entre páginas.
  useEffect(() => {
    if (applyMockAuthIfPresent()) return;
    // Sin token no tiene sentido llamar al API (evitaríamos un 401 inútil).
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    validateToken();
  }, [location.pathname]);

  // ---- LOGIN REAL --------------------------------------------------
  // Llama al backend, guarda el token y redirige al dashboard.
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      // Guardamos el usuario en el estado del contexto
      setUser({ 
        id: response.id, 
        email: response.correo,
        role: response.id_rol as UserRole
      });
      setUserRole(response.id_rol as UserRole || 'cliente');
      navigate("/dashboard");  // redirige al panel del usuario
    } catch (error) {
      console.error("Login failed:", error);
      // Volvemos a lanzar el error para que el componente lo muestre
      throw error;
    }
  };

  // ---- LOGOUT ------------------------------------------------------
  const signOut = async () => {
    try {
      await authService.logout();  // limpia token en el servicio
      setUser(null);
      setUserRole(null);
      navigate("/auth");  // mandamos al login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ---- LOGIN SIMULADO (modo demo) ---------------------------------
  // Permite "entrar" a la app sin backend, útil para presentaciones.
  const loginWithMock = (data: { email: string; role: UserRole }) => {
    localStorage.setItem("mockAuth", JSON.stringify({ email: data.email, role: data.role }));
    setUser({ id: "mock-user", email: data.email, role: data.role });
    setUserRole(data.role);
    setLoading(false);
    navigate("/dashboard");
  };

  // El Provider expone TODO esto a los componentes hijos.
  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, signOut, loginWithMock }}>
      {children}
    </AuthContext.Provider>
  );
};
