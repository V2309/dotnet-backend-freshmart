namespace dotnet_backend_freshmart.DTOs.Report
{
    public class DailyRevenueComparisonResponse
    {
        public string Day { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public decimal Target { get; set; }
    }
}
