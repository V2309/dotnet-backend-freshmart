import { create } from 'zustand';
import type {
  FullDashboardResponse,
  DashboardKpiResponse,
  RecentTransactionResponse,
  LowStockProductResponse,
} from '../types/dashboard';
import { dashboardService } from '../services/dashboard.service';
import { signalRService } from '../services/signalr.service';

interface DashboardState {
  data: FullDashboardResponse | null;
  isLoading: boolean;
  isRealtimeConnected: boolean;
  isPulsing: boolean;
  lastUpdated: Date;
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

  // Actions
  fetchFullDashboard: (timeframe?: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y') => Promise<void>;
  setTimeframe: (timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y') => void;
  initSignalR: () => () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  isLoading: false,
  isRealtimeConnected: false,
  isPulsing: false,
  lastUpdated: new Date(),
  timeframe: '1Y',

  setTimeframe: (timeframe) => {
    set({ timeframe });
    get().fetchFullDashboard(timeframe);
  },

  fetchFullDashboard: async (customTimeframe) => {
    const tf = customTimeframe || get().timeframe;
    set({ isLoading: true });
    try {
      const data = await dashboardService.getFullDashboard(tf);
      set({
        data,
        lastUpdated: new Date(),
        isLoading: false,
      });
    } catch (err) {
      console.error('Lỗi tải dữ liệu Dashboard:', err);
      set({ isLoading: false });
    }
  },

  initSignalR: () => {
    // 1. Listen for Full Dashboard Updates
    const unsubDashboard = signalRService.onDashboardUpdate((newData) => {
      set({
        data: newData,
        lastUpdated: new Date(),
        isPulsing: true,
      });

      // Clear pulse after 1.5s
      setTimeout(() => {
        set({ isPulsing: false });
      }, 1500);
    });

    // 2. Listen for KPI updates
    const unsubKpis = signalRService.onKpiUpdate((kpis: DashboardKpiResponse) => {
      const current = get().data;
      if (current) {
        set({
          data: { ...current, kpis },
          lastUpdated: new Date(),
          isPulsing: true,
        });
        setTimeout(() => set({ isPulsing: false }), 1500);
      }
    });

    // 3. Listen for Recent Transactions
    const unsubTx = signalRService.onRecentTransaction((tx: RecentTransactionResponse) => {
      const current = get().data;
      if (current) {
        const updatedList = [tx, ...current.recentTransactions.filter((t) => t.id !== tx.id)].slice(0, 10);
        set({
          data: { ...current, recentTransactions: updatedList },
          lastUpdated: new Date(),
        });
      }
    });

    // 4. Listen for Low Stock Alerts
    const unsubLowStock = signalRService.onLowStockAlert((lowStockProducts: LowStockProductResponse[]) => {
      const current = get().data;
      if (current) {
        set({
          data: { ...current, lowStockProducts },
          lastUpdated: new Date(),
        });
      }
    });

    // 5. Connection status listener
    const unsubStatus = signalRService.onConnectionStatus((connected) => {
      set({ isRealtimeConnected: connected });
    });

    // Start WebSocket connection
    signalRService.startConnection();

    // Return cleanup function
    return () => {
      unsubDashboard();
      unsubKpis();
      unsubTx();
      unsubLowStock();
      unsubStatus();
    };
  },
}));
