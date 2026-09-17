using dotnet_backend_freshmart.DTOs.PurchaseOrder;

namespace dotnet_backend_freshmart.Services.PurchaseOrderService
{
    public interface IPurchaseOrderService
    {
        Task<IEnumerable<PurchaseOrderResponse>> GetAllAsync(PurchaseOrderFilterParams filterParams);
        Task<PurchaseOrderResponse> GetByIdAsync(Guid id);
        Task<PurchaseOrderResponse> GetByCodeAsync(string code);
        Task<PurchaseOrderResponse> CreateAsync(CreatePurchaseOrderRequest request, Guid? employeeId = null, string? employeeName = null);
        Task<PurchaseOrderResponse> ReceiveAsync(Guid id);
        Task<PurchaseOrderResponse> CancelAsync(Guid id);
        Task DeleteAsync(Guid id);
    }
}
