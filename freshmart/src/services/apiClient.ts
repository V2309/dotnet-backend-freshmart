import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// Axios Client dùng chung cho toàn bộ ứng dụng FreshMart
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5211/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// 1. Request Interceptor: Tự động đính kèm Bearer Token nếu có
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage (được lưu bởi Zustand persist hoặc auth service)
    const token = localStorage.getItem('freshmart_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Bắt và chuẩn hóa mã lỗi HTTP
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Nếu token hết hạn hoặc không hợp lệ (401 Unauthorized)
    if (error.response?.status === 401) {
      // Chỉ logout/xóa token nếu không phải là request đang gọi vào /auth/login
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('freshmart_auth_token');
        localStorage.removeItem('freshmart_auth_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Trích xuất message lỗi dễ đọc từ AxiosError trả về từ Backend .NET
 */
export const getApiErrorMessage = (error: unknown, fallbackMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.'): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(', ');
    }
    if (error.message === 'Network Error') {
      return 'Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại dịch vụ Backend.';
    }
  }
  return fallbackMessage;
};
