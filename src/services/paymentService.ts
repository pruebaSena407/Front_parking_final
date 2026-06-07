import apiRequest from './api';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  reservationId: number;
  amount: number;
  status: PaymentStatus;
  method: string;
  transactionId: string;
  cardHolder?: string | null;
  cardLast4?: string | null;
  paymentDate?: string | null;
  createdAt: string;
  receipt?: Receipt;
}

/** Comprobante de pago enriquecido que devuelve el backend. */
export interface Receipt {
  receiptNumber: string;
  issuedAt: string | null;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  cardLast4?: string | null;
  cardHolder?: string | null;
  payer?: {
    id: number | null;
    name: string;
    email: string;
  } | null;
  reservation?: {
    id: number;
    locationName: string | null;
    locationAddress: string | null;
    spaceCode: string | null;
    startDate: string | null;
    endDate: string | null;
  } | null;
}

export interface CreatePaymentRequest {
  reservationId: number;
  amount: number;
  method: string;
  status?: PaymentStatus;
  /** Datos de tarjeta (opcionales): el backend sólo guarda los últimos 4. */
  cardNumber?: string;
  cardName?: string;
}

class PaymentService {
  async getPayments(): Promise<Payment[]> {
    return apiRequest<Payment[]>('/pagos/', { method: 'GET' });
  }

  async getPayment(id: number): Promise<Payment> {
    return apiRequest<Payment>(`/pagos/${id}`, { method: 'GET' });
  }

  async getReceipt(id: number): Promise<Receipt> {
    return apiRequest<Receipt>(`/pagos/${id}/receipt`, { method: 'GET' });
  }

  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    return apiRequest<Payment>('/pagos/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePaymentStatus(id: number, status: PaymentStatus): Promise<Payment> {
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
