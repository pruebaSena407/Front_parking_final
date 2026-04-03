import apiRequest from './api';

export interface Location {
  id: number;
  name: string;
  address: string;
  capacity: number;
  latitude: number;
  longitude: number;
}

export interface CreateLocationRequest {
  name: string;
  address: string;
  capacity: number;
  latitude: number;
  longitude: number;
}

class LocationService {
  async getLocations(): Promise<Location[]> {
    return apiRequest<Location[]>('/locations', {
      method: 'GET',
    });
  }

  async getLocation(id: number): Promise<Location> {
    return apiRequest<Location>(`/locations/${id}`, {
      method: 'GET',
    });
  }

  async createLocation(data: CreateLocationRequest): Promise<Location> {
    return apiRequest<Location>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLocation(id: number, data: Partial<CreateLocationRequest>): Promise<Location> {
    return apiRequest<Location>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLocation(id: number): Promise<void> {
    await apiRequest(`/locations/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new LocationService();
