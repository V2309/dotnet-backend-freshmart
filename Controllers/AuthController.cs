using dotnet_backend_freshmart.DTOs.Auth;
using dotnet_backend_freshmart.DTOs.Common;
using dotnet_backend_freshmart.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace dotnet_backend_freshmart.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // 1. ĐĂNG KÝ NHÂN VIÊN MỚI (public)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterEmployeeDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<AuthResponseDto>.Ok(result, "Đăng ký nhân viên thành công"));
        }

        // 2. ĐĂNG NHẬP (Code / Email / Phone + PIN)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Đăng nhập thành công"));
        }

        // 3. ĐĂNG NHẬP NHANH TẠI QUẦY POS
        [HttpPost("login-pin")]
        public async Task<IActionResult> LoginPin([FromBody] LoginPinDto dto)
        {
            var result = await _authService.LoginPinAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Đăng nhập POS thành công"));
        }

        // 4. ĐĂNG XUẤT
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // JWT stateless: client hủy token ở phía mình.
            // Endpoint này phục vụ audit log hoặc xác nhận phía client.
            return Ok(ApiResponse.OkNoData("Đăng xuất thành công."));
        }

        // 5. THÔNG TIN USER HIỆN TẠI (đọc từ JWT claims, không query DB)
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var currentUser = new CurrentUserDto
            {
                Id = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString()),
                Code = User.FindFirstValue("Code") ?? string.Empty,
                Name = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty,
                Role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty,
                Email = User.FindFirstValue(ClaimTypes.Email)
            };

            return Ok(ApiResponse<CurrentUserDto>.Ok(currentUser));
        }

        // 6. TEST PHÂN QUYỀN CHỈ ADMIN
        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult TestAdminOnly()
        {
            return Ok(ApiResponse.OkNoData("Xin chào Quản trị viên! Bạn có quyền truy cập khu vực này."));
        }
    }
}
