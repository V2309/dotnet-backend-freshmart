namespace dotnet_backend_freshmart.DTOs.Dashboard
{
    public class SalesPurchaseChartPoint
    {
        public string Time { get; set; } = string.Empty;
        public decimal Purchase { get; set; }
        public decimal Sales { get; set; }
    }

    public class SalesPurchaseChartResponse
    {
        public string Timeframe { get; set; } = "1Y";
        public decimal TotalPurchase { get; set; }
        public decimal TotalSales { get; set; }
        public List<SalesPurchaseChartPoint> Data { get; set; } = [];
    }
}
