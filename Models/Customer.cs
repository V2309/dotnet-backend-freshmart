using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
    public class Customer
    {
        public Guid Id { get; set; }

        public string Code { get; set; } = string.Empty; // Mã KH: KH000001, KH000002...

        public string Name { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public DateOnly? BirthDate { get; set; }

        public string? Gender { get; set; }

        public int Points { get; set; } = 0;

        public decimal TotalSpent { get; set; } = 0;

        public LoyaltyTier Tier { get; set; } = LoyaltyTier.Deal;

        public DateOnly? LastVisit { get; set; }

        public bool IsActive { get; set; } = true;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Quan hệ 1 Khách hàng có thể có nhiều Đơn hàng
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
