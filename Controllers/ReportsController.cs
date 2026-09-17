using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Report;
using dotnet_backend_freshmart.Services.ReportService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// 1. GET /api/v1/reports/summary?timeframe=day|week|month|year
        /// Lấy tổng quan các chỉ số tài chính (Doanh thu, VAT, Chiết khấu, Lợi nhuận gộp, Số đơn hàng).
        /// </summary>
        [HttpGet("summary")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> GetSummary([FromQuery] string timeframe = "month")
        {
            var result = await _reportService.GetSummaryAsync(timeframe);
            return Ok(ApiResponse<ReportSummaryResponse>.Ok(result, "Lấy tổng quan báo cáo tài chính thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/reports/payment-share?timeframe=day|week|month|year
        /// Cơ cấu doanh thu theo phương thức thanh toán (VietQR, Tiền mặt, Thẻ POS) cho biểu đồ PieChart.
        /// </summary>
        [HttpGet("payment-share")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> GetPaymentShare([FromQuery] string timeframe = "month")
        {
            var result = await _reportService.GetPaymentShareAsync(timeframe);
            return Ok(ApiResponse<PaymentShareResponse>.Ok(result, "Lấy cơ cấu phương thức thanh toán thành công"));
        }

        /// <summary>
        /// 3. GET /api/v1/reports/revenue-trend?timeframe=day|week|month|year
        /// Xu hướng doanh thu & VAT theo từng khung giờ trong ngày cho biểu đồ AreaChart.
        /// </summary>
        [HttpGet("revenue-trend")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> GetRevenueTrend([FromQuery] string timeframe = "day")
        {
            var result = await _reportService.GetRevenueTrendAsync(timeframe);
            return Ok(ApiResponse<IEnumerable<HourlyRevenueTrendResponse>>.Ok(result, "Lấy xu hướng doanh thu theo giờ thành công"));
        }

        /// <summary>
        /// 4. GET /api/v1/reports/daily-comparison?timeframe=week
        /// Doanh thu thực tế so với mục tiêu theo từng ngày trong tuần (Thứ 2 - Chủ nhật) cho biểu đồ BarChart.
        /// </summary>
        [HttpGet("daily-comparison")]
        [Authorize(Roles = "Admin,StoreManager")]
        public async Task<IActionResult> GetDailyComparison([FromQuery] string timeframe = "week")
        {
            var result = await _reportService.GetDailyComparisonAsync(timeframe);
            return Ok(ApiResponse<IEnumerable<DailyRevenueComparisonResponse>>.Ok(result, "Lấy so sánh doanh thu các ngày trong tuần thành công"));
        }
    }
}
