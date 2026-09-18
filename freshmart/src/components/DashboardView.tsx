import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, X } from 'lucide-react';
import type { FullDashboardResponse } from '../types/dashboard';
import type { CashierShift, Order } from '../types';
import { formatCurrency } from '../utils/format';

import {
  DashboardHeader,
  DashboardHeroCards,
  DashboardDetailCards,
  SalesPurchaseChart,
  OverallInfoSection,
  TopSellingList,
  LowStockAlertCard,
  RecentSalesCard,
  SalesStatisticsChart,
  RecentTransactionsTable,
  TopCustomersList,
  CategoryPieSection,
  OrderHeatmapSection
} from './dashboard';

interface DashboardViewProps {
  data: FullDashboardResponse | null;
  isLoading: boolean;
  isRealtimeConnected: boolean;
  isPulsing: boolean;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  onRefresh: () => void;
  activeShift?: CashierShift;
  onNavigateToPOS: () => void;
  onNavigateToInventory: () => void;
  onNavigateToReports: () => void;
  onNavigateToShifts: () => void;
  onQuickRestock: (productId: string, quantity: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  isLoading,
  isRealtimeConnected,
  isPulsing,
  timeframe,
  onTimeframeChange,
  onRefresh,
  activeShift,
  onNavigateToPOS,
  onNavigateToInventory,
  onNavigateToReports,
  onNavigateToShifts,
  onQuickRestock
}) => {
  const { user } = useAuth();
  const [showLowStockAlert, setShowLowStockAlert] = useState<boolean>(true);

  // Safe KPI defaults
  const kpis = data?.kpis || {
    totalSalesRevenue: 0,
    totalSalesReturn: 0,
    totalPurchaseValue: 0,
    totalPurchaseReturn: 0,
    grossProfit: 0,
    invoiceDue: 0,
    totalExpenses: 0,
    totalPaymentReturns: 0,
    totalSalesCount: 0,
    totalPurchasesCount: 0,
    totalCustomersCount: 0,
    totalProductsCount: 0,
    totalSuppliersCount: 0,
    totalCategoriesCount: 0,
    firstTimeCustomersCount: 0,
    vipCustomersCount: 0,
  };

  const criticalProduct = data?.lowStockProducts?.[0];
  const lowStockList = data?.lowStockProducts || [];
  const topSellingList = data?.topSellingProducts || [];
  const recentTransactions = data?.recentTransactions || [];
  const topCustomersList = data?.topCustomers || [];
  const rawChartData = data?.chart?.data || [];
  const rawMonthlyStats = data?.monthlyStats || [];
  const categoryStats = data?.categoryStats || {
    totalCategories: 0,
    totalProducts: 0,
    topCategories: [],
    pieData: []
  };
  const heatmap = data?.heatmap || [];

  // Normalize chart data keys (handles both camelCase and PascalCase from API)
  const chartData = useMemo(() => {
    if (!rawChartData || rawChartData.length === 0) {
      const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return defaultMonths.map((m, i) => ({
        time: m,
        purchase: Math.round(10 + i * 1.5),
        sales: Math.round(15 + i * 2.2)
      }));
    }
    return rawChartData.map((pt: any) => ({
      time: pt.time || pt.Time || '',
      purchase: Number(pt.purchase ?? pt.Purchase ?? 0),
      sales: Number(pt.sales ?? pt.Sales ?? 0)
    }));
  }, [rawChartData]);

  // Normalize monthly stats keys (handles both camelCase and PascalCase from API)
  const monthlyStats = useMemo(() => {
    if (!rawMonthlyStats || rawMonthlyStats.length === 0) {
      const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return defaultMonths.map((m, i) => ({
        month: m,
        revenue: Math.round(18 + i * 2),
        expense: -Math.round(14 + i * 1.5)
      }));
    }
    return rawMonthlyStats.map((pt: any) => ({
      month: pt.month || pt.Month || '',
      revenue: Number(pt.revenue ?? pt.Revenue ?? 0),
      expense: Number(pt.expense ?? pt.Expense ?? 0)
    }));
  }, [rawMonthlyStats]);

  // Customer Donut Data
  const customerDonutData = useMemo(() => [
    { name: 'Khách mới', value: Math.max(1, kpis.firstTimeCustomersCount), color: '#FE9F43' },
    { name: 'Khách VIP', value: Math.max(1, kpis.vipCustomersCount), color: '#00A389' }
  ], [kpis.firstTimeCustomersCount, kpis.vipCustomersCount]);

  // Custom Tooltip for Recharts
  const CustomRechartsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#212B36] text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 z-50 border border-slate-700">
          <p className="font-bold text-slate-300">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-mono font-bold">
                ₫{Math.abs(Number(entry.value || 0)).toLocaleString('vi-VN')} triệu
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="dashboard-view" className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200">
      {/* 1. Header Bar */}
      <DashboardHeader
        userName={user?.name || user?.fullName || 'Quản trị viên'}
        isRealtimeConnected={isRealtimeConnected}
        isPulsing={isPulsing}
        isLoading={isLoading}
        onRefresh={onRefresh}
        activeShift={activeShift}
        onNavigateToShifts={onNavigateToShifts}
      />

      {/* 2. Low Stock Alert Banner (Dismissible) */}
      {showLowStockAlert && criticalProduct && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                Cảnh báo tồn kho: Mặt hàng <span className="underline font-black">{criticalProduct.name}</span> sắp hết hàng!
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Hiện tại trong kho chỉ còn <span className="font-bold">{criticalProduct.stock} {criticalProduct.unit}</span> (Mức tối thiểu: {criticalProduct.minStock}).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToInventory}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              Nhập hàng ngay
            </button>
            <button
              onClick={() => setShowLowStockAlert(false)}
              className="text-amber-800 hover:text-amber-950 p-1.5 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Top Row 1 - 4 Key Hero Cards */}
      <DashboardHeroCards kpis={kpis} isPulsing={isPulsing} />

      {/* 4. Top Row 2 - 4 Detail KPI Cards */}
      <DashboardDetailCards kpis={kpis} />

      {/* 5. Middle Row 1 (8 cols: SalesPurchaseChart, 4 cols: OverallInfoSection) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <SalesPurchaseChart
            chartData={chartData}
            timeframe={timeframe}
            onTimeframeChange={onTimeframeChange}
            totalPurchaseValue={kpis.totalPurchaseValue}
            totalSalesRevenue={kpis.totalSalesRevenue}
            tooltipComponent={CustomRechartsTooltip}
          />
        </div>
        <div className="lg:col-span-4">
          <OverallInfoSection
            kpis={kpis}
            customerDonutData={customerDonutData}
            tooltipComponent={CustomRechartsTooltip}
          />
        </div>
      </div>

      {/* 6. Middle Row 2 (3 Columns: Top Selling, Low Stock, Recent Sales) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TopSellingList products={topSellingList} />
        <LowStockAlertCard
          products={lowStockList}
          onNavigateToInventory={onNavigateToInventory}
          onQuickRestock={onQuickRestock}
        />
        <RecentSalesCard transactions={recentTransactions} />
      </div>

      {/* 7. Middle Row 3 (5 cols: SalesStatisticsChart, 7 cols: RecentTransactionsTable) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <SalesStatisticsChart
            monthlyStats={monthlyStats}
            totalSalesRevenue={kpis.totalSalesRevenue}
            totalPurchaseValue={kpis.totalPurchaseValue}
            tooltipComponent={CustomRechartsTooltip}
          />
        </div>
        <div className="lg:col-span-7">
          <RecentTransactionsTable
            transactions={recentTransactions}
            onNavigateToPOS={onNavigateToPOS}
          />
        </div>
      </div>

      {/* 8. Bottom Row (3 Columns: Top Customers, Category Pie, Order Heatmap) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TopCustomersList customers={topCustomersList} />
        <CategoryPieSection categoryStats={categoryStats} />
        <OrderHeatmapSection heatmap={heatmap} />
      </div>
    </div>
  );
};

export default DashboardView;
