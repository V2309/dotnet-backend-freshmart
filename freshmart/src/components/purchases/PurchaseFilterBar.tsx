import React from 'react';
import { Search } from 'lucide-react';

interface PurchaseFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | 'pending' | 'received' | 'cancelled';
  onStatusFilterChange: (val: 'all' | 'pending' | 'received' | 'cancelled') => void;
  totalCount: number;
}

export const PurchaseFilterBar: React.FC<PurchaseFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
}) => {
  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ giao hàng' },
    { key: 'received', label: 'Đã nhập kho' },
    { key: 'cancelled', label: 'Đã hủy' },
  ] as const;

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-[#EAEAEA] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo mã phiếu nhập (NHxxxx), nhà cung cấp..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onStatusFilterChange(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        <span className="text-xs text-slate-400 font-bold ml-2 hidden sm:inline">
          ({totalCount} phiếu)
        </span>
      </div>
    </div>
  );
};
