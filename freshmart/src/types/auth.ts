// ============================================================================
// Types cho module Xác thực & Tài khoản người dùng (Auth)
// Chuẩn hóa theo DTO của Backend ASP.NET Core FreshMart
// ============================================================================

export type UserRole = 'admin' | 'cashier' | 'store_manager' | 'warehouse_staff' | 'manager';

export interface User {
  id: string;
  code: string;
  name: string;
  role: UserRole;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
  avatar?: string;
}

export interface EmployeeResponseDto {
  id: string;
  code: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  role: string;
  isActive: boolean;
}

export interface CurrentUserDto {
  id: string;
  code: string;
  name: string;
  role: string;
  email?: string | null;
}

export interface LoginRequest {
  identifier: string; // Email, Số điện thoại hoặc Mã nhân viên
  pin: string;        // Mã PIN / Mật khẩu
}

export interface LoginPinRequest {
  employeeCode: string; // Mã nhân viên (ví dụ: NV000001)
  pin: string;          // Mã PIN
}

export interface RegisterEmployeeRequest {
  name: string;
  phone: string;
  email?: string;
  pin: string;
  hiredDate?: string;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  employee: EmployeeResponseDto;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}
