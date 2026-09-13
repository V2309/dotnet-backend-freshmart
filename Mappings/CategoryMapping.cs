using dotnet_backend_freshmart.DTOs.Category;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    // <summary>
    /// Extension methods để map Category entity sang CategoryResponse DTO.
    /// Theo convention: Mapping nằm ở Mappings/, không viết lẫn vào Controller hay Service.
    /// </summary>
    public static class CategoryMapping
    {
        public static CategoryResponse ToResponse(this Category category, int productCount = 0) =>
            new()
            {
                Id = category.Id,
                Slug = category.Slug,
                Name = category.Name,
                Icon = category.Icon,
                SortOrder = category.SortOrder,
                IsActive = category.IsActive,
                ProductCount = productCount,
                CreatedAt = category.CreatedAt
            };
    }
}
