import * as signalR from '@microsoft/signalr';
import type {
  FullDashboardResponse,
  DashboardKpiResponse,
  RecentTransactionResponse,
  LowStockProductResponse,
} from '../types/dashboard';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting: boolean = false;

  private onDashboardUpdateCallbacks: Array<(data: FullDashboardResponse) => void> = [];
  private onKpiUpdateCallbacks: Array<(kpis: DashboardKpiResponse) => void> = [];
  private onRecentTransactionCallbacks: Array<(tx: RecentTransactionResponse) => void> = [];
  private onLowStockAlertCallbacks: Array<(lowStock: LowStockProductResponse[]) => void> = [];
  private onConnectionStatusCallbacks: Array<(connected: boolean) => void> = [];

  private getHubUrl(): string {
    const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5211/api/v1';
    // Remove trailing /api or /api/v1 to get server base
    const base = apiBase.replace(/\/api(\/v1)?\/?$/, '');
    return `${base}/hubs/dashboard`;
  }

  public async startConnection(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    try {
      this.isConnecting = true;
      const hubUrl = this.getHubUrl();

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => localStorage.getItem('freshmart_auth_token') || localStorage.getItem('token') || '',
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Register Handlers
      this.connection.on('ReceiveDashboardUpdate', (data: FullDashboardResponse) => {
        console.log('⚡ [SignalR] Received Realtime Full Dashboard Update', data);
        this.onDashboardUpdateCallbacks.forEach((cb) => cb(data));
      });

      this.connection.on('ReceiveKpiUpdate', (kpis: DashboardKpiResponse) => {
        console.log('⚡ [SignalR] Received Realtime KPI Update', kpis);
        this.onKpiUpdateCallbacks.forEach((cb) => cb(kpis));
      });

      this.connection.on('ReceiveRecentTransaction', (tx: RecentTransactionResponse) => {
        console.log('⚡ [SignalR] Received Realtime Recent Transaction', tx);
        this.onRecentTransactionCallbacks.forEach((cb) => cb(tx));
      });

      this.connection.on('ReceiveLowStockAlert', (lowStock: LowStockProductResponse[]) => {
        console.log('⚡ [SignalR] Received Realtime Low Stock Alert', lowStock);
        this.onLowStockAlertCallbacks.forEach((cb) => cb(lowStock));
      });

      this.connection.onreconnecting(() => {
        console.warn('🔄 [SignalR] Reconnecting to Dashboard Hub...');
        this.onConnectionStatusCallbacks.forEach((cb) => cb(false));
      });

      this.connection.onreconnected(() => {
        console.log('✅ [SignalR] Reconnected to Dashboard Hub!');
        this.onConnectionStatusCallbacks.forEach((cb) => cb(true));
      });

      this.connection.onclose(() => {
        console.warn('❌ [SignalR] Dashboard Hub connection closed.');
        this.onConnectionStatusCallbacks.forEach((cb) => cb(false));
      });

      await this.connection.start();
      console.log('🟢 [SignalR] Connected successfully to Dashboard Hub at:', hubUrl);
      this.onConnectionStatusCallbacks.forEach((cb) => cb(true));
    } catch (err) {
      console.error('❌ [SignalR] Connection to Dashboard Hub failed:', err);
      this.onConnectionStatusCallbacks.forEach((cb) => cb(false));
    } finally {
      this.isConnecting = false;
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('⏹️ [SignalR] Stopped connection to Dashboard Hub');
      } catch (err) {
        console.error('Error stopping SignalR connection', err);
      } finally {
        this.connection = null;
        this.onConnectionStatusCallbacks.forEach((cb) => cb(false));
      }
    }
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  public onDashboardUpdate(callback: (data: FullDashboardResponse) => void): () => void {
    this.onDashboardUpdateCallbacks.push(callback);
    return () => {
      this.onDashboardUpdateCallbacks = this.onDashboardUpdateCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onKpiUpdate(callback: (kpis: DashboardKpiResponse) => void): () => void {
    this.onKpiUpdateCallbacks.push(callback);
    return () => {
      this.onKpiUpdateCallbacks = this.onKpiUpdateCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onRecentTransaction(callback: (tx: RecentTransactionResponse) => void): () => void {
    this.onRecentTransactionCallbacks.push(callback);
    return () => {
      this.onRecentTransactionCallbacks = this.onRecentTransactionCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onLowStockAlert(callback: (lowStock: LowStockProductResponse[]) => void): () => void {
    this.onLowStockAlertCallbacks.push(callback);
    return () => {
      this.onLowStockAlertCallbacks = this.onLowStockAlertCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onConnectionStatus(callback: (connected: boolean) => void): () => void {
    this.onConnectionStatusCallbacks.push(callback);
    return () => {
      this.onConnectionStatusCallbacks = this.onConnectionStatusCallbacks.filter((cb) => cb !== callback);
    };
  }
}

export const signalRService = new SignalRService();
