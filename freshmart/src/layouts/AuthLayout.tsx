import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-screen flex bg-slate-900 text-white select-none">
      {/* Left side decorative branding banner */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-linear-to-br from-slate-950 via-slate-900 to-primary-950 border-r border-slate-800/80 overflow-hidden">
        {/* Background glow decorations */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Logo header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/30 group-hover:scale-105 transition">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block">FreshMart POS</span>
              <span className="text-xs text-slate-400 font-medium">Hệ thống Quản lý Bán lẻ & Siêu thị 4.0</span>
            </div>
          </Link>
        </div>

        {/* Hero message & highlights */}
        <div className="relative z-10 my-auto space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Tối ưu tốc độ bán hàng tại quầy</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Giải pháp Bán hàng Siêu tốc, Quản lý kho hàng Chuẩn xác
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Tích hợp thanh toán quét mã VietQR tự động, quản lý hàng hóa, sổ quỹ tài chính và phân quyền thu ngân đa ca chuyên nghiệp.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="text-sm font-bold text-white">An toàn dữ liệu</h4>
              <p className="text-xs text-slate-400 mt-1">Đồng bộ ca bán hàng, đối soát dòng tiền chuẩn xác</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <BarChart2 className="w-6 h-6 text-primary-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Báo cáo tức thì</h4>
              <p className="text-xs text-slate-400 mt-1">Biểu đồ doanh thu và mặt hàng bán chạy real-time</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} FreshMart Retail POS</span>
          <span>Phiên bản v2.5.0 Production</span>
        </div>
      </div>

      {/* Right side form area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-900">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
