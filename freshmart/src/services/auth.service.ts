import { apiClient } from './apiClient';
import type {
  LoginRequest,
  LoginPinRequest,
  RegisterEmployeeRequest,
  AuthResponse,
  CurrentUserDto,
  ApiResponse,
} from '../types/auth';

// ============================================================================
// Service gọi API Xác thực (Auth)
// Chỉ đảm nhận việc gửi/nhận dữ liệu HTTP, không can thiệp vào UI State
// ============================================================================

export const authService = {
  /**
   * Đăng nhập bằng Email / SĐT / Mã NV + Mật khẩu hoặc PIN
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  /**
   * Đăng nhập nhanh tại quầy POS bằng Mã nhân viên + PIN
   */
  loginPin: async (data: LoginPinRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login-pin', data);
    return response.data.data;
  },

  /**
   * Đăng ký nhân viên mới (Public endpoint)
   */
  register: async (data: RegisterEmployeeRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  /**
   * Lấy thông tin user hiện tại từ JWT Claims
   */
  getCurrentUser: async (): Promise<CurrentUserDto> => {
    const response = await apiClient.get<ApiResponse<CurrentUserDto>>('/auth/me');
    return response.data.data;
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<null>>('/auth/logout');
    } catch {
      // Bỏ qua lỗi mạng khi logout để luôn xóa token cục bộ
    }
  },
};
