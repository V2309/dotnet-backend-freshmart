using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_backend_freshmart.DTOs.Report;

namespace dotnet_backend_freshmart.Services.ReportService
{
    public interface IReportService
    {
        Task<ReportSummaryResponse> GetSummaryAsync(string timeframe = "month");
        Task<PaymentShareResponse> GetPaymentShareAsync(string timeframe = "month");
        Task<IEnumerable<HourlyRevenueTrendResponse>> GetRevenueTrendAsync(string timeframe = "day");
        Task<IEnumerable<DailyRevenueComparisonResponse>> GetDailyComparisonAsync(string timeframe = "week");
    }
}
