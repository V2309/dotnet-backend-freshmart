using dotnet_backend_freshmart.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Employee
{
    public class UpdateEmployeeRequest
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
        public EmployeeRole Role { get; set; }
        public DateTime? HiredDate { get; set; }
        public string? Notes { get; set; }
    }
}

