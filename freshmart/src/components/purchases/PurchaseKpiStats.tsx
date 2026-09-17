import React from 'react';
import { Truck, Clock, CheckCircle2, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface PurchaseKpiStatsProps {
  totalPOs: number;
  totalPendingValue: number;
  totalReceivedValue: number;
  pendingCount: number;
}

export const PurchaseKpiStats: React.FC<PurchaseKpiStatsProps> = ({
  totalPOs,
  totalPendingValue,
  totalReceivedValue,
  pendingCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Tổng số đơn nhập */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Tổng phiếu nhập</span>
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-[#212B36] mt-2 tabular-nums">
          {totalPOs}
        </p>
        <span className="text-[11px] text-slate-400 font-medium">Toàn bộ lịch sử</span>
      </div>

      {/* KPI 2: Chờ nhận hàng */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Đang chờ giao</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-amber-600 mt-2 tabular-nums">
          {pendingCount}
        </p>
        <span className="text-[11px] text-amber-700/80 font-medium">Phiếu chờ nhập kho</span>
      </div>

      {/* KPI 3: Giá trị hàng đang chờ */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Giá trị chờ giao</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-blue-600 mt-2 tabular-nums">
          {formatCurrency(totalPendingValue)}
        </p>
        <span className="text-[11px] text-blue-700/80 font-medium">Dự kiến thanh toán</span>
      </div>

      {/* KPI 4: Giá trị đã nhập kho */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Đã nhập kho</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00A389] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-[#00A389] mt-2 tabular-nums">
          {formatCurrency(totalReceivedValue)}
        </p>
        <span className="text-[11px] text-emerald-700/80 font-medium">Đã cộng tồn kho</span>
      </div>
    </div>
  );
};
