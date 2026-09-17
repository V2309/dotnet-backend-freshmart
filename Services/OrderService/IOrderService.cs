using dotnet_backend_freshmart.DTOs.Order;

namespace dotnet_backend_freshmart.Services.OrderService
{
    public interface IOrderService
    {
        Task<OrderResponse> CheckoutAsync(CheckoutRequest request, Guid currentUserId);
        Task<IEnumerable<OrderResponse>> GetAllAsync(OrderFilterParams filterParams);
        Task<OrderResponse> GetByIdAsync(Guid id);
        Task<OrderResponse> GetByCodeAsync(string code);
        Task<OrderResponse> CancelOrderAsync(Guid id, string reason, Guid currentUserId);
        VietQrResponse GenerateVietQr(decimal amount, string? orderCode);
    }
}
