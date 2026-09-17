namespace dotnet_backend_freshmart.DTOs.Report
{
    public class HourlyRevenueTrendResponse
    {
        public string Time { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Orders { get; set; }
        public decimal Vat { get; set; }
    }
}
