// ============================================================================
// Types cho module Sản phẩm (Products)
// Khớp 100% với DTOs của Backend ASP.NET Core
// ============================================================================

export type StockStatus = 'InStock' | 'LowStock' | 'OutOfStock';

export interface Product {
  id: string;
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  supplierId?: string | null;
  supplierName?: string | null;
  unit: string;
  costPrice: number;
  sellPrice: number;
  vatRate: number;
  stock: number;
  minStock: number;
  imageUrl?: string | null;
  status: StockStatus;
  isActive: boolean;
  expiryDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string;
  categoryId: string;
  supplierId?: string | null;
  unit?: string;
  costPrice: number;
  sellPrice: number;
  vatRate?: number;
  stock: number;
  minStock: number;
  imageUrl?: string | null;
  status?: StockStatus;
  isActive?: boolean;
  expiryDate?: string | null;
  notes?: string | null;
}

export interface UpdateProductRequest {
  sku: string;
  barcode?: string | null;
  name: string;
  description?: string;
  categoryId: string;
  supplierId?: string | null;
  unit?: string;
  costPrice: number;
  sellPrice: number;
  vatRate?: number;
  stock: number;
  minStock: number;
  imageUrl?: string | null;
  status?: StockStatus;
  isActive?: boolean;
  expiryDate?: string | null;
  notes?: string | null;
}

export interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  supplierId?: string;
  status?: StockStatus;
  isActive?: boolean;
  sortBy?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface QuickStockRequest {
  stock: number;
  note?: string;
}
