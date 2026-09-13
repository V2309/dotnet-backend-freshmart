import React from 'react';
import { Layers, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';
import { Category } from '@/types/category';

interface CategoryKpisProps {
  categories: Category[];
}

export const CategoryKpis: React.FC<CategoryKpisProps> = ({ categories }) => {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const totalProductsLinked = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
  const inactiveCount = totalCategories - activeCategories;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1 */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#646B72]">Tổng nhóm hàng</p>
          <p className="text-2xl font-black text-[#212B36] mt-1">{totalCategories}</p>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
            Toàn bộ phân loại
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#646B72]">Đang áp dụng</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCategories}</p>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
            Hiển thị trên POS
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#646B72]">Sản phẩm liên kết</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{totalProductsLinked}</p>
          <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
            Mặt hàng trong danh mục
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <PackageCheck className="w-6 h-6" />
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAEAEA] shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-[#646B72]">Tạm ngưng / Ẩn</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{inactiveCount}</p>
          <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block">
            Không hiện trên POS
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
