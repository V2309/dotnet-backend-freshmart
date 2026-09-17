export type NotificationType = 'warning' | 'info' | 'success' | 'error';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  isRead?: boolean;
  createdAt?: string;
  employeeId?: string;
  employeeName?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  employeeId?: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
