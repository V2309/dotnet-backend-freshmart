using System.ComponentModel.DataAnnotations;
using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Inventory
{
    public class AdjustStockRequest
    {
        [Required(ErrorMessage = "Mã sản phẩm là bắt buộc.")]
        public Guid ProductId { get; set; }

        /// <summary>
        /// Số lượng thực tế kiểm kê (Tuyệt đối). Nếu truyền trường này, hệ thống sẽ tự tính QtyChange.
        /// </summary>
        [Range(0, 10000000, ErrorMessage = "Số lượng tồn kho không được âm.")]
        public int? ActualStock { get; set; }

        /// <summary>
        /// Số lượng điều chỉnh tăng (+) hoặc giảm (-) tương đối (Dùng khi không truyền ActualStock).
        /// </summary>
        public int? QtyChange { get; set; }

        public AdjustReason Reason { get; set; } = AdjustReason.StockCount;

        [StringLength(500, ErrorMessage = "Ghi chú không được vượt quá 500 ký tự.")]
        public string? Note { get; set; }
    }
}
