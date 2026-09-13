import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  ResetPinRequest,
  EmployeeFilterParams,
} from '../types/employee';

// ============================================================================
// Service gọi API Quản lý Nhân sự (Employees)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const employeeService = {
  /**
   * Lấy danh sách nhân viên có tìm kiếm, lọc vai trò, trạng thái và phân trang
   */
  getAll: async (params?: EmployeeFilterParams): Promise<Employee[]> => {
    const response = await apiClient.get<ApiResponse<Employee[]>>('/employees', {
      params,
    });
    return response.data.data;
  },

  /**
   * Lấy chi tiết nhân viên theo ID hoặc Mã Code
   */
  getById: async (idOrCode: string): Promise<Employee> => {
    const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${idOrCode}`);
    return response.data.data;
  },

  /**
   * Thêm nhân viên mới
   */
  create: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await apiClient.post<ApiResponse<Employee>>('/employees', data);
    return response.data.data;
  },

  /**
   * Cập nhật thông tin nhân viên
   */
  update: async (idOrCode: string, data: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${idOrCode}`, data);
    return response.data.data;
  },

  /**
   * Khóa / Kích hoạt tài khoản nhân viên
   */
  toggleStatus: async (idOrCode: string): Promise<Employee> => {
    const response = await apiClient.patch<ApiResponse<Employee>>(`/employees/${idOrCode}/status`);
    return response.data.data;
  },

  /**
   * Cấp lại mã PIN cho nhân viên (Quyền Admin)
   */
  resetPin: async (idOrCode: string, newPin: string): Promise<void> => {
    await apiClient.patch<ApiResponse<null>>(`/employees/${idOrCode}/reset-pin`, {
      newPin,
    } as ResetPinRequest);
  },

  /**
   * Xóa nhân viên khỏi hệ thống (Quyền Admin)
   */
  delete: async (idOrCode: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/employees/${idOrCode}`);
  },
};
