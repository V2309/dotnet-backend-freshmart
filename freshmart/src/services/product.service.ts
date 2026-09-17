import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilterParams,
  QuickStockRequest,
} from '../types/product';

// ============================================================================
// Service gọi API Quản lý Sản phẩm (Products)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const productService = {
  /**
   * 1. Lấy danh sách sản phẩm (hỗ trợ tìm kiếm, lọc theo danh mục/NCC/trạng thái, sắp xếp & phân trang)
   */
  getAll: async (params?: ProductFilterParams): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params,
    });
    return response.data.data;
  },

  /**
   * 2. Lấy chi tiết 1 sản phẩm theo ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  /**
   * 3. Quét mã vạch Barcode (phục vụ máy quét POS và Quick Search)
   */
  getByBarcode: async (barcode: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/barcode/${barcode}`);
    return response.data.data;
  },

  /**
   * 4. Thêm sản phẩm mới
   */
  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  /**
   * 5. Cập nhật thông tin sản phẩm
   */
  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  /**
   * 6. Cập nhật nhanh số lượng tồn kho
   */
  quickAdjustStock: async (id: string, data: QuickStockRequest): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/quick-stock`, data);
    return response.data.data;
  },

  /**
   * 7. Bật / Tắt trạng thái kinh doanh sản phẩm
   */
  toggleStatus: async (id: string): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/status`);
    return response.data.data;
  },

  /**
   * 8. Xóa sản phẩm
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
  },
};
