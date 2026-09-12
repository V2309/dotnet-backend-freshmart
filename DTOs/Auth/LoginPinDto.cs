using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Auth
{
    public class LoginPinDto
    {
        [Required(ErrorMessage = "Mã nhân viên là bắt buộc")]
        public string EmployeeCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã PIN là bắt buộc")]
        public string Pin { get; set; } = string.Empty;


    }
}
