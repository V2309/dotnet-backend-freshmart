import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  PurchaseOrder,
  CreatePurchaseOrderRequest,
  PurchaseOrderFilterParams,
} from '../types/purchase';

// ============================================================================
// Service gọi API Đơn nhập hàng (Purchase Orders)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const purchaseService = {
  /**
   * Lấy danh sách đơn nhập hàng (hỗ trợ tìm kiếm, lọc theo trạng thái, NCC, phân trang)
   */
  getAll: async (params?: PurchaseOrderFilterParams): Promise<PurchaseOrder[]> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder[]>>('/purchase-orders', {
      params,
    });
    return response.data.data;
  },

  /**
   * Lấy chi tiết đơn nhập hàng theo GUID
   */
  getById: async (id: string): Promise<PurchaseOrder> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}`);
    return response.data.data;
  },

  /**
   * Lấy chi tiết đơn nhập hàng theo Mã đơn (NHxxxxxx)
   */
  getByCode: async (code: string): Promise<PurchaseOrder> => {
    const response = await apiClient.get<ApiResponse<PurchaseOrder>>(`/purchase-orders/code/${code}`);
    return response.data.data;
  },

  /**
   * Tạo đơn đặt / nhập hàng mới
   */
  create: async (data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> => {
    const response = await apiClient.post<ApiResponse<PurchaseOrder>>('/purchase-orders', data);
    return response.data.data;
  },

  /**
   * Xác nhận hàng đã về kho (Tự động cộng dồn tồn kho và cập nhật giá vốn)
   */
  receive: async (id: string): Promise<PurchaseOrder> => {
    const response = await apiClient.patch<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}/receive`);
    return response.data.data;
  },

  /**
   * Hủy đơn nhập hàng
   */
  cancel: async (id: string): Promise<PurchaseOrder> => {
    const response = await apiClient.patch<ApiResponse<PurchaseOrder>>(`/purchase-orders/${id}/cancel`);
    return response.data.data;
  },

  /**
   * Xóa đơn nhập hàng nháp
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/purchase-orders/${id}`);
  },
};
