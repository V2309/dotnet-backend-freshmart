import React from 'react';
import { Radio, RefreshCw, Layers } from 'lucide-react';
import type { CashierShift } from '../../types';
import { formatDateTime } from '../../utils/format';

interface DashboardHeaderProps {
  userName?: string;
  isRealtimeConnected: boolean;
  isPulsing: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  activeShift?: CashierShift;
  onNavigateToShifts: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Quản trị viên',
  isRealtimeConnected,
  isPulsing,
  isLoading,
  onRefresh,
  activeShift,
  onNavigateToShifts
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-2xs">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#212B36]">
            Tổng quan Hoạt động Kinh doanh
          </h1>

          {/* Realtime Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border transition-all duration-300 shadow-2xs bg-emerald-50 text-emerald-700 border-emerald-200">
            <Radio className={`w-3.5 h-3.5 ${isRealtimeConnected ? 'animate-pulse text-emerald-500' : 'text-slate-400'}`} />
            <span>{isRealtimeConnected ? 'LIVE REALTIME' : 'POLLING'}</span>
          </div>

          {/* Live Flash Badge */}
          {isPulsing && (
            <span className="animate-bounce inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FE9F43] text-white shadow-xs">
              ⚡ Vừa cập nhật!
            </span>
          )}
        </div>
        <p className="text-xs text-[#646B72] mt-1 font-medium">
          Dữ liệu thời gian thực đồng bộ trực tiếp từ quầy POS và Kho hàng • Cập nhật lúc {formatDateTime(new Date().toISOString())}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Shift Quick Indicator */}
        {activeShift && (
          <button
            onClick={onNavigateToShifts}
            className="flex items-center gap-2 px-3 py-2 bg-[#FFF5E9] hover:bg-[#FFE8CC] text-[#FE9F43] rounded-xl text-xs font-bold transition border border-[#FED8AB] cursor-pointer"
            title="Xem chi tiết ca làm việc"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{activeShift.shiftName || 'Ca làm việc đang mở'}</span>
          </button>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#F7F7F7] hover:bg-slate-200 text-[#212B36] rounded-xl text-xs font-bold transition border border-[#EAEAEA] cursor-pointer disabled:opacity-50"
          title="Tải lại dữ liệu mới nhất"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>
    </div>
  );
};
