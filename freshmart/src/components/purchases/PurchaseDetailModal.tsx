import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Receipt,
  User,
  Check,
  Copy,
  PackageCheck,
  Ban
} from 'lucide-react';
import { PurchaseOrder } from '../../types/purchase';
import { formatCurrency, formatDate } from '../../utils/format';

interface PurchaseDetailModalProps {
  isOpen: boolean;
  purchase: PurchaseOrder | null;
  onClose: () => void;
  onReceive: (id: string) => Promise<void>;
  onCancel?: (id: string) => Promise<void>;
}

export const PurchaseDetailModal: React.FC<PurchaseDetailModalProps> = ({
  isOpen,
  purchase,
  onClose,
  onReceive,
  onCancel,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !purchase) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(purchase.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleConfirmReceive = async () => {
    if (!window.confirm(`Xác nhận nhập kho cho phiếu "${purchase.code}"? Số lượng tồn kho và giá vốn của các sản phẩm sẽ được tự động cập nhật.`)) return;

    try {
      setIsProcessing(true);
      await onReceive(purchase.id);
      onClose();
    } catch (err) {
      console.error('Lỗi nhận hàng:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!onCancel) return;
    if (!window.confirm(`Bạn có chắc chắn muốn hủy phiếu nhập "${purchase.code}"?`)) return;

    try {
      setIsProcessing(true);
      await onCancel(purchase.id);
      onClose();
    } catch (err) {
      console.error('Lỗi hủy đơn:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = (purchase.status || '').toLowerCase() === 'pending';
  const isReceived = (purchase.status || '').toLowerCase() === 'received';
  const isCancelled = (purchase.status || '').toLowerCase() === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Phiếu nhập: #{purchase.code}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition"
                  title="Sao chép mã phiếu"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Nhà cung cấp: <span className="text-amber-400 font-bold">{purchase.supplierName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isReceived && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã nhập kho
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                Chờ giao hàng
              </span>
            )}
            {isCancelled && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                <Ban className="w-3.5 h-3.5" />
                Đã hủy
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Ngày tạo phiếu</span>
              <span className="font-bold text-slate-800">{formatDate(purchase.createdAt)}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Dự kiến nhận</span>
              <span className="font-bold text-slate-800">
                {purchase.expectedDate ? formatDate(purchase.expectedDate) : 'Chưa hẹn'}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Người tạo đơn</span>
              <span className="font-bold text-slate-800">{purchase.createdByName}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Thực nhận ngày</span>
              <span className="font-bold text-emerald-700">
                {purchase.receivedDate ? formatDate(purchase.receivedDate) : 'Chưa nhận'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Danh sách hàng hóa chi tiết ({purchase.items?.length || 0} mặt hàng)
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Sản phẩm</th>
                    <th className="py-2.5 px-3">Mã SKU</th>
                    <th className="py-2.5 px-3 text-center">SL Đặt</th>
                    <th className="py-2.5 px-3 text-center">SL Nhận</th>
                    <th className="py-2.5 px-3 text-right">Đơn giá vốn</th>
                    <th className="py-2.5 px-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchase.items && purchase.items.length > 0 ? (
                    purchase.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-bold text-slate-800">
                          {item.productName}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500">
                          {item.sku}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-800">
                          {item.quantityOrdered}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-700">
                          {item.quantityReceived}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-600 tabular-nums">
                          {formatCurrency(item.unitCost)}
                        </td>
                        <td className="py-2 px-3 text-right font-black text-slate-800 tabular-nums">
                          {formatCurrency(item.lineTotal)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">
                        Không có danh sách mặt hàng chi tiết
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {purchase.notes && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium block">Ghi chú</span>
              <p className="font-medium text-slate-700 mt-0.5">{purchase.notes}</p>
            </div>
          )}

          {/* Summary Box */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-amber-900 font-bold">Tổng số lượng:</span>
              <span className="ml-1.5 font-black text-amber-900">{purchase.totalItems} đơn vị</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-amber-800 font-bold mr-2">Tổng tiền thanh toán:</span>
              <span className="text-base font-black text-amber-800 tabular-nums">
                {formatCurrency(purchase.totalValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>
            {isPending && onCancel && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmCancel}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Hủy phiếu nhập</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Đóng
            </button>

            {isPending && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmReceive}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{isProcessing ? 'Đang cập nhật kho...' : 'Xác nhận nhập kho'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
