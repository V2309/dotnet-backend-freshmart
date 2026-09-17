using dotnet_backend_freshmart.DTOs.Customer;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    /// <summary>
    /// Extension methods để map Customer entity sang CustomerResponse DTO.
    /// Theo convention: Mapping nằm ở Mappings/, không viết lẫn vào Controller hay Service.
    /// </summary>
    public static class CustomerMapping
    {
        public static CustomerResponse ToResponse(this Customer c) =>
            new()
            {
                Id = c.Id,
                Code = c.Code,
                Name = c.Name,
                Phone = c.Phone,
                Email = c.Email,
                Address = c.Address,
                BirthDate = c.BirthDate,
                Gender = c.Gender,
                Points = c.Points,
                TotalSpent = c.TotalSpent,
                Tier = c.Tier,
                LastVisit = c.LastVisit?.ToString("yyyy-MM-dd"),
                IsActive = c.IsActive,
                Notes = c.Notes,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            };
    }
}
