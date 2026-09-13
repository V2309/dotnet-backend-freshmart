import React from 'react';
import { Search, Plus } from 'lucide-react';
import { SupplierFilterParams } from '@/types/supplier';

interface SupplierFilterBarProps {
  filterParams: SupplierFilterParams;
  onFilterChange: (params: Partial<SupplierFilterParams>) => void;
  onOpenAddModal: () => void;
}

export const SupplierFilterBar: React.FC<SupplierFilterBarProps> = ({
  filterParams,
  onFilterChange,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Tìm kiếm */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterParams.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Tìm theo tên NCC, mã NCC, SĐT, người liên hệ..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 transition placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Tùy chọn lọc trạng thái & Nút Thêm */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => onFilterChange({ isActive: undefined })}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterParams.isActive === undefined
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onFilterChange({ isActive: true })}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterParams.isActive === true
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Đang hợp tác
          </button>
          <button
            onClick={() => onFilterChange({ isActive: false })}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filterParams.isActive === false
                ? 'bg-white text-rose-700 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tạm dừng
          </button>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm nhà cung cấp</span>
        </button>
      </div>
    </div>
  );
};
