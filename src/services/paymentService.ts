import apiRequest from './api';

export interface Payment {
  id: number;
  reservationId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  transactionId: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  reservationId: number;
  amount: number;
  method: string;
}

class PaymentService {
  async getPayments(): Promise<Payment[]> {
    return apiRequest<Payment[]>('/pagos', {
      method: 'GET',
    });
  }

  async getPayment(id: number): Promise<Payment> {
    return apiRequest<Payment>(`/pagos/${id}`, {
      method: 'GET',
    });
  }

  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    return apiRequest<Payment>('/pagos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    return apiRequest<Payment>(`/pagos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async refundPayment(id: number): Promise<Payment> {
    return apiRequest<Payment>(`/pagos/${id}/refund`, {
      method: 'POST',
    });
  }
}

export default new PaymentService();
