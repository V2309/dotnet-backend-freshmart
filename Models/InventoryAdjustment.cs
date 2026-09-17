using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
    public class InventoryAdjustment
    {
        public Guid Id { get; set; }

        public Guid ProductId { get; set; }
        public virtual Product? Product { get; set; }

        public Guid? EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; }

        public AdjustReason Reason { get; set; } = AdjustReason.StockCount;

        public int QtyBefore { get; set; } = 0;
        public int QtyChange { get; set; } = 0;
        public int QtyAfter { get; set; } = 0;

        public string? Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
