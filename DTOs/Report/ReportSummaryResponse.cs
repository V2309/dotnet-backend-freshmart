namespace dotnet_backend_freshmart.DTOs.Report
{
    public class ReportSummaryResponse
    {
        public decimal TotalRevenue { get; set; }
        public decimal TotalVAT { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal GrossProfit { get; set; }
        public int OrderCount { get; set; }
        public string Timeframe { get; set; } = "month";
    }
}
