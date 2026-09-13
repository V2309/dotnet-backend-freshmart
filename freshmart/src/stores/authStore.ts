import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import { getApiErrorMessage } from '../services/apiClient';
import type { User, UserRole } from '../types/auth';

// ============================================================================
// Zustand Store Quản lý State Xác thực người dùng (Auth Store)
// ============================================================================

interface AuthState {
  user: User | null;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (identifier: string, pin: string) => Promise<User>;
  loginPin: (employeeCode: string, pin: string) => Promise<User>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

// Helper chuẩn hóa vai trò từ Backend ('Admin', 'Cashier', 'StoreManager') sang Frontend ('admin', 'cashier', 'manager')
const normalizeRole = (roleStr: string): UserRole => {
  const lower = roleStr.toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('cashier')) return 'cashier';
  if (lower.includes('manager')) return 'manager';
  if (lower.includes('warehouse')) return 'warehouse_staff';
  return 'cashier';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // 1. Đăng nhập thông thường (Email / SĐT / Code + Mật khẩu/PIN)
      login: async (identifier: string, pin: string): Promise<User> => {
        set({ isLoading: true, error: null });
        try {
          const authData = await authService.login({ identifier, pin });

          const user: User = {
            id: authData.employee.id,
            code: authData.employee.code,
            name: authData.employee.name,
            email: authData.employee.email,
            phone: authData.employee.phone,
            role: normalizeRole(authData.employee.role),
            isActive: authData.employee.isActive,
          };

          // Lưu token riêng vào localStorage để apiClient interceptor đọc nhanh
          localStorage.setItem('freshmart_auth_token', authData.token);
          localStorage.setItem('freshmart_auth_user', JSON.stringify(user));

          set({
            user,
            token: authData.token,
            expiresAt: authData.expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return user;
        } catch (err) {
          const message = getApiErrorMessage(err, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      // 2. Đăng nhập nhanh tại POS bằng Mã NV + PIN
      loginPin: async (employeeCode: string, pin: string): Promise<User> => {
        set({ isLoading: true, error: null });
        try {
          const authData = await authService.loginPin({ employeeCode, pin });

          const user: User = {
            id: authData.employee.id,
            code: authData.employee.code,
            name: authData.employee.name,
            email: authData.employee.email,
            phone: authData.employee.phone,
            role: normalizeRole(authData.employee.role),
            isActive: authData.employee.isActive,
          };

          localStorage.setItem('freshmart_auth_token', authData.token);
          localStorage.setItem('freshmart_auth_user', JSON.stringify(user));

          set({
            user,
            token: authData.token,
            expiresAt: authData.expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return user;
        } catch (err) {
          const message = getApiErrorMessage(err, 'Mã nhân viên hoặc mã PIN không chính xác.');
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      // 3. Tải thông tin người dùng hiện tại từ token
      fetchCurrentUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const currentDto = await authService.getCurrentUser();
          const currentUser: User = {
            id: currentDto.id,
            code: currentDto.code,
            name: currentDto.name,
            email: currentDto.email,
            role: normalizeRole(currentDto.role),
          };

          set({ user: currentUser, isAuthenticated: true });
        } catch {
          // Token không còn hợp lệ -> logout
          get().logout();
        }
      },

      // 4. Đăng xuất
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          localStorage.removeItem('freshmart_auth_token');
          localStorage.removeItem('freshmart_auth_user');
          set({
            user: null,
            token: null,
            expiresAt: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },
    }),
    {
      name: 'freshmart_auth_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
