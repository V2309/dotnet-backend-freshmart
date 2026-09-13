import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '@/components/DashboardView';
import { useApp } from '@/context/AppContext';

export const DashboardPage: React.FC = () => {
  const { 
    orders, 
    products, 
    customers, 
    purchases, 
    currentShift, 
    setActiveReceiptOrder, 
    handleAdjustStock 
  } = useApp();
  const navigate = useNavigate();

  return (
    <DashboardView
      orders={orders}
      products={products}
      customers={customers}
      purchases={purchases}
      currentShift={currentShift}
      onSelectOrder={(order) => setActiveReceiptOrder(order)}
      onNavigateToPOS={() => navigate('/pos')}
      onNavigateToInventory={() => navigate('/inventory')}
      onQuickRestock={(productId, amount) => handleAdjustStock(productId, amount)}
    />
  );
};

export default DashboardPage;
