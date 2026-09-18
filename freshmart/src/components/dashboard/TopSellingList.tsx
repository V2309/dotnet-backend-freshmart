import React from 'react';
import { Flame } from 'lucide-react';
import type { TopSellingProductResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/format';

interface TopSellingListProps {
  products: TopSellingProductResponse[];
}

export const TopSellingList: React.FC<TopSellingListProps> = ({ products }) => {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFF5E9] text-[#FE9F43] flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#212B36]">Sản phẩm bán chạy</h3>
        </div>
        <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
          Top {products.length} SP
        </span>
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
                <p className="text-[11px] text-[#646B72] mt-0.5 font-medium">
                  {formatCurrency(p.sellPrice)} • <span className="text-slate-400 font-bold">{p.quantitySold} {p.unit} đã bán</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#00A389] bg-[#E8F8F5] border border-[#00A389]/20 px-2 py-0.5 rounded-md shrink-0">
              {formatCurrency(p.totalRevenue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
