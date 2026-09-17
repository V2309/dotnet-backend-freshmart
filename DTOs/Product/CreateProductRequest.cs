using System.ComponentModel.DataAnnotations;
using dotnet_backend_freshmart.Models.Enums;

namespace dotnet_backend_freshmart.DTOs.Product
{
    public class CreateProductRequest
    {
        [Required(ErrorMessage = "Mã SKU sản phẩm là bắt buộc.")]
        [StringLength(50, ErrorMessage = "Mã SKU tối đa 50 ký tự.")]
        public string Sku { get; set; } = string.Empty;

        [StringLength(50, ErrorMessage = "Mã vạch tối đa 50 ký tự.")]
        public string? Barcode { get; set; }

        [Required(ErrorMessage = "Tên sản phẩm là bắt buộc.")]
        [StringLength(255, ErrorMessage = "Tên sản phẩm tối đa 255 ký tự.")]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Danh mục sản phẩm là bắt buộc.")]
        public Guid CategoryId { get; set; }

        public Guid? SupplierId { get; set; }

        [StringLength(20, ErrorMessage = "Đơn vị tính tối đa 20 ký tự.")]
        public string Unit { get; set; } = "Cai";

        [Range(0, double.MaxValue, ErrorMessage = "Giá vốn phải lớn hơn hoặc bằng 0.")]
        public decimal CostPrice { get; set; } = 0;

        [Range(0, double.MaxValue, ErrorMessage = "Giá bán phải lớn hơn hoặc bằng 0.")]
        public decimal SellPrice { get; set; } = 0;

        [Range(0, 100, ErrorMessage = "Thuế VAT từ 0% đến 100%.")]
        public decimal VatRate { get; set; } = 8.00m;

        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho phải >= 0.")]
        public int Stock { get; set; } = 0;

        [Range(0, int.MaxValue, ErrorMessage = "Mức tồn tối thiểu phải >= 0.")]
        public int MinStock { get; set; } = 0;

        public string? ImageUrl { get; set; }

        public StockStatus Status { get; set; } = StockStatus.InStock;

        public bool IsActive { get; set; } = true;

        public DateTime? ExpiryDate { get; set; }

        public string? Notes { get; set; }
    }
}
