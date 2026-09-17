import { create } from 'zustand';
import { productService } from '../services/product.service';
import { getApiErrorMessage } from '../services/apiClient';
import type {
  Product,
  ProductFilterParams,
  CreateProductRequest,
  UpdateProductRequest,
  QuickStockRequest,
} from '../types/product';

// ============================================================================
// Zustand Store Quản lý Sản phẩm (Product Store)
// Tuân thủ quy tắc Cache-First & Error Handling chuẩn
// ============================================================================

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filterParams: ProductFilterParams;

  // Actions
  fetchProducts: (params?: ProductFilterParams, force?: boolean) => Promise<void>;
  getProductById: (id: string) => Promise<Product>;
  getProductByBarcode: (barcode: string) => Promise<Product>;
  createProduct: (data: CreateProductRequest) => Promise<Product>;
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<Product>;
  quickAdjustStock: (id: string, data: QuickStockRequest) => Promise<Product>;
  toggleStatus: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setFilter: (filter: Partial<ProductFilterParams>) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  filterParams: {
    search: '',
    categoryId: undefined,
    categorySlug: undefined,
    supplierId: undefined,
    status: undefined,
    isActive: undefined,
    sortBy: 'newest',
    page: 1,
    limit: 50,
  },

  clearError: () => set({ error: null }),

  setFilter: (newFilter) => {
    const updated = { ...get().filterParams, ...newFilter };
    set({ filterParams: updated });
    get().fetchProducts(updated, true);
  },

  // 1. Tải danh sách sản phẩm (Cache-First)
  fetchProducts: async (params, force = false) => {
    if (get().products.length > 0 && !force && !params) {
      return;
    }

    set({ isLoading: get().products.length === 0, error: null });
    try {
      const activeParams = params || get().filterParams;
      const data = await productService.getAll(activeParams);
      set({ products: data, isLoading: false });
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể tải danh sách sản phẩm.');
      set({ error: message, isLoading: false });
    }
  },

  // 2. Lấy chi tiết 1 sản phẩm
  getProductById: async (id) => {
    const cached = get().products.find((p) => p.id === id);
    if (cached) return cached;

    try {
      return await productService.getById(id);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không tìm thấy sản phẩm.');
      throw new Error(message);
    }
  },

  // 3. Quét mã vạch Barcode
  getProductByBarcode: async (barcode) => {
    try {
      return await productService.getByBarcode(barcode);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không tìm thấy sản phẩm với mã vạch này.');
      throw new Error(message);
    }
  },

  // 4. Thêm sản phẩm mới
  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await productService.create(data);
      set((state) => ({
        products: [created, ...state.products],
        isLoading: false,
      }));
      return created;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Thêm sản phẩm thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 5. Cập nhật thông tin sản phẩm
  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await productService.update(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Cập nhật sản phẩm thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 6. Cập nhật nhanh số lượng kho
  quickAdjustStock: async (id, data) => {
    try {
      const updated = await productService.quickAdjustStock(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Cập nhật tồn kho thất bại.');
      set({ error: message });
      throw new Error(message);
    }
  },

  // 7. Bật / Tắt trạng thái kinh doanh
  toggleStatus: async (id) => {
    try {
      const updated = await productService.toggleStatus(id);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }));
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể đổi trạng thái sản phẩm.');
      set({ error: message });
      throw new Error(message);
    }
  },

  // 8. Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      await productService.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (err) {
      const message = getApiErrorMessage(err, 'Xóa sản phẩm thất bại.');
      set({ error: message });
      throw new Error(message);
    }
  },
}));
