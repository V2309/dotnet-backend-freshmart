import React from 'react';
import { Receipt, RotateCcw, ShoppingBag, TrendingUp } from 'lucide-react';
import type { DashboardKpiResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/format';

interface DashboardHeroCardsProps {
  kpis: DashboardKpiResponse;
  isPulsing: boolean;
}

export const DashboardHeroCards: React.FC<DashboardHeroCardsProps> = ({ kpis, isPulsing }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Sales (Warm Orange) */}
      <div className={`bg-gradient-to-r from-[#FE9F43] to-[#FFA858] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between transition-all duration-300 ${
        isPulsing ? 'ring-4 ring-[#FE9F43]/40 scale-[1.02]' : ''
      }`}>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-white/90">Tổng doanh số (Sales)</span>
          <h3 className="text-2xl font-black tracking-tight leading-none text-white tabular-nums">
            {formatCurrency(kpis.totalSalesRevenue)}
          </h3>
          <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
            +{kpis.totalSalesCount} đơn hoàn tất
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
          <Receipt className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card 2: Total Sales Return (Midnight Blue) */}
      <div className="bg-gradient-to-r from-[#1B2850] to-[#2B3B6B] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-white/90">Hàng trả / Hủy (Returns)</span>
          <h3 className="text-2xl font-black tracking-tight leading-none text-white tabular-nums">
            {formatCurrency(kpis.totalSalesReturn)}
          </h3>
          <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
            Đơn hủy & đổi trả
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
          <RotateCcw className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card 3: Total Purchase (Emerald Green) */}
      <div className="bg-gradient-to-r from-[#00A389] to-[#28C76F] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-white/90">Tổng đơn nhập (Purchases)</span>
          <h3 className="text-2xl font-black tracking-tight leading-none text-white tabular-nums">
            {formatCurrency(kpis.totalPurchaseValue)}
          </h3>
          <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
            {kpis.totalPurchasesCount} phiếu nhập kho
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card 4: Gross Profit (Purple Accent) */}
      <div className="bg-gradient-to-r from-[#7367F0] to-[#9E95F5] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-white/90">Lợi nhuận gộp (Profit)</span>
          <h3 className="text-2xl font-black tracking-tight leading-none text-white tabular-nums">
            {formatCurrency(kpis.grossProfit)}
          </h3>
          <span className="inline-block text-[10px] font-extrabold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md mt-1">
            Margin ước tính
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
