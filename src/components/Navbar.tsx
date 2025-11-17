import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Menu, X, BarChart3, Settings, LogOut, User, Accessibility } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const location = useLocation();
  const { 
    isEnabled: a11yEnabled, toggle: toggleA11y, enable: enableA11y,
    highContrast, dyslexiaFont, underlineLinks, extraSpacing, compactMobile, setOption
  } = useAccessibility();

  const handleInPageNav = (e: React.MouseEvent, id: string) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"}>
              <div className="flex items-center">
                <Car className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-gray-800">ParkVista</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {!user && (
              <>
                <Link to="/#features" onClick={(e) => handleInPageNav(e, "features")} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                  Características
                </Link>
                <Link to="/#tariffs" onClick={(e) => handleInPageNav(e, "tariffs")} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                  Tarifas
                </Link>
                <Link to="/#locations" onClick={(e) => handleInPageNav(e, "locations")} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                  Ubicaciones
                </Link>
                <Link to="/#contact" onClick={(e) => handleInPageNav(e, "contact")} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                  Contacto
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                  Dashboard
                </Link>
                {userRole === "cliente" && (
                  <>
                    <Link to="/payments" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                      Pagos
                    </Link>
                    <Link to="/register" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                      Mi Cuenta
                    </Link>
                  </>
                )}
                {(userRole === "empleado" || userRole === "admin") && (
                  <>
                    <Link to="/reports" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                      <BarChart3 className="mr-1 h-4 w-4" />
                      Informes
                    </Link>
                    {userRole === "admin" && (
                      <Link to="/admin" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary">
                        <Settings className="mr-1 h-4 w-4" />
                        Administración
                      </Link>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          <div className="hidden sm:flex items-center">
            {!user ? (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="mr-2">Iniciar Sesión</Button>
                </Link>
                <Link to="/auth">
                  <Button>Registrarse</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium capitalize">{userRole || "Usuario"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            )}
            {/* Botón de Accesibilidad (desktop) con menú de opciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={a11yEnabled ? "default" : "outline"}
                  size="sm"
                  className="ml-3"
                  aria-pressed={a11yEnabled}
                  aria-label="Alternar opciones de accesibilidad"
                >
                  <Accessibility className="h-4 w-4 mr-2" />
                  {a11yEnabled ? "Accesibilidad: ON" : "Accesibilidad"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Accesibilidad</DropdownMenuLabel>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-default">
                  <Button size="sm" className="w-full" onClick={toggleA11y} aria-pressed={a11yEnabled}>
                    {a11yEnabled ? "Desactivar modo accesible" : "Activar modo accesible"}
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={highContrast}
                  onCheckedChange={(v) => { if (!a11yEnabled) enableA11y(); setOption("highContrast", Boolean(v)); }}
                >
                  Alto contraste
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={dyslexiaFont}
                  onCheckedChange={(v) => { if (!a11yEnabled) enableA11y(); setOption("dyslexiaFont", Boolean(v)); }}
                >
                  Fuente legible (dislexia)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={underlineLinks}
                  onCheckedChange={(v) => { if (!a11yEnabled) enableA11y(); setOption("underlineLinks", Boolean(v)); }}
                >
                  Subrayar enlaces
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={extraSpacing}
                  onCheckedChange={(v) => { if (!a11yEnabled) enableA11y(); setOption("extraSpacing", Boolean(v)); }}
                >
                  Espaciado extra
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={compactMobile}
                  onCheckedChange={(v) => { setOption("compactMobile", Boolean(v)); }}
                >
                  Modo compacto (móvil)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {!user ? (
              <>
                    <Link 
                      to="/#features" 
                      onClick={(e) => { handleInPageNav(e, "features"); setIsMenuOpen(false); }}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Características
                </Link>
                    <Link 
                      to="/#tariffs" 
                      onClick={(e) => { handleInPageNav(e, "tariffs"); setIsMenuOpen(false); }}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Tarifas
                </Link>
                    <Link 
                      to="/#locations" 
                      onClick={(e) => { handleInPageNav(e, "locations"); setIsMenuOpen(false); }}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Ubicaciones
                </Link>
                    <Link 
                      to="/#contact" 
                      onClick={(e) => { handleInPageNav(e, "contact"); setIsMenuOpen(false); }}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Contacto
                </Link>
                <div className="border-t mt-2 pt-2">
                  <Link 
                    to="/auth" 
                    className="block pl-3 pr-4 py-2 text-base font-medium text-primary hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/auth" 
                    className="block pl-3 pr-4 py-2 text-base font-medium text-primary hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {userRole === "cliente" && (
                  <>
                    <Link 
                      to="/payments" 
                      className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pagos
                    </Link>
                    <Link 
                      to="/register" 
                      className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                  </>
                )}
                {(userRole === "empleado" || userRole === "admin") && (
                  <>
                    <Link 
                      to="/reports" 
                      className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Informes
                      </div>
                    </Link>
                    {userRole === "admin" && (
                      <Link 
                        to="/admin" 
                        className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Administración
                        </div>
                      </Link>
                    )}
                  </>
                )}
                <div className="border-t mt-2 pt-2">
                  <button
                    onClick={() => {
                      toggleA11y();
                    }}
                    className="w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    aria-pressed={a11yEnabled}
                    aria-label="Alternar opciones de accesibilidad"
                  >
                    <div className="flex items-center">
                      <Accessibility className="mr-2 h-4 w-4" />
                      {a11yEnabled ? "Accesibilidad: ON" : "Accesibilidad"}
                    </div>
                  </button>
                  <div className="pl-3 pr-4 py-2 text-sm text-muted-foreground">
                    Rol: <span className="capitalize font-medium text-foreground">{userRole || "Usuario"}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
