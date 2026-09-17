using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
    public class PurchaseOrder
    {
        public Guid Id { get; set; }

        public string Code { get; set; } = string.Empty;

        // Nhà cung cấp
        public Guid SupplierId { get; set; }
        public virtual Supplier? Supplier { get; set; }
        public string SupplierName { get; set; } = string.Empty;

        // Nhân viên tạo đơn nhập
        public Guid? CreatedById { get; set; }
        public virtual Employee? CreatedBy { get; set; }
        public string CreatedByName { get; set; } = string.Empty;

        // Thời gian nhận hàng
        public DateOnly? ExpectedDate { get; set; }
        public DateOnly? ReceivedDate { get; set; }

        // Thống kê số lượng & giá trị
        public int TotalItems { get; set; } = 0;
        public decimal TotalValue { get; set; } = 0;
        public decimal PaidAmount { get; set; } = 0;

        // Trạng thái đơn nhập
        public PurchaseStatus Status { get; set; } = PurchaseStatus.Pending;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Danh sách mặt hàng trong phiếu nhập
        public virtual ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    }
}
