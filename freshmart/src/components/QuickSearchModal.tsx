import React, { useState, useEffect } from 'react';
import { Search, X, Package, ShoppingBag, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product, Order, Customer } from '../types';
import { formatCurrency } from '../utils/format';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onSelectProduct: (p: Product) => void;
  onSelectOrder: (o: Order) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  customers,
  onSelectProduct,
  onSelectOrder
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedProducts = products.filter(p =>
    !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q)
  ).slice(0, 5);

  const matchedOrders = orders.filter(o =>
    !q || o.code.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedCustomers = customers.filter(c =>
    !q || c.name.toLowerCase().includes(q) || c.phone.includes(q)
  ).slice(0, 3);

  return (
    <div 
      id="quick-search-modal-overlay"
      className="fixed inset-0 bg-slate-900/50 backdrop-none flex items-start justify-center z-50 pt-20 p-4"
    >
      <div 
        id="quick-search-modal-card"
        className="bg-white border border-slate-200 rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Search input field */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-2.5 bg-slate-50">
          <Search className="w-4 h-4 text-primary-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm nhanh sản phẩm, hóa đơn, khách hàng... (Esc để thoát)"
            className="w-full bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs divide-y divide-slate-100">
          {/* Products */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Hàng hóa ({matchedProducts.length})
            </span>
            <div className="space-y-1">
              {matchedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="p-2 rounded-md hover:bg-primary-50 cursor-pointer flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600" />
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.sku} • Barcode: {p.barcode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary-700">{formatCurrency(p.sellPrice)}</span>
                    <span className="text-[10px] text-slate-400 block">Tồn: {p.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Hóa đơn ({matchedOrders.length})
            </span>
            <div className="space-y-1">
              {matchedOrders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    onSelectOrder(o);
                    onClose();
                  }}
                  className="p-2 rounded-md hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900">{o.code} - {o.customerName}</p>
                      <p className="text-[10px] text-slate-400">Thu ngân: {o.cashierName}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(o.total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customers */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Khách hàng ({matchedCustomers.length})
            </span>
            <div className="space-y-1">
              {matchedCustomers.map((c) => (
                <div
                  key={c.id}
                  className="p-2 rounded-md hover:bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.phone} • Hạng {c.tier}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary-700">{c.points} điểm</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Gợi ý: Chọn sản phẩm để tự động thêm vào giỏ hàng POS</span>
          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">ESC để đóng</span>
        </div>
      </div>
    </div>
  );
};
