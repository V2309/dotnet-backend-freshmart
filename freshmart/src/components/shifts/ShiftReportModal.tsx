import React from 'react';
import { X, FileText, Printer, CheckCircle2, User, Clock, DollarSign, ShoppingBag, CreditCard, QrCode } from 'lucide-react';
import type { ShiftReport } from '../../types/shift';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { sound } from '../../utils/sound';

interface ShiftReportModalProps {
  isOpen: boolean;
  report: ShiftReport | null;
  isLoading: boolean;
  onClose: () => void;
}

export const ShiftReportModal: React.FC<ShiftReportModalProps> = ({
  isOpen,
  report,
  isLoading,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="bg-white border border-[#EAEAEA] rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#212B36]">Biên bản Tổng kết Ca làm việc</h3>
              <p className="text-xs text-[#646B72] font-medium">Báo cáo kiểm két và doanh thu thu ngân</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#646B72] hover:text-[#212B36] hover:bg-slate-100 transition cursor-pointer"
              title="In biên bản"
            >
              <Printer className="w-4 h-4" />
            </button>
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
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-12 text-center text-[#646B72]">
              <div className="w-8 h-8 border-3 border-[#FE9F43] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold">Đang tải báo cáo tổng kết...</p>
            </div>
          ) : report ? (
            <div className="space-y-5">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#EAEAEA] text-xs">
                <div>
                  <span className="text-[#646B72] font-medium">Ca làm việc:</span>
                  <p className="font-black text-[#212B36] text-sm mt-0.5">{report.shiftName}</p>
                </div>
                <div>
                  <span className="text-[#646B72] font-medium">Thu ngân phụ trách:</span>
                  <p className="font-bold text-[#212B36] text-sm mt-0.5">{report.cashierName} ({report.cashierCode})</p>
                </div>
                <div>
                  <span className="text-[#646B72] font-medium">Thời gian bắt đầu:</span>
                  <p className="font-semibold text-[#212B36] mt-0.5">{formatDateTime(report.startTime)}</p>
                </div>
                <div>
                  <span className="text-[#646B72] font-medium">Thời gian kết thúc:</span>
                  <p className="font-semibold text-[#212B36] mt-0.5">{report.endTime ? formatDateTime(report.endTime) : 'Chưa chốt ca'}</p>
                </div>
              </div>

              {/* Bảng kê luồng tiền */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-[#646B72] mb-2.5">1. Chi tiết Doanh thu & Két tiền</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-[#F1F3F5]">
                    <span className="text-[#646B72] font-medium">Tiền mặt ban đầu trong két:</span>
                    <span className="font-bold text-[#212B36] tabular-nums">{formatCurrency(report.startingCash)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F1F3F5]">
                    <span className="text-[#646B72] font-medium">Doanh thu bán lẻ (Tiền mặt):</span>
                    <span className="font-bold text-[#00A389] tabular-nums">+{formatCurrency(report.cashSales)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F1F3F5]">
                    <span className="text-[#646B72] font-medium">Doanh thu chuyển khoản VietQR:</span>
                    <span className="font-bold text-[#2E6FF2] tabular-nums">{formatCurrency(report.vietQRSales)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F1F3F5]">
                    <span className="text-[#646B72] font-medium">Doanh thu quẹt thẻ POS:</span>
                    <span className="font-bold text-purple-600 tabular-nums">{formatCurrency(report.cardSales)}</span>
                  </div>
                  <div className="flex justify-between py-2.5 bg-[#FFF5E9] px-3.5 rounded-xl border border-[#FED8AB]">
                    <span className="font-black text-[#212B36]">Tổng doanh thu ca:</span>
                    <span className="font-black text-[#FE9F43] text-sm tabular-nums">{formatCurrency(report.totalRevenue)}</span>
                  </div>
                </div>
              </div>

              {/* Kiểm két thực tế & Chênh lệch */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-[#646B72] mb-2.5">2. Đối soát & Kiểm két</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-[#F1F3F5]">
                    <span className="text-[#646B72] font-medium">Tiền két lý thuyết (Đầu ca + Tiền mặt):</span>
                    <span className="font-bold text-[#212B36] tabular-nums">{formatCurrency(report.expectedCash)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F1F3F5]">
                    <span className="text-[#646B72] font-medium">Tiền két thực tế kiểm đếm:</span>
                    <span className="font-black text-[#212B36] tabular-nums">
                      {report.actualCash != null ? formatCurrency(report.actualCash) : 'Chưa chốt'}
                    </span>
                  </div>
                  {report.cashDifference != null && (
                    <div className="flex justify-between py-2.5 px-3.5 rounded-xl bg-[#F8FAFC] border border-[#EAEAEA]">
                      <span className="font-bold text-[#212B36]">Chênh lệch két:</span>
                      <span className={`font-black tabular-nums ${report.cashDifference === 0 ? 'text-[#00A389]' : report.cashDifference > 0 ? 'text-[#2E6FF2]' : 'text-rose-600'}`}>
                        {report.cashDifference === 0 ? '0 ₫ (Khớp 100%)' : report.cashDifference > 0 ? `+${formatCurrency(report.cashDifference)}` : formatCurrency(report.cashDifference)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chỉ số vận hành */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-[#646B72] mb-2.5">3. Chỉ số Vận hành</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#EAEAEA]">
                    <span className="text-[11px] text-[#646B72] font-medium">Tổng hóa đơn phục vụ:</span>
                    <p className="text-base font-black text-[#212B36] mt-1 tabular-nums">{report.totalOrders} đơn</p>
                  </div>
                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#EAEAEA]">
                    <span className="text-[11px] text-[#646B72] font-medium">Giá trị đơn trung bình (AOV):</span>
                    <p className="text-base font-black text-[#212B36] mt-1 tabular-nums">{formatCurrency(report.averageOrderValue)}</p>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {report.notes && (
                <div className="p-3.5 bg-[#FFF5E9] border border-[#FED8AB] rounded-xl text-xs text-[#212B36]">
                  <span className="font-bold text-[#FE9F43]">Ghi chú bàn giao:</span> {report.notes}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#646B72] text-center py-6">Không có dữ liệu báo cáo</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAEAEA] flex justify-end bg-white">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#212B36] hover:bg-[#344252] text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
