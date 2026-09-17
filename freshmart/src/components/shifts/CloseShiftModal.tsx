import React, { useState } from 'react';
import { X, StopCircle, DollarSign, Calculator, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Shift, CloseShiftRequest } from '../../types/shift';
import { formatCurrency } from '../../utils/format';
import { sound } from '../../utils/sound';

interface CloseShiftModalProps {
  isOpen: boolean;
  shift: Shift | null;
  onClose: () => void;
  onSubmit: (shiftId: string, data: CloseShiftRequest) => Promise<void>;
}

export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  isOpen,
  shift,
  onClose,
  onSubmit,
}) => {
  if (!isOpen || !shift) return null;

  const expectedCash = Number(shift.expectedCash) || (Number(shift.startingCash) + Number(shift.totalRevenue));
  const [actualCash, setActualCash] = useState<number>(expectedCash);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const difference = actualCash - expectedCash;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(shift.id, {
        actualCash: Number(actualCash) || 0,
        notes: notes.trim() || undefined,
      });
      sound.playPop();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Chốt ca làm việc thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="bg-white border border-[#EAEAEA] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-2xs">
              <StopCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#212B36]">Chốt & Đóng ca làm việc</h3>
              <p className="text-xs text-[#646B72] font-medium">Kiểm đếm tiền két thực tế và tổng kết ca</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#646B72] hover:text-[#212B36] hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Thông tin tóm tắt ca */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#EAEAEA] space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#646B72] font-medium">Ca làm việc:</span>
              <strong className="text-[#212B36] font-bold">{shift.shiftName}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#646B72] font-medium">Thu ngân phụ trách:</span>
              <strong className="text-[#212B36] font-bold">{shift.cashierName}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#646B72] font-medium">Tiền mặt ban đầu:</span>
              <span className="font-bold text-[#212B36] tabular-nums">{formatCurrency(shift.startingCash)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#646B72] font-medium">Doanh thu trong ca ({shift.orderCount} đơn):</span>
              <span className="font-black text-[#00A389] tabular-nums">+{formatCurrency(shift.totalRevenue)}</span>
            </div>
            <div className="pt-2.5 border-t border-[#EAEAEA] flex justify-between text-xs">
              <span className="font-bold text-[#212B36]">Tiền két lý thuyết:</span>
              <span className="font-black text-[#2E6FF2] text-sm tabular-nums">{formatCurrency(expectedCash)}</span>
            </div>
          </div>

          {/* Nhập tiền thực tế kiểm đếm */}
          <div>
            <label className="block text-xs font-bold text-[#212B36] mb-1.5">
              Số tiền mặt thực tế kiểm đếm được trong két (₫) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                value={actualCash}
                onChange={(e) => setActualCash(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-base font-black text-[#212B36] focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition tabular-nums"
                required
              />
              <DollarSign className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Hiển thị chênh lệch */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
            difference === 0 
              ? 'bg-[#E8F8F5] border-[#00A389]/30 text-[#00A389]' 
              : difference > 0 
                ? 'bg-[#EAF8FF] border-[#2E6FF2]/30 text-[#2E6FF2]' 
                : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            <div className="flex items-center gap-2">
              {difference === 0 ? (
                <CheckCircle className="w-4 h-4 text-[#00A389]" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>{difference === 0 ? 'Két tiền khớp 100% với lý thuyết' : difference > 0 ? 'Thừa tiền trong két' : 'Thiếu tiền trong két'}</span>
            </div>
            <span className="text-sm font-black tabular-nums">
              {difference > 0 ? `+${formatCurrency(difference)}` : formatCurrency(difference)}
            </span>
          </div>

          {/* Ghi chú khi chốt ca */}
          <div>
            <label className="block text-xs font-bold text-[#212B36] mb-1.5">
              Ghi chú chốt ca / Giải trình chênh lệch
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#EAEAEA] rounded-xl text-xs font-medium text-[#212B36] placeholder-[#646B72]/50 focus:outline-none focus:border-[#FE9F43] focus:ring-2 focus:ring-[#FE9F43]/20 resize-none transition"
              placeholder="Nhập lý do chênh lệch nếu có hoặc lời nhắn bàn giao..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-bold text-[#646B72] hover:text-[#212B36] hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang chốt ca...' : 'Xác nhận Chốt & Đóng ca'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
