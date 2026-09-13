import React from 'react';
import { Edit2, Trash2, Folder, Layers, Coffee, Apple, Milk, Cookie, Sparkles } from 'lucide-react';
import { Category } from '@/types/category';

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

// Icon helper
const getCategoryIcon = (iconName?: string | null) => {
  const icon = (iconName || '').toLowerCase();
  if (icon.includes('coffee') || icon.includes('drink')) return <Coffee className="w-5 h-5 text-amber-600" />;
  if (icon.includes('apple') || icon.includes('fruit')) return <Apple className="w-5 h-5 text-rose-600" />;
  if (icon.includes('milk') || icon.includes('dairy')) return <Milk className="w-5 h-5 text-blue-600" />;
  if (icon.includes('cookie') || icon.includes('bakery')) return <Cookie className="w-5 h-5 text-orange-600" />;
  if (icon.includes('sparkle')) return <Sparkles className="w-5 h-5 text-purple-600" />;
  return <Folder className="w-5 h-5 text-primary-600" />;
};

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-12 text-center shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Đang tải danh sách danh mục...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Layers className="w-8 h-8" />
        </div>
        <p className="text-base font-bold text-slate-800">Không tìm thấy nhóm hàng nào</p>
        <p className="text-xs text-slate-500 mt-1">Hãy thêm danh mục mới hoặc thay đổi bộ lọc tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center w-16">STT</th>
              <th className="py-3.5 px-4">Tên nhóm hàng</th>
              <th className="py-3.5 px-4">Định danh (Slug)</th>
              <th className="py-3.5 px-4 text-center">Số sản phẩm</th>
              <th className="py-3.5 px-4 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {categories.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-slate-50/60 transition group">
                {/* Số thứ tự STT */}
                <td className="py-3.5 px-4 text-center font-bold text-slate-500 text-xs">
                  {index + 1}
                </td>

                {/* Tên nhóm hàng */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.icon || cat.slug)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{cat.name}</p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('vi-VN') : ''}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="py-3.5 px-4">
                  <code className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono border border-slate-200">
                    {cat.slug}
                  </code>
                </td>

                {/* Số lượng sản phẩm */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {cat.productCount || 0} mặt hàng
                  </span>
                </td>

                {/* Trạng thái */}
                <td className="py-3.5 px-4 text-center">
                  {cat.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Đang ẩn
                    </span>
                  )}
                </td>

                {/* Thao tác */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(cat)}
                      title="Chỉnh sửa danh mục"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cat)}
                      title="Xóa danh mục"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
