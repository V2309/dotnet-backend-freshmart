import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  IdCard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type LoginMode = 'account' | 'pin_code';

export const LoginPage: React.FC = () => {
  const { login, loginPin, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'account' (Email / SĐT) hoặc 'pin_code' (Mã nhân viên + PIN)
  const [loginMode, setLoginMode] = useState<LoginMode>('account');

  // Form State: Tab Email / SĐT
  const [emailOrPhone, setEmailOrPhone] = useState('admin@freshmart.vn');
  const [password, setPassword] = useState('123456');

  // Form State: Tab Mã nhân viên
  const [employeeCode, setEmployeeCode] = useState('NV000001');
  const [pinCode, setPinCode] = useState('1234');

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname;

  const handleModeChange = (mode: LoginMode) => {
    setLoginMode(mode);
    setLocalError(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    try {
      let loggedUser;
      if (loginMode === 'account') {
        // Đăng nhập bằng Email hoặc Số điện thoại
        loggedUser = await login(emailOrPhone, password);
      } else {
        // Đăng nhập bằng Mã nhân viên (NVxxxxxx) + Mã PIN
        loggedUser = await loginPin(employeeCode, pinCode);
      }

      // Điều hướng thông minh
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'cashier') {
        navigate('/pos', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setLocalError(err.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    }
  };

  const handleQuickFill = (mode: LoginMode, idVal: string, pinVal: string) => {
    setLoginMode(mode);
    if (mode === 'account') {
      setEmailOrPhone(idVal);
      setPassword(pinVal);
    } else {
      setEmployeeCode(idVal);
      setPinCode(pinVal);
    }
    setLocalError(null);
    clearError();
  };

  const activeError = localError || error;

  return (
    <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl text-slate-900">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Đăng nhập FreshMart</h2>
        <p className="text-xs text-slate-500 mt-1.5">Hệ thống Quản lý & Bán hàng POS Siêu thị</p>
      </div>

      {/* Tabs chọn phương thức đăng nhập */}
      <div className="flex p-1 mb-6 bg-slate-100 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={() => handleModeChange('account')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            loginMode === 'account'
              ? 'bg-white text-primary-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email / SĐT</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('pin_code')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            loginMode === 'pin_code'
              ? 'bg-white text-emerald-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <IdCard className="w-3.5 h-3.5" />
          <span>Mã Nhân Viên</span>
        </button>
      </div>

      {/* Alert hiển thị lỗi từ Backend .NET */}
      {activeError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{activeError}</div>
        </div>
      )}

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {loginMode === 'account' ? (
          /* TAB 1: EMAIL HOẶC SỐ ĐIỆN THOẠI */
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email hoặc Số điện thoại
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    if (activeError) {
                      setLocalError(null);
                      clearError();
                    }
                  }}
                  placeholder="admin@freshmart.vn hoặc 0912345678"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (activeError) {
                      setLocalError(null);
                      clearError();
                    }
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* TAB 2: MÃ NHÂN VIÊN + MÃ PIN (POS QUICK LOGIN) */
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mã định danh nhân viên
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={employeeCode}
                  onChange={(e) => {
                    setEmployeeCode(e.target.value.toUpperCase());
                    if (activeError) {
                      setLocalError(null);
                      clearError();
                    }
                  }}
                  placeholder="NV000001, NV000002..."
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mã PIN</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={10}
                  value={pinCode}
                  onChange={(e) => {
                    setPinCode(e.target.value);
                    if (activeError) {
                      setLocalError(null);
                      clearError();
                    }
                  }}
                  placeholder="Mã PIN 4-6 số"
                  className="w-full pl-10 pr-10 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs font-bold tracking-widest text-emerald-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
            <span>Ghi nhớ phiên</span>
          </label>
          <a href="#forgot" className="text-primary-600 hover:underline font-semibold">
            {loginMode === 'account' ? 'Quên mật khẩu?' : 'Quên mã PIN?'}
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 ${
            loginMode === 'account'
              ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>
                {loginMode === 'account' ? 'Đăng nhập Quản trị' : 'Đăng nhập Ca trực POS'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Credentials */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
          Điền nhanh tài khoản mẫu
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickFill('account', 'admin@freshmart.vn', '123456')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition ${
              loginMode === 'account'
                ? 'border-primary-300 bg-primary-100/70 text-primary-900 font-bold'
                : 'border-primary-200 bg-primary-50/70 hover:bg-primary-100/70 text-primary-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
            <span>Quản trị viên (Email)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('pin_code', 'NV000001', '1234')}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition ${
              loginMode === 'pin_code'
                ? 'border-emerald-300 bg-emerald-100/70 text-emerald-900 font-bold'
                : 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thu ngân (Mã số)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
