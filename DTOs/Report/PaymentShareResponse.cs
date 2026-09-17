using System.Collections.Generic;

namespace dotnet_backend_freshmart.DTOs.Report
{
    public class PaymentShareItem
    {
        public string Name { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public int Count { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class PaymentShareResponse
    {
        public decimal VietQrTotal { get; set; }
        public int VietQrCount { get; set; }

        public decimal CashTotal { get; set; }
        public int CashCount { get; set; }

        public decimal PosTotal { get; set; }
        public int PosCount { get; set; }

        public List<PaymentShareItem> Items { get; set; } = new();
    }
}
