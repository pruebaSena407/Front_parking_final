import apiRequest from './api';

export interface Reservation {
  id: number;
  userId: string;
  locationId: number;
  vehicleId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
}

export interface CreateReservationRequest {
  locationId: number;
  vehicleId: string;
  startDate: string;
  endDate: string;
}

class ReservationService {
  async getReservations(): Promise<Reservation[]> {
    return apiRequest<Reservation[]>('/reservations', {
      method: 'GET',
    });
  }

  async getReservation(id: number): Promise<Reservation> {
    return apiRequest<Reservation>(`/reservations/${id}`, {
      method: 'GET',
    });
  }

  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    return apiRequest<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReservation(id: number, data: Partial<CreateReservationRequest>): Promise<Reservation> {
    return apiRequest<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelReservation(id: number): Promise<void> {
    await apiRequest(`/reservations/${id}/cancel`, {
      method: 'POST',
    });
  }

  async deleteReservation(id: number): Promise<void> {
    await apiRequest(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ReservationService();
