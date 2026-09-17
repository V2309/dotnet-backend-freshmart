using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Shift
{
    public class ShiftReportResponse
    {
        public Guid ShiftId { get; set; }

        public string ShiftName { get; set; } = string.Empty;

        public string CashierName { get; set; } = string.Empty;

        public string CashierCode { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public ShiftStatus Status { get; set; }

        // Báo cáo chi tiết các phương thức thanh toán
        public decimal StartingCash { get; set; }

        public decimal CashSales { get; set; }

        public decimal VietQRSales { get; set; }

        public decimal CardSales { get; set; }

        public decimal TotalRevenue { get; set; }

        public decimal ExpectedCash { get; set; }

        public decimal? ActualCash { get; set; }

        public decimal? CashDifference { get; set; }

        // Chỉ số vận hành
        public int TotalOrders { get; set; }

        public decimal AverageOrderValue { get; set; }

        public string? Notes { get; set; }
    }
}
