import apiRequest from './api';

/** Registro de entrada/salida de un vehículo (operación del parqueadero). */
export interface Registro {
  id: number;
  date: string | null;
  checkIn: string | null;
  checkOut: string | null;
  userId: number;
  vehicleId: number;
  locationId: number | null;
  reservationId: number | null;
  active: boolean;
  plate?: string;
  vehicleType?: string;
  locationName?: string;
  durationMinutes?: number | null;
  createdAt?: string | null;
}

export interface CheckinRequest {
  plate: string;
  locationId?: number | null;
  vehicleType?: string;
  reservationId?: number | null;
}

class RegistroService {
  async list(): Promise<Registro[]> {
    return apiRequest<Registro[]>('/registros/', { method: 'GET' });
  }

  async listActive(locationId?: number): Promise<Registro[]> {
    const qs = locationId ? `?locationId=${locationId}` : '';
    return apiRequest<Registro[]>(`/registros/activos${qs}`, { method: 'GET' });
  }

  async checkin(data: CheckinRequest): Promise<Registro> {
    return apiRequest<Registro>('/registros/checkin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkout(id: number): Promise<Registro> {
    return apiRequest<Registro>(`/registros/${id}/checkout`, { method: 'POST' });
  }
}

export default new RegistroService();
