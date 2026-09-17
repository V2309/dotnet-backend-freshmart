import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  Shift,
  OpenShiftRequest,
  CloseShiftRequest,
  ShiftReport,
  ShiftFilterParams,
} from '../types/shift';

// ============================================================================
// Service gọi API Quản lý Ca làm việc & Két tiền (Shifts)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const shiftService = {
  /**
   * 1. Lấy ca làm việc đang mở (Active) hiện tại của thu ngân
   */
  getCurrentShift: async (employeeId?: string): Promise<Shift | null> => {
    const response = await apiClient.get<ApiResponse<Shift | null>>('/shifts/current', {
      params: employeeId ? { employeeId } : undefined,
    });
    return response.data.data;
  },

  /**
   * 2. Mở ca làm việc mới
   */
  openShift: async (data: OpenShiftRequest): Promise<Shift> => {
    const response = await apiClient.post<ApiResponse<Shift>>('/shifts/open', data);
    return response.data.data;
  },

  /**
   * 3. Chốt / Đóng ca làm việc và kiểm đếm két tiền
   */
  closeShift: async (id: string, data: CloseShiftRequest): Promise<Shift> => {
    const response = await apiClient.post<ApiResponse<Shift>>(`/shifts/${id}/close`, data);
    return response.data.data;
  },

  /**
   * 4. Lấy danh sách lịch sử tất cả ca làm việc
   */
  getAll: async (params?: ShiftFilterParams): Promise<Shift[]> => {
    const response = await apiClient.get<ApiResponse<Shift[]>>('/shifts', {
      params,
    });
    return response.data.data;
  },

  /**
   * 5. Lấy chi tiết 1 ca làm việc theo ID
   */
  getById: async (id: string): Promise<Shift> => {
    const response = await apiClient.get<ApiResponse<Shift>>(`/shifts/${id}`);
    return response.data.data;
  },

  /**
   * 6. Lấy báo cáo tài chính tổng kết chi tiết ca làm việc
   */
  getReport: async (id: string): Promise<ShiftReport> => {
    const response = await apiClient.get<ApiResponse<ShiftReport>>(`/shifts/${id}/report`);
    return response.data.data;
  },
};
