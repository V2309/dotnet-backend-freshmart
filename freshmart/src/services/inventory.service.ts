import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  InventoryOverview,
  AdjustStockRequest,
  InventoryAdjustment,
  InventoryAdjustmentFilterParams,
} from '../types/inventory';

// ============================================================================
// Service gọi API Quản lý Tồn kho & Kiểm kê (Inventory)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const inventoryService = {
  /**
   * Lấy dữ liệu KPI tổng quan tồn kho (Sắp hết, Hết hàng, Tổng giá trị tồn kho)
   */
  getOverview: async (): Promise<InventoryOverview> => {
    const response = await apiClient.get<ApiResponse<InventoryOverview>>('/inventory/overview');
    return response.data.data;
  },

  /**
   * Điều chỉnh / Kiểm kê tồn kho sản phẩm (Ghi nhận lịch sử và cập nhật số lượng)
   */
  adjustStock: async (data: AdjustStockRequest): Promise<InventoryAdjustment> => {
    const response = await apiClient.post<ApiResponse<InventoryAdjustment>>('/inventory/adjust', data);
    return response.data.data;
  },

  /**
   * Lấy lịch sử các lần kiểm kê / điều chỉnh kho
   */
  getHistory: async (params?: InventoryAdjustmentFilterParams): Promise<InventoryAdjustment[]> => {
    const response = await apiClient.get<ApiResponse<InventoryAdjustment[]>>('/inventory/adjustments-history', {
      params,
    });
    return response.data.data;
  },
};
