import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '@/components/DashboardView';
import { useApp } from '@/context/AppContext';
import { useDashboardStore } from '@/stores/dashboardStore';

export const DashboardPage: React.FC = () => {
  const { 
    currentShift, 
    setActiveReceiptOrder, 
    handleAdjustStock 
  } = useApp();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isRealtimeConnected,
    isPulsing,
    lastUpdated,
    timeframe,
    fetchFullDashboard,
    setTimeframe,
    initSignalR,
  } = useDashboardStore();

  useEffect(() => {
    fetchFullDashboard();
    const cleanup = initSignalR();
    return () => {
      cleanup();
    };
  }, [fetchFullDashboard, initSignalR]);

  return (
    <DashboardView
      data={data}
      isLoading={isLoading}
      isRealtimeConnected={isRealtimeConnected}
      isPulsing={isPulsing}
      lastUpdated={lastUpdated}
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      onRefresh={() => fetchFullDashboard()}
      currentShift={currentShift}
      onSelectOrder={(order) => setActiveReceiptOrder(order)}
      onNavigateToPOS={() => navigate('/pos')}
      onNavigateToInventory={() => navigate('/inventory')}
      onQuickRestock={(productId, amount) => handleAdjustStock(productId, amount)}
    />
  );
};

export default DashboardPage;

