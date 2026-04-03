import apiRequest from './api';

export interface Rate {
  id: number;
  locationId: number;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  currency: string;
}

export interface CreateRateRequest {
  locationId: number;
  hourlyRate: number;
  dailyRate: number;
  monthlyRate: number;
  currency: string;
}

class RateService {
  async getRates(): Promise<Rate[]> {
    return apiRequest<Rate[]>('/rates', {
      method: 'GET',
    });
  }

  async getRate(id: number): Promise<Rate> {
    return apiRequest<Rate>(`/rates/${id}`, {
      method: 'GET',
    });
  }

  async getRateByLocation(locationId: number): Promise<Rate> {
    return apiRequest<Rate>(`/rates/location/${locationId}`, {
      method: 'GET',
    });
  }

  async createRate(data: CreateRateRequest): Promise<Rate> {
    return apiRequest<Rate>('/rates', {
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
    await apiRequest(`/rates/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new RateService();
