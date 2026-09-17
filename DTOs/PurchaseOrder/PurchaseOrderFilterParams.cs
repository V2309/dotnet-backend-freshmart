using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.PurchaseOrder
{
    public class PurchaseOrderFilterParams
    {
        public string? Search { get; set; }
        public PurchaseStatus? Status { get; set; }
        public Guid? SupplierId { get; set; }
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 50;
    }
}
