using dotnet_backend_freshmart.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Order
{
    public class CheckoutRequest
    {
        public Guid? ShiftId { get; set; }

        public Guid? CustomerId { get; set; }

        public string CustomerName { get; set; } = "Khách lẻ vãng lai";

        public string? CustomerPhone { get; set; }

        public Guid? CashierId { get; set; }

        public string? CashierName { get; set; }

        [Required(ErrorMessage = "Danh sách sản phẩm mua không được để trống.")]
        [MinLength(1, ErrorMessage = "Đơn hàng phải có ít nhất 1 sản phẩm.")]
        public List<OrderItemRequest> Items { get; set; } = new();

        public decimal Subtotal { get; set; }

        public decimal DiscountPercent { get; set; } = 0;

        public decimal DiscountAmount { get; set; } = 0;

        public decimal VatRate { get; set; } = 8.00m;

        public decimal VatAmount { get; set; } = 0;

        [Required(ErrorMessage = "Tổng tiền thanh toán là bắt buộc.")]
        [Range(0, double.MaxValue, ErrorMessage = "Tổng tiền thanh toán phải >= 0.")]
        public decimal Total { get; set; }

        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;

        public decimal AmountReceived { get; set; } = 0;

        public decimal ChangeAmount { get; set; } = 0;

        public string? Note { get; set; }
    }
}
