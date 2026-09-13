using dotnet_backend_freshmart.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Employee
{
    public class CreateEmployeeRequest
    {
        [Required(ErrorMessage = "Tên nhân viên là bắt buộc.")]
        [StringLength(100, ErrorMessage = "Tên không được vượt quá 100 ký tự.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [Phone(ErrorMessage = "Số điện thoại không đúng định dạng.")]
        public string Phone { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Vai trò (Role) là bắt buộc.")]
        public EmployeeRole Role { get; set; } = EmployeeRole.Cashier;

        [Required(ErrorMessage = "Mã PIN/Mật khẩu khởi tạo là bắt buộc.")]
        [MinLength(4, ErrorMessage = "Mã PIN/Mật khẩu tối thiểu 4 ký tự.")]
        public string Pin { get; set; } = string.Empty;

        public DateTime? HiredDate { get; set; }

        public string? Notes { get; set; }
    }

}
