import React from 'react';
import { Clock, DollarSign, ShoppingBag, AlertCircle } from 'lucide-react';
import type { Shift } from '../../types/shift';
import { formatCurrency } from '../../utils/format';

interface ShiftKpiCardsProps {
  shifts: Shift[];
  currentShift: Shift | null;
}

export const ShiftKpiCards: React.FC<ShiftKpiCardsProps> = ({ shifts, currentShift }) => {
  const totalRevenue = shifts.reduce((sum, s) => sum + (Number(s.totalRevenue) || 0), 0);
  const totalOrders = shifts.reduce((sum, s) => sum + (Number(s.orderCount) || 0), 0);
  const totalDifference = shifts.reduce((sum, s) => sum + (Number(s.difference) || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Trạng thái ca trực */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#646B72] font-semibold">Ca hiện tại</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${currentShift ? 'bg-[#E8F8F5] text-[#00A389]' : 'bg-slate-100 text-slate-500'}`}>
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-xl font-black text-[#212B36] mt-2 truncate">
          {currentShift ? currentShift.shiftName : 'Chưa mở ca'}
        </h3>
        <span className="text-[11px] text-[#646B72] font-medium mt-1.5 block truncate">
          {currentShift ? `Thu ngân: ${currentShift.cashierName}` : 'Quầy thu ngân đang nghỉ'}
        </span>
      </div>

      {/* 2. Tổng doanh thu các ca */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#646B72] font-semibold">Tổng doanh thu ca</span>
          <div className="w-9 h-9 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-[#FE9F43] mt-2 tabular-nums">
          {formatCurrency(totalRevenue)}
        </h3>
        <span className="text-[11px] text-[#646B72] font-medium mt-1.5 block">
          Ghi nhận từ {shifts.length} ca làm việc
        </span>
      </div>

      {/* 3. Tổng đơn hàng phục vụ */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#646B72] font-semibold">Tổng số đơn hàng</span>
          <div className="w-9 h-9 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-[#212B36] mt-2 tabular-nums">
          {totalOrders.toLocaleString('vi-VN')} đơn
        </h3>
        <span className="text-[11px] text-[#646B72] font-medium mt-1.5 block">
          Đã thanh toán hoàn tất
        </span>
      </div>

      {/* 4. Tổng chênh lệch kiểm két */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#646B72] font-semibold">Chênh lệch két tiền</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${totalDifference === 0 ? 'bg-[#E8F8F5] text-[#00A389]' : 'bg-rose-50 text-rose-600'}`}>
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <h3 className={`text-2xl font-black mt-2 tabular-nums ${totalDifference === 0 ? 'text-[#00A389]' : totalDifference > 0 ? 'text-[#00A389]' : 'text-rose-600'}`}>
          {totalDifference > 0 ? `+${formatCurrency(totalDifference)}` : formatCurrency(totalDifference)}
        </h3>
        <span className="text-[11px] text-[#646B72] font-medium mt-1.5 block">
          {totalDifference === 0 ? 'Két tiền khớp 100%' : 'Chênh lệch thực tế & lý thuyết'}
        </span>
      </div>
    </div>
  );
};
