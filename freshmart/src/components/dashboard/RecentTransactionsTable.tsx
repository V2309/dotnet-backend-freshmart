import React, { useState } from 'react';
import { Receipt } from 'lucide-react';
import type { RecentTransactionResponse } from '../../types/dashboard';
import { formatCurrency } from '../../utils/format';

interface RecentTransactionsTableProps {
  transactions: RecentTransactionResponse[];
  onNavigateToPOS: () => void;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  transactions,
  onNavigateToPOS
}) => {
  const [activeTab, setActiveTab] = useState<'sale' | 'purchase' | 'quotation' | 'expenses' | 'invoices'>('sale');

  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F8F5] text-[#00A389] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-[#212B36]">Giao dịch gần đây (Recent Transactions)</h3>
          </div>

          <button
            onClick={onNavigateToPOS}
            className="text-xs text-[#FE9F43] font-bold hover:underline cursor-pointer"
          >
            Tất cả đơn →
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto text-xs font-bold">
          {(['sale', 'purchase', 'quotation', 'expenses', 'invoices'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer shrink-0 ${
                activeTab === tab
                  ? 'bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB]'
                  : 'text-[#646B72] hover:bg-[#F7F7F7]'
              }`}
            >
              {tab === 'sale' ? 'Bán lẻ (Sale)' : tab === 'purchase' ? 'Nhập hàng' : tab === 'quotation' ? 'Báo giá' : tab === 'expenses' ? 'Chi phí' : 'Hóa đơn'}
            </button>
          ))}
        </div>

        {/* Transactions Table from live SignalR data */}
        <div className="mt-4 overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-white shadow-2xs z-10">
              <tr className="border-b border-[#F1F3F5] text-[#646B72] font-bold text-[11px]">
                <th className="pb-2.5 pt-2 px-2.5">Thời gian</th>
                <th className="pb-2.5 pt-2 px-2.5">Khách hàng / Đối tác</th>
                <th className="pb-2.5 pt-2 px-2.5">Trạng thái</th>
                <th className="pb-2.5 pt-2 px-2.5 text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5] font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FFFDF9] transition">
                  <td className="py-2.5 px-2.5 text-[#646B72] whitespace-nowrap">{tx.formattedDate}</td>
                  <td className="py-2.5 px-2.5">
                    <p className="font-bold text-[#212B36]">{tx.partnerName}</p>
                    <span className="text-[10px] text-[#FE9F43] font-mono font-bold">#{tx.code}</span>
                  </td>
                  <td className="py-2.5 px-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tx.statusColor}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-black text-[#212B36] tabular-nums">
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
