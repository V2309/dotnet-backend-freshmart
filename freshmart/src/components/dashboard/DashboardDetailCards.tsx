import React from 'react';
import { DollarSign, RotateCcw, CreditCard, Sparkles } from 'lucide-react';
import type { DashboardKpiResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/format';

interface DashboardDetailCardsProps {
  kpis: DashboardKpiResponse;
}

export const DashboardDetailCards: React.FC<DashboardDetailCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tiền mua hàng nợ */}
      <div className="bg-white border border-[#EAEAEA] p-4.5 rounded-2xl shadow-2xs hover:shadow-sm transition flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Công nợ nhập hàng (Due)</p>
          <p className="text-xl font-black text-[#212B36] tabular-nums">{formatCurrency(kpis.invoiceDue)}</p>
          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
            Đơn chờ thanh toán
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Chi phí hoạt động */}
      <div className="bg-white border border-[#EAEAEA] p-4.5 rounded-2xl shadow-2xs hover:shadow-sm transition flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Chi phí vận hành (Expense)</p>
          <p className="text-xl font-black text-[#212B36] tabular-nums">{formatCurrency(kpis.totalExpenses)}</p>
          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md inline-block">
            Mặt bằng & vận hành
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Hoàn trả tiền mặt */}
      <div className="bg-white border border-[#EAEAEA] p-4.5 rounded-2xl shadow-2xs hover:shadow-sm transition flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Hoàn trả thanh toán</p>
          <p className="text-xl font-black text-[#212B36] tabular-nums">{formatCurrency(kpis.totalPaymentReturns)}</p>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
            Đơn hủy POS
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Lợi nhuận thuần */}
      <div className="bg-white border border-[#EAEAEA] p-4.5 rounded-2xl shadow-2xs hover:shadow-sm transition flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Lợi nhuận ước tính (Net)</p>
          <p className="text-xl font-black text-[#00A389] tabular-nums">
            {formatCurrency(Math.max(0, kpis.grossProfit - kpis.totalExpenses))}
          </p>
          <span className="text-[10px] text-[#00A389] font-bold bg-[#E8F8F5] px-2 py-0.5 rounded-md inline-block">
            Biên lợi nhuận ròng
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
