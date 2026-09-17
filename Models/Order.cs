using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.Models
{
    public class Order
    {
        public Guid Id { get; set; }

        public string Code { get; set; } = string.Empty;

        // Khóa ngoại liên kết tới Ca làm việc thu ngân (Shift)
        public Guid? ShiftId { get; set; }
        public virtual Shift? Shift { get; set; }

        // Khách hàng mua hàng (nullable nếu khách lẻ)
        public Guid? CustomerId { get; set; }
        public string CustomerName { get; set; } = "Khách lẻ vãng lai";
        public string? CustomerPhone { get; set; }

        // Thu ngân thực hiện giao dịch (Cashier)
        public Guid? CashierId { get; set; }
        public virtual Employee? Cashier { get; set; }
        public string CashierName { get; set; } = string.Empty;

        // Tiền hàng & Chiết khấu
        public decimal Subtotal { get; set; } = 0;
        public decimal DiscountPercent { get; set; } = 0;
        public decimal DiscountAmount { get; set; } = 0;
        public decimal VatAmount { get; set; } = 0;
        public decimal Total { get; set; } = 0;

        // Thanh toán & Tiền thối
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;
        public decimal AmountReceived { get; set; } = 0;
        public decimal ChangeAmount { get; set; } = 0;

        public OrderStatus Status { get; set; } = OrderStatus.Completed;

        public string? Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Danh sách các mặt hàng trong đơn
        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
