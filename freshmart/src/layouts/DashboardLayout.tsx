import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { PaymentModal } from '@/components/PaymentModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { QuickSearchModal } from '@/components/QuickSearchModal';
import { CalculatorModal } from '@/components/CalculatorModal';
import { HeldOrdersModal } from '@/components/HeldOrdersModal';
import { HotkeysModal } from '@/components/HotkeysModal';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ViewMode } from '@/types';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const app = useApp();
  const { user } = useAuth();

  // Sidebar collapsed state with localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('freshmart_sidebar_collapsed') === 'true';
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('freshmart_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Derive currentView from pathname
  const pathSegment = location.pathname.replace('/', '') as ViewMode;
  const currentView: ViewMode = [
    'dashboard',
    'pos',
    'products',
    'categories',
    'suppliers',
    'inventory',
    'purchases',
    'customers',
    'reports',
    'shifts',
    'employees',
  ].includes(pathSegment)
    ? pathSegment
    : 'dashboard';

  const handleSelectView = (view: ViewMode) => {
    navigate(`/${view}`);
  };

  return (
    <div id="freshmart-app" className="flex h-screen w-screen overflow-hidden bg-slate-100/60 text-slate-900 select-none antialiased">
      {/* 1. Global Shell - Collapsible Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={handleSelectView}
        lowStockCount={app.lowStockCount}
        productCount={app.products.length}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 2. Global Shell - Top Header */}
        <Header
          currentView={currentView}
          notifications={app.notifications}
          onMarkNotificationRead={app.handleMarkNotificationRead}
          onClearAllNotifications={app.handleClearAllNotifications}
          currentShift={app.currentShift}
          onOpenSearch={() => app.setIsQuickSearchOpen(true)}
          onNavigateToPOS={() => navigate('/pos')}
          onOpenCalculator={() => app.setIsCalculatorOpen(true)}
          onOpenHeldOrders={() => app.setIsHeldOrdersOpen(true)}
          onOpenHotkeys={() => app.setIsHotkeysOpen(true)}
          heldOrdersCount={app.heldOrders.length}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* View Router Outlet */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-[#F7F7F7]">
          <Outlet />
        </main>
      </div>

      {/* Interactive Payment Modal */}
      {app.isPaymentModalOpen && (
        <PaymentModal
          isOpen={app.isPaymentModalOpen}
          onClose={() => app.setIsPaymentModalOpen(false)}
          cart={app.cart}
          customer={app.selectedCustomer}
          subtotal={app.subtotal}
          discountAmount={app.discountAmount}
          vatAmount={app.vatAmount}
          total={app.total}
          onCompleteOrder={app.handleCompleteOrder}
          cashierName={user?.name || app.currentShift.cashierName}
        />
      )}

      {/* Printable Receipt Modal */}
      {app.activeReceiptOrder && (
        <ReceiptModal
          order={app.activeReceiptOrder}
          onClose={() => app.setActiveReceiptOrder(null)}
          onStartNewSale={() => {
            app.setActiveReceiptOrder(null);
            navigate('/pos');
          }}
        />
      )}

      {/* Global Quick Search (Cmd + K) */}
      {app.isQuickSearchOpen && (
        <QuickSearchModal
          isOpen={app.isQuickSearchOpen}
          onClose={() => app.setIsQuickSearchOpen(false)}
          products={app.products}
          orders={app.orders}
          customers={app.customers}
          onSelectProduct={(p) => {
            app.handleAddToCart(p);
            navigate('/pos');
          }}
          onSelectOrder={(o) => {
            app.setActiveReceiptOrder(o);
          }}
        />
      )}

      {/* Cashier Calculator Modal (Alt + C) */}
      {app.isCalculatorOpen && (
        <CalculatorModal
          isOpen={app.isCalculatorOpen}
          onClose={() => app.setIsCalculatorOpen(false)}
        />
      )}

      {/* Held / Parked Orders Drawer Modal */}
      {app.isHeldOrdersOpen && (
        <HeldOrdersModal
          isOpen={app.isHeldOrdersOpen}
          onClose={() => app.setIsHeldOrdersOpen(false)}
          heldOrders={app.heldOrders}
          onResumeOrder={(id) => {
            app.handleResumeOrder(id);
            navigate('/pos');
          }}
          onDeleteHeldOrder={app.handleDeleteHeldOrder}
        />
      )}

      {/* Cashier Hotkeys Guide Sheet */}
      {app.isHotkeysOpen && (
        <HotkeysModal
          isOpen={app.isHotkeysOpen}
          onClose={() => app.setIsHotkeysOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
