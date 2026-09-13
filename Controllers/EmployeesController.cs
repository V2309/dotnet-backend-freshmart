using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Employee;
using dotnet_backend_freshmart.Services;
using dotnet_backend_freshmart.Services.EmployeeService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    // Chỉ Quản trị viên (Admin) hoặc Quản lý cửa hàng (StoreManager) mới được truy cập
    [Authorize(Roles = "Admin,StoreManager")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        // Constructor Injection: Tiêm interface IEmployeeService đã đăng ký DI
        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        /// <summary>
        /// 1. GET /api/v1/employees
        /// Lấy danh sách nhân viên có hỗ trợ tìm kiếm (Tên/SĐT/Mã), lọc vai trò (Role), trạng thái và phân trang.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] EmployeeFilterParams filterParams)
        {
            var result = await _employeeService.GetAllAsync(filterParams);
            return Ok(ApiResponse<IEnumerable<EmployeeResponse>>.Ok(result, "Lấy danh sách nhân viên thành công"));
        }

        /// <summary>
        /// 2. GET /api/v1/employees/{id}
        /// Lấy thông tin chi tiết của 1 nhân viên theo Id (GUID).
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _employeeService.GetByIdAsync(id);
            return Ok(ApiResponse<EmployeeResponse>.Ok(result, "Lấy thông tin nhân viên thành công"));
        }

        /// <summary>
        /// 3. POST /api/v1/employees
        /// Thêm nhân viên mới vào hệ thống (tự sinh mã NVxxxxxx, băm mã PIN).
        /// Trả về mã HTTP 201 Created.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeRequest request)
        {
            var result = await _employeeService.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<EmployeeResponse>.Ok(result, "Thêm nhân viên mới thành công"));
        }

        /// <summary>
        /// 4. PUT /api/v1/employees/{id}
        /// Cập nhật thông tin cơ bản của nhân viên (Họ tên, SĐT, Email, Role, Ngày nhận việc, Ghi chú).
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEmployeeRequest request)
        {
            var result = await _employeeService.UpdateAsync(id, request);
            return Ok(ApiResponse<EmployeeResponse>.Ok(result, "Cập nhật thông tin nhân viên thành công"));
        }

        /// <summary>
        /// 5. PATCH /api/v1/employees/{id}/status
        /// Khóa hoặc Mở khóa tài khoản nhân viên (đảo ngược giá trị IsActive).
        /// </summary>
        [HttpPatch("{identifier}/status")]
        public async Task<IActionResult> ToggleStatus(string identifier)
        {
            var result = await _employeeService.ToggleStatusAsync(identifier);
            var message = result.IsActive ? "Đã kích hoạt tài khoản nhân viên" : "Đã khóa tài khoản nhân viên";
            return Ok(ApiResponse<EmployeeResponse>.Ok(result, message));
        }

        /// <summary>
        /// 6. PATCH /api/v1/employees/{id}/reset-pin
        /// Cấp lại mã PIN mới cho nhân viên (Chỉ riêng vai trò Admin mới có quyền thực hiện).
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id:guid}/reset-pin")]
        public async Task<IActionResult> ResetPin(Guid id, [FromBody] ResetPinRequest request)
        {
            await _employeeService.ResetPinAsync(id, request);
            return Ok(ApiResponse.OkNoData("Cấp lại mã PIN cho nhân viên thành công."));
        }

        /// <summary>
        /// 7. DELETE /api/v1/employees/{id}
        /// Xóa hoàn toàn nhân viên khỏi hệ thống (Chỉ dành riêng cho Admin).
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _employeeService.DeleteAsync(id);
            return Ok(ApiResponse.OkNoData("Xóa nhân viên thành công."));
        }
    }
}
