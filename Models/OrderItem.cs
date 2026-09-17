namespace dotnet_backend_freshmart.Models
{
    public class OrderItem
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }
        public virtual Order? Order { get; set; }

        public Guid ProductId { get; set; }
        public virtual Product? Product { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;

        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; } = 0;
        public decimal CostPrice { get; set; } = 0;
        public decimal DiscountPercent { get; set; } = 0;
        public decimal LineTotal { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
