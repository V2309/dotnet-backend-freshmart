using dotnet_backend_freshmart.DTOs.Dashboard;

namespace dotnet_backend_freshmart.Hubs
{
    public interface IDashboardHubClient
    {
        Task ReceiveDashboardUpdate(FullDashboardResponse dashboardData);
        Task ReceiveKpiUpdate(DashboardKpiResponse kpis);
        Task ReceiveRecentTransaction(RecentTransactionResponse transaction);
        Task ReceiveLowStockAlert(List<LowStockProductResponse> lowStockProducts);
    }
}
