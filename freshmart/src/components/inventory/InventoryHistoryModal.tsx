import React, { useState, useEffect } from 'react';
import { X, History, RefreshCw, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { InventoryAdjustment } from '../../types/inventory';
import { inventoryService } from '../../services/inventory.service';
import { formatDate } from '../../utils/format';

interface InventoryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryHistoryModal: React.FC<InventoryHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [historyList, setHistoryList] = useState<InventoryAdjustment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          const data = await inventoryService.getHistory({ limit: 100 });
          setHistoryList(data ?? []);
        } catch (err) {
          console.error('Lỗi tải lịch sử kiểm kê:', err);
          setHistoryList([]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderReasonBadge = (reason: string) => {
    const r = (reason || '').toLowerCase();
    if (r.includes('damage') || r.includes('hỏng')) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
          Hàng hỏng / lỗi
        </span>
      );
    }
    if (r.includes('expiry') || r.includes('hạn')) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
          Hết hạn
        </span>
      );
    }
    if (r.includes('return') || r.includes('trả')) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          Trả hàng
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
        Kiểm kê định kỳ
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Nhật ký Lịch sử Kiểm kê & Điều chỉnh Tồn kho
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />}
              </h3>
              <p className="text-[11px] text-slate-400">
                Toàn bộ lịch sử các lần thay đổi số lượng kho thủ công
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Body */}
        <div className="p-5 overflow-y-auto flex-1 text-xs">
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Sản phẩm</th>
                  <th className="py-2.5 px-3">Người thực hiện</th>
                  <th className="py-2.5 px-3">Lý do</th>
                  <th className="py-2.5 px-3 text-center">Tồn trước</th>
                  <th className="py-2.5 px-3 text-center">Thay đổi</th>
                  <th className="py-2.5 px-3 text-center">Tồn sau</th>
                  <th className="py-2.5 px-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyList.length > 0 ? (
                  historyList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-800">{item.productName}</p>
                        <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        {item.employeeName}
                      </td>
                      <td className="py-2.5 px-3">
                        {renderReasonBadge(item.reason)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium text-slate-500 tabular-nums">
                        {item.qtyBefore}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold tabular-nums">
                        <span
                          className={
                            item.qtyChange > 0
                              ? 'text-emerald-600'
                              : item.qtyChange < 0
                              ? 'text-red-600'
                              : 'text-slate-600'
                          }
                        >
                          {item.qtyChange > 0 ? `+${item.qtyChange}` : item.qtyChange}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-black text-slate-800 tabular-nums">
                        {item.qtyAfter}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                        {item.note || '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      {loading ? 'Đang tải dữ liệu...' : 'Chưa có lịch sử điều chỉnh kho nào.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            Tổng cộng: {historyList.length} bản ghi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
