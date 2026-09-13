// ============================================================================
// Types cho module Danh mục hàng hóa (Categories)
// Khớp 100% với DTOs của Backend ASP.NET Core
// ============================================================================

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name: string;
  slug?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}
