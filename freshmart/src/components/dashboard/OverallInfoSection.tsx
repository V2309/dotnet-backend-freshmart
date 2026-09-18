import React from 'react';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { Layers, Boxes, Truck, Users, ShoppingBag } from 'lucide-react';
import type { DashboardKpiResponse } from '../../types/dashboard';

interface OverallInfoSectionProps {
  kpis: DashboardKpiResponse;
  customerDonutData: Array<{ name: string; value: number; color: string }>;
  tooltipComponent: React.FC<any>;
}

export const OverallInfoSection: React.FC<OverallInfoSectionProps> = ({
  kpis,
  customerDonutData,
  tooltipComponent: CustomTooltip
}) => {
  return (
    <div className="space-y-5">
      {/* Overall Information Stat Badges */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F1F3F5]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#212B36]">Chỉ số tổng thể (Overall Info)</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 text-center">
          <div className="p-3 bg-[#F7F7F7] rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Truck className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#646B72] font-semibold">Nhà CC</p>
            <p className="text-base font-black text-[#212B36] mt-0.5 tabular-nums">{kpis.totalSuppliersCount}</p>
          </div>

          <div className="p-3 bg-[#F7F7F7] rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#646B72] font-semibold">Hội viên</p>
            <p className="text-base font-black text-[#212B36] mt-0.5 tabular-nums">{kpis.totalCustomersCount}</p>
          </div>

          <div className="p-3 bg-[#F7F7F7] rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-[#E8F8F5] text-[#00A389] flex items-center justify-center mx-auto mb-2">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-[#646B72] font-semibold">Đơn hàng</p>
            <p className="text-base font-black text-[#212B36] mt-0.5 tabular-nums">{kpis.totalSalesCount}</p>
          </div>
        </div>
      </div>

      {/* RECHARTS: Customers Overview Donut */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
          <h3 className="text-sm font-black text-[#212B36]">Tỷ lệ khách hàng (Customers)</h3>
          <span className="text-[11px] text-[#00A389] font-bold bg-[#E8F8F5] px-2 py-0.5 rounded-md">
            Live Data
          </span>
        </div>

        <div className="flex items-center justify-between pt-3">
          <div className="relative w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={52}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {customerDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-black text-[#212B36] leading-none tabular-nums">{kpis.totalCustomersCount}</span>
              <span className="text-[9px] text-[#646B72] font-semibold">Hội viên</span>
            </div>
          </div>

          {/* Stats Legends */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FE9F43]"></span>
                <span className="text-base font-bold text-[#212B36] tabular-nums">{kpis.firstTimeCustomersCount}</span>
              </div>
              <p className="text-[11px] text-[#646B72] pl-4.5 font-medium">Khách mới / Thân thiết</p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A389]"></span>
                <span className="text-base font-bold text-[#212B36] tabular-nums">{kpis.vipCustomersCount}</span>
              </div>
              <p className="text-[11px] text-[#646B72] pl-4.5 font-medium">Khách VIP / Gold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
