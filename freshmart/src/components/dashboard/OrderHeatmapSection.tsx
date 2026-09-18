import React from 'react';
import { Clock } from 'lucide-react';
import type { HeatmapHourRow } from '../../types/dashboard';

interface OrderHeatmapSectionProps {
  heatmap: HeatmapHourRow[];
}

export const OrderHeatmapSection: React.FC<OrderHeatmapSectionProps> = ({ heatmap }) => {
  const getHeatmapColor = (val: number) => {
    switch (val) {
      case 4: return 'bg-[#FE9F43] text-white';
      case 3: return 'bg-[#FED8AB] text-[#212B36]';
      case 2: return 'bg-[#FFE8CC] text-[#212B36]';
      case 1: return 'bg-[#FFF5E9] text-[#646B72]';
      default: return 'bg-[#F7F7F7] text-slate-300';
    }
  };

  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#F4F1FD] text-[#7367F0] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#212B36]">Mật độ đơn hàng theo giờ</h3>
        </div>
        <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
          7 Ngày
        </span>
      </div>

      <div className="pt-3">
        <div className="grid grid-cols-8 gap-1 text-[10px] text-center font-bold text-[#646B72] mb-1.5">
          <span>Giờ</span>
          <span>T2</span>
          <span>T3</span>
          <span>T4</span>
          <span>T5</span>
          <span>T6</span>
          <span>T7</span>
          <span>CN</span>
        </div>

        <div className="space-y-1">
          {heatmap.map((row) => (
            <div key={row.time} className="grid grid-cols-8 gap-1 items-center">
              <span className="text-[10px] font-semibold text-[#646B72] text-center">{row.time}</span>
              {row.values.map((val, idx) => (
                <div
                  key={idx}
                  className={`h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 cursor-pointer ${getHeatmapColor(val)}`}
                  title={`${row.time}: ${val * 12} đơn`}
                >
                  {val > 2 ? val * 12 : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
