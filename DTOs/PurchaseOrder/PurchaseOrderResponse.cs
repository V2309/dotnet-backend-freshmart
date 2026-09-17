using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.PurchaseOrder
{
    public class PurchaseOrderResponse
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public Guid SupplierId { get; set; }
        public string SupplierName { get; set; } = string.Empty;
        public Guid? CreatedById { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public DateOnly? ExpectedDate { get; set; }
        public DateOnly? ReceivedDate { get; set; }
        public int TotalItems { get; set; }
        public decimal TotalValue { get; set; }
        public decimal PaidAmount { get; set; }
        public PurchaseStatus Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<PurchaseOrderItemResponse> Items { get; set; } = new();
    }
}
