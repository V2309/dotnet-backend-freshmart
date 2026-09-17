import React from 'react';
import { Search } from 'lucide-react';

interface CustomerFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedTier: string;
  onTierChange: (tier: string) => void;
  totalCount: number;
}

const TIER_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'Thân thiết', label: 'Thân thiết' },
  { id: 'Bạc', label: 'Hạng Bạc' },
  { id: 'Vàng', label: 'Hạng Vàng' },
  { id: 'Kim Cương', label: 'Kim Cương' },
];

export const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  search,
  onSearchChange,
  selectedTier,
  onTierChange,
  totalCount,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3.5">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-[#646B72] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo Tên, SĐT, Mã KH..."
          className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl text-xs font-semibold text-[#212B36] placeholder-[#646B72] focus:bg-white focus:border-[#FE9F43] focus:outline-hidden transition"
        />
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {TIER_OPTIONS.map((t) => {
          const isActive = selectedTier === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTierChange(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#FE9F43] text-white shadow-2xs'
                  : 'bg-[#F8F9FA] text-[#646B72] hover:bg-[#EAEAEA]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
        <span className="text-[11px] font-bold text-[#646B72] ml-2 px-2 py-1 bg-slate-100 rounded-lg">
          {totalCount} KH
        </span>
      </div>
    </div>
  );
};
