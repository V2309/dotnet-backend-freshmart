using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Order
{
    public class OrderFilterParams
    {
        public string? Search { get; set; }
        public Guid? ShiftId { get; set; }
        public Guid? CustomerId { get; set; }
        public Guid? CashierId { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public OrderStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 50;
    }
}
