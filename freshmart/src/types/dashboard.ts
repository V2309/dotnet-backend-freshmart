export interface DashboardKpiResponse {
  totalSalesRevenue: number;
  totalSalesReturn: number;
  totalPurchaseValue: number;
  totalPurchaseReturn: number;
  grossProfit: number;
  invoiceDue: number;
  totalExpenses: number;
  totalPaymentReturns: number;
  totalSalesCount: number;
  totalPurchasesCount: number;
  totalCustomersCount: number;
  totalProductsCount: number;
  totalSuppliersCount: number;
  totalCategoriesCount: number;
  firstTimeCustomersCount: number;
  vipCustomersCount: number;
}

export interface SalesPurchaseChartPoint {
  time: string;
  purchase: number;
  sales: number;
}

export interface SalesPurchaseChartResponse {
  timeframe: string;
  totalPurchase: number;
  totalSales: number;
  data: SalesPurchaseChartPoint[];
}

export interface CategoryPieItem {
  name: string;
  count: number;
  totalRevenue: number;
  color: string;
}

export interface CategorySalesPieResponse {
  totalCategories: number;
  totalProducts: number;
  topCategories: CategoryPieItem[];
  pieData: CategoryPieItem[];
}

export interface RecentTransactionResponse {
  id: string;
  type: string;
  code: string;
  partnerName: string;
  productName: string;
  category: string;
  amount: number;
  status: string;
  statusColor: string;
  imageUrl: string;
  createdAt: string;
  formattedDate: string;
}

export interface LowStockProductResponse {
  id: string;
  sku: string;
  name: string;
  categoryName: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  imageUrl: string;
}

export interface TopSellingProductResponse {
  id: string;
  sku: string;
  name: string;
  categoryName: string;
  unit: string;
  sellPrice: number;
  quantitySold: number;
  totalRevenue: number;
  imageUrl: string;
}

export interface TopCustomerResponse {
  id: string;
  code: string;
  name: string;
  phone: string;
  tier: string;
  points: number;
  totalSpent: number;
}

export interface MonthlyStatPoint {
  month: string;
  revenue: number;
  expense: number;
}

export interface HeatmapHourRow {
  time: string;
  values: number[];
}

export interface FullDashboardResponse {
  kpis: DashboardKpiResponse;
  chart: SalesPurchaseChartResponse;
  categoryStats: CategorySalesPieResponse;
  recentTransactions: RecentTransactionResponse[];
  lowStockProducts: LowStockProductResponse[];
  topSellingProducts: TopSellingProductResponse[];
  topCustomers: TopCustomerResponse[];
  monthlyStats: MonthlyStatPoint[];
  heatmap: HeatmapHourRow[];
  timestamp: string;
}
