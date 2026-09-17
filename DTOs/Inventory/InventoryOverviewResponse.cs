namespace dotnet_backend_freshmart.DTOs.Inventory
{
    public class InventoryOverviewResponse
    {
        public int LowStockCount { get; set; }
        public int OutOfStockCount { get; set; }
        public decimal TotalStockValue { get; set; }
        public int TotalStockItems { get; set; }
    }
}
