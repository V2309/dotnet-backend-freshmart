using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Shift
{
    public class ShiftResponse
    {
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        public string CashierName { get; set; } = string.Empty;

        public string CashierCode { get; set; } = string.Empty;

        public string ShiftName { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public decimal StartingCash { get; set; }

        public decimal ExpectedCash { get; set; }

        public decimal? ActualCash { get; set; }

        public decimal? Difference { get; set; }

        public decimal TotalRevenue { get; set; }

        public int OrderCount { get; set; }

        public ShiftStatus Status { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
