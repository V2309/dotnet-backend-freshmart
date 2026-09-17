import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Order, 
  Customer, 
  NotificationItem, 
  SupplierPurchase, 
  CartItem, 
  HeldCartData, 
  CashierShift,
  StockStatus
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_PURCHASES, 
  CURRENT_SHIFT 
} from '../data/mockData';
import { productService } from '../services/product.service';
import { customerService } from '../services/customer.service';
import { purchaseService } from '../services/purchase.service';
import { notificationService } from '../services/notification.service';
import { orderService } from '../services/order.service';
import { sound } from '../utils/sound';

interface AppContextType {
  // Core Data
  products: Product[];
  orders: Order[];
  customers: Customer[];
  notifications: NotificationItem[];
  purchases: SupplierPurchase[];
  currentShift: CashierShift;
  
  // POS Cart State
  cart: CartItem[];
  heldOrders: HeldCartData[];
  selectedCustomer: Customer | null;
  discountPercent: number;
  vatRate: number;
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  vatAmount: number;
  total: number;
  lowStockCount: number;
  
  // Modals & Popups
  isPaymentModalOpen: boolean;
  activeReceiptOrder: Order | null;
  isQuickSearchOpen: boolean;
  isCalculatorOpen: boolean;
  isHeldOrdersOpen: boolean;
  isHotkeysOpen: boolean;

  // Setters
  setSelectedCustomer: (cust: Customer | null) => void;
  setDiscountPercent: (pct: number) => void;
  setVatRate: (rate: number) => void;
  
  // Handlers - POS Cart
  handleAddToCart: (product: Product) => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleRemoveFromCart: (productId: string) => void;
  handleClearCart: () => void;
  handleParkCurrentOrder: (customerName?: string, note?: string) => void;
  handleResumeOrder: (heldId: string) => void;
  handleRestoreHeldOrder: (heldId: string) => void;
  handleDeleteHeldOrder: (heldId: string) => void;
  handleApplyDiscount: (percent: number) => void;
  handleSetVatRate: (vat: number) => void;
  handleSelectCustomer: (customer: Customer | null) => void;
  handleCompleteOrder: (order: Order) => void;
  
  // Handlers - Modals
  setIsPaymentModalOpen: (open: boolean) => void;
  setActiveReceiptOrder: (order: Order | null) => void;
  setIsQuickSearchOpen: (open: boolean) => void;
  setIsCalculatorOpen: (open: boolean) => void;
  setIsHeldOrdersOpen: (open: boolean) => void;
  setIsHotkeysOpen: (open: boolean) => void;

  // Handlers - Data Management
  handleAddProduct: (product: Omit<Product, 'id'>) => void;
  handleUpdateProduct: (product: Product) => void;
  handleAdjustStock: (productId: string, amountChange: number) => void;
  handleSetExactStock: (productId: string, exactStock: number) => void;
  handleAddPurchase: (po: SupplierPurchase) => void;
  handleReceivePurchase: (purchaseId: string) => void;
  handleAddCustomer: (customer: Omit<Customer, 'id' | 'code' | 'points' | 'totalSpent' | 'lastVisit'>) => void;
  handleMarkNotificationRead: (id: string) => void;
  handleClearAllNotifications: () => void;
  handleCloseShift: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [purchases, setPurchases] = useState<SupplierPurchase[]>([]);
  const [currentShift, setCurrentShift] = useState<CashierShift>(CURRENT_SHIFT);

