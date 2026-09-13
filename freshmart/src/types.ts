export type ViewMode = 
  | 'dashboard' 
  | 'pos' 
  | 'products' 
  | 'categories'
  | 'suppliers'
  | 'inventory' 
  | 'purchases' 
  | 'customers' 
  | 'reports' 
  | 'employees';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  image: string;
  status: StockStatus;
  supplier: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPercent: number;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  points: number;
  totalSpent: number;
  tier: 'Bạc' | 'Vàng' | 'Kim Cương' | 'Thân thiết';
  lastVisit: string;
}

export type PaymentMethod = 'cash' | 'vietqr' | 'pos_card';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  code: string; // e.g. HD1048
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  cashierName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  change: number;
  status: 'completed' | 'cancelled' | 'pending';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
}

export interface SupplierPurchase {
  id: string;
  code: string; // e.g. NH2041
  supplierName: string;
  createdAt: string;
  expectedDate: string;
  totalItems: number;
  totalValue: number;
  status: 'received' | 'pending' | 'draft';
  createdBy: string;
}

export interface CashierShift {
  id: string;
  cashierName: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  startingCash: number;
  expectedCash: number;
  totalRevenue: number;
  orderCount: number;
  status: 'active' | 'closed';
}
