using dotnet_backend_freshmart.DTOs.Employee;

namespace dotnet_backend_freshmart.Services.EmployeeService
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeResponse>> GetAllAsync(EmployeeFilterParams filterParams);
        Task<EmployeeResponse> GetByIdAsync(Guid id);
        Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest request);
        Task<EmployeeResponse> UpdateAsync(Guid id, UpdateEmployeeRequest request);
        Task<EmployeeResponse> ToggleStatusAsync(string identifier);
        Task ResetPinAsync(Guid id, ResetPinRequest request);
        Task DeleteAsync(Guid id);
    }
}
