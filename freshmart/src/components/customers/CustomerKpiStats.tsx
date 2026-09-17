import React from 'react';
import { Users, Crown, Gift, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface CustomerKpiStatsProps {
  totalCustomers: number;
  vipCustomersCount: number;
  totalPoints: number;
  totalSpentAll: number;
}

export const CustomerKpiStats: React.FC<CustomerKpiStatsProps> = ({
  totalCustomers,
  vipCustomersCount,
  totalPoints,
  totalSpentAll,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Tổng số hội viên */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng số hội viên</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-[#212B36] tabular-nums">{totalCustomers}</span>
            <span className="text-[11px] text-[#646B72] font-semibold">người</span>
          </div>
        </div>
      </div>

      {/* 2. Hội viên VIP (Vàng / Kim Cương) */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#FBF0FF] text-[#9333EA] flex items-center justify-center shrink-0">
          <Crown className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Hội viên VIP (Vàng/Kim Cương)</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-[#9333EA] tabular-nums">{vipCustomersCount}</span>
            <span className="text-[11px] text-[#646B72] font-semibold">khách VIP</span>
          </div>
        </div>
      </div>

      {/* 3. Tổng điểm tích lũy */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#E8F8F5] text-[#00A389] flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Tổng điểm tích lũy</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-[#00A389] tabular-nums">{totalPoints.toLocaleString('vi-VN')}</span>
            <span className="text-[11px] text-[#646B72] font-semibold">điểm</span>
          </div>
        </div>
      </div>

      {/* 4. Tổng doanh thu từ hội viên */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#646B72] uppercase tracking-wider">Doanh thu từ hội viên</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-[#00A389] tabular-nums">{formatCurrency(totalSpentAll)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
