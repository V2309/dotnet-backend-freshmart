import { create } from 'zustand';
import { shiftService } from '../services/shift.service';
import { getApiErrorMessage } from '../services/apiClient';
import type {
  Shift,
  OpenShiftRequest,
  CloseShiftRequest,
  ShiftReport,
  ShiftFilterParams,
} from '../types/shift';

// ============================================================================
// Zustand Store Quản lý Ca làm việc & Két tiền (Shift Store)
// ============================================================================

interface ShiftState {
  shifts: Shift[];
  currentShift: Shift | null;
  activeReport: ShiftReport | null;
  isLoading: boolean;
  isReportLoading: boolean;
  error: string | null;
  filterParams: ShiftFilterParams;

  // Actions
  fetchCurrentShift: (employeeId?: string) => Promise<Shift | null>;
  fetchShifts: (params?: ShiftFilterParams, force?: boolean) => Promise<void>;
  getShiftById: (id: string) => Promise<Shift>;
  fetchShiftReport: (id: string) => Promise<ShiftReport>;
  openShift: (data: OpenShiftRequest) => Promise<Shift>;
  closeShift: (id: string, data: CloseShiftRequest) => Promise<Shift>;
  setFilter: (filter: Partial<ShiftFilterParams>) => void;
  clearError: () => void;
  clearReport: () => void;
}

export const useShiftStore = create<ShiftState>((set, get) => ({
  shifts: [],
  currentShift: null,
  activeReport: null,
  isLoading: false,
  isReportLoading: false,
  error: null,
  filterParams: {},

  clearError: () => set({ error: null }),
  clearReport: () => set({ activeReport: null }),

  setFilter: (newFilter) => {
    const updated = { ...get().filterParams, ...newFilter };
    set({ filterParams: updated });
    get().fetchShifts(updated, true);
  },

  // 1. Lấy ca trực hiện tại
  fetchCurrentShift: async (employeeId) => {
    try {
      const current = await shiftService.getCurrentShift(employeeId);
      set({ currentShift: current });
      return current;
    } catch (err) {
      console.warn('Không thể lấy ca trực hiện tại:', err);
      return null;
    }
  },

  // 2. Lấy danh sách lịch sử ca làm việc
  fetchShifts: async (params, force = false) => {
    if (!force && get().shifts.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const data = await shiftService.getAll(params || get().filterParams);
      set({ shifts: data, isLoading: false });
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Không thể tải danh sách ca làm việc');
      set({ error: msg, isLoading: false });
    }
  },

  // 3. Lấy chi tiết 1 ca
  getShiftById: async (id) => {
    const cached = get().shifts.find((s) => s.id === id);
    if (cached) return cached;

    set({ isLoading: true, error: null });
    try {
      const shift = await shiftService.getById(id);
      set({ isLoading: false });
      return shift;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Không thể tải thông tin ca làm việc');
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  // 4. Lấy báo cáo tổng kết ca
  fetchShiftReport: async (id) => {
    set({ isReportLoading: true, error: null });
    try {
      const report = await shiftService.getReport(id);
      set({ activeReport: report, isReportLoading: false });
      return report;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Không thể tải báo cáo ca làm việc');
      set({ error: msg, isReportLoading: false });
      throw err;
    }
  },

  // 5. Mở ca làm việc mới
  openShift: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newShift = await shiftService.openShift(data);
      set((state) => ({
        currentShift: newShift,
        shifts: [newShift, ...state.shifts],
        isLoading: false,
      }));
      return newShift;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Mở ca làm việc thất bại');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  // 6. Chốt / Đóng ca làm việc
  closeShift: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const closedShift = await shiftService.closeShift(id, data);
      set((state) => ({
        currentShift: state.currentShift?.id === id ? null : state.currentShift,
        shifts: state.shifts.map((s) => (s.id === id ? closedShift : s)),
        isLoading: false,
      }));
      return closedShift;
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Chốt ca làm việc thất bại');
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },
}));
