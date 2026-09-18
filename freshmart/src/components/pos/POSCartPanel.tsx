import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
   User, 
   ChevronDown, 
   UserPlus, 
   Check, 
   Clock, 
   Save, 
   RotateCcw, 
   CreditCard,
   Copy,
   Receipt,
   Sparkles,
   ArrowRight,
   Search,
   Phone,
   Loader2,
   X
 } from 'lucide-react';
import { CartItem, Customer } from '../../types';
import { formatCurrency } from '../../utils/format';
import { customerService } from '../../services/customer.service';
import { POSProductAddedList } from './POSProductAddedList';
import { POSOrderModifiers } from './POSOrderModifiers';
import { QuickAddCustomerModal } from '../QuickAddCustomerModal';
import { OrderType } from './POSProductCatalog';

interface POSCartPanelProps {
  cart: CartItem[];
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  orderType: OrderType;
  discountPercent: number;
  onSetDiscountPercent: (pct: number) => void;
  vatRate: number;
  onSetVatRate: (rate: number) => void;
  shippingFee?: number;
  onSetShippingFee?: (fee: number) => void;
  orderCode?: string;
  heldOrdersCount: number;
  onParkCurrentOrder: (orderType: OrderType) => void;
  onOpenHeldOrders: () => void;
  onClearCart: () => void;
  onOpenPaymentModal: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const POSCartPanel: React.FC<POSCartPanelProps> = ({
  cart,
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
  orderType,
  discountPercent,
  onSetDiscountPercent,
  vatRate,
  onSetVatRate,
  shippingFee = 0,
  onSetShippingFee,
  orderCode: propOrderCode,
  heldOrdersCount,
  onParkCurrentOrder,
  onOpenHeldOrders,
  onClearCart,
  onOpenPaymentModal,
  onUpdateQuantity,
  onRemoveFromCart
}) => {
  const [showCustomerDropdown, setShowCustomerDropdown] = useState<boolean>(false);
  const [showQuickAddCust, setShowQuickAddCust] = useState<boolean>(false);
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResultCust, setSearchResultCust] = useState<Customer | null | undefined>(undefined);
  const [quickAddInitialPhone, setQuickAddInitialPhone] = useState<string>('');
  const [localShipping, setLocalShipping] = useState<number>(shippingFee);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [localOrderCode] = useState<string>(() => 'HD' + Math.floor(1000 + Math.random() * 9000));
  const orderCode = propOrderCode || localOrderCode;

