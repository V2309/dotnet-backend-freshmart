using dotnet_backend_freshmart.DTOs.Auth;
using dotnet_backend_freshmart.DTOs.Employee;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    /// <summary>
    /// Extension methods để map Employee entity sang các DTOs.
    /// Theo convention: Mapping nằm ở Mappings/, không ở Controller hay Service.
    /// </summary>
    public static class EmployeeMapping
    {
        /// <summary>
        /// Map sang EmployeeResponse đầy đủ cho module Quản lý Nhân viên.
        /// </summary>
        public static EmployeeResponse ToResponse(this Employee employee) =>
            new()
            {
                Id = employee.Id,
                Code = employee.Code,
                Name = employee.Name,
                Phone = employee.Phone,
                Email = employee.Email,
                Role = employee.Role.ToString(),
                IsActive = employee.IsActive,
                HiredDate = employee.HiredDate,
                Notes = employee.Notes,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt
            };
        /// <summary>
        /// Map sang EmployeeResponseDto gọn cho module Auth (Login/Register).
        /// </summary>
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
