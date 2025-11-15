
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  Car
} from "lucide-react";

const LocationMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const locations = [
    {
      id: "plaza",
      name: "Centro Comercial Plaza",
      address: "Av. Principal #123, Centro",
      availability: 70,
      rate: "$4.000/hora",
      hours: "24/7",
      spots: 50,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "central",
      name: "Parqueadero Central",
      address: "Calle 45 #23-12, Downtown",
      availability: 30,
      rate: "$3.500/hora",
      hours: "6:00 - 22:00",
      spots: 40,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "corporate",
      name: "Edificio Corporativo",
      address: "Av. Empresarial #78-90, Business District",
      availability: 10,
      rate: "$5.000/hora",
      hours: "7:00 - 19:00",
      spots: 60,
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "north",
      name: "Parqueadero Norte",
      address: "Calle Norte #56-78, Zona Norte",
      availability: 55,
      rate: "$3.800/hora",
      hours: "24/7",
      spots: 45,
      image: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const toggleLocation = (id: string) => {
    setExpandedLocation(expandedLocation === id ? null : id);
  };

  const getAvailabilityColor = (percentage: number) => {
    if (percentage > 50) return "bg-secondary";
    if (percentage > 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <section id="locations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-3" variant="outline">Ubicaciones</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Parqueaderos estratégicamente ubicados</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Tenemos parqueaderos en las zonas más convenientes de la ciudad.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <div className={`${isMobile ? 'order-2' : 'lg:col-span-1'} space-y-4`}>
            {locations.map((location) => (
              <Card 
                key={location.id} 
                className={`overflow-hidden ${selectedLocation === location.id ? 'ring-2 ring-primary' : ''}`}
              >
                <CardContent className="p-0">
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-900">{location.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLocation(location.id);
                        }}
                      >
                        {expandedLocation === location.id ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {location.address}
                    </div>
                    
                    <div className="mt-3 mb-1">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 ${getAvailabilityColor(location.availability)} rounded-full`}
                          style={{ width: `${location.availability}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-gray-500">Disponibilidad</span>
                        <span className={`font-medium ${
                          location.availability > 50 ? 'text-secondary' : 
                          location.availability > 20 ? 'text-orange-500' : 'text-red-500'
                        }`}>{location.availability}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedLocation === location.id && (
                    <div className="px-4 pb-4 pt-1">
                      <div className="h-0.5 w-full bg-gray-100 mb-3"></div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                          <DollarSign className="h-4 w-4 text-gray-600 mb-1" />
                          <span className="text-gray-500">Tarifa</span>
                          <span className="font-medium">{location.rate}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                          <Clock className="h-4 w-4 text-gray-600 mb-1" />
                          <span className="text-gray-500">Horario</span>
                          <span className="font-medium">{location.hours}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                          <Car className="h-4 w-4 text-gray-600 mb-1" />
                          <span className="text-gray-500">Plazas</span>
                          <span className="font-medium">{location.spots}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-3">
                        <Navigation className="h-4 w-4 mr-2" />
                        Como Llegar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className={`${isMobile ? 'order-1 mb-8' : 'lg:col-span-2'}`}>
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-full rounded-lg overflow-hidden bg-gray-200">
              {/* Replace placeholder with actual map image */}
              <img 
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&auto=format&fit=crop&q=60"
                alt="Mapa de ubicaciones" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with location marker for selected location */}
              <div className="absolute inset-0">
                {selectedLocation && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-pulse">
                      <MapPin className="h-12 w-12 text-primary drop-shadow-lg" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Map title overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-800">Mapa de Ubicaciones</h3>
                <p className="text-xs text-gray-600">Selecciona un parqueadero para ver detalles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
