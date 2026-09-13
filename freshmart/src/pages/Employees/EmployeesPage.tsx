import React from 'react';
import { EmployeesView } from '@/components/EmployeesView';
import { useApp } from '@/context/AppContext';

export const EmployeesPage: React.FC = () => {
  const { currentShift, handleCloseShift } = useApp();

  return (
    <EmployeesView
      currentShift={currentShift}
      onCloseShift={handleCloseShift}
    />
  );
};

export default EmployeesPage;
