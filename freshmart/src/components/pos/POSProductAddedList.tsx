import React from 'react';
import { ShoppingBag, Trash2, Sparkles, Layers } from 'lucide-react';
import { CartItem } from '../../types';
import { POSCartItem } from './POSCartItem';
import { sound } from '../../utils/sound';

interface POSProductAddedListProps {
  cart: CartItem[];
  totalItemsCount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

export const POSProductAddedList: React.FC<POSProductAddedListProps> = ({
  cart,
  totalItemsCount,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
      {/* Header: Product Added (N) */}
      <div className="px-4 py-2.5 bg-[#F8FAFC]/90 backdrop-blur-xs border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
              Món đã chọn
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              (Product Added)
            </span>
          </div>
          <span className="bg-linear-to-r from-[#FE9F43] to-[#FFA858] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
            {totalItemsCount}
          </span>
        </div>

        {cart.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Xóa tất cả các mặt hàng đã chọn?')) {
                sound.playTrash();
                onClearCart();
              }
            }}
            className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg"
            title="Xóa tất cả món"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa hết</span>
          </button>
        )}
      </div>

      {/* Cart Items Scrollable List */}
      <div 
        id="pos-order-items-list" 
        className="flex-1 overflow-y-auto p-3 space-y-2 bg-white"
      >
        {cart.length === 0 ? (
          <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-slate-400 py-10 px-4 text-center select-none">
            <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/50 flex items-center justify-center text-[#FE9F43] mb-3 shadow-inner">
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="text-xs font-bold text-slate-700">Chưa có món nào trong đơn</p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mt-1 leading-relaxed">
              Nhấn vào món bên trái hoặc quét mã vạch để thêm nhanh
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <POSCartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveFromCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

