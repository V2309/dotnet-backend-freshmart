import React, { useState, useEffect, useMemo } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import { sound } from '@/utils/sound';
import {
  CategoryKpis,
  CategoryFilterBar,
  CategoryTable,
  CategoryModal,
} from './categories';

export const CategoriesView: React.FC = () => {
  const {
    categories,
    isLoading,
    error,
    includeInactive,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setIncludeInactive,
  } = useCategoryStore();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Lọc theo tìm kiếm cục bộ
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase().trim();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setShowModal(true);
    sound.playPop();
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setShowModal(true);
    sound.playPop();
  };

  const handleDelete = async (cat: Category) => {
    if (cat.productCount > 0) {
      alert(`Không thể xóa danh mục "${cat.name}" vì đang có ${cat.productCount} sản phẩm liên kết.`);
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhóm hàng "${cat.name}" (${cat.slug})?`)) {
      return;
    }

    try {
      await deleteCategory(cat.id);
      sound.playPop();
    } catch (err: any) {
      alert(err.message || 'Xóa danh mục thất bại');
    }
  };

  const handleSubmitModal = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data as UpdateCategoryRequest);
    } else {
      await createCategory(data as CreateCategoryRequest);
    }
    sound.playSuccessChime();
  };

  return (
    <div
      id="categories-view"
      className="p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] pb-16 select-none animate-in fade-in-50 duration-200"
    >
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EAEAEA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#212B36] tracking-tight">
              Danh mục nhóm hàng hóa
            </h1>
            <span className="bg-[#FFF5E9] text-[#FE9F43] border border-[#FED8AB] text-xs font-black px-2.5 py-0.5 rounded-full">
              {categories.length} phân loại
            </span>
          </div>
          <p className="text-xs text-[#646B72] mt-0.5 font-medium">
            Quản lý cây danh mục sản phẩm, cấu hình hiển thị và sắp xếp các nhóm hàng trên quầy POS
          </p>
        </div>
      </div>

      {/* 2. KPIs Summary */}
      <CategoryKpis categories={categories} />

      {/* 3. Filter Bar */}
      <CategoryFilterBar
        search={search}
        onSearchChange={setSearch}
        includeInactive={includeInactive}
        onToggleIncludeInactive={setIncludeInactive}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* 4. Table */}
      <CategoryTable
        categories={filteredCategories}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      {/* 5. Modal Add/Edit */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitModal}
        initialData={editingCategory}
        nextSortOrder={categories.length + 1}
      />
    </div>
  );
};

export default CategoriesView;
