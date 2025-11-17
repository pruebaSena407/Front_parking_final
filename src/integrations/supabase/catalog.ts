// Catálogo mock de ubicaciones, espacios y tarifas para el módulo de reservas.
// Se persiste en localStorage para que sea editable si luego se conecta con paneles de admin.

export type VehicleType = "car" | "motorcycle" | "bicycle" | "truck";

export type ParkingRate = {
  id: string;
  name: string;
  hourlyRate: number;
  dailyRate: number;
  vehicleType: VehicleType;
};

export type ParkingLocation = {
  id: string;
  name: string;
  address: string;
  capacity: number;
  latitude?: number;
  longitude?: number;
};

export type ParkingSpace = {
  id: string;
  code: string;
  locationId: string;
  isAvailable: boolean;
};

const L_KEY = "mockLocations";
const S_KEY = "mockSpaces";
const R_KEY = "mockRates";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function read<T>(k: string): T[] {
  const raw = localStorage.getItem(k);
  return raw ? (JSON.parse(raw) as T[]) : [];
}
function write<T>(k: string, data: T[]) {
  localStorage.setItem(k, JSON.stringify(data));
}

function ensureSeed() {
  const locs = read<ParkingLocation>(L_KEY);
  if (locs.length === 0) {
    const seededLocations: ParkingLocation[] = [
      { id: uuid(), name: "Centro Comercial Plaza", address: "Av. Principal #123", capacity: 80, latitude: 4.65, longitude: -74.06 },
      { id: uuid(), name: "Parqueadero Central", address: "Calle 45 #23-12", capacity: 60, latitude: 4.62, longitude: -74.07 },
      { id: uuid(), name: "Parqueadero Norte", address: "Calle Norte #56-78", capacity: 50, latitude: 4.68, longitude: -74.04 },
    ];
    write(L_KEY, seededLocations);

    const spaces: ParkingSpace[] = [];
    for (const loc of seededLocations) {
      for (let i = 1; i <= Math.min(12, loc.capacity); i++) {
        const code = `${String.fromCharCode(64 + ((i - 1) % 3) + 1)}-${String(i).padStart(2, "0")}`;
        spaces.push({ id: uuid(), code, locationId: loc.id, isAvailable: Math.random() > 0.2 });
      }
    }
    write(S_KEY, spaces);
  }

  const rates = read<ParkingRate>(R_KEY);
  if (rates.length === 0) {
    const seededRates: ParkingRate[] = [
      { id: uuid(), name: "Tarifa Estándar", hourlyRate: 4000, dailyRate: 25000, vehicleType: "car" },
      { id: uuid(), name: "Tarifa Motocicleta", hourlyRate: 3000, dailyRate: 15000, vehicleType: "motorcycle" },
      { id: uuid(), name: "Tarifa Premium", hourlyRate: 7000, dailyRate: 40000, vehicleType: "car" },
    ];
    write(R_KEY, seededRates);
  }
}

export async function listLocations(): Promise<ParkingLocation[]> {
  ensureSeed();
  return read<ParkingLocation>(L_KEY);
}

export async function listSpaces(locationId: string): Promise<ParkingSpace[]> {
  ensureSeed();
  return read<ParkingSpace>(S_KEY).filter(s => s.locationId === locationId);
}

export async function listRates(): Promise<ParkingRate[]> {
  ensureSeed();
  return read<ParkingRate>(R_KEY);
}


