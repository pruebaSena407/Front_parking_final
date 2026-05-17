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

class RateService {
  async getRates(): Promise<Rate[]> {
    return apiRequest<Rate[]>('/rates/', { method: 'GET' });
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
