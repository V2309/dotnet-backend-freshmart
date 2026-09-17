import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerFilterParams,
} from '../types/customer';

// ============================================================================
// Service gọi API Khách hàng (Customers)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const customerService = {
  /**
   * Lấy danh sách khách hàng (hỗ trợ tìm kiếm, lọc theo hạng thẻ, phân trang)
   */
  getAll: async (params?: CustomerFilterParams): Promise<Customer[]> => {
    const response = await apiClient.get<ApiResponse<Customer[]>>('/customers', {
      params,
    });
    return response.data.data;
  },

  /**
   * Lấy chi tiết 1 khách hàng theo GUID
   */
  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data.data;
  },

  /**
   * Tìm kiếm nhanh khách hàng tại quầy POS theo SĐT hoặc Tên/Mã KH
   */
  searchForPos: async (query: string): Promise<Customer | null> => {
    const response = await apiClient.get<ApiResponse<Customer | null>>('/customers/search-pos', {
      params: { query },
    });
    return response.data.data;
  },

  /**
   * Tạo mới khách hàng (Quản lý khách hàng hoặc Đăng ký nhanh tại quầy POS)
   */
  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.post<ApiResponse<Customer>>('/customers', data);
    return response.data.data;
  },

  /**
   * Cập nhật thông tin khách hàng
   */
  update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data.data;
  },

  /**
   * Bật / Tắt trạng thái hoạt động của khách hàng
   */
  toggleStatus: async (id: string): Promise<Customer> => {
    const response = await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}/status`);
    return response.data.data;
  },

  /**
   * Xóa khách hàng khỏi hệ thống
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/customers/${id}`);
  },
};
