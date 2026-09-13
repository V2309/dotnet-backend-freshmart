import { create } from 'zustand';
import { supplierService } from '../services/supplier.service';
import { getApiErrorMessage } from '../services/apiClient';
import type {
  Supplier,
  SupplierFilterParams,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '../types/supplier';

// ============================================================================
// Zustand Store Quản lý Nhà cung cấp (Supplier Store)
// ============================================================================

interface SupplierState {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  filterParams: SupplierFilterParams;

  // Actions
  fetchSuppliers: (params?: SupplierFilterParams, force?: boolean) => Promise<void>;
  createSupplier: (data: CreateSupplierRequest) => Promise<Supplier>;
  updateSupplier: (id: string, data: UpdateSupplierRequest) => Promise<Supplier>;
  toggleStatus: (id: string) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  setFilter: (filter: Partial<SupplierFilterParams>) => void;
  clearError: () => void;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  isLoading: false,
  error: null,
  filterParams: {
    search: '',
    isActive: undefined,
    page: 1,
    limit: 50,
  },

  clearError: () => set({ error: null }),

  setFilter: (newFilter) => {
    const updated = { ...get().filterParams, ...newFilter };
    set({ filterParams: updated });
    get().fetchSuppliers(updated);
  },

  // 1. Tải danh sách nhà cung cấp (Cache-First)
  fetchSuppliers: async (params, force = false) => {
    // Nếu đã có dữ liệu và không yêu cầu ép buộc tải lại hoặc đổi bộ lọc -> Dùng ngay cache trong store
    if (get().suppliers.length > 0 && !force && !params) {
      return;
    }

    set({ isLoading: get().suppliers.length === 0, error: null });
    try {
      const activeParams = params || get().filterParams;
      const data = await supplierService.getAll(activeParams);
      set({ suppliers: data, isLoading: false });
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể tải danh sách nhà cung cấp.');
      set({ error: message, isLoading: false });
    }
  },

  // 2. Tạo nhà cung cấp mới
  createSupplier: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await supplierService.create(data);
      set((state) => ({
        suppliers: [created, ...state.suppliers],
        isLoading: false,
      }));
      return created;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Thêm nhà cung cấp thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 3. Cập nhật nhà cung cấp
  updateSupplier: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await supplierService.update(id, data);
      set((state) => ({
        suppliers: state.suppliers.map((s) => (s.id === id ? updated : s)),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Cập nhật nhà cung cấp thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 4. Bật / Tắt trạng thái hợp tác
  toggleStatus: async (id) => {
    try {
      const updated = await supplierService.toggleStatus(id);
      set((state) => ({
        suppliers: state.suppliers.map((s) => (s.id === id ? updated : s)),
      }));
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể thay đổi trạng thái hợp tác.');
      set({ error: message });
      throw new Error(message);
    }
  },

  // 5. Xóa nhà cung cấp
  deleteSupplier: async (id) => {
    try {
      await supplierService.delete(id);
      set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id),
      }));
    } catch (err) {
      const message = getApiErrorMessage(err, 'Xóa nhà cung cấp thất bại.');
      set({ error: message });
      throw new Error(message);
    }
  },
}));
