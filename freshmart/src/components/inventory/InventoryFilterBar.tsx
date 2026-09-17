import React from 'react';
import { Search, Filter, History } from 'lucide-react';

interface InventoryFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: string[];
  filterMode: 'all' | 'low' | 'out';
  onFilterModeChange: (val: 'all' | 'low' | 'out') => void;
  totalCount: number;
  onOpenHistory: () => void;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  filterMode,
  onFilterModeChange,
  totalCount,
  onOpenHistory,
}) => {
  const tabs = [
    { key: 'all', label: 'Tất cả hàng hóa' },
    { key: 'low', label: 'Sắp hết hàng' },
    { key: 'out', label: 'Đã hết hàng' },
  ] as const;

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-[#EAEAEA] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, mã SKU, barcode..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs & History Button */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = filterMode === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onFilterModeChange(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? tab.key === 'out'
                      ? 'bg-red-500 text-white shadow-2xs'
                      : tab.key === 'low'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-slate-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenHistory}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-amber-600" />
          <span>Lịch sử kiểm kê</span>
        </button>

        <span className="text-xs text-slate-400 font-bold ml-1 hidden sm:inline">
          ({totalCount} món)
        </span>
      </div>
    </div>
  );
};
