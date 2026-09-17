using dotnet_backend_freshmart.DTOs.Shift;

namespace dotnet_backend_freshmart.Services.ShiftService
{
    public interface IShiftService
    {
        Task<ShiftResponse?> GetCurrentShiftAsync(Guid? employeeId = null);
        Task<ShiftResponse> OpenShiftAsync(OpenShiftRequest request, Guid currentEmployeeId);
        Task<ShiftResponse> CloseShiftAsync(Guid id, CloseShiftRequest request, Guid currentEmployeeId);
        Task<IEnumerable<ShiftResponse>> GetAllShiftsAsync(Guid? employeeId = null, DateTime? fromDate = null, DateTime? toDate = null);
        Task<ShiftResponse> GetShiftByIdAsync(Guid id);
        Task<ShiftReportResponse> GetShiftReportAsync(Guid id);
    }
}
