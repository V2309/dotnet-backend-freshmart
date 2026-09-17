namespace dotnet_backend_freshmart.DTOs.Order
{
    public class VietQrResponse
    {
        public string QrUrl { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BankAccount { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string TransferContent { get; set; } = string.Empty;
    }
}
