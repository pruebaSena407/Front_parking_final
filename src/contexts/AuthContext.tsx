import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "@/services/authService";

type UserRole = "cliente" | "empleado" | "admin" | null;

interface AuthUser {
  id: string;
  email: string;
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  userRole: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loginWithMock: (data: { email: string; role: UserRole }) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  login: async () => {},
  signOut: async () => {},
  loginWithMock: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
      return false;
    }
  };

  const validateToken = async () => {
    const isValid = await authService.validateToken();
    if (!isValid) {
      localStorage.removeItem("token");
      localStorage.removeItem("mockAuth");
      setUser(null);
      setUserRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (applyMockAuthIfPresent()) return;
    validateToken();
  }, [location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser({ 
        id: response.user.id, 
        email: response.user.email,
        role: response.user.role
      });
      setUserRole(response.user.role as UserRole);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      setUserRole(null);
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const loginWithMock = (data: { email: string; role: UserRole }) => {
    localStorage.setItem("mockAuth", JSON.stringify({ email: data.email, role: data.role }));
    setUser({ id: "mock-user", email: data.email, role: data.role });
    setUserRole(data.role);
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, signOut, loginWithMock }}>
      {children}
    </AuthContext.Provider>
  );
};
