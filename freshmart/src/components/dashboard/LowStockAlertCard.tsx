import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { LowStockProductResponse } from '../../types/dashboard';

interface LowStockAlertCardProps {
  products: LowStockProductResponse[];
  onNavigateToInventory: () => void;
  onQuickRestock: (productId: string, quantity: number) => void;
}

export const LowStockAlertCard: React.FC<LowStockAlertCardProps> = ({
  products,
  onNavigateToInventory,
  onQuickRestock
}) => {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#212B36]">Cảnh báo tồn kho ({products.length})</h3>
        </div>
        <button
          onClick={onNavigateToInventory}
          className="text-xs text-[#FE9F43] font-bold hover:underline cursor-pointer"
        >
          Xem tất cả
        </button>
      </div>

      <div className="divide-y divide-[#F1F3F5] mt-2">
        {products.map((p) => (
          <div key={p.id} className="py-3 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3 truncate">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-[#EAEAEA]"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-[#212B36] truncate group-hover:text-[#FE9F43] transition">
                  {p.name}
                </p>
                <p className="text-[11px] text-[#646B72] mt-0.5">
                  Mã: <span className="font-mono text-slate-500 font-bold">{p.sku}</span>
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md block">
                Còn {p.stock} {p.unit}
              </span>
              <button
                onClick={() => onQuickRestock(p.id, 20)}
                className="text-[10px] text-[#FE9F43] hover:text-[#E88E35] font-bold hover:underline mt-1 block cursor-pointer"
              >
                + Nhập thêm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
