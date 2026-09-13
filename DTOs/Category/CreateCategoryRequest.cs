using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Category
{
    public class CreateCategoryRequest
    {
        [Required(ErrorMessage = "Tên danh mục là bắt buộc.")]
        [StringLength(100, ErrorMessage = "Tên danh mục không được vượt quá 100 ký tự.")]
        public string Name { get; set; } = string.Empty;
        [StringLength(50, ErrorMessage = "Định danh slug không được vượt quá 50 ký tự.")]
        public string? Slug { get; set; }
        [StringLength(50, ErrorMessage = "Tên icon không được vượt quá 50 ký tự.")]
        public string? Icon { get; set; }
        public short SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }
}
