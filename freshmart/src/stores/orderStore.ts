import { create } from 'zustand';
import { orderService } from '../services/order.service';
import { getApiErrorMessage } from '../services/apiClient';
import type {
  Order,
  CheckoutRequest,
  OrderFilterParams,
  VietQrResponse,
} from '../types/order';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  vietQrData: VietQrResponse | null;
  isLoading: boolean;
  isCheckingOut: boolean;
  error: string | null;
  filterParams: OrderFilterParams;

  // Actions
  fetchOrders: (params?: OrderFilterParams, force?: boolean) => Promise<void>;
  getOrderById: (id: string) => Promise<Order>;
  getOrderByCode: (code: string) => Promise<Order>;
  checkout: (data: CheckoutRequest) => Promise<Order>;
  cancelOrder: (id: string, reason?: string) => Promise<Order>;
  fetchVietQr: (amount: number, orderCode?: string) => Promise<VietQrResponse>;
  setFilter: (filter: Partial<OrderFilterParams>) => void;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  vietQrData: null,
  isLoading: false,
  isCheckingOut: false,
  error: null,
  filterParams: {
    page: 1,
    limit: 50,
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),

  setFilter: (newFilter) => {
    const updated = { ...get().filterParams, ...newFilter };
    set({ filterParams: updated });
    get().fetchOrders(updated, true);
  },

  fetchOrders: async (params, force = false) => {
    if (!force && get().orders.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const data = await orderService.getAll(params || get().filterParams);
      set({ orders: data, isLoading: false });
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Không thể tải danh sách đơn hàng');
      set({ error: msg, isLoading: false });
    }
  },

  getOrderById: async (id) => {
    const cached = get().orders.find((o) => o.id === id);
    if (cached) return cached;

    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getById(id);
      set({ isLoading: false });
      return order;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Không thể tải thông tin đơn hàng');
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  getOrderByCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getByCode(code);
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Không thể tìm thấy hóa đơn');
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  checkout: async (data) => {
    set({ isCheckingOut: true, error: null });
    try {
      const newOrder = await orderService.checkout(data);
      set((state) => ({
        currentOrder: newOrder,
        orders: [newOrder, ...state.orders],
        isCheckingOut: false,
      }));
      return newOrder;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Thanh toán đơn hàng thất bại');
      set({ error: msg, isCheckingOut: false });
      throw new Error(msg);
    }
  },

  cancelOrder: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      const cancelled = await orderService.cancelOrder(id, reason);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? cancelled : o)),
        currentOrder: state.currentOrder?.id === id ? cancelled : state.currentOrder,
        isLoading: false,
      }));
      return cancelled;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Hủy đơn hàng thất bại');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  fetchVietQr: async (amount, orderCode) => {
    try {
      const qr = await orderService.getVietQr(amount, orderCode);
      set({ vietQrData: qr });
      return qr;
    } catch (err) {
      console.warn('Lỗi lấy mã VietQR:', err);
      throw err;
    }
  },
}));
