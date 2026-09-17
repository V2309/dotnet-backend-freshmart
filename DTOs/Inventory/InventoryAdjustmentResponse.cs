using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Inventory
{
    public class InventoryAdjustmentResponse
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public Guid? EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public AdjustReason Reason { get; set; }
        public int QtyBefore { get; set; }
        public int QtyChange { get; set; }
        public int QtyAfter { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
