using dotnet_backend_freshmart.DTOs.Inventory;

namespace dotnet_backend_freshmart.Services.InventoryService
{
    public interface IInventoryService
    {
        Task<InventoryOverviewResponse> GetOverviewAsync();
        Task<InventoryAdjustmentResponse> AdjustStockAsync(AdjustStockRequest request, Guid? employeeId = null);
        Task<IEnumerable<InventoryAdjustmentResponse>> GetHistoryAsync(InventoryAdjustmentFilterParams filterParams);
    }
}
