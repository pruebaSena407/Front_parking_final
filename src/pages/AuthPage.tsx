import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Home } from "lucide-react";
import authService from "@/services/authService";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loginWithMock } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("mockAuth");
    if (raw) navigate("/dashboard");
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("signup-email") || "");
    const fullName = String(formData.get("full-name") || "");
    const password = String(formData.get("signup-password") || "");
    const confirmPassword = String(formData.get("confirm-password") || "");

    if (!email || !fullName || !password || !confirmPassword) {
      toast({ 
        title: "Error", 
        description: "Por favor completa todos los campos.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ 
        title: "Error", 
        description: "Ingresa un correo electrónico válido.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validate fullName has at least two words
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      toast({ 
        title: "Error", 
        description: "El nombre completo debe incluir nombre y apellido.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      toast({ 
        title: "Error", 
        description: "La contraseña debe tener al menos 8 caracteres.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast({ 
        title: "Error", 
        description: "La contraseña debe contener al menos una letra mayúscula.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast({ 
        title: "Error", 
        description: "La contraseña debe contener al menos una letra minúscula.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    if (!/\d/.test(password)) {
      toast({ 
        title: "Error", 
        description: "La contraseña debe contener al menos un número.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast({ 
        title: "Error", 
        description: "La contraseña debe contener al menos un carácter especial.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({ 
        title: "Error", 
        description: "Las contraseñas no coinciden.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      await authService.register({ email, fullName, password });
      toast({ 
        title: "¡Cuenta creada!", 
        description: "Tu cuenta ha sido creada correctamente. Por favor inicia sesión."
      });
      
      // Limpiar formulario y cambiar a login
      form.reset();
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrarse";
      toast({ 
        title: "Error de registro", 
        description: errorMessage,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

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

  const handleDemoLogin = () => {
    loginWithMock({ email: "demo@example.com", role: "cliente" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Helmet>
        <title>Iniciar Sesión | ParkVista</title>
        <meta name="description" content="Inicia sesión o regístrate en ParkVista" />
      </Helmet>

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
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

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
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Iniciando..." : "Iniciar Sesión"}</Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
                  Demo Mode
                </Button>
              </form>
            </TabsContent>

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
