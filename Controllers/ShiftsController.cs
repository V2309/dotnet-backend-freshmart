using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.DTOs.Shift;
using dotnet_backend_freshmart.Services.ShiftService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ShiftsController : ControllerBase
    {
        private readonly IShiftService _shiftService;

        public ShiftsController(IShiftService shiftService)
        {
            _shiftService = shiftService;
        }

        private Guid GetCurrentUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idClaim, out var guid) ? guid : Guid.Empty;
        }

        /// <summary>
        /// 1. GET /api/v1/shifts/current
        /// Lấy ca làm việc đang mở (Active) của thu ngân hiện tại hoặc ca active mới nhất của hệ thống.
        /// </summary>
        [HttpGet("current")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCurrentShift([FromQuery] Guid? employeeId)
        {
            var targetEmpId = employeeId ?? (GetCurrentUserId() != Guid.Empty ? GetCurrentUserId() : null);
            var result = await _shiftService.GetCurrentShiftAsync(targetEmpId);
            return Ok(ApiResponse<ShiftResponse?>.Ok(result, result != null ? "Lấy ca làm việc hiện tại thành công" : "Hiện tại chưa có ca làm việc nào đang mở"));
        }

        /// <summary>
        /// 2. POST /api/v1/shifts/open
        /// Mở ca làm việc mới cho thu ngân (khai báo tiền mặt ban đầu và tên ca).
        /// </summary>
        [HttpPost("open")]
        [AllowAnonymous]
        public async Task<IActionResult> OpenShift([FromBody] OpenShiftRequest request)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _shiftService.OpenShiftAsync(request, currentUserId);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<ShiftResponse>.Ok(result, "Mở ca làm việc mới thành công"));
        }

        /// <summary>
        /// 3. POST /api/v1/shifts/{id}/close
        /// Chốt / Đóng ca làm việc (kiểm đếm tiền thực tế trong két và ghi nhận kết thúc ca).
        /// </summary>
        [HttpPost("{id:guid}/close")]
        [AllowAnonymous]
        public async Task<IActionResult> CloseShift(Guid id, [FromBody] CloseShiftRequest request)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _shiftService.CloseShiftAsync(id, request, currentUserId);
            return Ok(ApiResponse<ShiftResponse>.Ok(result, "Chốt ca làm việc thành công"));
        }

        /// <summary>
        /// 4. GET /api/v1/shifts
        /// Lấy danh sách lịch sử các ca làm việc (dành cho quản lý theo dõi doanh thu và nhân sự).
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] Guid? employeeId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var result = await _shiftService.GetAllShiftsAsync(employeeId, fromDate, toDate);
            return Ok(ApiResponse<IEnumerable<ShiftResponse>>.Ok(result, "Lấy danh sách ca làm việc thành công"));
        }

        /// <summary>
        /// 5. GET /api/v1/shifts/{id}
        /// Lấy thông tin chi tiết một ca làm việc theo ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _shiftService.GetShiftByIdAsync(id);
            return Ok(ApiResponse<ShiftResponse>.Ok(result, "Lấy thông tin ca làm việc thành công"));
        }

        /// <summary>
        /// 6. GET /api/v1/shifts/{id}/report
        /// Báo cáo tổng kết chi tiết ca làm việc (doanh thu, tiền mặt, QR, kiểm két).
        /// </summary>
        [HttpGet("{id:guid}/report")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReport(Guid id)
        {
            var result = await _shiftService.GetShiftReportAsync(id);
            return Ok(ApiResponse<ShiftReportResponse>.Ok(result, "Lấy báo cáo tổng kết ca thành công"));
        }
    }
}
