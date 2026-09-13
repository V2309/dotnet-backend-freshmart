import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  Supplier,
  SupplierFilterParams,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '../types/supplier';

// ============================================================================
// Service gọi API Nhà cung cấp (Suppliers)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const supplierService = {
  /**
   * Lấy danh sách nhà cung cấp (kèm tìm kiếm, lọc và phân trang)
   */
  getAll: async (params?: SupplierFilterParams): Promise<Supplier[]> => {
    const response = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers', {
      params,
    });
    return response.data.data;
  },

  /**
   * Lấy chi tiết nhà cung cấp theo ID
   */
  getById: async (id: string): Promise<Supplier> => {
    const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return response.data.data;
  },

  /**
   * Tạo nhà cung cấp mới
   */
  create: async (data: CreateSupplierRequest): Promise<Supplier> => {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', data);
    return response.data.data;
  },

  /**
   * Cập nhật thông tin nhà cung cấp
   */
  update: async (id: string, data: UpdateSupplierRequest): Promise<Supplier> => {
    const response = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data);
    return response.data.data;
  },

  /**
   * Bật / Tắt trạng thái hợp tác với nhà cung cấp
   */
  toggleStatus: async (id: string): Promise<Supplier> => {
    const response = await apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}/status`);
    return response.data.data;
  },

  /**
   * Xóa nhà cung cấp
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/suppliers/${id}`);
  },
};
