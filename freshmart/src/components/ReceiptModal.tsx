import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  PlusCircle, 
  X, 
  ShoppingBag,
  Share2
} from 'lucide-react';
import { Order } from '../types';
import { formatCurrency, formatDateTime } from '../utils/format';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onStartNewSale: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  onClose,
  onStartNewSale
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'vietqr': return 'Chuyển khoản VietQR';
      case 'pos_card': return 'Thẻ tín dụng / POS';
      default: return method;
    }
  };

  return (
    <div 
      id="receipt-modal-overlay"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
    >
      <div 
        id="receipt-modal-card"
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[95vh]"
      >
        {/* Top Success Banner */}
        <div className="bg-primary-600 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary-200" />
            <span className="text-xs font-bold uppercase tracking-wider">Thanh toán thành công</span>
          </div>
          <button
            onClick={onClose}
            className="text-primary-200 hover:text-white transition p-1 rounded-lg"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-6 overflow-y-auto bg-white font-mono text-xs text-slate-800 space-y-4">
          {/* Store Brand Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="flex items-center justify-center gap-1.5 font-sans font-extrabold text-base text-slate-900">
              <ShoppingBag className="w-4 h-4 text-primary-600" />
              <span>FRESHMART VIỆT NAM</span>
            </div>
            <p className="text-[11px] text-slate-500">Cửa hàng tạp hóa #01 - Quận 1</p>
            <p className="text-[10px] text-slate-400">128 Nguyễn Trãi, Phường Bến Thành, TP.HCM</p>
            <p className="text-[10px] text-slate-400">Hotline: 1900 6868 • MST: 0315998822</p>
            <div className="pt-2">
              <span className="font-bold text-xs uppercase tracking-widest text-slate-900 font-sans">
                HÓA ĐƠN BÁN LẺ
              </span>
            </div>
          </div>

          {/* Bill Meta */}
          <div className="text-[11px] space-y-1 text-slate-600 pb-2 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>Số phiếu:</span>
              <span className="font-bold text-slate-900">{order.code}</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian:</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Thu ngân:</span>
              <span>{order.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span className="font-semibold text-slate-800">{order.customerName}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 pb-1 mb-1">
              <span className="col-span-6">Tên mặt hàng</span>
              <span className="col-span-2 text-center">SL</span>
              <span className="col-span-4 text-right">Thành tiền</span>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-1.5 text-[11px]">
                  <div className="grid grid-cols-12 items-baseline">
                    <span className="col-span-6 font-medium text-slate-800 truncate pr-1">
                      {item.productName}
                    </span>
                    <span className="col-span-2 text-center text-slate-600">
                      {item.quantity}
                    </span>
                    <span className="col-span-4 text-right font-bold text-slate-900 tabular-nums">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 pl-1">
                    Đơn giá: {formatCurrency(item.unitPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Tổng tiền hàng:</span>
              <span className="tabular-nums font-medium">{formatCurrency(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Chiết khấu khuyến mãi:</span>
                <span className="tabular-nums font-bold">-{formatCurrency(order.discount)}</span>
              </div>
            )}

            {order.vat > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Thuế GTGT (VAT 8%):</span>
                <span className="tabular-nums">+{formatCurrency(order.vat)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>TỔNG CỘNG:</span>
              <span className="tabular-nums text-primary-700 font-extrabold">{formatCurrency(order.total)}</span>
            </div>

            <div className="flex justify-between text-slate-600 pt-1">
              <span>Hình thức:</span>
              <span className="font-semibold">{getMethodLabel(order.paymentMethod)}</span>
            </div>

            {order.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>Tiền khách đưa:</span>
                  <span className="tabular-nums">{formatCurrency(order.amountReceived)}</span>
                </div>
                <div className="flex justify-between text-primary-700 font-bold">
                  <span>Tiền thối lại:</span>
                  <span className="tabular-nums">{formatCurrency(order.change)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Barcode & Thank You */}
          <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1">
            <div className="inline-block p-1 bg-white border border-slate-200 rounded">
              <div className="h-7 w-44 bg-[repeating-linear-gradient(90deg,#0f172a_0px,#0f172a_2px,transparent_2px,transparent_4px,#0f172a_4px,#0f172a_7px,transparent_7px,transparent_9px)] mx-auto"></div>
              <span className="text-[9px] tracking-widest text-slate-500 font-mono block mt-0.5">
                *{order.code}*
              </span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Cảm ơn Quý khách & Hẹn gặp lại!
            </p>
            <p className="text-[9px] text-slate-400">
              Quý khách vui lòng kiểm tra hàng & hóa đơn trước khi rời quầy.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In hóa đơn</span>
          </button>

          <button
            onClick={onStartNewSale}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo đơn mới</span>
          </button>
        </div>
      </div>
    </div>
  );
};
