// ============================================================================
// Types cho Đơn nhập hàng (Purchase Orders)
// ============================================================================

export type PurchaseStatus = 'Draft' | 'Pending' | 'Received' | 'Cancelled' | 'pending' | 'received' | 'draft' | 'cancelled';

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  lineTotal: number;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  createdById?: string;
  createdByName: string;
  expectedDate?: string;
  receivedDate?: string;
  totalItems: number;
  totalValue: number;
  paidAmount: number;
  status: PurchaseStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: PurchaseOrderItem[];
}

export interface CreatePurchaseOrderItemRequest {
  productId: string;
  quantityOrdered: number;
  unitCost: number;
}

export interface CreatePurchaseOrderRequest {
  supplierId: string;
  expectedDate?: string;
  notes?: string;
  items: CreatePurchaseOrderItemRequest[];
}

export interface PurchaseOrderFilterParams {
  search?: string;
  status?: string;
  supplierId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}
