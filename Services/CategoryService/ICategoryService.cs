using dotnet_backend_freshmart.DTOs.Category;

namespace dotnet_backend_freshmart.Services.CategoryService
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponse>> GetAllAsync(bool includeInactive = false);
        Task<CategoryResponse> GetByIdAsync(Guid id);
        Task<CategoryResponse> CreateAsync(CreateCategoryRequest request);
        Task<CategoryResponse> UpdateAsync(Guid id, UpdateCategoryRequest request);
        Task DeleteAsync(Guid id);
    }
}
