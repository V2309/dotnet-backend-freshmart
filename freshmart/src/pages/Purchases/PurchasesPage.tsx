import React from 'react';
import { PurchasesView } from '@/components/PurchasesView';
import { useApp } from '@/context/AppContext';

export const PurchasesPage: React.FC = () => {
  const { purchases, handleAddPurchase, handleReceivePurchase } = useApp();

  return (
    <PurchasesView
      purchases={purchases}
      onAddPurchase={handleAddPurchase}
      onReceivePurchase={handleReceivePurchase}
    />
  );
};

export default PurchasesPage;
