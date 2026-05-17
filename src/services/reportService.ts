import apiRequest from './api';

export type ReportPeriod = 'weekly' | 'monthly' | 'yearly';

export interface VehicleFlowEntry {
  name: string;
  date: string;
  entradas: number;
  salidas: number;
}

export interface RevenueEntry {
  name: string;
  date: string;
  ingresos: number;
}

export interface ClientTypeEntry {
  name: string;
  value: number;
}

export interface DailySummaryEntry {
  fecha: string;
  entradas: number;
  salidas: number;
  ingresos: number;
  tiempoPromedio: string;
}

class ReportService {
  async getVehicleFlow(period: ReportPeriod = 'weekly'): Promise<VehicleFlowEntry[]> {
    return apiRequest<VehicleFlowEntry[]>(`/reports/vehicle-flow?period=${period}`, { method: 'GET' });
  }

  async getRevenue(period: ReportPeriod = 'weekly'): Promise<RevenueEntry[]> {
    return apiRequest<RevenueEntry[]>(`/reports/revenue?period=${period}`, { method: 'GET' });
  }

  async getClientTypes(): Promise<ClientTypeEntry[]> {
    return apiRequest<ClientTypeEntry[]>('/reports/client-types', { method: 'GET' });
  }

  async getDailySummary(period: ReportPeriod = 'weekly'): Promise<DailySummaryEntry[]> {
    return apiRequest<DailySummaryEntry[]>(`/reports/daily-summary?period=${period}`, { method: 'GET' });
  }
}

export default new ReportService();
