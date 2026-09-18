import React from 'react';
import { Receipt } from 'lucide-react';
import type { RecentTransactionResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/format';

interface RecentSalesCardProps {
  transactions: RecentTransactionResponse[];
}

export const RecentSalesCard: React.FC<RecentSalesCardProps> = ({ transactions }) => {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#212B36]">Đơn hàng vừa bán</h3>
        </div>
        <span className="text-[11px] text-[#646B72] font-semibold bg-[#F7F7F7] px-2 py-0.5 rounded-md">
          Realtime
        </span>
      </div>

      <div className="divide-y divide-[#F1F3F5] mt-2 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin">
        {transactions.map((p) => (
          <div 
            key={p.id} 
            className="py-3 flex items-center justify-between gap-3 group rounded-xl px-1 transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-3 truncate">
              <img
                src={p.imageUrl}
                alt={p.productName}
                className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-[#EAEAEA]"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-[#212B36] truncate group-hover:text-[#FE9F43] transition">
                  {p.productName}
                </p>
                <p className="text-[11px] text-[#646B72] mt-0.5 font-medium">
                  {p.category} • <strong className="text-[#212B36]">{formatCurrency(p.amount)}</strong>
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${p.statusColor} block`}>
                {p.status}
              </span>
              <span className="text-[10px] text-[#646B72] mt-0.5 block">{p.formattedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
