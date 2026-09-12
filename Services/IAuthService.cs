using dotnet_backend_freshmart.DTOs.Auth;

namespace dotnet_backend_freshmart.Services
{
    public interface IAuthService
    {
        /// <summary>Đăng ký nhân viên mới (public). Trả về JWT + thông tin employee.</summary>
        Task<AuthResponseDto> RegisterAsync(RegisterEmployeeDto dto);

        /// <summary>Đăng nhập bằng Code/Email/Phone + PIN.</summary>
        Task<AuthResponseDto> LoginAsync(LoginDto dto);

        /// <summary>Đăng nhập nhanh tại quầy POS bằng EmployeeCode + PIN.</summary>
        Task<AuthResponseDto> LoginPinAsync(LoginPinDto dto);
    }
}
