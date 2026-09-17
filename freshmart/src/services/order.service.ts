import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  Order,
  CheckoutRequest,
  OrderFilterParams,
  VietQrResponse,
} from '../types/order';

// ============================================================================
// Service gọi API Quản lý Đơn hàng & POS Checkout
// ============================================================================

export const orderService = {
  /**
   * 1. Thanh toán đơn hàng POS (Checkout)
   */
  checkout: async (data: CheckoutRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/pos/checkout', data);
    return response.data.data;
  },

  /**
   * 2. Lấy link mã VietQR động
   */
  getVietQr: async (amount: number, orderCode?: string): Promise<VietQrResponse> => {
    const response = await apiClient.get<ApiResponse<VietQrResponse>>('/pos/vietqr', {
      params: { amount, orderCode },
    });
    return response.data.data;
  },

  /**
   * 3. Lấy danh sách lịch sử đơn hàng
   */
  getAll: async (params?: OrderFilterParams): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders', {
      params,
    });
    return response.data.data;
  },

  /**
   * 4. Lấy chi tiết đơn hàng theo GUID
   */
  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  /**
   * 5. Lấy chi tiết đơn hàng theo mã hóa đơn (HDxxxx)
   */
  getByCode: async (code: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/code/${code}`);
    return response.data.data;
  },

  /**
   * 6. Hủy đơn hàng và hoàn trả tồn kho
   */
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`, null, {
      params: reason ? { reason } : undefined,
    });
    return response.data.data;
  },
};
