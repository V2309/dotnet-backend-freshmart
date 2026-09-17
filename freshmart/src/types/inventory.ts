// ============================================================================
// Types cho Quản lý Tồn kho & Kiểm kê (Inventory)
// ============================================================================

export type AdjustReason = 'StockCount' | 'Damage' | 'Expiry' | 'Return' | 'Other';

export interface InventoryOverview {
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
  totalStockItems: number;
}

export interface AdjustStockRequest {
  productId: string;
  actualStock?: number;
  qtyChange?: number;
  reason: AdjustReason;
  note?: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  employeeId?: string;
  employeeName: string;
  reason: AdjustReason;
  qtyBefore: number;
  qtyChange: number;
  qtyAfter: number;
  note?: string;
  createdAt: string;
}

export interface InventoryAdjustmentFilterParams {
  productId?: string;
  employeeId?: string;
  reason?: AdjustReason;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}
