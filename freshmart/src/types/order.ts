export type PaymentMethod = 'Cash' | 'VietQR' | 'PosCard' | 'cash' | 'vietqr' | 'pos_card';
export type OrderStatus = 'Pending' | 'Completed' | 'Cancelled' | 'pending' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discountPercent: number;
  lineTotal: number;
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  shiftId: string | null;
  shiftName: string | null;
  customerId: string | null;
  customerName: string;
  customerPhone: string | null;
  cashierId: string | null;
  cashierName: string;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  changeAmount: number;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItemRequest {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  lineTotal: number;
}

export interface CheckoutRequest {
  shiftId?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  cashierId?: string;
  cashierName?: string;
  items: OrderItemRequest[];
  subtotal: number;
  discountPercent?: number;
  discountAmount?: number;
  vatRate?: number;
  vatAmount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountReceived?: number;
  changeAmount?: number;
  note?: string;
}

export interface OrderFilterParams {
  search?: string;
  shiftId?: string;
  customerId?: string;
  cashierId?: string;
  paymentMethod?: PaymentMethod;
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface VietQrResponse {
  qrUrl: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  amount: number;
  transferContent: string;
}
