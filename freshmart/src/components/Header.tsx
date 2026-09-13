import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Maximize,
  Minimize,
  Barcode,
  Calculator,
  Keyboard,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ViewMode, NotificationItem, CashierShift } from '../types';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  currentView: ViewMode;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  currentShift: CashierShift;
  onOpenSearch: () => void;
  onNavigateToPOS: () => void;
  onOpenCalculator?: () => void;
  onOpenHeldOrders?: () => void;
  onOpenHotkeys?: () => void;
  heldOrdersCount?: number;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  currentShift,
  onOpenSearch,
  onNavigateToPOS,
  onOpenCalculator,
  onOpenHeldOrders,
  onOpenHotkeys,
  heldOrdersCount = 0,
  isSidebarCollapsed = false,
  onToggleSidebar
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Lấy tên và vai trò hiển thị
  const displayName = user?.name || currentShift.cashierName || 'Nhân viên';
  const displayCode = user?.code || 'NV000001';
  
  const getRoleBadge = (role?: string) => {
    const r = (role || 'cashier').toLowerCase();
    if (r.includes('admin')) return { label: 'Quản trị viên', bg: 'bg-primary-50 text-primary-700 border-primary-200' };
    if (r.includes('manager')) return { label: 'Quản lý cửa hàng', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (r.includes('warehouse')) return { label: 'Thủ kho', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Thu ngân POS', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const roleInfo = getRoleBadge(user?.role);
  const initialLetter = displayName.split(' ').pop()?.charAt(0).toUpperCase() || 'U';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header 
      id="top-header" 
      className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-5 flex items-center justify-between shrink-0 z-20 shadow-2xs select-none"
    >
      {/* Left: Sidebar Toggle Button + Breadcrumbs and Store Tag */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-[#FFF5E9] border border-transparent hover:border-[#FED8AB] transition cursor-pointer"
            title={isSidebarCollapsed ? 'Mở rộng menu (Sidebar)' : 'Thu gọn menu (Sidebar)'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Branch / Store Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50/90 border border-slate-200/80 px-3 py-1 rounded-full text-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700">Chi nhánh #01 (Quận 1, TP.HCM)</span>
        </div>
      </div>

      {/* Right: Universal Search, POS Tools, Fullscreen, Notifications, User Badge */}
      <div className="flex items-center gap-2">
        {/* Global Search Trigger (Cmd + K) */}
        <button
          id="global-search-btn"
          onClick={onOpenSearch}
          className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200/70 transition cursor-pointer shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Tìm mặt hàng, hóa đơn...</span>
          <kbd className="hidden md:inline-block bg-white border border-slate-300/80 rounded px-1.5 py-0.5 text-[9px] font-mono text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick Calculator Shortcut */}
        {onOpenCalculator && (
          <button
            onClick={onOpenCalculator}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition cursor-pointer shadow-2xs"
            title="Máy tính thu ngân (Alt + C)"
          >
            <Calculator className="w-4 h-4" />
          </button>
        )}

        {/* Held Orders quick counter */}
        {onOpenHeldOrders && heldOrdersCount > 0 && (
          <button
            onClick={onOpenHeldOrders}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            title="Xem các đơn hàng đang chờ phục vụ"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Đơn chờ</span>
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
              {heldOrdersCount}
            </span>
          </button>
        )}

        {/* Hotkeys helper */}
        {onOpenHotkeys && (
          <button
            onClick={onOpenHotkeys}
            className="hidden sm:flex p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition cursor-pointer shadow-2xs"
            title="Bảng phím tắt bán hàng"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        )}

        {/* Fullscreen Kiosk Mode */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition cursor-pointer shadow-2xs"
          title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình thu ngân (Kiosk)'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Quick POS Shortcut if not currently on POS */}
        {currentView !== 'pos' && (
          <button
            id="header-quick-pos-btn"
            onClick={onNavigateToPOS}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Barcode className="w-4 h-4" />
            <span className="hidden sm:inline">Bán hàng POS</span>
            <span className="bg-primary-700 text-primary-100 text-[9px] px-1.5 py-0.5 rounded font-mono">F9</span>
          </button>
        )}

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition cursor-pointer shadow-2xs"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div 
              id="notifications-menu"
              className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Thông báo kho & ca</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                <button
                  onClick={onClearAllNotifications}
                  className="text-[11px] text-slate-500 hover:text-primary-700 font-semibold cursor-pointer"
                >
                  Đọc tất cả
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-5 text-center text-xs text-slate-400">
                    Không có thông báo mới
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition flex items-start gap-2.5 ${
                        !notif.read ? 'bg-primary-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                        {notif.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {notif.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800">{notif.title}</p>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Dropdown */}
        <div className="relative pl-2 border-l border-slate-200" ref={userRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1 -m-1 rounded-2xl hover:bg-slate-100 transition cursor-pointer text-left group"
          >
            <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition">
              {initialLetter}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{displayName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-slate-500 font-mono font-semibold">{displayCode}</span>
                <span className="text-[9px] text-slate-300">•</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleInfo.bg}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 hidden sm:block transition" />
          </button>

          {/* User Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || `${displayCode}@freshmart.vn`}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleInfo.bg}`}>
                    {roleInfo.label}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {displayCode}
                  </span>
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/employees');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span>Quản lý tài khoản</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer mt-0.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất / Đổi ca</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
