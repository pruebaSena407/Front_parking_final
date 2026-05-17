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
  vehicleId: string;
  startDate: string;
  endDate: string;
  // Solo se permiten estos 4 estados:
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
}

// Datos mínimos que mandamos para CREAR una reserva
export interface CreateReservationRequest {
  locationId: number;
  vehicleId: string;
  startDate: string;
  endDate: string;
}

// Clase que agrupa las llamadas al API de reservas
class ReservationService {
  // GET /api/reservations → traer todas las reservas
  async getReservations(): Promise<Reservation[]> {
    return apiRequest<Reservation[]>('/reservations', {
      method: 'GET',
    });
  }

  // GET /api/reservations/:id → una reserva específica
  async getReservation(id: number): Promise<Reservation> {
    return apiRequest<Reservation>(`/reservations/${id}`, {
      method: 'GET',
    });
  }

  // POST /api/reservations → crear una reserva nueva
  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    return apiRequest<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),  // convertimos el objeto a JSON
    });
  }

  // PUT /api/reservations/:id → actualizar una reserva
  // Partial<X> significa que TODOS los campos de X son opcionales,
  // útil para enviar solo lo que cambia.
  async updateReservation(id: number, data: Partial<CreateReservationRequest>): Promise<Reservation> {
    return apiRequest<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // POST /api/reservations/:id/cancel → marcar como cancelada
  async cancelReservation(id: number): Promise<void> {
    await apiRequest(`/reservations/${id}/cancel`, {
      method: 'POST',
    });
  }

  // DELETE /api/reservations/:id → borrar una reserva
  async deleteReservation(id: number): Promise<void> {
    await apiRequest(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }
}

// Singleton: una sola instancia para toda la app
export default new ReservationService();
