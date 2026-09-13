import { create } from 'zustand';
import { employeeService } from '../services/employee.service';
import { getApiErrorMessage } from '../services/apiClient';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFilterParams,
} from '../types/employee';

// ============================================================================
// Zustand Store Quản lý State Nhân viên (Employee Store)
// ============================================================================

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  filterParams: EmployeeFilterParams;

  // Actions
  fetchEmployees: (params?: EmployeeFilterParams, force?: boolean) => Promise<void>;
  createEmployee: (data: CreateEmployeeRequest) => Promise<Employee>;
  updateEmployee: (idOrCode: string, data: UpdateEmployeeRequest) => Promise<Employee>;
  toggleStatus: (idOrCode: string) => Promise<void>;
  resetPin: (idOrCode: string, newPin: string) => Promise<void>;
  deleteEmployee: (idOrCode: string) => Promise<void>;
  setFilter: (filter: Partial<EmployeeFilterParams>) => void;
  clearError: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,
  filterParams: {
    search: '',
    role: undefined,
    isActive: undefined,
    page: 1,
    limit: 50,
  },

  clearError: () => set({ error: null }),

  setFilter: (newFilter) => {
    const updated = { ...get().filterParams, ...newFilter };
    set({ filterParams: updated });
    get().fetchEmployees(updated, true);
  },

  // 1. Tải danh sách nhân viên từ Backend API (Cache-First)
  fetchEmployees: async (params, force = false) => {
    // Nếu đã có dữ liệu và không yêu cầu ép buộc tải lại hoặc đổi bộ lọc -> Dùng ngay cache trong store
    if (get().employees.length > 0 && !force && !params) {
      return;
    }

    set({ isLoading: get().employees.length === 0, error: null });
    try {
      const activeParams = params || get().filterParams;
      const data = await employeeService.getAll(activeParams);
      set({ employees: data, isLoading: false });
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể tải danh sách nhân viên.');
      set({ error: message, isLoading: false });
    }
  },

  // 2. Thêm nhân viên mới
  createEmployee: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await employeeService.create(data);
      set((state) => ({
        employees: [created, ...state.employees],
        isLoading: false,
      }));
      return created;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Thêm nhân viên thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 3. Cập nhật thông tin nhân viên
  updateEmployee: async (idOrCode, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await employeeService.update(idOrCode, data);
      set((state) => ({
        employees: state.employees.map((e) =>
          e.id === updated.id || e.code === updated.code ? updated : e
        ),
        isLoading: false,
      }));
      return updated;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Cập nhật nhân viên thất bại.');
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 4. Khóa / Mở khóa tài khoản nhân viên
  toggleStatus: async (idOrCode) => {
    try {
      const updated = await employeeService.toggleStatus(idOrCode);
      set((state) => ({
        employees: state.employees.map((e) =>
          e.id === updated.id || e.code === updated.code ? updated : e
        ),
      }));
    } catch (err) {
      const message = getApiErrorMessage(err, 'Không thể thay đổi trạng thái nhân viên.');
      set({ error: message });
      throw new Error(message);
    }
  },

  // 5. Cấp lại mã PIN
  resetPin: async (idOrCode, newPin) => {
    try {
      await employeeService.resetPin(idOrCode, newPin);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Cấp lại mã PIN thất bại.');
      set({ error: message });
      throw new Error(message);
    }
  },

  // 6. Xóa nhân viên
  deleteEmployee: async (idOrCode) => {
    try {
      await employeeService.delete(idOrCode);
      set((state) => ({
        employees: state.employees.filter(
          (e) => e.id !== idOrCode && e.code !== idOrCode
        ),
      }));
    } catch (err) {
      const message = getApiErrorMessage(err, 'Xóa nhân viên thất bại.');
      set({ error: message });
      throw new Error(message);
    }
  },
}));
