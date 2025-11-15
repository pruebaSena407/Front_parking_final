import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type UserRole = "cliente" | "empleado" | "admin" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const FRONT_ONLY =
    (import.meta as any).env?.VITE_FRONT_ONLY === "true" ||
    !((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY);

  const applyMockAuthIfPresent = (): boolean => {
    const raw = localStorage.getItem("mockAuth");
    if (!raw) return false;
    try {
      const mock = JSON.parse(raw) as { email: string; role: UserRole };
      // Establece un usuario y sesión ficticia para habilitar la navegación
      setUser(({ id: "mock-user", email: mock.email } as unknown) as User);
      setSession(({} as unknown) as Session);
      setUserRole(mock.role);
      setLoading(false);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // Modo solo-front: evita cualquier integración con Supabase
    if (FRONT_ONLY) {
      const usedMock = applyMockAuthIfPresent();
      if (!usedMock) {
        // Sin mock: usuario no autenticado pero app lista
        setLoading(false);
      }
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role asynchronously
          setTimeout(async () => {
            const { data: roleData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();
            
            setUserRole(roleData?.role as UserRole ?? null);
            setLoading(false);
          }, 0);
        } else {
          // Si no hay sesión de Supabase, intenta usar auth mock
          const usedMock = applyMockAuthIfPresent();
          if (!usedMock) {
            setUserRole(null);
            setLoading(false);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          
          setUserRole(roleData?.role as UserRole ?? null);
          setLoading(false);
        }, 0);
      } else {
        // Si no hay sesión previa, intenta aplicar mock; si no, finaliza carga
        const usedMock = applyMockAuthIfPresent();
        if (!usedMock) {
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!FRONT_ONLY) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("mockAuth");
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
