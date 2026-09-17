using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Customer
{
    public class CustomerResponse
    {
        public Guid Id { get; set; }

        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public DateOnly? BirthDate { get; set; }

        public string? Gender { get; set; }

        public int Points { get; set; }

        public decimal TotalSpent { get; set; }

        public LoyaltyTier Tier { get; set; }

        public string? LastVisit { get; set; }

        public bool IsActive { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
