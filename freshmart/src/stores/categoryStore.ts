import { create } from 'zustand';
import { categoryService } from '../services/category.service';
import { getApiErrorMessage } from '../services/apiClient';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/category';

// ============================================================================
// Zustand Store Quản lý Danh mục hàng hóa (Category Store)
// ============================================================================

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  includeInactive: boolean;

  // Actions
  fetchCategories: (includeInactive?: boolean) => Promise<void>;
  createCategory: (data: CreateCategoryRequest) => Promise<Category>;
  updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  setIncludeInactive: (include: boolean) => void;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  includeInactive: false,

  clearError: () => set({ error: null }),

  setIncludeInactive: (include) => {
    set({ includeInactive: include });
    get().fetchCategories(include);
  },

  // 1. Tải danh sách danh mục từ Backend (Cache-First)
  fetchCategories: async (includeInactive, force = false) => {
    // Nếu đã có dữ liệu trong store và không yêu cầu ép buộc tải lại -> Không hiện loading
    if (get().categories.length > 0 && !force) {
      return;
    }

    set({ isLoading: get().categories.length === 0, error: null });
    try {
      const activeFlag = includeInactive !== undefined ? includeInactive : get().includeInactive;
      const data = await categoryService.getAll(activeFlag);
      set({ categories: data, isLoading: false });
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể tải danh sách danh mục.');
      set({ error: message, isLoading: false });
    }
  },

  // 2. Thêm mới danh mục
  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await categoryService.create(data);
      set((state) => ({
        categories: [...state.categories, created],
        isLoading: false,
      }));
      return created;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Thêm danh mục thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 3. Cập nhật danh mục
  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await categoryService.update(id, data);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updated : c)),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Cập nhật danh mục thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 4. Xóa danh mục
  deleteCategory: async (id) => {
    try {
      await categoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (err) {
      const message = getApiErrorMessage(err, 'Xóa danh mục thất bại.');
      set({ error: message });
      throw new Error(message);
    }
  },
}));
