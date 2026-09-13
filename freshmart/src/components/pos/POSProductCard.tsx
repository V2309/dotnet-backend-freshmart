import React from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/format';

interface POSProductCardProps {
  product: Product;
  inCartQty: number;
  onAddProduct: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const POSProductCard: React.FC<POSProductCardProps> = ({
  product,
  inCartQty,
  onAddProduct,
  onUpdateQuantity,
}) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`pos-product-card-${product.id}`}
      onClick={() => {
        if (!isOutOfStock) onAddProduct(product);
      }}
      className={`group relative bg-white border rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer select-none shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${
        inCartQty > 0
          ? 'border-[#FE9F43] ring-2 ring-[#FE9F43]/20 bg-[#FFFDF9]'
          : isOutOfStock
          ? 'opacity-50 border-slate-200 cursor-not-allowed'
          : 'border-slate-200/80 hover:border-amber-300'
      }`}
    >
      {/* Product Image Box */}
      <div className="relative w-full aspect-square rounded-xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9]/50 flex items-center justify-center p-2.5 overflow-hidden mb-2.5 border border-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
          loading="lazy"
        />

        {/* In-cart badge indicator */}
        {inCartQty > 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FE9F43] to-[#FFA858] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>x{inCartQty}</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-0.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
          {product.category}
        </span>
        <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 leading-snug group-hover:text-amber-700 transition-colors">
          {product.name}
        </h4>
      </div>

      {/* Dashed Separator + Stock & Price Row */}
      <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200/90 flex items-center justify-between">
        <span className={`text-[11px] font-bold ${isOutOfStock ? 'text-slate-400' : 'text-slate-500'}`}>
          Còn {product.stock} {product.unit || 'món'}
        </span>

        <span className="text-xs sm:text-sm font-black text-emerald-600 tabular-nums">
          {formatCurrency(product.sellPrice)}
        </span>
      </div>
    </div>
  );
};

