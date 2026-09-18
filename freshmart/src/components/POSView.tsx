import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, CartItem, Customer } from '../types';
import { 
  POSProductCatalog, 
  POSCartPanel, 
  OrderType 
} from './pos';

export type { OrderType };

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  discountPercent: number;
  onSetDiscountPercent: (percent: number) => void;
  vatRate: number;
  onSetVatRate: (rate: number) => void;
  onOpenPaymentModal: () => void;
  heldOrdersCount: number;
  onParkCurrentOrder: (orderType: OrderType) => void;
  onOpenHeldOrders: () => void;
  onOpenCalculator: () => void;
  onOpenHotkeys: () => void;
}

export const POSView: React.FC<POSViewProps> = ({
  products,
  customers,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
  discountPercent,
  onSetDiscountPercent,
  vatRate,
  onSetVatRate,
  onOpenPaymentModal,
  heldOrdersCount,
  onParkCurrentOrder,
  onOpenHeldOrders,
  onOpenCalculator,
  onOpenHotkeys
}) => {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global POS Keyboard Shortcuts (F9, F2, F8, Alt+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) {
          onOpenPaymentModal();
        }
      } else if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) {
          onParkCurrentOrder(orderType);
        }
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        onOpenCalculator();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, onOpenPaymentModal, onParkCurrentOrder, orderType, onOpenCalculator]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Search Query filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q)
      );
    });
  }, [products, selectedCategory, searchQuery]);

  // Map product id to quantity in cart for instant badge display
  const cartQuantitiesMap = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach(item => {
      map.set(item.product.id, item.quantity);
    });
    return map;
  }, [cart]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div id="pos-screen" className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#F7F7F7] overflow-hidden select-none">
      {/* 1. Left / Main POS Catalog Area (View Orders, Categories, Search, Products Grid) */}
      <POSProductCatalog
        products={products}
        filteredProducts={filteredProducts}
        cartQuantitiesMap={cartQuantitiesMap}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSetSearchQuery={setSearchQuery}
        onAddToCart={onAddToCart}
        onUpdateQuantity={onUpdateQuantity}
        onResetFilters={handleResetFilters}
        onOpenHeldOrders={onOpenHeldOrders}
        onOpenTransactionModal={onOpenHeldOrders}
        searchInputRef={searchInputRef}
      />

      {/* 2. Right Cart / Bill Receipt Panel (400px) */}
      <div className="w-full lg:w-[400px] shrink-0 h-full">
        <POSCartPanel
          cart={cart}
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={onSelectCustomer}
          onAddCustomer={onAddCustomer}
          orderType={orderType}
          discountPercent={discountPercent}
          onSetDiscountPercent={onSetDiscountPercent}
          vatRate={vatRate}
          onSetVatRate={onSetVatRate}
          heldOrdersCount={heldOrdersCount}
          onParkCurrentOrder={onParkCurrentOrder}
          onOpenHeldOrders={onOpenHeldOrders}
          onClearCart={onClearCart}
          onOpenPaymentModal={onOpenPaymentModal}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveFromCart={onRemoveFromCart}
        />
      </div>
    </div>
  );
};

export default POSView;
