import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  ReportTimeframe,
  ReportSummary,
  PaymentShareResponse,
  HourlyRevenueTrend,
  DailyRevenueComparison,
} from '../types/report';

// ============================================================================
// Service gọi API Báo cáo & Thống kê Tài chính (Reports)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const reportService = {
  /**
   * Lấy tổng quan các chỉ số tài chính theo khung thời gian
   */
  getSummary: async (timeframe: ReportTimeframe = 'month'): Promise<ReportSummary> => {
    const response = await apiClient.get<ApiResponse<ReportSummary>>('/reports/summary', {
      params: { timeframe },
    });
    return response.data.data;
  },

  /**
   * Lấy cơ cấu doanh thu theo phương thức thanh toán
   */
  getPaymentShare: async (timeframe: ReportTimeframe = 'month'): Promise<PaymentShareResponse> => {
    const response = await apiClient.get<ApiResponse<PaymentShareResponse>>('/reports/payment-share', {
      params: { timeframe },
    });
    return response.data.data;
  },

  /**
   * Lấy xu hướng doanh thu theo khung giờ
   */
  getRevenueTrend: async (timeframe: ReportTimeframe = 'day'): Promise<HourlyRevenueTrend[]> => {
    const response = await apiClient.get<ApiResponse<HourlyRevenueTrend[]>>('/reports/revenue-trend', {
      params: { timeframe },
    });
    return response.data.data;
  },

  /**
   * Lấy so sánh doanh thu các ngày trong tuần so với mục tiêu
   */
  getDailyComparison: async (timeframe: ReportTimeframe = 'week'): Promise<DailyRevenueComparison[]> => {
    const response = await apiClient.get<ApiResponse<DailyRevenueComparison[]>>('/reports/daily-comparison', {
      params: { timeframe },
    });
    return response.data.data;
  },
};
