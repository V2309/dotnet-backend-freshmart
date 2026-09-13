import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Customer, CartItem, NotificationItem, SupplierPurchase, CashierShift } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PURCHASES, 
  CURRENT_SHIFT 
} from '../data/mockData';
import { HeldCartData } from '../components/HeldOrdersModal';
import { OrderType } from '../components/POSView';
import { sound } from '../utils/sound';

interface AppContextType {
  // Core Data
  products: Product[];
  orders: Order[];
  customers: Customer[];
  notifications: NotificationItem[];
  purchases: SupplierPurchase[];
  currentShift: CashierShift;

  // Cart & POS State
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

  // Modals
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  activeReceiptOrder: Order | null;
  setActiveReceiptOrder: (order: Order | null) => void;
  isQuickSearchOpen: boolean;
  setIsQuickSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;
  isHeldOrdersOpen: boolean;
  setIsHeldOrdersOpen: (open: boolean) => void;
  isHotkeysOpen: boolean;
  setIsHotkeysOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Setters & Actions
  setSelectedCustomer: (cust: Customer | null) => void;
  setDiscountPercent: (pct: number) => void;
  setVatRate: (rate: number) => void;
  handleAddToCart: (product: Product) => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleRemoveFromCart: (productId: string) => void;
  handleClearCart: () => void;
  handleParkCurrentOrder: (orderType?: OrderType) => void;
  handleResumeOrder: (heldId: string) => void;
  handleDeleteHeldOrder: (heldId: string) => void;
  handleCompleteOrder: (newOrder: Order) => void;
  handleAddProduct: (newProductData: Omit<Product, 'id'>) => void;
  handleUpdateProduct: (updatedProduct: Product) => void;
  handleAdjustStock: (productId: string, amountChange: number) => void;
  handleSetExactStock: (productId: string, exactStock: number) => void;
  handleAddPurchase: (newPO: SupplierPurchase) => void;
  handleReceivePurchase: (purchaseId: string) => void;
  handleAddCustomer: (newCust: Omit<Customer, 'id'>) => void;
  handleMarkNotificationRead: (id: string) => void;
  handleClearAllNotifications: () => void;
  handleCloseShift: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [purchases, setPurchases] = useState<SupplierPurchase[]>(INITIAL_PURCHASES);
  const [currentShift, setCurrentShift] = useState<CashierShift>(CURRENT_SHIFT);

  // Active POS Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 2, discountPercent: 0 },
    { product: INITIAL_PRODUCTS[2], quantity: 5, discountPercent: 0 },
    { product: INITIAL_PRODUCTS[3], quantity: 1, discountPercent: 0 },
  ]);
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
  };

  const handleClearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscountPercent(0);
  };

  // Hold / Park Order
  const handleParkCurrentOrder = (orderType: OrderType = 'dine_in') => {
    if (cart.length === 0) return;
    const newHeld: HeldCartData = {
      id: 'hold-' + Date.now(),
      cart,
      customer: selectedCustomer,
      discount: discountPercent,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      orderType
    };
    setHeldOrders(prev => [newHeld, ...prev]);
    handleClearCart();

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Đã lưu đơn vào hàng chờ',
        message: `Đơn gồm ${cart.length} món đã được lưu tạm. Có thể mở lại bất cứ lúc nào.`,
        time: 'Vừa xong',
        type: 'info',
        read: false
      },
      ...prev
    ]);
  };

  const handleResumeOrder = (heldId: string) => {
    const target = heldOrders.find(h => h.id === heldId);
    if (!target) return;
    setCart(target.cart);
    setSelectedCustomer(target.customer);
    setDiscountPercent(target.discount);
    setHeldOrders(prev => prev.filter(h => h.id !== heldId));
    setIsHeldOrdersOpen(false);
    sound.playPop();
  };

  const handleDeleteHeldOrder = (heldId: string) => {
    sound.playTrash();
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
          return { ...p, stock: newStock, status: newStatus };
        }
        return p;
      })
    );
  };

  const handleSetExactStock = (productId: string, exactStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, exactStock);
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
    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Nhập kho thành công',
        message: `Đơn nhập hàng #${purchaseId} đã được ghi nhận vào sổ kho.`,
        time: 'Vừa xong',
        type: 'success',
        read: false
      },
      ...prev
    ]);
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
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
        handleResumeOrder,
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
