using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Employee
{
    public class ResetPinRequest
    {
        [Required(ErrorMessage = "Mã PIN mới là bắt buộc.")]
        [MinLength(4, ErrorMessage = "Mã PIN mới tối thiểu 4 ký tự.")]
        public string NewPin { get; set; } = string.Empty;
    }
}
