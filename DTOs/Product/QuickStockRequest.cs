using System.ComponentModel.DataAnnotations;

namespace dotnet_backend_freshmart.DTOs.Product
{
    public class QuickStockRequest
    {
        [Required(ErrorMessage = "Số lượng tồn kho là bắt buộc.")]
        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho phải lớn hơn hoặc bằng 0.")]
        public int Stock { get; set; }

        public string? Note { get; set; }
    }
}
