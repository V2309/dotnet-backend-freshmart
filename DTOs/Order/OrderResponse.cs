using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Order
{
    public class OrderResponse
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public Guid? ShiftId { get; set; }
        public string? ShiftName { get; set; }
        public Guid? CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }
        public Guid? CashierId { get; set; }
        public string CashierName { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal VatAmount { get; set; }
        public decimal Total { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public decimal AmountReceived { get; set; }
        public decimal ChangeAmount { get; set; }
        public OrderStatus Status { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderItemResponse> Items { get; set; } = new();
    }
}
