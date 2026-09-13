// ============================================================================
// Types cho module Nhà cung cấp (Suppliers)
// Khớp 100% với DTOs của Backend ASP.NET Core
// ============================================================================

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  taxCode?: string | null;
  bankAccount?: string | null;
  bankName?: string | null;
  isActive: boolean;
  notes?: string | null;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFilterParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateSupplierRequest {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateSupplierRequest {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  isActive?: boolean;
  notes?: string;
}
