
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-3" variant="outline">Características</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Todo lo que necesitas para estacionar</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Nuestra plataforma ofrece todas las herramientas para una experiencia de estacionamiento sin problemas.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Disponibilidad en Tiempo Real</h3>
            <p className="text-gray-600">
              Consulta la disponibilidad de parqueaderos en tiempo real y asegura tu lugar antes de llegar.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mapas Interactivos</h3>
            <p className="text-gray-600">
              Visualiza todas las ubicaciones disponibles con mapas detallados y direcciones precisas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tarifas Transparentes</h3>
            <p className="text-gray-600">
              Conoce los precios exactos antes de llegar, sin sorpresas ni cargos ocultos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reserva Anticipada</h3>
            <p className="text-gray-600">
              Asegura tu lugar con anticipación para eventos especiales o días ocupados.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Acceso para Usuarios</h3>
            <p className="text-gray-600">
              Accede a tu historial, lugares favoritos y configuraciones personalizadas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Panel de Administrador</h3>
            <p className="text-gray-600">
              Herramientas completas para gestionar parqueaderos, monitorear ocupación y generar informes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
