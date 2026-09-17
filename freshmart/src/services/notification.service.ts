import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/auth';
import type {
  NotificationItem,
  CreateNotificationRequest,
  UnreadCountResponse,
} from '../types/notification';

// ============================================================================
// Service gọi API Thông báo & Cảnh báo (Notifications)
// Tuân thủ quy tắc trong frontend-api-rules-services.txt
// ============================================================================

export const notificationService = {
  /**
   * Lấy danh sách thông báo từ hệ thống
   */
  getAll: async (unreadOnly?: boolean): Promise<NotificationItem[]> => {
    const response = await apiClient.get<ApiResponse<NotificationItem[]>>('/notifications', {
      params: unreadOnly !== undefined ? { unreadOnly } : undefined,
    });
    return response.data.data;
  },

  /**
   * Đếm số lượng thông báo chưa đọc (để hiển thị badge)
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
    return response.data.data.unreadCount;
  },

  /**
   * Tạo thông báo mới
   */
  create: async (data: CreateNotificationRequest): Promise<NotificationItem> => {
    const response = await apiClient.post<ApiResponse<NotificationItem>>('/notifications', data);
    return response.data.data;
  },

  /**
   * Đánh dấu 1 thông báo là đã đọc
   */
  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await apiClient.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch<ApiResponse<null>>('/notifications/read-all');
  },

  /**
   * Xóa thông báo khỏi danh sách
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/notifications/${id}`);
  },
};
