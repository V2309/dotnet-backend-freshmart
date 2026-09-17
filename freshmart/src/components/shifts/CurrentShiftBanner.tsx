import React from 'react';
import { PlayCircle, StopCircle, Clock, UserCheck, DollarSign } from 'lucide-react';
import type { Shift } from '../../types/shift';
import { formatCurrency, formatDateTime } from '../../utils/format';

interface CurrentShiftBannerProps {
  currentShift: Shift | null;
  onOpenShiftClick: () => void;
  onCloseShiftClick: () => void;
}

export const CurrentShiftBanner: React.FC<CurrentShiftBannerProps> = ({
  currentShift,
  onOpenShiftClick,
  onCloseShiftClick,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#212B36] to-[#344252] rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-700/50">
      {/* Subtle warm glow */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-[#FE9F43]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold ${
              currentShift 
                ? 'bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/30' 
                : 'bg-white/10 text-slate-300 border border-white/10'
            }`}>
              <span className={`w-2 h-2 rounded-full ${currentShift ? 'bg-[#00A389] animate-pulse' : 'bg-slate-400'}`} />
              {currentShift ? 'Ca trực đang hoạt động' : 'Chưa mở ca trực'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {currentShift ? currentShift.shiftName : 'Sẵn sàng bắt đầu ca thu ngân'}
          </h2>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-xs text-slate-300">
            {currentShift ? (
              <>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#FE9F43]" />
                  <span>Thu ngân: <strong className="text-white">{currentShift.cashierName}</strong> ({currentShift.cashierCode})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FE9F43]" />
                  <span>Bắt đầu: <strong className="text-white">{formatDateTime(currentShift.startTime)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#FE9F43]" />
                  <span>Tiền két ban đầu: <strong className="text-[#00A389]">{formatCurrency(currentShift.startingCash)}</strong></span>
                </div>
              </>
            ) : (
              <p className="text-slate-300 text-xs">
                Vui lòng mở ca làm việc và khai báo số tiền mặt ban đầu trong két tiền trước khi bắt đầu thanh toán POS.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentShift ? (
            <button
              onClick={onCloseShiftClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              Chốt & Đóng ca trực
            </button>
          ) : (
            <button
              onClick={onOpenShiftClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FE9F43] hover:bg-[#E88E35] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              Bắt đầu Mở ca mới
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
