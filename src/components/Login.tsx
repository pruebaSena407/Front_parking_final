// =====================================================================
// COMPONENTE LOGIN (Login.tsx)
// ---------------------------------------------------------------------
// Este componente es OTRA versión del formulario de login + registro
// (similar a AuthPage), pero se monta como una sección dentro de la
// página de inicio (NO es una página completa).
//
// Tiene dos modos:
//   - "user"  → cuenta normal de cliente
//   - "admin" → para administradores
//
// Y dos pestañas: Iniciar Sesión / Registrarse.
// =====================================================================

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Building2, Lock, Mail } from "lucide-react";  // íconos
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/authService";
import { validatePasswordMatch } from "@/lib/validators";

const Login = () => {
  // --- ESTADOS LOCALES DEL COMPONENTE -------------------------------
  // Tipo de usuario seleccionado (botones de arriba)
  const [userType, setUserType] = useState<"user" | "admin">("user");
  // Campos del formulario de login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Campos del formulario de registro
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Estado de carga (para deshabilitar botones mientras procesa)
  const [isLoading, setIsLoading] = useState(false);
  // Funciones del contexto y hook de notificaciones
  const { login, loginWithMock } = useAuth();
  const { toast } = useToast();

  // -------------------------------------------------------------------
  // LOGIN: enviar email + password al backend
  // -------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // login() del contexto: hace el POST y redirige al dashboard
      await login(loginEmail, loginPassword);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión";
      toast({
        title: "Error de autenticación",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // finally: pase lo que pase (éxito o error), siempre quitamos el loading
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // REGISTRO: crear cuenta nueva
  // -------------------------------------------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación rápida: las dos contraseñas deben coincidir
    const matchError = validatePasswordMatch(registerPassword, confirmPassword);
    if (matchError) {
      toast({
        title: "Error",
        description: matchError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Llamamos al servicio de auth para crear el usuario en el backend
      await authService.register({
        email: registerEmail,
        password: registerPassword,
        fullName: registerName,
      });
      
      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada correctamente. Por favor inicia sesión.",
      });
      
      // Limpiamos los campos después del registro exitoso
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrarse";
      toast({
        title: "Error de registro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // LOGIN DEMO: entra sin backend (útil para probar la UI)
  // -------------------------------------------------------------------
  const handleMockLogin = (role: "cliente" | "admin") => {
    loginWithMock({
      email: loginEmail || "demo@example.com",
      role: role === "admin" ? "admin" : "cliente",
    });
  };

  // -------------------------------------------------------------------
  // RENDERIZADO
  // -------------------------------------------------------------------
  return (
    <section id="login" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center">
          <Badge className="mb-3" variant="outline">Acceso</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Inicia Sesión en tu Cuenta</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Accede como usuario para reservar parqueaderos o como administrador para gestionar el sistema.
          </p>
        </div>
        
        <div className="mt-12 flex justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              {/* Botones para alternar entre "Usuario" y "Administrador" */}
              <div className="flex justify-center space-x-4 mb-4">
                <Button
                  variant={userType === "user" ? "default" : "outline"}
                  onClick={() => setUserType("user")}
                  className="flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Usuario
                </Button>
                <Button
                  variant={userType === "admin" ? "default" : "outline"}
                  onClick={() => setUserType("admin")}
                  className="flex items-center"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Administrador
                </Button>
              </div>
              {/* Título y descripción cambian según el userType */}
              <CardTitle className="text-center text-2xl">
                {userType === "user" ? "Acceso de Usuario" : "Acceso de Administrador"}
              </CardTitle>
              <CardDescription className="text-center">
                {userType === "user" 
                  ? "Ingresa para acceder a tu cuenta y reservar parqueaderos" 
                  : "Área exclusiva para administradores del sistema"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pestañas: login / registro */}
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>
                
                {/* ============== FORMULARIO LOGIN ============== */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Campo email controlado (value + onChange = react controlled input) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <p className="text-sm text-gray-700 font-semibold">Correo asociado a tu cuenta</p>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="email" 
                          placeholder="tu@correo.com"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10" 
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    {/* Campo contraseña + enlace de "olvidé mi contraseña" */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                        <a href="#" className="text-sm text-primary hover:underline">
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>
                      <p className="text-sm text-gray-700 font-semibold">Tu contraseña de acceso</p>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                    </Button>
                    {/* Botón demo: solo aparece según el userType seleccionado */}
                    {userType === "admin" && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleMockLogin("admin")}
                        disabled={isLoading}
                      >
                        Demo Admin
                      </Button>
                    )}
                    {userType === "user" && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleMockLogin("cliente")}
                        disabled={isLoading}
                      >
                        Demo Usuario
                      </Button>
                    )}
                  </form>
                </TabsContent>
                
                {/* ============== FORMULARIO REGISTRO ============== */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <p className="text-sm text-gray-700 font-semibold">Mínimo 5 caracteres, incluye nombre y apellido</p>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="name"
                          placeholder="Juan Pérez"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Correo Electrónico</Label>
                      <p className="text-sm text-gray-700 font-semibold">Proporciona un correo válido y activo</p>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="reg-email"
                          type="email"
                          placeholder="tu@correo.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Contraseña</Label>
                      <p className="text-sm text-gray-700 font-semibold">Mínimo 8 caracteres: mayúsculas, minúsculas, números y caracteres especiales (!@#$%^&*)</p>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="reg-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                      <p className="text-sm text-gray-700 font-semibold">Debe ser idéntica a la contraseña anterior</p>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col text-center text-sm text-gray-600">
              {/* Footer cambia según userType: usuarios ven los T&C, admins un aviso */}
              {userType === "user" ? (
                <p>
                  Al registrarte, aceptas nuestros{" "}
                  <a href="#" className="text-primary hover:underline">
                    Términos y Condiciones
                  </a>{" "}
                  y{" "}
                  <a href="#" className="text-primary hover:underline">
                    Política de Privacidad
                  </a>
                </p>
              ) : (
                <p>
                  El acceso de administrador requiere aprobación.
                  <br />
                  Contacte al soporte técnico para obtener credenciales.
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Login;
