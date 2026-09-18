import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  FullDashboardResponse,
  DashboardKpiResponse,
  SalesPurchaseChartResponse,
  CategorySalesPieResponse,
  RecentTransactionResponse,
  LowStockProductResponse,
} from '../types/dashboard';

export const dashboardService = {
  getFullDashboard: async (timeframe: string = '1Y'): Promise<FullDashboardResponse> => {
    const response = await apiClient.get<ApiResponse<FullDashboardResponse>>('/dashboard/full', {
      params: { timeframe },
    });
    return response.data.data;
  },

  getKpiSummary: async (): Promise<DashboardKpiResponse> => {
    const response = await apiClient.get<ApiResponse<DashboardKpiResponse>>('/dashboard/kpi-summary');
    return response.data.data;
  },

  getSalesPurchaseChart: async (timeframe: string = '1Y'): Promise<SalesPurchaseChartResponse> => {
    const response = await apiClient.get<ApiResponse<SalesPurchaseChartResponse>>('/dashboard/sales-purchase-chart', {
      params: { timeframe },
    });
    return response.data.data;
  },

  getCategorySalesPie: async (): Promise<CategorySalesPieResponse> => {
    const response = await apiClient.get<ApiResponse<CategorySalesPieResponse>>('/dashboard/category-sales-pie');
    return response.data.data;
  },

  getRecentTransactions: async (limit: number = 10): Promise<RecentTransactionResponse[]> => {
    const response = await apiClient.get<ApiResponse<RecentTransactionResponse[]>>('/dashboard/recent-transactions', {
      params: { limit },
    });
    return response.data.data;
  },

  getLowStockAlerts: async (limit: number = 10): Promise<LowStockProductResponse[]> => {
    const response = await apiClient.get<ApiResponse<LowStockProductResponse[]>>('/dashboard/low-stock-alert', {
      params: { limit },
    });
    return response.data.data;
  },
};
