export type ReportTimeframe = 'day' | 'week' | 'month' | 'year';

export interface ReportSummary {
  totalRevenue: number;
  totalVAT: number;
  totalDiscount: number;
  grossProfit: number;
  orderCount: number;
  timeframe: ReportTimeframe;
}

export interface PaymentShareItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface PaymentShareResponse {
  vietQrTotal: number;
  vietQrCount: number;
  cashTotal: number;
  cashCount: number;
  posTotal: number;
  posCount: number;
  items: PaymentShareItem[];
}

export interface HourlyRevenueTrend {
  time: string;
  revenue: number;
  orders: number;
  vat: number;
}

export interface DailyRevenueComparison {
  day: string;
  date: string;
  revenue: number;
  target: number;
}
