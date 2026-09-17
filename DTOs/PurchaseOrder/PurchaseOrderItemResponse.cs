namespace dotnet_backend_freshmart.DTOs.PurchaseOrder
{
    public class PurchaseOrderItemResponse
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; }
        public decimal UnitCost { get; set; }
        public decimal LineTotal { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
