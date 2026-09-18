namespace dotnet_backend_freshmart.DTOs.Dashboard
{
    public class RecentTransactionResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = "Sale"; // "Sale" | "Purchase"
        public string Code { get; set; } = string.Empty;
        public string PartnerName { get; set; } = string.Empty; // CustomerName or SupplierName
        public string ProductName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string StatusColor { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string FormattedDate { get; set; } = string.Empty;
    }

    public class LowStockProductResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal CostPrice { get; set; }
        public decimal SellPrice { get; set; }
        public int Stock { get; set; }
        public int MinStock { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class TopSellingProductResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal SellPrice { get; set; }
        public int QuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class TopCustomerResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Tier { get; set; } = string.Empty;
        public int Points { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class MonthlyStatPoint
    {
        public string Month { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public decimal Expense { get; set; }
    }

    public class HeatmapHourRow
    {
        public string Time { get; set; } = string.Empty;
        public List<int> Values { get; set; } = []; // T2 -> CN (7 days)
    }

    public class FullDashboardResponse
    {
        public DashboardKpiResponse Kpis { get; set; } = new();
        public SalesPurchaseChartResponse Chart { get; set; } = new();
        public CategorySalesPieResponse CategoryStats { get; set; } = new();
        public List<RecentTransactionResponse> RecentTransactions { get; set; } = [];
        public List<LowStockProductResponse> LowStockProducts { get; set; } = [];
        public List<TopSellingProductResponse> TopSellingProducts { get; set; } = [];
        public List<TopCustomerResponse> TopCustomers { get; set; } = [];
        public List<MonthlyStatPoint> MonthlyStats { get; set; } = [];
        public List<HeatmapHourRow> Heatmap { get; set; } = [];
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
