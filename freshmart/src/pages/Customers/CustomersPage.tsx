import React from 'react';
import { CustomersView } from '@/components/CustomersView';
import { useApp } from '@/context/AppContext';

export const CustomersPage: React.FC = () => {
  const { customers, handleAddCustomer } = useApp();

  return (
    <CustomersView
      customers={customers}
      onAddCustomer={handleAddCustomer}
    />
  );
};

export default CustomersPage;
