import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryView } from '@/components/InventoryView';
import { useApp } from '@/context/AppContext';

export const InventoryPage: React.FC = () => {
  const { products, handleAdjustStock, handleSetExactStock } = useApp();
  const navigate = useNavigate();

  return (
    <InventoryView
      products={products}
      onAdjustStock={handleAdjustStock}
      onSetExactStock={handleSetExactStock}
      onNavigateToPurchases={() => navigate('/purchases')}
    />
  );
};

export default InventoryPage;
