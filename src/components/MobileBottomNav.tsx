import { Home, Calendar, CreditCard, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return null;

  const items = [
    { to: "/dashboard", label: "Inicio", icon: <Home className="h-5 w-5" /> },
    { to: "/dashboard#reservas", label: "Reservas", icon: <Calendar className="h-5 w-5" /> },
    { to: "/payments", label: "Pagos", icon: <CreditCard className="h-5 w-5" /> },
    { to: "/register", label: "Cuenta", icon: <User className="h-5 w-5" /> },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegación inferior"
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active = location.pathname + location.hash === item.to || location.pathname === item.to;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex flex-col items-center justify-center py-2 text-xs ${active ? "text-primary" : "text-gray-600"}`}
                aria-current={active ? "page" : undefined}
              >
                {item.icon}
                <span className="mt-0.5">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};


