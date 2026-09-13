import React from 'react';
import { ReportsView } from '@/components/ReportsView';
import { useApp } from '@/context/AppContext';

export const ReportsPage: React.FC = () => {
  const { orders } = useApp();

  return (
    <ReportsView
      orders={orders}
    />
  );
};

export default ReportsPage;
