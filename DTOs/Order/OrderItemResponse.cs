namespace dotnet_backend_freshmart.DTOs.Order
{
    public class OrderItemResponse
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal CostPrice { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal LineTotal { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
