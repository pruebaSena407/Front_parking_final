import apiRequest from './api';

export type VehicleType = 'car' | 'motorcycle' | 'bicycle' | 'truck';

export interface Rate {
  id: number;
  name: string;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number | null;
  currency: string;
  vehicleType: VehicleType;
  locationId: number | null;
}

export interface CreateRateRequest {
  name: string;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate?: number | null;
  currency?: string;
  vehicleType: VehicleType;
  locationId?: number | null;
}

export interface PublicRate {
  id: number;
  name: string;
  vehicleType: VehicleType;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number | null;
  currency: string;
}

export interface Quote {
  rateId: number;
  rateName: string;
  vehicleType: string;
  currency: string;
  hours: number;
  unit: 'hour' | 'day';
  units: number;
  unitPrice: number;
  total: number;
}

class RateService {
  async getRates(): Promise<Rate[]> {
    return apiRequest<Rate[]>('/rates/', { method: 'GET' });
  }

  /** Tarifas públicas para la landing (no requiere sesión). */
  async getPublicRates(): Promise<PublicRate[]> {
    return apiRequest<PublicRate[]>('/rates/public', { method: 'GET' });
  }

  /** Estimado de cobro según ubicación, tipo de vehículo y horas. */
  async getQuote(params: { locationId?: number; vehicleType?: string; hours?: number }): Promise<Quote> {
    const qs = new URLSearchParams();
    if (params.locationId != null) qs.set('locationId', String(params.locationId));
    if (params.vehicleType) qs.set('vehicleType', params.vehicleType);
    if (params.hours != null) qs.set('hours', String(params.hours));
    return apiRequest<Quote>(`/rates/quote?${qs.toString()}`, { method: 'GET' });
  }

  async getRate(id: number): Promise<Rate> {
    return apiRequest<Rate>(`/rates/${id}`, { method: 'GET' });
  }

  async getRateByLocation(locationId: number): Promise<Rate> {
    return apiRequest<Rate>(`/rates/location/${locationId}`, { method: 'GET' });
  }

  async createRate(data: CreateRateRequest): Promise<Rate> {
    return apiRequest<Rate>('/rates/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRate(id: number, data: Partial<CreateRateRequest>): Promise<Rate> {
    return apiRequest<Rate>(`/rates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRate(id: number): Promise<void> {
    await apiRequest(`/rates/${id}`, { method: 'DELETE' });
  }
}

export default new RateService();
