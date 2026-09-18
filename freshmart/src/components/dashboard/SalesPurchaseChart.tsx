import React from 'react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface SalesPurchaseChartProps {
  chartData: Array<{ time: string; purchase: number; sales: number }>;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  totalPurchaseValue: number;
  totalSalesRevenue: number;
  tooltipComponent: React.FC<any>;
}

export const SalesPurchaseChart: React.FC<SalesPurchaseChartProps> = ({
  chartData,
  timeframe,
  onTimeframeChange,
  totalPurchaseValue,
  totalSalesRevenue,
  tooltipComponent: CustomTooltip
}) => {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#212B36]">Báo cáo Doanh số & Nhập hàng (Sales & Purchase)</h3>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-[#F7F7F7] p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          {['1D', '1W', '1M', '3M', '6M', '1Y'].map((t) => (
            <button
              key={t}
              onClick={() => onTimeframeChange(t)}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                timeframe === t
                  ? 'bg-[#FE9F43] text-white shadow-xs'
                  : 'text-[#646B72] hover:text-[#212B36]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Indicator stats */}
      <div className="flex items-center gap-6 pt-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#FED8AB]"></span>
          <span className="text-[#646B72] font-semibold">Tổng nhập kho:</span>
          <span className="text-[#212B36] font-bold tabular-nums">{formatCurrency(totalPurchaseValue)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#FE9F43]"></span>
          <span className="text-[#646B72] font-semibold">Tổng bán lẻ:</span>
          <span className="text-[#212B36] font-bold tabular-nums">{formatCurrency(totalSalesRevenue)}</span>
        </div>
      </div>

      {/* Recharts BarChart Container */}
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
            <XAxis 
              dataKey="time" 
              tickLine={false} 
              axisLine={{ stroke: '#EAEAEA' }} 
              tick={{ fill: '#646B72', fontSize: 11, fontWeight: 600 }} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#646B72', fontSize: 11 }} 
              unit="tr"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(254, 159, 67, 0.08)' }} />
            <Bar dataKey="purchase" name="Nhập kho" fill="#FED8AB" radius={[4, 4, 0, 0]} maxBarSize={22} />
            <Bar dataKey="sales" name="Bán lẻ" fill="#FE9F43" radius={[4, 4, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
