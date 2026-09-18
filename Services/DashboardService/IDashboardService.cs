using dotnet_backend_freshmart.DTOs.Dashboard;

namespace dotnet_backend_freshmart.Services.DashboardService
{
    public interface IDashboardService
    {
        Task<DashboardKpiResponse> GetKpiSummaryAsync();
        Task<SalesPurchaseChartResponse> GetSalesPurchaseChartAsync(string timeframe = "1Y");
        Task<CategorySalesPieResponse> GetCategorySalesPieAsync();
        Task<List<RecentTransactionResponse>> GetRecentTransactionsAsync(int limit = 10);
        Task<List<LowStockProductResponse>> GetLowStockAlertsAsync(int limit = 10);
        Task<FullDashboardResponse> GetFullDashboardAsync(string timeframe = "1Y");
        Task BroadcastDashboardUpdateAsync();
    }
}
