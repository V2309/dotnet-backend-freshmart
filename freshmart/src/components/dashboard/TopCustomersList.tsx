import React from 'react';
import { Users } from 'lucide-react';
import type { TopCustomerResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/format';

interface TopCustomersListProps {
  customers: TopCustomerResponse[];
}

export const TopCustomersList: React.FC<TopCustomersListProps> = ({ customers }) => {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EAF8FF] text-[#2E6FF2] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-[#212B36]">Khách hàng thân thiết ({customers.length})</h3>
        </div>
        <span className="text-xs text-[#646B72] font-semibold">VIP Tiers</span>
      </div>

      <div className="divide-y divide-[#F1F3F5] mt-2">
        {customers.map((c) => (
          <div key={c.id} className="py-3 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3 truncate">
              <div className="w-10 h-10 rounded-xl bg-[#FFF5E9] text-[#FE9F43] font-bold flex items-center justify-center text-xs shrink-0 border border-[#FED8AB]">
                {c.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#212B36] truncate group-hover:text-[#FE9F43] transition">
                  {c.name}
                </p>
                <p className="text-[11px] text-[#646B72] mt-0.5 font-medium">
                  {c.phone} • <span className="text-[#00A389] font-bold">{c.points} điểm</span>
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md block">
                {c.tier}
              </span>
              <span className="text-xs font-black text-[#212B36] mt-0.5 block tabular-nums">
                {formatCurrency(c.totalSpent)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
