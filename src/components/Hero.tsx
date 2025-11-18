
import { Button } from "@/components/ui/button";
import { Car, Clock, MapPin } from "lucide-react";

const Hero = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="md:flex md:items-center md:space-x-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Encuentra tu estacionamiento ideal en segundos
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-2xl">
              Revisa disponibilidad en tiempo real, tarifas y ubicaciones con nuestra aplicación de gestión de parqueaderos.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto" onClick={() => scrollTo("locations")}>
                Buscar Parqueadero
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto" onClick={() => scrollTo("tariffs")}>
                Ver Tarifas
              </Button>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2 mt-10 md:mt-0">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center text-gray-700 mb-2">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Centro Comercial Plaza</span>
                </div>
                <div className="h-2 bg-green-100 rounded">
                  <div className="h-2 bg-secondary rounded" style={{ width: '70%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">70% disponible</span>
                  <span className="text-secondary font-medium">35 espacios libres</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center text-gray-700 mb-2">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Parqueadero Central</span>
                </div>
                <div className="h-2 bg-orange-100 rounded">
                  <div className="h-2 bg-orange-500 rounded" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">30% disponible</span>
                  <span className="text-orange-500 font-medium">12 espacios libres</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center text-gray-700 mb-2">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Edificio Corporativo</span>
                </div>
                <div className="h-2 bg-red-100 rounded">
                  <div className="h-2 bg-red-500 rounded" style={{ width: '10%' }}></div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">10% disponible</span>
                  <span className="text-red-500 font-medium">5 espacios libres</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Car className="h-10 w-10 text-primary p-2 bg-blue-50 rounded-full" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Estacionamiento Fácil</h3>
                <p className="text-gray-600">Encuentra espacios disponibles rápidamente</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-10 w-10 text-primary p-2 bg-blue-50 rounded-full" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Tiempo Real</h3>
                <p className="text-gray-600">Información actualizada al instante</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-10 w-10 text-primary p-2 bg-blue-50 rounded-full" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Múltiples Ubicaciones</h3>
                <p className="text-gray-600">Parqueaderos en toda la ciudad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
