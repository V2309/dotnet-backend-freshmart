import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types/auth';

export type { User };

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (identifier: string, pin: string) => Promise<User>;
  loginPin: (employeeCode: string, pin: string) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginPin,
    logout,
    clearError,
    fetchCurrentUser,
  } = useAuthStore();

  // Kiểm tra phiên đăng nhập khi khởi tạo app
  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token, user, fetchCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        isLoading,
        error,
        login,
        loginPin,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
