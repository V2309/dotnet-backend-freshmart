using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Supplier
{
    public class CreateSupplierRequest
    {
        [Required(ErrorMessage = "Tên nhà cung cấp là bắt buộc.")]
        [StringLength(255, ErrorMessage = "Tên nhà cung cấp không được vượt quá 255 ký tự.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(150, ErrorMessage = "Tên người liên hệ không được vượt quá 150 ký tự.")]
        public string? ContactName { get; set; }

        [Phone(ErrorMessage = "Số điện thoại không đúng định dạng.")]
        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự.")]
        public string? Phone { get; set; }

        [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
        [StringLength(150, ErrorMessage = "Email không được vượt quá 150 ký tự.")]
        public string? Email { get; set; }

        public string? Address { get; set; }

        [StringLength(20, ErrorMessage = "Mã số thuế không được vượt quá 20 ký tự.")]
        public string? TaxCode { get; set; }

        [StringLength(50, ErrorMessage = "Số tài khoản ngân hàng không được vượt quá 50 ký tự.")]
        public string? BankAccount { get; set; }

        [StringLength(150, ErrorMessage = "Tên ngân hàng không được vượt quá 150 ký tự.")]
        public string? BankName { get; set; }

        public bool IsActive { get; set; } = true;

        public string? Notes { get; set; }
    }
}
