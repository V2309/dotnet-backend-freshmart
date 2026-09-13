import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Layers,
  Building2,
  Boxes, 
  Truck, 
  Users, 
  BarChart3, 
  UserCheck, 
  Settings, 
  LogOut,
  ShoppingBag,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { ViewMode } from '../types';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  lowStockCount: number;
  productCount: number;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  lowStockCount,
  productCount,
  isCollapsed = false
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.name || 'Nhân viên';
  const displayCode = user?.code || 'NV000001';
  const initialLetter = displayName.split(' ').pop()?.charAt(0).toUpperCase() || 'U';

  const getRoleLabel = (role?: string) => {
    const r = (role || 'cashier').toLowerCase();
    if (r.includes('admin')) return 'Quản trị viên';
    if (r.includes('manager')) return 'Quản lý';
    if (r.includes('warehouse')) return 'Thủ kho';
    return 'Thu ngân';
  };

  const navItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'pos' as ViewMode,
      label: 'Bán hàng POS',
      icon: Store,
      badge: 'F9',
      highlight: true
    },
    {
      id: 'products' as ViewMode,
      label: 'Sản phẩm',
      icon: Package,
      badge: productCount.toString()
    },
    {
      id: 'categories' as ViewMode,
      label: 'Nhóm hàng',
      icon: Layers,
      badge: null
    },
    {
      id: 'suppliers' as ViewMode,
      label: 'Nhà cung cấp',
      icon: Building2,
      badge: null
    },
    {
      id: 'inventory' as ViewMode,
      label: 'Tồn kho & Sổ kho',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} cảnh báo` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'purchases' as ViewMode,
      label: 'Đơn nhập hàng',
      icon: Truck,
      badge: null
    },
    {
      id: 'customers' as ViewMode,
      label: 'Khách hàng',
      icon: Users,
      badge: null
    },
    {
      id: 'reports' as ViewMode,
      label: 'Báo cáo & Sổ quỹ',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'employees' as ViewMode,
      label: 'Ca & Nhân viên',
      icon: UserCheck,
      badge: null
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside 
      id="main-sidebar" 
      className={`h-screen bg-[#fcfdfe] border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none shadow-xs transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20 min-w-[80px] max-w-[80px]' : 'w-64 min-w-[256px] max-w-[256px]'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className={`border-b border-slate-100 transition-all duration-300 ${
          isCollapsed ? 'p-3 flex flex-col items-center gap-3' : 'p-4 sm:p-5'
        }`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group" title="FreshMart - Trang chủ">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-primary-600 to-primary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden whitespace-nowrap">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none group-hover:text-primary-600 transition-colors">
                    FreshMart
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium mt-1 truncate">
                    Hệ thống POS & Bán lẻ
                  </p>
                </div>
              )}
            </Link>
          </div>
          
          {/* Store status pill */}
          {!isCollapsed ? (
            <div className="mt-3.5 flex items-center justify-between bg-slate-50/90 border border-slate-200/70 px-3 py-2 rounded-xl text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold">Cửa hàng #01</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Trực tuyến
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center py-1" title="Cửa hàng #01 - Trực tuyến">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-100"></span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className={`space-y-1.5 overflow-y-auto max-h-[calc(100vh-270px)] no-scrollbar transition-all duration-300 ${
          isCollapsed ? 'p-2' : 'p-3.5'
        }`}>
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Nghiệp vụ chính
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectView(item.id)}
                title={item.label}
                className={`w-full flex items-center rounded-2xl transition-all duration-200 cursor-pointer relative group ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-3 text-[13.5px]'
                } ${
                  isActive
                    ? 'bg-white text-primary-600 font-semibold border border-primary-200/80 shadow-xs shadow-primary-500/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium border border-transparent'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 truncate'}`}>
                  <div className={`p-0.5 rounded-lg transition-colors ${isActive ? 'text-primary-600' : 'text-slate-500 group-hover:text-slate-900'}`}>
                    <Icon className="w-5 h-5 shrink-0 stroke-[2.2]" />
                  </div>
                  {!isCollapsed && (
                    <span className="truncate tracking-tight">{item.label}</span>
                  )}
                </div>

                {/* Badge in expanded vs collapsed mode */}
                {item.badge && (
                  !isCollapsed ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border border-primary-200/60'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 border border-slate-200/70'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500"></span>
                  )
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card & Action Section */}
      <div className={`border-t border-slate-100 bg-[#f8fafc]/90 transition-all duration-300 ${
        isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3'
      }`}>
        {!isCollapsed ? (
          <div>
            {/* User Profile Mini Card */}
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200/70 shadow-2xs mb-2">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {initialLetter}
              </div>
              <div className="flex-1 overflow-hidden leading-tight">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono font-bold text-primary-600">{displayCode}</span>
                  <span className="text-[9px] text-slate-300">•</span>
                  <span className="text-[10px] text-slate-500 truncate">{getRoleLabel(user?.role)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-1.5">
              <button 
                id="sidebar-settings-btn"
                onClick={() => navigate('/employees')}
                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-2 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
                title="Quản lý tài khoản & ca trực"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Cài đặt</span>
              </button>
              <button 
                id="sidebar-logout-btn"
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-2 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đổi ca</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <div 
              className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs"
              title={`${displayName} (${displayCode})`}
            >
              {initialLetter}
            </div>
            <button 
              id="sidebar-settings-btn"
              onClick={() => navigate('/employees')}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
              title="Cài đặt hệ thống"
            >
              <Settings className="w-4 h-4 text-slate-500" />
            </button>
            <button 
              id="sidebar-logout-btn"
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
              title="Đăng xuất / Đổi ca"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
