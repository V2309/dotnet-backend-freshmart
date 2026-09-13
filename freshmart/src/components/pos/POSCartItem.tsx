import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/format';
import { sound } from '../../utils/sound';

interface POSCartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const POSCartItem: React.FC<POSCartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const itemTotal = item.product.sellPrice * item.quantity;

  return (
    <div 
      className="group relative bg-[#F8FAFC]/80 hover:bg-[#FFF9F2]/80 border border-slate-200/70 hover:border-amber-300/80 rounded-2xl p-2.5 transition-all duration-200 select-none shadow-2xs hover:shadow-xs"
    >
      <div className="flex items-center gap-3">
        {/* Squircle Thumbnail with double border */}
        <div className="relative w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-2xs p-1 shrink-0 flex items-center justify-center overflow-hidden">
          <img 
            src={item.product.image} 
            alt={item.product.name} 
            className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300" 
          />
        </div>

        {/* Product Details & Stepper */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <h4 className="text-xs font-bold text-slate-800 leading-snug truncate group-hover:text-amber-900 transition-colors">
              {item.product.name}
            </h4>
            <button
              onClick={() => {
                sound.playTrash();
                onRemove(item.product.id);
              }}
              className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-lg transition-all cursor-pointer opacity-80 group-hover:opacity-100"
              title="Xóa món"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Unit Price */}
            <span className="text-[11px] text-slate-500 font-semibold tabular-nums">
              {formatCurrency(item.product.sellPrice)}
            </span>

            {/* Tactile Haptic Stepper */}
            <div className="flex items-center bg-white border border-slate-200 shadow-2xs rounded-xl p-0.5">
              <button
                onClick={() => {
                  sound.playPop();
                  onUpdateQuantity(item.product.id, item.quantity - 1);
                }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-90 transition cursor-pointer"
                title="Giảm"
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
              </button>
              <span className="w-7 text-center text-xs font-black text-slate-800 tabular-nums">
                {item.quantity}
              </span>
              <button
                onClick={() => {
                  sound.playPop();
                  onUpdateQuantity(item.product.id, item.quantity + 1);
                }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-90 transition cursor-pointer"
                title="Tăng"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>

            {/* Line Subtotal */}
            <span className="text-xs font-black text-slate-900 tabular-nums tracking-tight">
              {formatCurrency(itemTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

