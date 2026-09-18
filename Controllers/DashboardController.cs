using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Dashboard;
using dotnet_backend_freshmart.Services.DashboardService;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("full")]
        public async Task<ActionResult<ApiResponse<FullDashboardResponse>>> GetFullDashboard([FromQuery] string timeframe = "1Y")
        {
            var data = await _dashboardService.GetFullDashboardAsync(timeframe);
            return Ok(ApiResponse<FullDashboardResponse>.Ok(data, "Lấy toàn bộ dữ liệu Dashboard thành công"));
        }

        [HttpGet("kpi-summary")]
        public async Task<ActionResult<ApiResponse<DashboardKpiResponse>>> GetKpiSummary()
        {
            var data = await _dashboardService.GetKpiSummaryAsync();
            return Ok(ApiResponse<DashboardKpiResponse>.Ok(data, "Lấy tổng hợp KPIs thành công"));
        }

        [HttpGet("sales-purchase-chart")]
        public async Task<ActionResult<ApiResponse<SalesPurchaseChartResponse>>> GetSalesPurchaseChart([FromQuery] string timeframe = "1Y")
        {
            var data = await _dashboardService.GetSalesPurchaseChartAsync(timeframe);
            return Ok(ApiResponse<SalesPurchaseChartResponse>.Ok(data, "Lấy dữ liệu biểu đồ doanh số & nhập hàng thành công"));
        }

        [HttpGet("category-sales-pie")]
        public async Task<ActionResult<ApiResponse<CategorySalesPieResponse>>> GetCategorySalesPie()
        {
            var data = await _dashboardService.GetCategorySalesPieAsync();
            return Ok(ApiResponse<CategorySalesPieResponse>.Ok(data, "Lấy cơ cấu danh mục thành công"));
        }

        [HttpGet("recent-transactions")]
        public async Task<ActionResult<ApiResponse<List<RecentTransactionResponse>>>> GetRecentTransactions([FromQuery] int limit = 10)
        {
            var data = await _dashboardService.GetRecentTransactionsAsync(limit);
            return Ok(ApiResponse<List<RecentTransactionResponse>>.Ok(data, "Lấy danh sách giao dịch gần đây thành công"));
        }

        [HttpGet("low-stock-alert")]
        public async Task<ActionResult<ApiResponse<List<LowStockProductResponse>>>> GetLowStockAlert([FromQuery] int limit = 10)
        {
            var data = await _dashboardService.GetLowStockAlertsAsync(limit);
            return Ok(ApiResponse<List<LowStockProductResponse>>.Ok(data, "Lấy danh sách cảnh báo tồn kho thành công"));
        }
    }
}
