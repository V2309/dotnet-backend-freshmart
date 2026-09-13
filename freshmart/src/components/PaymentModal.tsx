import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Banknote, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Wallet,
  Sparkles
} from 'lucide-react';
import { CartItem, Customer, PaymentMethod, Order } from '../types';
import { formatCurrency } from '../utils/format';
import { sound } from '../utils/sound';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  customer: Customer | null;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  onCompleteOrder: (order: Order) => void;
  cashierName: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cart,
  customer,
  subtotal,
  discountAmount,
  vatAmount,
  total,
  onCompleteOrder,
  cashierName
}) => {
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<number>(total);
  const [orderNote, setOrderNote] = useState<string>('');
  const [vietQrConfirmed, setVietQrConfirmed] = useState<boolean>(false);
  const [posCardConfirmed, setPosCardConfirmed] = useState<boolean>(false);

  // Sync default amountReceived with total whenever total changes
  useEffect(() => {
    setAmountReceived(total);
    setVietQrConfirmed(false);
    setPosCardConfirmed(false);
  }, [total, isOpen]);

  // Keyboard shortcut: Enter to confirm if valid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const changeAmount = Math.max(0, amountReceived - total);
  const isCashInsufficient = method === 'cash' && amountReceived < total;

  // Quick cash preset denominations (DreamsPOS style)
  const quickCashChips = useMemo(() => {
    const list = [
      { label: 'Đúng số tiền', value: total },
      { label: '50.000₫', value: 50000 },
      { label: '100.000₫', value: 100000 },
      { label: '200.000₫', value: 200000 },
      { label: '500.000₫', value: 500000 },
      { label: '1.000.000₫', value: 1000000 },
    ];
    return list.filter(item => item.value >= total || item.value === total || item.value >= 200000);
  }, [total]);

  const handleFinish = () => {
    if (isCashInsufficient) return;

    sound.playSuccessChime();

    const orderId = 'ord-' + Math.floor(1000 + Math.random() * 9000);
    const orderCode = 'HD' + Math.floor(1050 + Math.random() * 8900);

    const completedOrder: Order = {
      id: orderId,
      code: orderCode,
      createdAt: new Date().toISOString(),
      customerName: customer ? customer.name : 'Khách lẻ vãng lai',
      customerPhone: customer?.phone,
      cashierName: cashierName,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.product.sellPrice,
        total: item.product.sellPrice * item.quantity
      })),
      subtotal,
      discount: discountAmount,
      vat: vatAmount,
      total,
      paymentMethod: method,
      amountReceived: method === 'cash' ? amountReceived : total,
      change: method === 'cash' ? changeAmount : 0,
      status: 'completed'
    };

    onCompleteOrder(completedOrder);
  };

  return (
    <div 
      id="pos-payment-modal-overlay"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
    >
      <div 
        id="pos-payment-modal-card"
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Thanh toán & Xuất hóa đơn</h3>
              <p className="text-xs text-slate-400">
                Khách: <span className="font-semibold text-primary-400">{customer ? customer.name : 'Khách lẻ vãng lai'}</span> • Thu ngân: <span className="text-slate-200">{cashierName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Total Payable Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-indigo-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-primary-100">Tổng tiền cần thanh toán</span>
              <p className="text-xs text-primary-100/90 mt-0.5">
                {cart.reduce((s, c) => s + c.quantity, 0)} sản phẩm (Đã gồm chiết khấu & VAT)
              </p>
            </div>
            <span className="text-3xl font-black tabular-nums tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Chọn phương thức thanh toán
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition duration-150 active:scale-95 ${
                  method === 'cash'
                    ? 'border-primary-500 bg-primary-50/70 text-primary-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${method === 'cash' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Banknote className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Tiền mặt</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('transfer')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition duration-150 active:scale-95 ${
                  method === 'transfer'
                    ? 'border-primary-500 bg-primary-50/70 text-primary-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${method === 'transfer' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">VietQR Chuyển khoản</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition duration-150 active:scale-95 ${
                  method === 'card'
                    ? 'border-primary-500 bg-primary-50/70 text-primary-950 font-bold shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${method === 'card' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Thẻ POS / MoMo</span>
              </button>
            </div>
          </div>

          {/* METHOD 1: CASH INTERFACE */}
          {method === 'cash' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiền khách đưa (₫)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amountReceived || ''}
                    onChange={(e) => setAmountReceived(Number(e.target.value))}
                    className={`w-full px-3 py-2.5 text-lg font-bold tabular-nums border rounded-xl bg-white focus:outline-none focus:ring-2 transition ${
                      isCashInsufficient 
                        ? 'border-rose-400 focus:ring-rose-500 text-rose-700' 
                        : 'border-slate-300 focus:ring-primary-500 text-slate-900'
                    }`}
                    placeholder="Nhập số tiền..."
                    autoFocus
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    VND
                  </span>
                </div>
              </div>

              {/* Quick Cash Presets (DreamsPOS style) */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Mệnh giá tiền nhanh:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickCashChips.map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setAmountReceived(chip.value);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                        amountReceived === chip.value
                          ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change calculation */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700">Tiền thối lại cho khách:</span>
                  {isCashInsufficient && (
                    <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Chưa đủ tiền thanh toán (Thiếu {formatCurrency(total - amountReceived)})
                    </p>
                  )}
                </div>
                <span className={`text-xl font-extrabold tabular-nums ${isCashInsufficient ? 'text-rose-600' : 'text-primary-700'}`}>
                  {formatCurrency(changeAmount)}
                </span>
              </div>
            </div>
          )}

          {/* METHOD 2: VIETQR */}
          {method === 'transfer' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-36 h-36 bg-white border border-slate-300 rounded-xl p-2 shadow-xs shrink-0 flex flex-col items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=FreshMart_POS_${total}_HD1049`}
                  alt="VietQR code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-primary-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mã VietQR động tạo theo đơn</span>
                </div>
                <p className="text-slate-600">
                  Khách mở ứng dụng ngân hàng (Vietcombank, BIDV, Techcombank, MB...) hoặc MoMo quét mã trên.
                </p>
                <div className="bg-white p-2 border border-slate-200 rounded-lg space-y-1 font-mono text-[11px]">
                  <p><span className="text-slate-400">STK:</span> 19036789999 (Techcombank)</p>
                  <p><span className="text-slate-400">Chủ TK:</span> FRESHMART VIETNAM</p>
                  <p><span className="text-slate-400">Số tiền:</span> <b className="text-primary-700">{formatCurrency(total)}</b></p>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vietQrConfirmed}
                    onChange={(e) => setVietQrConfirmed(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                  />
                  <span className="font-semibold text-slate-800">
                    Đã nhận được thông báo biến động số dư (+{formatCurrency(total)})
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* METHOD 3: CARD / POS TERMINAL */}
          {method === 'card' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <CreditCard className="w-4 h-4 text-primary-600" />
                <span>Thanh toán qua máy POS quẹt thẻ ngân hàng</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                1. Đưa thẻ của khách vào khe đọc chip hoặc chạm contactless trên máy POS ngân hàng.<br />
                2. Kiểm tra số tiền trên máy POS: <b className="text-primary-700">{formatCurrency(total)}</b>.<br />
                3. Đợi máy in biên nhận cà thẻ và tích xác nhận bên dưới.
              </p>

              <label className="flex items-center gap-2 pt-2 border-t border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={posCardConfirmed}
                  onChange={(e) => setPosCardConfirmed(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                />
                <span className="font-semibold text-slate-800">
                  Máy POS đã báo giao dịch thành công (In biên nhận máy POS)
                </span>
              </label>
            </div>
          )}

          {/* Order Note */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Ghi chú hóa đơn (In ra hóa đơn nếu có)
            </label>
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="VD: Khách lấy túi lớn, giao giờ trưa..."
              className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            Quay lại
          </button>

          <button
            type="button"
            disabled={isCashInsufficient}
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận & In hóa đơn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
