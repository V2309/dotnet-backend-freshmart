// ============================================================================
// Types cho module Quản lý Nhân sự (Employees)
// Khớp 100% với DTOs của Backend ASP.NET Core
// ============================================================================

export type EmployeeRoleType = 0 | 1 | 2 | 3 | 'Cashier' | 'StoreManager' | 'WarehouseStaff' | 'Admin';

export interface Employee {
  id: string;
  code: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  role: string;
  isActive: boolean;
  hiredDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilterParams {
  search?: string;
  role?: string | number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateEmployeeRequest {
  name: string;
  phone: string;
  email?: string;
  role: EmployeeRoleType;
  pin: string;
  hiredDate?: string;
  notes?: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  phone: string;
  email?: string;
  role: EmployeeRoleType;
  hiredDate?: string;
  notes?: string;
}

export interface ResetPinRequest {
  newPin: string;
}
