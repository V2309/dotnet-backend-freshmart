import React, { useState, useEffect } from 'react';
import { X, Layers, AlertCircle } from 'lucide-react';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
  initialData?: Category | null;
  nextSortOrder?: number;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  nextSortOrder = 1,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [sortOrder, setSortOrder] = useState<number>(nextSortOrder);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setIcon(initialData.icon || 'Folder');
      setSortOrder(initialData.sortOrder ?? nextSortOrder);
      setIsActive(initialData.isActive);
    } else {
      setName('');
      setSlug('');
      setIcon('Folder');
      setSortOrder(nextSortOrder);
      setIsActive(true);
    }
    setError(null);
  }, [initialData, isOpen, nextSortOrder]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim() || undefined,
        icon: icon.trim() || 'Folder',
        sortOrder: Number(sortOrder),
        isActive,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? 'Chỉnh sửa nhóm hàng' : 'Thêm mới nhóm hàng'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit ? 'Cập nhật thông tin phân loại' : 'Tạo phân loại sản phẩm mới'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tên nhóm hàng */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tên danh mục / nhóm hàng <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Đồ uống, Rau củ quả, Bánh kẹo..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 font-medium"
            />
          </div>

          {/* Slug định danh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Slug định danh (Tùy chọn)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="VD: drinks, rau-cu-qua, banh-keo..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 font-mono text-xs"
            />
            <p className="text-[10px] text-slate-400 mt-1">Để trống hệ thống sẽ tự sinh slug từ tên nhóm hàng</p>
          </div>

          {/* Thứ tự & Trạng thái */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Thứ tự sắp xếp
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Trạng thái hiển thị
              </label>
              <label className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  {isActive ? 'Đang hoạt động' : 'Tạm ngưng / Ẩn'}
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition active:scale-98 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting && <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></span>}
              <span>{isEdit ? 'Lưu thay đổi' : 'Tạo nhóm hàng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
