using dotnet_backend_freshmart.DTOs.Supplier;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    /// <summary>
    /// Extension methods để map Supplier entity sang SupplierResponse DTO.
    /// Theo convention: Mapping nằm ở Mappings/, không viết lẫn vào Controller hay Service.
    /// </summary>
    public static class SupplierMapping
    {
        public static SupplierResponse ToResponse(this Supplier supplier, int productCount = 0) =>
            new()
            {
                Id = supplier.Id,
                Code = supplier.Code,
                Name = supplier.Name,
                ContactName = supplier.ContactName,
                Phone = supplier.Phone,
                Email = supplier.Email,
                Address = supplier.Address,
                TaxCode = supplier.TaxCode,
                BankAccount = supplier.BankAccount,
                BankName = supplier.BankName,
                IsActive = supplier.IsActive,
                Notes = supplier.Notes,
                ProductCount = productCount,
                CreatedAt = supplier.CreatedAt,
                UpdatedAt = supplier.UpdatedAt
            };
    }
}
