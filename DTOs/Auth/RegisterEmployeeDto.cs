using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Auth
{
    public class RegisterEmployeeDto
    {
        [Required(ErrorMessage = "Tên nhân viên là bắt buộc")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string? Email { get; set; }

        /// <summary>
        /// Mã PIN hoặc Mật khẩu lúc đăng ký.
        /// Role mặc định là Cashier – không cho phép client tự chọn Admin qua endpoint public này.
        /// </summary>
        [Required(ErrorMessage = "Mã PIN/Mật khẩu là bắt buộc")]
        [MinLength(4, ErrorMessage = "Mã PIN/Mật khẩu tối thiểu 4 ký tự")]
        public string Pin { get; set; } = string.Empty;

        public DateTime? HiredDate { get; set; }
        public string? Notes { get; set; }
    }
}
