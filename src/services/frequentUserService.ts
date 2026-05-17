import apiRequest from './api';

export interface FrequentUserPayload {
  fullName: string;
  email: string;
  phone: string;
  documentType: 'cedula' | 'pasaporte' | 'extranjeria';
  documentNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'bicycle' | 'truck';
  licensePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  address: string;
  preferredLocation: string;
}

export interface FrequentUserResponse {
  frequentUser: {
    id: number;
    userId: number;
    vehicleId: number;
    documentType: string | null;
    documentNumber: string | null;
    address: string | null;
    preferredLocation: string | null;
    createdAt: string | null;
  };
  user: Record<string, unknown>;
  vehicle: Record<string, unknown>;
}

class FrequentUserService {
  async register(data: FrequentUserPayload): Promise<FrequentUserResponse> {
    return apiRequest<FrequentUserResponse>('/frequent-users/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new FrequentUserService();
