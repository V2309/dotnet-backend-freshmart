using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.PurchaseOrder
{
    public class CreatePurchaseOrderRequest
    {
        [Required(ErrorMessage = "Nhà cung cấp là bắt buộc.")]
        public Guid SupplierId { get; set; }

        public DateOnly? ExpectedDate { get; set; }

        public string? Notes { get; set; }

        [Required(ErrorMessage = "Danh sách hàng hóa nhập là bắt buộc.")]
        [MinLength(1, ErrorMessage = "Phiếu nhập phải có ít nhất 1 mặt hàng.")]
        public List<CreatePurchaseOrderItemRequest> Items { get; set; } = new();
    }
}
