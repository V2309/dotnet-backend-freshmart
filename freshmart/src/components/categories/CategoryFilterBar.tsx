import React from 'react';
import { Search, Plus } from 'lucide-react';

interface CategoryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  includeInactive: boolean;
  onToggleIncludeInactive: (val: boolean) => void;
  onOpenAddModal: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  search,
  onSearchChange,
  includeInactive,
  onToggleIncludeInactive,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Tìm kiếm */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên danh mục, slug định danh..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 transition placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Tùy chọn lọc & Nút Thêm */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition select-none">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => onToggleIncludeInactive(e.target.checked)}
            className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
          />
          <span>Hiển thị nhóm hàng đã ẩn</span>
        </label>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm nhóm hàng</span>
        </button>
      </div>
    </div>
  );
};
