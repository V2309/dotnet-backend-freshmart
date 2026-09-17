using dotnet_backend_freshmart.DTOs.Product;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    /// <summary>
    /// Extension methods để map Product entity sang ProductResponse DTO.
    /// Theo convention: Mapping nằm ở Mappings/, không viết lẫn vào Controller hay Service.
    /// </summary>
    public static class ProductMapping
    {
        public static ProductResponse ToResponse(this Product product) =>
            new()
            {
                Id = product.Id,
                Sku = product.Sku,
                Barcode = product.Barcode,
                Name = product.Name,
                Description = product.Description,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? string.Empty,
                CategorySlug = product.Category?.Slug ?? string.Empty,
                SupplierId = product.SupplierId,
                SupplierName = product.Supplier?.Name,
                Unit = product.Unit,
                CostPrice = product.CostPrice,
                SellPrice = product.SellPrice,
                VatRate = product.VatRate,
                Stock = product.Stock,
                MinStock = product.MinStock,
                ImageUrl = product.ImageUrl,
                Status = product.Status,
                IsActive = product.IsActive,
                ExpiryDate = product.ExpiryDate,
                Notes = product.Notes,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
    }
}
