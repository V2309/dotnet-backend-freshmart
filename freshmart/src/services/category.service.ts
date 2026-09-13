import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/category';

// ============================================================================
// Service gọi API Danh mục hàng hóa (Categories)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const categoryService = {
  /**
   * Lấy toàn bộ danh mục hàng hóa (kèm số lượng sản phẩm liên kết)
   */
  getAll: async (includeInactive = false): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
      params: { includeInactive },
    });
    return response.data.data;
  },

  /**
   * Lấy thông tin chi tiết 1 danh mục theo ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  /**
   * Tạo danh mục mới
   */
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  },

  /**
   * Cập nhật thông tin danh mục
   */
  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
  },

  /**
   * Xóa danh mục
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};
