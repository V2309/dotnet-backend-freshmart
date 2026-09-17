import React from 'react';
import { Package, DollarSign, AlertTriangle, XCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface InventoryKpiStatsProps {
  totalStockItems: number;
  totalStockValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export const InventoryKpiStats: React.FC<InventoryKpiStatsProps> = ({
  totalStockItems,
  totalStockValue,
  lowStockCount,
  outOfStockCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng số lượng tồn */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Tổng lượng tồn kho</span>
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-[#212B36] mt-2 tabular-nums">
          {totalStockItems.toLocaleString('vi-VN')}
        </p>
        <span className="text-[11px] text-slate-400 font-medium">Đơn vị sản phẩm</span>
      </div>

      {/* 2. Tổng giá trị vốn tồn kho */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Tổng giá trị vốn tồn</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-emerald-700 mt-2 tabular-nums">
          {formatCurrency(totalStockValue)}
        </p>
        <span className="text-[11px] text-emerald-700/80 font-medium">Tính theo giá vốn nhập</span>
      </div>

      {/* 3. Cảnh báo sắp hết hàng */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Sắp hết hàng</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-amber-600 mt-2 tabular-nums">
          {lowStockCount}
        </p>
        <span className="text-[11px] text-amber-700/80 font-medium">Dưới định mức tối thiểu</span>
      </div>

      {/* 4. Hết hàng */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-2xs hover:shadow-xs transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#646B72]">Đã hết hàng</span>
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-red-600 mt-2 tabular-nums">
          {outOfStockCount}
        </p>
        <span className="text-[11px] text-red-700/80 font-medium">Cần tạo phiếu nhập gấp</span>
      </div>
    </div>
  );
};