  const handleCopyOrderCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(orderCode);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };
  const customerDropdownRef = useRef<HTMLDivElement>(null);

  const handleShippingChange = (fee: number) => {
    setLocalShipping(fee);
    if (onSetShippingFee) onSetShippingFee(fee);
  };

  const handleSearchCustomer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchPhone.trim();
    if (!query) {
      setSearchResultCust(undefined);
      return;
    }

    // 1. Kiểm tra nhanh trong danh sách hiện có
    const foundLocal = customers.find(c => 
      (c.phone && c.phone.trim() === query) || 
      c.code.toLowerCase() === query.toLowerCase()
    );

    if (foundLocal) {
      setSearchResultCust(foundLocal);
      return;
    }

    // 2. Gọi API backend /api/v1/customers/search-pos
    try {
      setIsSearching(true);
      const res = await customerService.searchForPos(query);
      setSearchResultCust(res || null);
    } catch (err) {
      console.error('Lỗi tìm khách hàng:', err);
      setSearchResultCust(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenQuickAddWithPhone = (phoneToPass: string) => {
    setQuickAddInitialPhone(phoneToPass);
    setShowQuickAddCust(true);
    setShowCustomerDropdown(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lọc danh sách khách hàng khi gõ
  const displayedCustomers = useMemo(() => {
    if (!searchPhone.trim()) return customers;
    const q = searchPhone.trim().toLowerCase();
    return customers.filter(c => 
      (c.phone && c.phone.includes(q)) || 
      c.name.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q)
    );
  }, [customers, searchPhone]);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.sellPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * discountPercent) / 100);
  }, [subtotal, discountPercent]);

  const subtotalAfterDiscount = subtotal - discountAmount;

  const vatAmount = useMemo(() => {
    return Math.round((subtotalAfterDiscount * vatRate) / 100);
  }, [subtotalAfterDiscount, vatRate]);

  const grandTotal = subtotalAfterDiscount + vatAmount + localShipping;

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <aside 
      id="pos-receipt-panel" 
      className="bg-white flex flex-col h-full overflow-hidden border-l border-slate-200/90 shadow-xl select-none"
    >
      {/* 1. Customer Selection Bar & Invoice ID Header */}
      <div className="p-3.5 border-b border-slate-200/80 bg-linear-to-b from-[#FDFBF7] to-[#F8FAFC] space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Hóa đơn bán lẻ</span>
            </span>
            {/* Invoice ID / Order Code Badge */}
            <button
              type="button"
              onClick={handleCopyOrderCode}
              title="Nhấn để sao chép mã đơn"
              className="group text-[11px] font-mono font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Receipt className="w-3 h-3 text-amber-600" />
              <span>#{orderCode}</span>
              {copiedId ? (
                <Check className="w-3 h-3 text-emerald-600 ml-0.5" />
              ) : (
                <Copy className="w-2.5 h-2.5 text-amber-600/60 group-hover:text-amber-700 ml-0.5" />
              )}
            </button>
          </div>

          {heldOrdersCount > 0 && (
            <button
              onClick={onOpenHeldOrders}
              className="text-[11px] font-bold text-amber-800 bg-amber-100/90 hover:bg-amber-200 border border-amber-300/80 px-2.5 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
            >
              <Clock className="w-3 h-3 text-amber-700" />
              <span>Đơn chờ ({heldOrdersCount})</span>
            </button>
          )}
        </div>

        {/* Customer Double-Bezel Box */}
        <div className="relative" ref={customerDropdownRef}>
          <div className="flex items-center gap-1.5">
            <button
              id="pos-customer-select-btn"
              onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
              className="flex-1 flex items-center justify-between bg-white border border-slate-200 hover:border-amber-400 px-3 py-2 rounded-2xl text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-xl bg-linear-to-br from-amber-50 to-orange-100 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0 font-bold shadow-inner">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left truncate">
                  <span className="font-bold text-slate-800 truncate block text-xs group-hover:text-amber-900 transition-colors">
                    {selectedCustomer ? selectedCustomer.name : 'Khách lẻ vãng lai'}
                  </span>
                  {selectedCustomer ? (
                    <span className="text-[10px] text-amber-700 font-bold block">
                      Hạng {selectedCustomer.tier} • {selectedCustomer.points} điểm tích lũy
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Nhấn để chọn thành viên tích điểm
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
            </button>

            <button
              onClick={() => setShowQuickAddCust(true)}
              className="p-2.5 bg-linear-to-b from-[#FFF5E9] to-[#FEEAD1] hover:from-[#FEEAD1] hover:to-[#FED8AB] text-amber-800 border border-amber-300/80 rounded-2xl transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
              title="Thêm khách hàng mới"
            >
              <UserPlus className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Customer Dropdown Menu with Phone Search */}
          {showCustomerDropdown && (
            <div 
              id="pos-customer-dropdown-menu"
              className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-50 p-2 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2"
            >
              {/* Search Bar by Phone / Name */}
              <form 
                onSubmit={handleSearchCustomer}
                className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all"
              >
                <div className="relative flex-1 flex items-center">
                  <Phone className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={(e) => {
                      setSearchPhone(e.target.value);
                      if (searchResultCust !== undefined) setSearchResultCust(undefined);
                    }}
                    placeholder="Nhập SĐT hoặc tên khách..."
                    className="w-full bg-transparent px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                    autoFocus
                  />
                  {searchPhone && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchPhone('');
                        setSearchResultCust(undefined);
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-600 rounded-md mr-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-2.5 py-1.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-[11px] rounded-lg shadow-2xs flex items-center gap-1 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  title="Tìm kiếm khách hàng theo SĐT"
                >
                  {isSearching ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Search className="w-3 h-3" />
                  )}
                  <span>Tìm</span>
                </button>
              </form>

              {/* Explicit Search Result Box (from API lookup) */}
              {searchResultCust !== undefined && (
                <div className="animate-in fade-in duration-100">
                  {searchResultCust ? (
                    <div className="p-2.5 bg-amber-50/80 border border-amber-300/80 rounded-xl flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-800 truncate">{searchResultCust.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">{searchResultCust.tier}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                          {searchResultCust.phone} • {searchResultCust.points} điểm tích lũy
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCustomer(searchResultCust);
                          setShowCustomerDropdown(false);
                          setSearchPhone('');
                          setSearchResultCust(undefined);
                        }}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Chọn
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-2 text-rose-800">
                      <div className="text-[11px]">
                        <span className="font-bold">Không tìm thấy</span>
                        <p className="text-[10px] text-rose-600">SĐT này chưa có trong hệ thống</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenQuickAddWithPhone(searchPhone)}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Thêm mới</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Standard List */}
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                <div
                  onClick={() => {
                    onSelectCustomer(null);
                    setShowCustomerDropdown(false);
                  }}
                  className="p-2 text-xs hover:bg-[#FFF9F2] cursor-pointer rounded-xl font-bold text-slate-800 flex items-center justify-between transition-colors"
                >
                  <span>Khách lẻ vãng lai</span>
                  {!selectedCustomer && <Check className="w-4 h-4 text-emerald-600" />}
                </div>

                {displayedCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectCustomer(c);
                      setShowCustomerDropdown(false);
                    }}
                    className="p-2 text-xs hover:bg-[#FFF9F2] cursor-pointer rounded-xl font-medium text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {c.phone} • <span className="text-amber-700 font-bold">{c.tier}</span> ({c.points} điểm)
                      </p>
                    </div>
                    {selectedCustomer?.id === c.id && <Check className="w-4 h-4 text-amber-600 shrink-0 ml-2" />}
                  </div>
                ))}

                {displayedCustomers.length === 0 && !searchResultCust && (
                  <div className="py-3 text-center text-slate-400 text-xs">
                    Không tìm thấy khách hàng nào
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Product Added Section (Scrollable Items List) */}
      <POSProductAddedList
        cart={cart}
        totalItemsCount={totalItemsCount}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onClearCart={onClearCart}
      />

      {/* 3. Bottom Calculation, Modifiers & Checkout Panel */}
      <div className="border-t border-slate-200/90 p-4 bg-linear-to-b from-[#FDFBF7] to-[#F8FAFC] space-y-3 shrink-0 shadow-lg">
        {/* Modifiers: Order Tax, Shipping, Discount Dropdowns */}
        <POSOrderModifiers
          taxRate={vatRate}
          onSetTaxRate={onSetVatRate}
          shippingFee={localShipping}
          onSetShippingFee={handleShippingChange}
          discountPercent={discountPercent}
          onSetDiscountPercent={onSetDiscountPercent}
        />

        {/* Totals Summary */}
        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-medium">Tạm tính (Sub Total)</span>
            <span className="font-bold text-slate-800 tabular-nums">{formatCurrency(subtotal)}</span>
          </div>

          {vatAmount > 0 && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Thuế VAT ({vatRate}%)</span>
              <span className="font-bold text-slate-800 tabular-nums">+{formatCurrency(vatAmount)}</span>
            </div>
          )}

          {localShipping > 0 && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Phí giao hàng</span>
              <span className="font-bold text-slate-800 tabular-nums">+{formatCurrency(localShipping)}</span>
            </div>
          )}

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-rose-600 bg-rose-50/80 px-2 py-1 rounded-lg border border-rose-200/60">
              <span className="font-bold">Chiết khấu ({discountPercent}%)</span>
              <span className="font-black tabular-nums">-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          {/* Grand Total Banner Card (Linear Style Double-Bezel) */}
          <div className="mt-2 p-3 bg-linear-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                Tổng thanh toán
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">Đã gồm VAT & chiết khấu</p>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#FE9F43] tabular-nums tracking-tight drop-shadow-2xs">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <button
            id="pos-park-order-btn"
            disabled={cart.length === 0}
            onClick={() => onParkCurrentOrder(orderType)}
            className="flex items-center justify-center gap-1.5 py-3 px-2 bg-white hover:bg-amber-50 text-amber-800 disabled:opacity-40 rounded-2xl text-xs font-bold border border-amber-200/90 shadow-2xs hover:border-amber-300 transition-all active:scale-95 cursor-pointer"
            title="Lưu đơn tạm để thanh toán sau"
          >
            <Save className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Lưu đơn</span>
          </button>

          <button
            id="pos-clear-cart-btn"
            disabled={cart.length === 0}
            onClick={() => {
              if (confirm('Xác nhận xóa toàn bộ mặt hàng trong giỏ?')) {
                onClearCart();
              }
            }}
            className="flex items-center justify-center gap-1.5 py-3 px-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 disabled:opacity-40 rounded-2xl text-xs font-bold border border-slate-200 hover:border-rose-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Hủy đơn hiện tại"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Hủy đơn</span>
          </button>

          {/* Primary High-Impact Checkout Button with Nested Icon Island */}
          <button
            id="pos-checkout-btn"
            disabled={cart.length === 0}
            onClick={onOpenPaymentModal}
            className="group flex items-center justify-between py-2 px-3 bg-linear-to-r from-[#FF8A00] to-[#FE9F43] hover:from-[#f38a22] hover:to-[#FFA858] active:scale-[0.98] disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all cursor-pointer"
          >
            <span className="tracking-tight">Thanh toán</span>
            <div className="w-6 h-6 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <CreditCard className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Quick Add Customer Modal */}
      {showQuickAddCust && (
        <QuickAddCustomerModal
          isOpen={showQuickAddCust}
          initialPhone={quickAddInitialPhone}
          onClose={() => {
            setShowQuickAddCust(false);
            setQuickAddInitialPhone('');
          }}
          onCustomerAdded={(newC) => {
            onAddCustomer(newC);
            onSelectCustomer(newC);
            setQuickAddInitialPhone('');
          }}
        />
      )}
    </aside>
  );
};

