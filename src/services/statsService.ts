import apiRequest from './api';

export interface OverviewStats {
  activeClients: number;
  activeReservations: number;
  monthlyRevenue: number;
  locationCount: number;
  totalUsers: number;
}

export interface OccupancyEntry {
  locationId: number;
  locationName: string;
  capacity: number;
  occupied: number;
  rate: number;
}

export interface RevenueStats {
  total: number;
  completed: number;
  pending: number;
  refunded: number;
  paymentCount: number;
}

class StatsService {
  async getOverview(): Promise<OverviewStats> {
    const data = await apiRequest<{ stats: OverviewStats }>('/stats/overview', { method: 'GET' });
    return data.stats;
  }

  async getOccupancy(): Promise<{ occupancy: OccupancyEntry[]; averageRate: number }> {
    return apiRequest('/stats/occupancy', { method: 'GET' });
  }

  async getRevenue(): Promise<RevenueStats> {
    const data = await apiRequest<{ revenue: RevenueStats }>('/stats/revenue', { method: 'GET' });
    return data.revenue;
  }
}

export default new StatsService();
