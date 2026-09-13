import React from 'react';
import { CashierShift } from '../../types';
import { formatCurrency } from '../../utils/format';
import { sound } from '../../utils/sound';

interface ShiftStatusBannerProps {
  currentShift: CashierShift;
  cashierName: string;
  onCloseShift: () => void;
}

export const ShiftStatusBanner: React.FC<ShiftStatusBannerProps> = ({
  currentShift,
  cashierName,
  onCloseShift,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A389] animate-pulse"></span>
          <h2 className="text-sm font-black text-[#212B36]">
            Ca làm việc đang mở: {currentShift.shiftName}
          </h2>
        </div>
        <p className="text-xs text-[#646B72] mt-1 font-medium">
          Thu ngân trực quầy: <b className="text-[#212B36]">{cashierName}</b> • Bắt đầu ca lúc {currentShift.startTime} ({currentShift.orderCount} đơn hàng đã bán)
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-[11px] text-[#646B72] font-semibold block">Số tiền dự kiến bàn giao:</span>
          <span className="text-sm font-black text-[#00A389] tabular-nums">
            {formatCurrency(currentShift.expectedCash)}
          </span>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onCloseShift();
          }}
          className="px-4 py-2 bg-[#212B36] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
        >
          Chốt & Bàn giao ca
        </button>
      </div>
    </div>
  );
};