  // Load real products from Backend API on mount
  useEffect(() => {
    productService.getAll()
      .then((apiProducts) => {
        if (apiProducts && apiProducts.length > 0) {
          const mapped: Product[] = apiProducts.map((p) => {
            const rawStatus = (p.status || '').toString().toLowerCase();
            const status: StockStatus = 
              rawStatus === 'instock' ? 'in_stock' :
              rawStatus === 'lowstock' ? 'low_stock' : 'out_of_stock';

            return {
              id: p.id,
              sku: p.sku,
              barcode: p.barcode || '',
              name: p.name,
              category: p.categoryName || 'Khác',
              unit: p.unit,
              costPrice: p.costPrice,
              sellPrice: p.sellPrice,
              stock: p.stock,
              minStock: p.minStock,
              image: p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
              status,
              supplier: p.supplierName || 'Chưa gán',
            };
          });
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('API Products fallback to initial state:', err);
      });

    // Load real customers from Backend API on mount
    customerService.getAll()
      .then((apiCustomers) => {
        if (apiCustomers) {
          setCustomers(apiCustomers as Customer[]);
        }
      })
      .catch((err) => {
        console.warn('API Customers error:', err);
        setCustomers([]);
      });

    // Load real purchases from Backend API on mount
    purchaseService.getAll()
      .then((apiPurchases) => {
        if (apiPurchases) {
          const mappedPurchases: SupplierPurchase[] = apiPurchases.map((po) => ({
            id: po.id,
            code: po.code,
            supplierName: po.supplierName,
            createdAt: po.createdAt ? po.createdAt.split('T')[0] : '',
            expectedDate: po.expectedDate || '',
            totalItems: po.totalItems,
            totalValue: po.totalValue,
            status: (po.status || 'pending').toLowerCase() as any,
            createdBy: po.createdByName,
          }));
          setPurchases(mappedPurchases);
        }
      })
      .catch((err) => {
        console.warn('API Purchases error:', err);
        setPurchases([]);
      });

    // Load real notifications from Backend API on mount
    notificationService.getAll()
      .then((apiNotifs) => {
        if (apiNotifs) {
          setNotifications(apiNotifs.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: n.time || 'Vừa xong',
            type: (n.type || 'info').toLowerCase() as any,
            read: n.read ?? n.isRead ?? false,
          })));
        }
      })
      .catch((err) => {
        console.warn('API Notifications error:', err);
        setNotifications([]);
      });

