import React from 'react';
import { FileText, Clock, CheckCircle2 } from 'lucide-react';
import type { Shift } from '../../types/shift';
import { formatCurrency, formatDateTime } from '../../utils/format';

interface ShiftTableProps {
  shifts: Shift[];
  onViewReport: (shiftId: string) => void;
}

export const ShiftTable: React.FC<ShiftTableProps> = ({ shifts, onViewReport }) => {
  if (shifts.length === 0) {
    return (
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-12 text-center shadow-2xs">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-[#212B36]">Chưa có lịch sử ca làm việc nào</h3>
        <p className="text-xs text-[#646B72] mt-1">
          Các ca làm việc khi được mở và chốt sẽ hiển thị lịch sử chi tiết tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-2xs">
      <div className="px-5 py-4 border-b border-[#F1F3F5] flex items-center justify-between">
        <h3 className="text-sm font-black text-[#212B36] uppercase tracking-tight">Lịch sử các ca làm việc</h3>
        <span className="text-xs text-[#646B72] font-semibold">
          {shifts.length} ca đã ghi nhận
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#212B36]">
          <thead className="bg-[#F8FAFC] text-[11px] font-bold text-[#646B72] uppercase tracking-wider border-b border-[#EAEAEA]">
            <tr>
              <th className="px-5 py-3.5">Ca làm việc</th>
              <th className="px-5 py-3.5">Thu ngân</th>
              <th className="px-5 py-3.5">Thời gian bắt đầu / kết thúc</th>
              <th className="px-5 py-3.5 text-right">Tiền đầu ca</th>
              <th className="px-5 py-3.5 text-right">Doanh thu ca</th>
              <th className="px-5 py-3.5 text-right">Thực tế / Lệch</th>
              <th className="px-5 py-3.5 text-center">Trạng thái</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5] font-medium">
            {shifts.map((shift) => {
              const isActive = (shift.status || '').toLowerCase() === 'active';
              const diff = shift.difference ?? (shift.actualCash != null ? Number(shift.actualCash) - Number(shift.expectedCash) : null);

              return (
                <tr key={shift.id} className="hover:bg-[#FFFDF9] transition-colors">
                  {/* Ca làm việc */}
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#212B36]">
                      {shift.shiftName}
                    </div>
                    <div className="text-[11px] text-[#646B72] mt-0.5">
                      {shift.orderCount} đơn hàng
                    </div>
                  </td>

                  {/* Thu ngân */}
                  <td className="px-5 py-4">
                    <div className="text-[#212B36] font-semibold">
                      {shift.cashierName || 'Thu ngân'}
                    </div>
                    <div className="text-[10px] text-[#646B72] font-mono">
                      {shift.cashierCode}
                    </div>
                  </td>

                  {/* Thời gian */}
                  <td className="px-5 py-4 text-[11px]">
                    <div className="text-[#212B36] font-medium">
                      Từ: {formatDateTime(shift.startTime)}
                    </div>
                    <div className="text-[#646B72] mt-0.5">
                      Đến: {shift.endTime ? formatDateTime(shift.endTime) : 'Đang làm việc...'}
                    </div>
                  </td>

                  {/* Tiền đầu ca */}
                  <td className="px-5 py-4 text-right text-[#212B36] font-semibold tabular-nums">
                    {formatCurrency(shift.startingCash)}
                  </td>

                  {/* Doanh thu */}
                  <td className="px-5 py-4 text-right font-black text-[#00A389] tabular-nums">
                    {formatCurrency(shift.totalRevenue)}
                  </td>

                  {/* Thực tế & Chênh lệch */}
                  <td className="px-5 py-4 text-right">
                    {shift.actualCash != null ? (
                      <>
                        <div className="text-[#212B36] font-bold tabular-nums">
                          {formatCurrency(shift.actualCash)}
                        </div>
                        {diff != null && (
                          <div className={`text-[10px] font-bold mt-0.5 ${diff === 0 ? 'text-[#00A389]' : diff > 0 ? 'text-[#2E6FF2]' : 'text-rose-600'}`}>
                            {diff === 0 ? 'Khớp két' : diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff)}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400">Chưa kiểm két</span>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isActive
                        ? 'bg-[#E8F8F5] text-[#00A389] border border-[#00A389]/30'
                        : 'bg-slate-100 text-[#646B72] border border-slate-200'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#00A389] animate-pulse' : 'bg-slate-400'}`} />
                      {isActive ? 'Đang mở' : 'Đã chốt'}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onViewReport(shift.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFF5E9] text-[#212B36] hover:text-[#FE9F43] border border-[#EAEAEA] hover:border-[#FED8AB] text-xs font-bold transition shadow-2xs cursor-pointer"
                      title="Xem biên bản tổng kết ca"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Báo cáo</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
