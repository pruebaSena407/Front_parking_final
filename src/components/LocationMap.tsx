import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  MapPin,
  Navigation,
  ChevronDown,
  ChevronUp,
  Car,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locationService, { type Location as ParkingLocation } from "@/services/locationService";

// Por defecto Leaflet busca los íconos en /marker-icon.png, lo que no
// funciona con Vite. Re-apuntamos a las versiones públicas de unpkg.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Componente auxiliar: cuando cambia la ubicación seleccionada, centramos
// el mapa en sus coordenadas con un pequeño zoom.
function FlyToSelected({ location }: { location: ParkingLocation | null }) {
  const map = useMap();
  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      map.flyTo([location.latitude, location.longitude], 15, { duration: 0.8 });
    }
  }, [location, map]);
  return null;
}

const LocationMap = () => {
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const run = async () => {
      try {
        const data = await locationService.getLocations();
        setLocations(data);
      } catch (e) {
        console.error("Error cargando ubicaciones:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === selectedId) ?? null,
    [locations, selectedId]
  );

  // Centro inicial: promedio de coordenadas o Bogotá si la lista está vacía.
  const center = useMemo<[number, number]>(() => {
    const withCoords = locations.filter((l) => l.latitude && l.longitude);
    if (withCoords.length === 0) return [4.65, -74.06];
    const lat =
      withCoords.reduce((acc, l) => acc + (l.latitude ?? 0), 0) / withCoords.length;
    const lng =
      withCoords.reduce((acc, l) => acc + (l.longitude ?? 0), 0) / withCoords.length;
    return [lat, lng];
  }, [locations]);

  const toggleLocation = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
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
          <div className={`${isMobile ? "order-2" : "lg:col-span-1"} space-y-4`}>
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Cargando ubicaciones...
                </CardContent>
              </Card>
            ) : locations.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No hay ubicaciones registradas todavía.
                </CardContent>
              </Card>
            ) : (
              locations.map((location) => (
                <Card
                  key={location.id}
                  className={`overflow-hidden ${selectedId === location.id ? "ring-2 ring-primary" : ""}`}
                >
                  <CardContent className="p-0">
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setSelectedId(location.id)}
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
                          {expandedId === location.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {location.address}
                      </div>

                      <div className="mt-3 text-xs text-gray-500">
                        Capacidad: <span className="font-medium text-gray-700">{location.capacity}</span> espacios
                      </div>
                    </div>

                    {expandedId === location.id && (
                      <div className="px-4 pb-4 pt-1">
                        <div className="h-0.5 w-full bg-gray-100 mb-3"></div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                            <Car className="h-4 w-4 text-gray-600 mb-1" />
                            <span className="text-gray-500">Plazas</span>
                            <span className="font-medium">{location.capacity}</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                            <MapPin className="h-4 w-4 text-gray-600 mb-1" />
                            <span className="text-gray-500">Coordenadas</span>
                            <span className="font-medium text-xs">
                              {location.latitude?.toFixed(2)}, {location.longitude?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-3"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
                              "_blank"
                            )
                          }
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Cómo Llegar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className={`${isMobile ? "order-1 mb-8" : "lg:col-span-2"}`}>
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-full rounded-lg overflow-hidden">
              <MapContainer
                center={center}
                zoom={12}
                scrollWheelZoom={false}
                style={{ width: "100%", height: "100%", minHeight: 300 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations
                  .filter((l) => l.latitude && l.longitude)
                  .map((l) => (
                    <Marker
                      key={l.id}
                      position={[l.latitude, l.longitude]}
                      eventHandlers={{ click: () => setSelectedId(l.id) }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{l.name}</strong>
                          <div className="text-gray-600">{l.address}</div>
                          <div className="text-gray-500 mt-1">{l.capacity} espacios</div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                <FlyToSelected location={selectedLocation} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
