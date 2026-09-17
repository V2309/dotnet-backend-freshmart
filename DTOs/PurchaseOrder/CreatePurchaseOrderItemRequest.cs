using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.PurchaseOrder
{
    public class CreatePurchaseOrderItemRequest
    {
        [Required(ErrorMessage = "Mã sản phẩm là bắt buộc.")]
        public Guid ProductId { get; set; }

        [Required(ErrorMessage = "Số lượng nhập là bắt buộc.")]
        [Range(1, 1000000, ErrorMessage = "Số lượng nhập phải lớn hơn 0.")]
        public int QuantityOrdered { get; set; }

        [Required(ErrorMessage = "Đơn giá nhập là bắt buộc.")]
        [Range(0, 10000000000, ErrorMessage = "Đơn giá nhập không được âm.")]
        public decimal UnitCost { get; set; }
    }
}
