using dotnet_backend_freshmart.DTOs.Supplier;

namespace dotnet_backend_freshmart.Services.SupplierService
{
    public interface ISupplierService
    {
        Task<IEnumerable<SupplierResponse>> GetAllAsync(SupplierFilterParams filterParams);
        Task<SupplierResponse> GetByIdAsync(Guid id);
        Task<SupplierResponse> CreateAsync(CreateSupplierRequest request);
        Task<SupplierResponse> UpdateAsync(Guid id, UpdateSupplierRequest request);
        Task<SupplierResponse> ToggleStatusAsync(Guid id);
        Task DeleteAsync(Guid id);
    }
}
