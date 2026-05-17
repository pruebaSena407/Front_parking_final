// =====================================================================
// PÁGINA DE AUTENTICACIÓN (AuthPage.tsx)
// ---------------------------------------------------------------------
// Aquí están los formularios de LOGIN y REGISTRO en una sola página
// con pestañas (tabs). También incluye el botón "Demo Mode" que entra
// sin necesidad de backend (para pruebas/presentaciones).
//
// Flujo general:
//   1) El usuario llena el formulario
//   2) Validamos del lado del cliente (formato, longitud, etc.)
//   3) Llamamos al servicio (authService) o al contexto (login)
//   4) Mostramos un toast (notificación) con el resultado
// =====================================================================

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Home } from "lucide-react";  // íconos
import authService from "@/services/authService";
import {
  validateEmail,
  validateFullName,
  validatePhone,
  validatePasswordStrength,
  validatePasswordMatch,
} from "@/lib/validators";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();                  // hook para mostrar notificaciones
  const { login, loginWithMock } = useAuth();    // funciones del contexto de auth
  const [loading, setLoading] = useState(false); // bloqueamos botones mientras procesa

  // Si el usuario ya tiene una sesión "demo" guardada, lo mandamos directo
  // al dashboard sin pasar por el login.
  useEffect(() => {
    const raw = localStorage.getItem("mockAuth");
    if (raw) navigate("/dashboard");
  }, [navigate]);

  // -------------------------------------------------------------------
  // MANEJO DEL FORMULARIO DE REGISTRO
  // -------------------------------------------------------------------
  // Hace VARIAS validaciones del lado del cliente antes de enviar al backend.
  // (El backend también valida, pero así damos mejor experiencia al usuario).
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // evita que el form recargue la página
    setLoading(true);

    // Sacamos todos los valores del formulario
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("signup-email") || "");
    const fullName = String(formData.get("full-name") || "");
    const countryCode = String(formData.get("country-code") || "");
    const phone = String(formData.get("phone") || "");
    const password = String(formData.get("signup-password") || "");
    const confirmPassword = String(formData.get("confirm-password") || "");

    // Si algún campo está vacío, mensaje genérico (mismo comportamiento de antes)
    if (!email || !fullName || !phone || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Validamos en orden los campos. La primera regla que falle aborta
    // y muestra el toast correspondiente (mismo comportamiento que antes).
    const validationError =
      validateEmail(email) ||
      validateFullName(fullName) ||
      validatePhone(phone) ||
      validatePasswordStrength(password) ||
      validatePasswordMatch(password, confirmPassword);

    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Concatenamos código de país + número (ej: "+57" + "3001234567")
    const telefono = countryCode + phone;

    // Llamada real al servicio de registro
    try {
      await authService.register({ email, fullName, password, telefono });
      toast({ 
        title: "¡Cuenta creada!", 
        description: "Tu cuenta ha sido creada correctamente. Por favor inicia sesión."
      });
      
      // Limpiamos el formulario y dejamos al usuario en la pestaña de login
      form.reset();
      setLoading(false);
    } catch (error) {
      // Si el backend devuelve error (ej: correo ya registrado), lo mostramos
      const errorMessage = error instanceof Error ? error.message : "Error al registrarse";
      toast({ 
        title: "Error de registro", 
        description: errorMessage,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // MANEJO DEL FORMULARIO DE LOGIN
  // -------------------------------------------------------------------
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("signin-email") || "");
    const password = String(formData.get("signin-password") || "");

    if (!email || !password) {
      toast({ 
        title: "Error", 
        description: "Por favor completa email y contraseña.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // login() viene del contexto: hace la llamada al backend y
      // si todo OK, navega al dashboard automáticamente.
      await login(email, password);
      toast({ 
        title: "¡Bienvenido!", 
        description: "Has iniciado sesión correctamente."
      });
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Credenciales inválidas.";
      toast({ 
        title: "Error de autenticación", 
        description: errorMessage,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // BOTÓN "DEMO": entrar sin pasar por el backend
  // -------------------------------------------------------------------
  const handleDemoLogin = () => {
    loginWithMock({ email: "demo@example.com", role: "cliente" });
  };

  // -------------------------------------------------------------------
  // RENDERIZADO: Card centrada con tabs de Login y Registro
  // -------------------------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Helmet>
        <title>Iniciar Sesión | ParkVista</title>
        <meta name="description" content="Inicia sesión o regístrate en ParkVista" />
      </Helmet>

      {/* Botón en la esquina superior izquierda para volver al home */}
      <Link
        to="/"
        className="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        Ir al inicio
      </Link>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">ParkVista</CardTitle>
          <CardDescription>Accede a tu cuenta o crea una nueva</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs: dos pestañas que cambian el formulario visible */}
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            {/* ============ FORMULARIO DE LOGIN ============ */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signin-email" name="signin-email" type="email" placeholder="tu@correo.com" className="pl-10" required disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signin-password" name="signin-password" type="password" placeholder="••••••••" className="pl-10" required disabled={loading} />
                  </div>
                </div>
                {/* El botón muestra "Iniciando..." mientras se procesa */}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Iniciando..." : "Iniciar Sesión"}</Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
                  Demo Mode
                </Button>
              </form>
            </TabsContent>

            {/* ============ FORMULARIO DE REGISTRO ============ */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Nombre Completo</Label>
                  <p className="text-sm text-gray-700 font-semibold">Mínimo 5 caracteres, incluye nombre y apellido</p>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="full-name" name="full-name" type="text" placeholder="Juan Pérez" className="pl-10" required disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Correo Electrónico</Label>
                  <p className="text-sm text-gray-700 font-semibold">Proporciona un correo válido y activo</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" name="signup-email" type="email" placeholder="tu@correo.com" className="pl-10" required disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country-code">País</Label>
                  {/* Select con códigos de países latinos + EEUU y España */}
                  <Select name="country-code" defaultValue="+57" disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+57">Colombia (+57)</SelectItem>
                      <SelectItem value="+1">Estados Unidos (+1)</SelectItem>
                      <SelectItem value="+34">España (+34)</SelectItem>
                      <SelectItem value="+52">México (+52)</SelectItem>
                      <SelectItem value="+54">Argentina (+54)</SelectItem>
                      <SelectItem value="+56">Chile (+56)</SelectItem>
                      <SelectItem value="+58">Venezuela (+58)</SelectItem>
                      <SelectItem value="+591">Bolivia (+591)</SelectItem>
                      <SelectItem value="+593">Ecuador (+593)</SelectItem>
                      <SelectItem value="+595">Paraguay (+595)</SelectItem>
                      <SelectItem value="+598">Uruguay (+598)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Teléfono</Label>
                  <p className="text-sm text-gray-700 font-semibold">Solo números, mínimo 10 dígitos (sin incluir el indicativo)</p>
                  <Input id="phone" name="phone" type="tel" placeholder="3001234567" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <p className="text-sm text-gray-700 font-semibold">Mínimo 8 caracteres: mayúsculas, minúsculas, números y caracteres especiales (!@#$%^&*)</p>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" name="signup-password" type="password" placeholder="••••••••" className="pl-10" required minLength={6} disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <p className="text-sm text-gray-700 font-semibold">Debe ser idéntica a la contraseña anterior</p>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="confirm-password" name="confirm-password" type="password" placeholder="••••••••" className="pl-10" required minLength={6} disabled={loading} />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creando cuenta..." : "Crear Cuenta"}</Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
                  Demo Mode
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
