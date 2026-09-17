using dotnet_backend_freshmart.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Customer
{
    public class UpdateCustomerRequest
    {
        [Required(ErrorMessage = "Tên khách hàng là bắt buộc.")]
        [StringLength(150, ErrorMessage = "Tên khách hàng không được vượt quá 150 ký tự.")]
        public string Name { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Số điện thoại không đúng định dạng.")]
        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự.")]
        public string? Phone { get; set; }

        [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
        [StringLength(150, ErrorMessage = "Email không được vượt quá 150 ký tự.")]
        public string? Email { get; set; }

        public string? Address { get; set; }

        public DateOnly? BirthDate { get; set; }

        [StringLength(10, ErrorMessage = "Giới tính không hợp lệ.")]
        public string? Gender { get; set; }

        public LoyaltyTier Tier { get; set; } = LoyaltyTier.Deal;

        public bool IsActive { get; set; } = true;

        public string? Notes { get; set; }
    }
}
