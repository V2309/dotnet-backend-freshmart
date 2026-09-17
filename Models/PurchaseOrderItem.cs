namespace dotnet_backend_freshmart.Models
{
    public class PurchaseOrderItem
    {
        public Guid Id { get; set; }

        public Guid PurchaseOrderId { get; set; }
        public virtual PurchaseOrder? PurchaseOrder { get; set; }

        public Guid ProductId { get; set; }
        public virtual Product? Product { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;

        public int QuantityOrdered { get; set; } = 1;
        public int QuantityReceived { get; set; } = 0;

        public decimal UnitCost { get; set; } = 0;
        public decimal LineTotal { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
