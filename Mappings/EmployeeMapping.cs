using dotnet_backend_freshmart.DTOs.Auth;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    /// <summary>
    /// Extension methods để map Employee entity sang các DTOs.
    /// Theo convention: Mapping nằm ở Mappings/, không ở Controller hay Service.
    /// </summary>
    public static class EmployeeMapping
    {
        public static EmployeeResponseDto ToResponseDto(this Employee employee) =>
            new()
            {
                Id = employee.Id,
                Code = employee.Code,
                Name = employee.Name,
                Phone = employee.Phone,
                Email = employee.Email,
                Role = employee.Role.ToString(),
                IsActive = employee.IsActive
            };
    }
}
