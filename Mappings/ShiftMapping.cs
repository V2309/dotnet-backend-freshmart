using dotnet_backend_freshmart.DTOs.Shift;
using dotnet_backend_freshmart.Models;

namespace dotnet_backend_freshmart.Mappings
{
    /// <summary>
    /// Extension methods để map Shift entity sang ShiftResponse DTO.
    /// Chuẩn kiến trúc: Tách biệt Mapping độc lập tại Mappings/
    /// </summary>
    public static class ShiftMapping
    {
        public static ShiftResponse ToResponse(this Shift shift) =>
            new()
            {
                Id = shift.Id,
                EmployeeId = shift.EmployeeId,
                CashierName = shift.Employee?.Name ?? string.Empty,
                CashierCode = shift.Employee?.Code ?? string.Empty,
                ShiftName = shift.ShiftName,
                StartTime = shift.StartTime,
                EndTime = shift.EndTime,
                StartingCash = shift.StartingCash,
                ExpectedCash = shift.ExpectedCash,
                ActualCash = shift.ActualCash,
                Difference = shift.ActualCash.HasValue ? shift.ActualCash.Value - shift.ExpectedCash : null,
                TotalRevenue = shift.TotalRevenue,
                OrderCount = shift.OrderCount,
                Status = shift.Status,
                Notes = shift.Notes,
                CreatedAt = shift.CreatedAt,
                UpdatedAt = shift.UpdatedAt
            };
    }
}
