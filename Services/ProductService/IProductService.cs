using dotnet_backend_freshmart.DTOs.Product;

namespace dotnet_backend_freshmart.Services.ProductService
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponse>> GetAllAsync(ProductFilterParams filterParams);
        Task<ProductResponse> GetByIdAsync(Guid id);
        Task<ProductResponse> GetByBarcodeAsync(string barcode);
        Task<ProductResponse> CreateAsync(CreateProductRequest request);
        Task<ProductResponse> UpdateAsync(Guid id, UpdateProductRequest request);
        Task<ProductResponse> QuickAdjustStockAsync(Guid id, QuickStockRequest request);
        Task<ProductResponse> ToggleStatusAsync(Guid id);
        Task DeleteAsync(Guid id);
    }
}
