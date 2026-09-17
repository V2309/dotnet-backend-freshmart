using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Inventory
{
    public class InventoryAdjustmentFilterParams
    {
        public Guid? ProductId { get; set; }
        public Guid? EmployeeId { get; set; }
        public AdjustReason? Reason { get; set; }
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 50;
    }
}
