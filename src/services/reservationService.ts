// =====================================================================
// SERVICIO DE RESERVAS (reservationService.ts)
// ---------------------------------------------------------------------
// Funciones del front para hablar con el backend de reservas.
// Cada método llama a un endpoint distinto en /api/reservations/*
// =====================================================================

import apiRequest from './api';

// Cómo se ve una reserva en el front (tipado para TypeScript)
export interface Reservation {
  id: number;
  userId: string;
  locationId: number;
  vehicleId: string | null;
  spaceCode?: string | null;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  /** Campos expandidos que devuelve el backend para mostrar nombres, no IDs. */
  userName?: string | null;
  locationName?: string | null;
  vehiclePlate?: string | null;
}

// Datos que mandamos para CREAR una reserva
export interface CreateReservationRequest {
  userId?: string;
  locationId: number;
  vehicleId: string | null;
  startDate: string;
  endDate: string;
  spaceCode?: string | null;
  totalPrice?: number | null;
  notes?: string | null;
}

class ReservationService {
  async getReservations(): Promise<Reservation[]> {
    return apiRequest<Reservation[]>('/reservations/', { method: 'GET' });
  }

  async getReservation(id: number): Promise<Reservation> {
    return apiRequest<Reservation>(`/reservations/${id}`, { method: 'GET' });
  }

  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    return apiRequest<Reservation>('/reservations/', {
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

  async cancelReservation(id: number): Promise<Reservation> {
    return apiRequest<Reservation>(`/reservations/${id}/cancel`, {
      method: 'POST',
    });
  }

  async deleteReservation(id: number): Promise<void> {
    await apiRequest(`/reservations/${id}`, { method: 'DELETE' });
  }
}

export default new ReservationService();
