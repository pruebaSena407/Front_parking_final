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

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginWithMock } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("mockAuth");
    if (raw) navigate("/dashboard");
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("signup-email") || "");
    const fullName = String(formData.get("full-name") || "");

    loginWithMock({ email, role: "cliente" });
    toast({ title: "¡Cuenta creada!", description: "Modo demo sin backend." });
    setLoading(false);
    navigate("/dashboard");
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("signin-email") || "");
    const password = String(formData.get("signin-password") || "");

    const hardcoded = [
      { email: "admin@parkvista.test", password: "admin123", role: "admin" },
      { email: "user@parkvista.test", password: "user123", role: "cliente" },
    ] as const;

    const match = hardcoded.find((c) => c.email === email && c.password === password);

    if (match) {
      loginWithMock({ email: match.email, role: match.role });
      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente." });
      setLoading(false);
      navigate("/dashboard");
      return;
    }

    setLoading(false);
    toast({ title: "Error", description: "Credenciales inválidas.", variant: "destructive" });
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
                    <Input id="signin-email" name="signin-email" type="email" placeholder="tu@correo.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signin-password" name="signin-password" type="password" placeholder="••••••••" className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Cargando..." : "Iniciar Sesión"}</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="full-name" name="full-name" type="text" placeholder="Juan Pérez" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" name="signup-email" type="email" placeholder="tu@correo.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" name="signup-password" type="password" placeholder="••••••••" className="pl-10" required minLength={6} />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Cargando..." : "Crear Cuenta"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
