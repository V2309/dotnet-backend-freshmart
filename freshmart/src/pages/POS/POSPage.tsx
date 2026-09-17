import React, { useEffect, useMemo } from 'react';
import { POSView } from '@/components/POSView';
import { useApp } from '@/context/AppContext';
import { useProductStore } from '@/stores/productStore';
import { useShiftStore } from '@/stores/shiftStore';
import { Product } from '@/types';

export const POSPage: React.FC = () => {
  const { products: storeProducts, fetchProducts } = useProductStore();
  const { fetchCurrentShift } = useShiftStore();
  const {
    products: appProducts,
    customers,
    cart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart,
    selectedCustomer,
    setSelectedCustomer,
    handleAddCustomer,
    discountPercent,
    setDiscountPercent,
    vatRate,
    setVatRate,
    setIsPaymentModalOpen,
    heldOrders,
    handleParkCurrentOrder,
    setIsHeldOrdersOpen,
    setIsCalculatorOpen,
    setIsHotkeysOpen,
  } = useApp();

  useEffect(() => {
    fetchProducts(undefined, true);
    fetchCurrentShift();
  }, [fetchProducts, fetchCurrentShift]);

  // Derived products from DB store
  const products: Product[] = useMemo(() => {
    if (storeProducts && storeProducts.length > 0) {
      return storeProducts.map(p => ({
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
        status: p.stock <= 0 ? 'out_of_stock' : p.stock <= p.minStock ? 'low_stock' : 'in_stock',
        supplier: p.supplierName || 'NCC FreshMart'
      }));
    }
    return appProducts;
  }, [storeProducts, appProducts]);

  return (
    <POSView
      products={products}
      customers={customers}
      cart={cart}
      onAddToCart={handleAddToCart}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveFromCart={handleRemoveFromCart}
      onClearCart={handleClearCart}
      selectedCustomer={selectedCustomer}
      onSelectCustomer={setSelectedCustomer}
      onAddCustomer={handleAddCustomer}
      discountPercent={discountPercent}
      onSetDiscountPercent={setDiscountPercent}
      vatRate={vatRate}
      onSetVatRate={setVatRate}
      onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
      heldOrdersCount={heldOrders.length}
      onParkCurrentOrder={handleParkCurrentOrder}
      onOpenHeldOrders={() => setIsHeldOrdersOpen(true)}
      onOpenCalculator={() => setIsCalculatorOpen(true)}
      onOpenHotkeys={() => setIsHotkeysOpen(true)}
    />
  );
};

export default POSPage;
