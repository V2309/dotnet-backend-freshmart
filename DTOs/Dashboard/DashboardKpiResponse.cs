namespace dotnet_backend_freshmart.DTOs.Dashboard
{
    public class DashboardKpiResponse
    {
        // 4 Hero Cards
        public decimal TotalSalesRevenue { get; set; }
        public decimal TotalSalesReturn { get; set; }
        public decimal TotalPurchaseValue { get; set; }
        public decimal TotalPurchaseReturn { get; set; }

        // 4 Detailed Metrics
        public decimal GrossProfit { get; set; }
        public decimal InvoiceDue { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalPaymentReturns { get; set; }

        // Overall Counts
        public int TotalSalesCount { get; set; }
        public int TotalPurchasesCount { get; set; }
        public int TotalCustomersCount { get; set; }
        public int TotalProductsCount { get; set; }
        public int TotalSuppliersCount { get; set; }
        public int TotalCategoriesCount { get; set; }

        // Customer breakdown
        public int FirstTimeCustomersCount { get; set; }
        public int VipCustomersCount { get; set; }
    }
}
