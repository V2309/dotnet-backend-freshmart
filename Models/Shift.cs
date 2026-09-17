using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
    public class Shift
    {
        public Guid Id { get; set; }

        public Guid EmployeeId { get; set; }

        // Khóa ngoại liên kết tới Nhân viên thu ngân (Employee)
        public virtual Employee? Employee { get; set; }

        public string ShiftName { get; set; } = string.Empty;

        public DateTime StartTime { get; set; } = DateTime.UtcNow;

        public DateTime? EndTime { get; set; }

        public decimal StartingCash { get; set; } = 0;

        public decimal ExpectedCash { get; set; } = 0;

        public decimal? ActualCash { get; set; }

        public decimal TotalRevenue { get; set; } = 0;

        public int OrderCount { get; set; } = 0;

        public ShiftStatus Status { get; set; } = ShiftStatus.Active;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
