import React from 'react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface SalesStatisticsChartProps {
  monthlyStats: Array<{ month: string; revenue: number; expense: number }>;
  totalSalesRevenue: number;
  totalPurchaseValue: number;
  tooltipComponent: React.FC<any>;
}

export const SalesStatisticsChart: React.FC<SalesStatisticsChartProps> = ({
  monthlyStats,
  totalSalesRevenue,
  totalPurchaseValue,
  tooltipComponent: CustomTooltip
}) => {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#212B36]">Thống kê Doanh thu (Sales Statistics)</h3>
        </div>
        <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2.5 py-1 rounded-lg">
          2026
        </span>
      </div>

      <div className="flex items-center gap-6 pt-4 text-xs">
        <div>
          <p className="text-[#646B72] text-[11px] font-medium">Doanh thu (Revenue)</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base font-black text-[#212B36] tabular-nums">{formatCurrency(totalSalesRevenue)}</span>
          </div>
        </div>
        <div>
          <p className="text-[#646B72] text-[11px] font-medium">Chi phí nhập (Purchase)</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-base font-black text-[#212B36] tabular-nums">{formatCurrency(totalPurchaseValue)}</span>
          </div>
        </div>
      </div>

      {/* Recharts Bi-directional Chart */}
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats} stackOffset="sign" margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={{ stroke: '#EAEAEA' }} 
              tick={{ fill: '#646B72', fontSize: 10, fontWeight: 600 }} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#646B72', fontSize: 10 }} 
              unit="tr"
            />
            <ReferenceLine y={0} stroke="#EAEAEA" />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 163, 137, 0.05)' }} />
            <Bar dataKey="revenue" name="Doanh thu" fill="#00A389" radius={[3, 3, 0, 0]} maxBarSize={14} />
            <Bar dataKey="expense" name="Chi phí" fill="#FE9F43" radius={[0, 0, 3, 3]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
