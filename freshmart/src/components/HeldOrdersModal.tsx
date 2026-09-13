import React from 'react';
import { X, Play, Trash2, Clock, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, Customer } from '../types';
import { formatCurrency } from '../utils/format';

export interface HeldCartData {
  id: string;
  cart: CartItem[];
  customer: Customer | null;
  discount: number;
  createdAt: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
}

interface HeldOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  heldOrders: HeldCartData[];
  onResumeOrder: (heldId: string) => void;
  onDeleteHeldOrder: (heldId: string) => void;
}

export const HeldOrdersModal: React.FC<HeldOrdersModalProps> = ({
  isOpen,
  onClose,
  heldOrders,
  onResumeOrder,
  onDeleteHeldOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Danh sách đơn hàng chờ phục vụ (Held Orders)</h3>
              <p className="text-[11px] text-slate-400">Đơn đã lưu tạm khi khách chờ tính tiền hoặc lấy thêm hàng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {heldOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-12 h-12 mx-auto text-slate-300 stroke-1 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Hiện không có đơn nào đang chờ</p>
              <p className="text-xs text-slate-400 mt-0.5">Bấm nút "Lưu đơn" tại quầy POS để chuyển đơn vào hàng chờ</p>
            </div>
          ) : (
            heldOrders.map((item, idx) => {
              const totalAmount = item.cart.reduce((s, c) => s + c.product.sellPrice * c.quantity, 0);
              const itemsCount = item.cart.reduce((s, c) => s + c.quantity, 0);

              return (
                <div
                  key={item.id}
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        #HOLD-{idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {item.orderType === 'takeaway' ? 'Mang về' : item.orderType === 'delivery' ? 'Giao hàng' : 'Tại quầy'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-900">
                        {item.customer ? item.customer.name : 'Khách lẻ vãng lai'}
                      </span>
                      {item.customer?.phone && (
                        <span className="text-slate-400">({item.customer.phone})</span>
                      )}
                    </div>

                    {/* Preview first 3 items */}
                    <p className="text-[11px] text-slate-500 truncate max-w-sm">
                      {item.cart.map(c => `${c.product.name} (x${c.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">{itemsCount} món hàng</span>
                      <span className="text-sm font-bold text-primary-600 tabular-nums">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onDeleteHeldOrder(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition"
                        title="Hủy đơn này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onResumeOrder(item.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Khôi phục</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tổng số đơn chờ: <b>{heldOrders.length}</b></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
