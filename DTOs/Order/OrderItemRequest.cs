using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Order
{
    public class OrderItemRequest
    {
        [Required(ErrorMessage = "ProductId là bắt buộc.")]
        public Guid ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string Sku { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Số lượng mua phải lớn hơn 0.")]
        public int Quantity { get; set; } = 1;

        [Range(0, double.MaxValue, ErrorMessage = "Đơn giá phải >= 0.")]
        public decimal UnitPrice { get; set; }

        public decimal DiscountPercent { get; set; } = 0;

        public decimal LineTotal { get; set; }
    }
}
