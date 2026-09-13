import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Store, LayoutDashboard, ShieldCheck, Sparkles, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const MainLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none block">FreshMart</span>
              <span className="text-[11px] text-slate-500 font-medium">Hệ thống Siêu thị & Bán lẻ POS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-100/80 transition"
            >
              Trang chủ
            </Link>
            <Link
              to="/dashboard"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-100/80 transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-primary-600" />
              Tổng quan
            </Link>
            <Link
              to="/pos"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-100/80 transition flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-emerald-600" />
              Bán hàng POS
            </Link>
            <Link
              to="/products"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-100/80 transition"
            >
              Kho hàng
            </Link>
          </nav>

          {/* User Auth actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-none">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 capitalize">{user?.role}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition"
                >
                  <span>Vào hệ thống</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title="Đăng xuất"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Main Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
              F
            </div>
            <span className="font-semibold text-slate-800">FreshMart POS System</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <Link to="/pos" className="hover:text-primary-600 transition">Thu ngân POS</Link>
            <Link to="/dashboard" className="hover:text-primary-600 transition">Bảng điều khiển</Link>
            <Link to="/login" className="hover:text-primary-600 transition">Đăng nhập</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
