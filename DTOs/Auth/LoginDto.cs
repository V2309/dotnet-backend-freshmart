using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Auth
{
    public class LoginDto
    {
      
        
            [Required(ErrorMessage = "Vui lòng nhập Mã nhân viên, Email hoặc SĐT")]
            public string Identifier { get; set; } = string.Empty; // Code, Email hoặc Phone

            [Required(ErrorMessage = "Vui lòng nhập Mã PIN/Mật khẩu")]
            public string Pin { get; set; } = string.Empty;
        
    }
}