    // Load real orders from Backend API on mount
    orderService.getAll()
      .then((apiOrders) => {
        if (apiOrders) {
          setOrders(apiOrders);
        }
      })
      .catch((err) => {
        console.warn('API Orders error:', err);
        setOrders([]);
      });
  }, []);

  // Active POS Cart State (Khởi tạo giỏ hàng trống khi mở ca / vào quầy POS)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heldOrders, setHeldOrders] = useState<HeldCartData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(8);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isHeldOrdersOpen, setIsHeldOrdersOpen] = useState<boolean>(false);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState<boolean>(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K or Ctrl + K for universal search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen(prev => !prev);
      }
      // ? key for hotkeys
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsHotkeysOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // POS Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, discountPercent: 0 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    sound.playTrash();
  };

  const handleClearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscountPercent(0);
  };

  const handleApplyDiscount = (percent: number) => {
    setDiscountPercent(percent);
  };

  const handleSetVatRate = (vat: number) => {
    setVatRate(vat);
  };

  const handleSelectCustomer = (customer: Customer | null) => {
    setSelectedCustomer(customer);
  };

  // Hold / Park Order
  const handleParkCurrentOrder = (customerName?: string, note?: string) => {
    if (cart.length === 0) return;
    const newHeld: HeldCartData = {
      id: 'held-' + Date.now(),
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName || (selectedCustomer ? selectedCustomer.name : 'Khách lẻ'),
      cart: [...cart],
      discountPercent,
      vatRate,
      note
    };
    setHeldOrders(prev => [newHeld, ...prev]);
    handleClearCart();
    sound.playHold();
  };

  const handleRestoreHeldOrder = (heldId: string) => {
    const target = heldOrders.find(h => h.id === heldId);
    if (!target) return;
    setCart(target.cart);
    setDiscountPercent(target.discountPercent);
    setVatRate(target.vatRate);
    setHeldOrders(prev => prev.filter(h => h.id !== heldId));
    setIsHeldOrdersOpen(false);
  };

  const handleDeleteHeldOrder = (heldId: string) => {
    setHeldOrders(prev => prev.filter(h => h.id !== heldId));
  };

  const handleCompleteOrder = (newOrder: Order) => {
    // 1. Decrement product stocks
    setProducts((prev) =>
      prev.map((p) => {
        const orderItem = newOrder.items.find((item) => item.productId === p.id);
        if (orderItem) {
          const newStock = Math.max(0, p.stock - orderItem.quantity);
          const newStatus = newStock <= 0 ? 'out_of_stock' : newStock <= p.minStock ? 'low_stock' : 'in_stock';
          return {
            ...p,
            stock: newStock,
            status: newStatus
          };
        }
        return p;
      })
    );

    // 2. Add to orders list
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Update customer loyalty points if member
    if (selectedCustomer) {
      const addedPoints = Math.floor(newOrder.total / 10000);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                points: c.points + addedPoints,
                totalSpent: c.totalSpent + newOrder.total,
                lastVisit: new Date().toISOString().split('T')[0]
              }
            : c
        )
      );
    }

    // 4. Update shift stats
    setCurrentShift((prev) => ({
      ...prev,
      orderCount: prev.orderCount + 1,
      totalRevenue: prev.totalRevenue + newOrder.total,
      expectedCash: newOrder.paymentMethod === 'cash' ? prev.expectedCash + newOrder.total : prev.expectedCash
    }));

    // 5. Close payment modal, show receipt, clear cart
    setIsPaymentModalOpen(false);
    setActiveReceiptOrder(newOrder);
    handleClearCart();
  };

  // Product & Inventory Handlers
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: 'p-' + Date.now()
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleAdjustStock = (productId: string, amountChange: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + amountChange);
          const newStatus = newStock <= 0 ? 'out_of_stock' : newStock <= p.minStock ? 'low_stock' : 'in_stock';
          
          // Sync quick-stock with backend API
          productService.quickAdjustStock(productId, { stock: newStock }).catch(console.error);

          return { ...p, stock: newStock, status: newStatus };
        }
        return p;
      })
    );
  };

  const handleSetExactStock = (productId: string, exactStock: number) => {
    const newStock = Math.max(0, exactStock);
    // Sync quick-stock with backend API
    productService.quickAdjustStock(productId, { stock: newStock }).catch(console.error);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStatus = newStock <= 0 ? 'out_of_stock' : newStock <= p.minStock ? 'low_stock' : 'in_stock';
          return { ...p, stock: newStock, status: newStatus };
        }
        return p;
      })
    );
  };

  // Purchases Handlers
  const handleAddPurchase = (newPO: SupplierPurchase) => {
    setPurchases(prev => [newPO, ...prev]);
  };

  const handleReceivePurchase = (purchaseId: string) => {
    setPurchases(prev =>
      prev.map(p => p.id === purchaseId ? { ...p, status: 'received' } : p)
    );

    const newNotifItem: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Nhập kho thành công',
      message: `Đơn nhập hàng #${purchaseId} đã được ghi nhận vào sổ kho.`,
      time: 'Vừa xong',
      type: 'success',
      read: false
    };

    setNotifications(prev => [newNotifItem, ...prev]);

    // Persist to backend database
    notificationService.create({
      title: newNotifItem.title,
      message: newNotifItem.message,
      type: 'success',
    }).then((created) => {
      if (created && created.id) {
        setNotifications(prev => prev.map(n => n.id === newNotifItem.id ? { ...n, id: created.id } : n));
      }
    }).catch((err) => {
      console.warn('Cannot persist notification to backend:', err);
    });
  };

  // Customer Handlers
  const handleAddCustomer = (newCust: Omit<Customer, 'id'>) => {
    const created: Customer = {
      ...newCust,
      id: 'c-' + Date.now()
    };
    setCustomers(prev => [created, ...prev]);
  };

  // Notifications
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    // If it's a valid GUID or exists on backend, sync it
    if (id && !id.startsWith('notif-')) {
      notificationService.markAsRead(id).catch(console.error);
    }
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    notificationService.markAllAsRead().catch(console.error);
  };

  const handleCloseShift = () => {
    alert('Đã chốt ca thành công! Số tiền bàn giao thực tế: ₫' + currentShift.expectedCash.toLocaleString('vi-VN'));
  };

  // Cart financial summary
  const subtotal = cart.reduce((sum, item) => sum + item.product.sellPrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const vatAmount = Math.round((subtotalAfterDiscount * vatRate) / 100);
  const total = subtotalAfterDiscount + vatAmount;
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        customers,
        notifications,
        purchases,
        currentShift,
        cart,
        heldOrders,
        selectedCustomer,
        discountPercent,
        vatRate,
        subtotal,
        discountAmount,
        subtotalAfterDiscount,
        vatAmount,
        total,
        lowStockCount,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        activeReceiptOrder,
        setActiveReceiptOrder,
        isQuickSearchOpen,
        setIsQuickSearchOpen,
        isCalculatorOpen,
        setIsCalculatorOpen,
        isHeldOrdersOpen,
        setIsHeldOrdersOpen,
        isHotkeysOpen,
        setIsHotkeysOpen,
        setSelectedCustomer,
        setDiscountPercent,
        setVatRate,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveFromCart,
        handleClearCart,
        handleParkCurrentOrder,
        handleResumeOrder: handleRestoreHeldOrder,
        handleRestoreHeldOrder,
        handleDeleteHeldOrder,
        handleCompleteOrder,
        handleAddProduct,
        handleUpdateProduct,
        handleAdjustStock,
        handleSetExactStock,
        handleAddPurchase,
        handleReceivePurchase,
        handleAddCustomer,
        handleMarkNotificationRead,
        handleClearAllNotifications,
        handleCloseShift
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
