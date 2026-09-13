import React from 'react';
import { POSView } from '@/components/POSView';
import { useApp } from '@/context/AppContext';

export const POSPage: React.FC = () => {
  const {
    products,
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
